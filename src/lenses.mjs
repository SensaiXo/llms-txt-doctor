// Lens runner, lifted from SensaiXo/problem-due-diligence run.mjs. Four blind reviewers as four
// SEPARATE headless Claude processes: no tools, no settings, no CLAUDE.md, no memory, no MCP.
// Each sees exactly its prompt + the frozen case. Then one synthesiser sees case + 4 reports.
// Blindness is a process boundary, not a sentence in the prompt.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const PROMPTS = join(dirname(fileURLToPath(import.meta.url)), '..', 'prompts');

export const LENSES = [
  { key: 'structure',   name: 'Structure & Hierarchy',      prompt: 'structure-hierarchy.md',      slot: 'REPORT_STRUCTURE' },
  { key: 'positioning', name: 'Positioning & Consistency',  prompt: 'positioning-consistency.md',  slot: 'REPORT_POSITIONING' },
  { key: 'coverage',    name: 'Coverage & Priority',        prompt: 'coverage-priority.md',        slot: 'REPORT_COVERAGE' },
  { key: 'retrieval',   name: 'Description & Retrieval',    prompt: 'description-retrieval.md',    slot: 'REPORT_RETRIEVAL' },
];

export function runIsolated(sandbox, model, systemPrompt, userPrompt, onChunk = () => {}) {
  return new Promise((resolve, reject) => {
    const cli = process.platform === 'win32' ? 'claude.cmd' : 'claude';
    const sysFile = join(sandbox, `sys-${Math.random().toString(36).slice(2)}.md`);
    writeFileSync(sysFile, systemPrompt);
    const child = spawn(cli, [
      '-p', '--tools', '', '--setting-sources', '', '--settings', join(sandbox, 'isolation.json'),
      '--strict-mcp-config', '--no-session-persistence', '--disable-slash-commands',
      '--model', model, '--output-format', 'stream-json', '--verbose', '--system-prompt-file', sysFile,
    ], { cwd: sandbox, shell: process.platform === 'win32', env: { ...process.env, CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1', CLAUDE_CODE_DISABLE_CLAUDE_MDS: '1' } });
    let out = '', err = '';
    child.stdout.on('data', (d) => {
      for (const line of d.toString().split('\n')) {
        if (!line.trim()) continue;
        try {
          const ev = JSON.parse(line);
          if (ev.type === 'assistant') {
            const text = (ev.message?.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
            if (text) { out = text; onChunk(text.length); }
          }
          if (ev.type === 'result' && ev.result) out = ev.result;
        } catch {}
      }
    });
    child.stderr.on('data', (d) => (err += d));
    child.on('close', (code) => (code === 0 || out ? resolve(out) : reject(new Error(err || `exit ${code}`))));
    child.stdin.end(userPrompt);
  });
}

export function splitPrompt(file, marker) {
  const raw = readFileSync(join(PROMPTS, file), 'utf8');
  const [system, tail] = raw.split(marker);
  return { system: system.trim(), tail: (tail ?? '').trim() };
}

export function makeSandbox() {
  const sandbox = mkdtempSync(join(tmpdir(), 'llmsdoc-'));
  writeFileSync(join(sandbox, 'isolation.json'), JSON.stringify({ hooks: {}, enabledPlugins: {}, disableAllHooks: true }));
  return sandbox;
}

export async function runLenses(caseText, { model = 'opus', onProgress = () => {} } = {}) {
  const sandbox = makeSandbox();
  try {
    const reports = await Promise.all(LENSES.map(async (l) => {
      const { system, tail } = splitPrompt(l.prompt, /^## Frozen Case.*$/m);
      const user = (tail || '{{CASE}}').replace('{{CASE}}', caseText);
      try {
        const text = await runIsolated(sandbox, model, system, user, (n) => onProgress(l.key, n, false));
        onProgress(l.key, text.length, true);
        return { ...l, text, verdict: text.match(/VERDICT:\s*(PASS|BLOCKING)/)?.[1] ?? 'UNKNOWN' };
      } catch (e) {
        onProgress(l.key, 0, true, e);
        return { ...l, text: `(reviewer failed: ${e.message})`, verdict: 'FAILED' };
      }
    }));
    const { system, tail } = splitPrompt('synthesiser.md', /^## Inputs.*$/m);
    let user = tail.replace('{{CASE}}', caseText);
    for (const r of reports) user = user.replace(`{{${r.slot}}}`, r.text);
    onProgress('synth', 0, false);
    const synthesis = await runIsolated(sandbox, model, system, user, (n) => onProgress('synth', n, false));
    onProgress('synth', synthesis.length, true);
    const verdict = synthesis.match(/VERDICT:\s*(PUBLISH|FIX|REWRITE)/)?.[1] ?? 'UNKNOWN';
    const scoreM = synthesis.match(/SCORE:\s*(\d{1,3})/);
    const proposed = synthesis.match(/```(?:markdown|text|md)?\s*\n(# [\s\S]*?)\n```/)?.[1] ?? null;
    return { reports, synthesis, verdict, score: scoreM ? Number(scoreM[1]) : null, proposed };
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}

// Generate mode: the site has no llms.txt. One sealed drafter, same isolation, drafts from the
// frozen case (site digest + sitemap page digests). Same hard rule: URLs only from the case.
export async function runGenerate(caseText, { model = 'opus', onProgress = () => {} } = {}) {
  const sandbox = makeSandbox();
  try {
    const { system, tail } = splitPrompt('generate.md', /^## Frozen Case.*$/m);
    const user = tail.replace('{{CASE}}', caseText);
    const text = await runIsolated(sandbox, model, system, user, (n) => onProgress(n, false));
    onProgress(text.length, true);
    const proposed = text.match(/```(?:markdown|text|md)?\s*\n(# [\s\S]*?)\n```/)?.[1] ?? null;
    return { text, proposed };
  } finally {
    rmSync(sandbox, { recursive: true, force: true });
  }
}
