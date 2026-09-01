#!/usr/bin/env node
// llms-txt-doctor <url> [--out dir] [--model opus|sonnet] [--no-lenses] [--max-pages n] [--json]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { crawl } from '../src/crawl.mjs';
import { runChecks, score } from '../src/checks.mjs';
import { buildCase } from '../src/case.mjs';
import { runLenses, runGenerate, LENSES } from '../src/lenses.mjs';
import { runQa, formatQa } from '../src/qa.mjs';

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith('--'));
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
if (!url) { console.error('usage: llms-txt-doctor <url> [--out dir] [--model opus|sonnet] [--qa-model sonnet] [--no-lenses] [--no-qa] [--max-pages n] [--json]'); process.exit(1); }
const model = opt('--model', 'opus');
const maxPages = Number(opt('--max-pages', 60));
const noLenses = args.includes('--no-lenses');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const host = new URL(url).hostname;
const outDir = opt('--out', join(process.cwd(), 'runs', `${host}-${stamp}`));
mkdirSync(outDir, { recursive: true });
const DIM = '\x1b[2m', BOLD = '\x1b[1m', RESET = '\x1b[0m';
const log = (m) => console.error(`${DIM}› ${m}${RESET}`);

// ---- layer 1: deterministic ---------------------------------------------------------------
const c = await crawl(url, { maxPages, log });
const findings = runChecks(c);
const detScore = score(findings);
const frozen = buildCase(c, findings);
writeFileSync(join(outDir, 'case.md'), frozen.text);
writeFileSync(join(outDir, 'case.json'), JSON.stringify({ origin: c.origin, fingerprint: frozen.fingerprint, llms: { ...c.llms, parsed: c.llms.parsed }, links: c.links, resources: c.resources.map(({ html, ...r }) => ({ ...r, html, text: undefined })), sitemap: c.sitemap, home: c.home, findings, inspect: c.inspect }, null, 2));

const bySev = (s) => findings.filter((f) => f.severity === s);
console.log(`\n${BOLD}llms.txt doctor${RESET}  ${c.origin}  case ${frozen.fingerprint}`);
console.log(`deterministic score ${BOLD}${detScore}/100${RESET}  blocking ${bySev('BLOCKING').length}  advisory ${bySev('ADVISORY').length}  info ${bySev('INFO').length}`);
for (const f of findings.filter((f) => f.severity !== 'INFO')) console.log(`  ${f.severity === 'BLOCKING' ? '🟥' : '🟨'} ${f.id.padEnd(26)} ${f.message}`);
for (const f of bySev('INFO')) console.log(`  ${DIM}·  ${f.id.padEnd(26)} ${f.message}${RESET}`);

// ---- agent Q&A test (measured): sealed model, only llms.txt + fetch -------------------------
let qa = null;
let caseForLenses = frozen.text;
if (!args.includes('--no-qa') && c.llms.parsed) {
  const qaModel = opt('--qa-model', 'sonnet');
  console.log(`\n${BOLD}agent test${RESET} ${DIM}(sealed ${qaModel}, only llms.txt + up to 2 fetches per question)${RESET}`);
  try {
    qa = await runQa(c, { model: qaModel, onStep: (label, done) => process.stdout.write(done ? ` ✓\n` : `  ${label}`) });
    const s = qa.summary;
    console.log(`  ${BOLD}${s.correct}/${s.total} correct${RESET}, ${s.wrong ? '🟥 ' : ''}${s.wrong} wrong, ${s.declined} declined`);
    for (const it of qa.items.filter((x) => x.grade !== 'CORRECT')) console.log(`  ${it.grade === 'WRONG' ? '🟥' : '·'} ${it.grade.padEnd(8)} ${it.question}`);
    const qaText = formatQa(qa);
    writeFileSync(join(outDir, 'qa.md'), qaText);
    caseForLenses += '\n' + qaText;
  } catch (e) {
    console.log(`  agent test failed: ${e.message}`);
  }
}

// ---- generate mode: no llms.txt on the site, draft one from the crawl ----------------------
let gen = null;
if (!noLenses && !c.llms.parsed) {
  console.log(`\n${BOLD}no llms.txt found${RESET} ${DIM}drafting one from ${c.sitemap.unlistedDigest.length} crawled pages (sealed ${model})${RESET}`);
  gen = await runGenerate(frozen.text, { model, onProgress: (n, done) => process.stdout.write(done ? ' ✓\n' : '.') });
  writeFileSync(join(outDir, 'generate.md'), gen.text);
  if (gen.proposed) writeFileSync(join(outDir, 'llms.proposed.txt'), gen.proposed.trimEnd() + '\n');
  console.log(gen.text.split('```')[0].trim());
}

let lens = null;
if (!noLenses && c.llms.parsed) {
  // ---- layer 2: four blind lenses + synthesiser -----------------------------------------
  console.log(`\n${BOLD}4 blind reviewers${RESET} ${DIM}(separate processes, no tools, model ${model})${RESET}`);
  const state = Object.fromEntries([...LENSES.map((l) => l.key), 'synth'].map((k) => [k, { chars: 0, done: false, err: null }]));
  const names = { ...Object.fromEntries(LENSES.map((l) => [l.key, l.name])), synth: 'Synthesiser' };
  let lines = 0;
  const render = () => {
    if (lines) process.stdout.write(`\x1b[${lines}A\x1b[0J`);
    const out = Object.entries(state).map(([k, s]) => `  ${names[k].padEnd(28)} ${'█'.repeat(Math.min(20, Math.floor(s.chars / 300))).padEnd(20, '░')}  ${s.err ? '❌ failed' : s.done ? '✓ done' : s.chars ? '… writing' : '  waiting'}`);
    lines = out.length;
    process.stdout.write(out.join('\n') + '\n');
  };
  render();
  const tick = setInterval(render, 150);
  lens = await runLenses(caseForLenses, { model, onProgress: (k, n, done, err) => { state[k].chars = n; state[k].done = done; state[k].err = err ?? null; } });
  clearInterval(tick); render();
  for (const r of lens.reports) writeFileSync(join(outDir, `${r.key}.md`), r.text);
  writeFileSync(join(outDir, 'synthesis.md'), lens.synthesis);
  if (lens.proposed) writeFileSync(join(outDir, 'llms.proposed.txt'), lens.proposed.trimEnd() + '\n');
  const face = { PUBLISH: '🟢', FIX: '🟠', REWRITE: '🔴' }[lens.verdict] ?? '❓';
  console.log(`\n${face} ${BOLD}VERDICT: ${lens.verdict}${RESET}  score ${lens.score ?? '?'}/100  (${lens.reports.filter((r) => r.verdict === 'BLOCKING').length}/4 reviewers BLOCKING)`);
  const fixList = lens.synthesis.match(/FIX LIST:[\s\S]*?(?=\n```|\nREASONING:)/)?.[0];
  if (fixList) console.log('\n' + fixList.trim());
}

// ---- report ------------------------------------------------------------------------------
const R = [];
R.push(`# llms.txt audit: ${c.origin}`, '', `Run ${stamp}, case ${frozen.fingerprint}, model ${noLenses ? 'none' : model}.`, '');
R.push(`## Deterministic score: ${detScore}/100`, '');
for (const f of findings) R.push(`- **${f.severity}** \`${f.id}\`: ${f.message}${f.evidence?.length ? '  \n  ' + f.evidence.map((e) => `\`${e}\``).join(', ') : ''}`);
if (qa) R.push('', formatQa(qa));
if (gen) {
  R.push('', '## Draft llms.txt (site had none)', '', gen.text.replace(/```markdown[\s\S]*?```/, '(draft: see below)'), '');
  if (gen.proposed) R.push('```markdown', gen.proposed.trimEnd(), '```', '');
}
if (lens) {
  R.push('', `## Verdict: ${lens.verdict} (score ${lens.score ?? '?'}/100)`, '', lens.synthesis.replace(/```markdown[\s\S]*?```/, '(proposed file: see llms.proposed.txt below)'), '');
  if (lens.proposed) R.push('## Proposed llms.txt', '', '```markdown', lens.proposed.trimEnd(), '```', '');
  R.push('## Reviewer reports', '');
  for (const r of lens.reports) R.push(`### ${r.name} (${r.verdict})`, '', r.text, '');
}
writeFileSync(join(outDir, 'report.md'), R.join('\n'));
if (args.includes('--json')) console.log(JSON.stringify({ origin: c.origin, fingerprint: frozen.fingerprint, deterministicScore: detScore, findings, verdict: lens?.verdict, score: lens?.score, outDir }, null, 2));
console.log(`\n${DIM}written: ${outDir}${RESET}`);
