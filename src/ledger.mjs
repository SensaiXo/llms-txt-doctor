// Run ledger: files every run under <reports>/sites/<host>/runs/<stamp>/ and appends one row to
// <reports>/sites/<host>/runs.jsonl, so "before vs after" is a diff between two rows, not memory.
// Rows are append-only; a run is never edited after it is written (same rule as PDDE's RUNS.md).
import { mkdirSync, cpSync, appendFileSync, readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export function ledgerRow({ host, stamp, fingerprint, detScore, findings, qa, lens, gen, model }) {
  const ids = {};
  for (const f of findings) ids[f.id] = (ids[f.id] ?? 0) + 1;
  return {
    host, stamp, fingerprint, model,
    detScore,
    blocking: findings.filter((f) => f.severity === 'BLOCKING').length,
    advisory: findings.filter((f) => f.severity === 'ADVISORY').length,
    ids,
    qa: qa ? { correct: qa.summary.correct, wrong: qa.summary.wrong, declined: qa.summary.declined, total: qa.summary.total } : null,
    lensScore: lens?.score ?? null,
    verdict: lens?.verdict ?? (gen ? 'DRAFTED' : null),
    reviewersBlocking: lens ? lens.reports.filter((r) => r.verdict === 'BLOCKING').length : null,
  };
}

export function fileRun(reportsDir, host, stamp, outDir, row) {
  const siteDir = join(reportsDir, 'sites', host);
  mkdirSync(join(siteDir, 'runs'), { recursive: true });
  cpSync(outDir, join(siteDir, 'runs', stamp), { recursive: true });
  appendFileSync(join(siteDir, 'runs.jsonl'), JSON.stringify(row) + '\n');
  writeFileSync(join(siteDir, 'HISTORY.md'), renderHistory(siteDir));
  return siteDir;
}

export function readRuns(siteDir) {
  const f = join(siteDir, 'runs.jsonl');
  const rows = existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
  // chronological, not insertion order: late imports of old runs must not become the "latest"
  return rows.sort((a, b) => String(a.stamp).localeCompare(String(b.stamp)));
}

// Before/after between the first and the latest run, plus the full row table.
export function renderHistory(siteDir) {
  const runs = readRuns(siteDir);
  if (!runs.length) return '# History\n\nno runs yet\n';
  const first = runs[0], last = runs[runs.length - 1];
  const L = [`# History: ${last.host}`, '', `${runs.length} run(s), first ${first.stamp}, latest ${last.stamp}. Rows are append-only; each run folder holds the frozen case and every report.`, ''];
  L.push('| run | rule score | blocking | advisory | reviewers | verdict | agent test (ok / wrong / declined) |');
  L.push('|---|---|---|---|---|---|---|');
  for (const r of runs) L.push(`| ${r.stamp} | ${r.detScore} | ${r.blocking} | ${r.advisory} | ${r.lensScore ?? '–'} | ${r.verdict ?? '–'} | ${r.qa ? `${r.qa.correct} / ${r.qa.wrong} / ${r.qa.declined}` : '–'} |`);
  if (runs.length > 1) {
    const d = (a, b) => (a == null || b == null ? '–' : `${b - a >= 0 ? '+' : ''}${b - a}`);
    L.push('', '## Before → after (first run → latest run)', '');
    L.push(`- rule score: ${first.detScore} → ${last.detScore} (${d(first.detScore, last.detScore)})`);
    L.push(`- reviewer score: ${first.lensScore ?? '–'} → ${last.lensScore ?? '–'} (${d(first.lensScore, last.lensScore)}); verdict ${first.verdict ?? '–'} → ${last.verdict ?? '–'}`);
    if (first.qa && last.qa) L.push(`- agent test wrong answers: ${first.qa.wrong} → ${last.qa.wrong} (${d(first.qa.wrong, last.qa.wrong)}); correct ${first.qa.correct} → ${last.qa.correct}`);
    const gone = Object.keys(first.ids).filter((k) => !(k in last.ids));
    const fresh = Object.keys(last.ids).filter((k) => !(k in first.ids));
    const changed = Object.keys(first.ids).filter((k) => k in last.ids && first.ids[k] !== last.ids[k]).map((k) => `${k} ${first.ids[k]}→${last.ids[k]}`);
    L.push(`- findings resolved: ${gone.join(', ') || 'none'}`);
    L.push(`- findings new: ${fresh.join(', ') || 'none'}`);
    if (changed.length) L.push(`- findings changed in count: ${changed.join(', ')}`);
    L.push('', 'Caveat: reviewer score and agent test have run-to-run variance; rule score and finding ids are deterministic for the same live site.');
  }
  const fdir = join(siteDir, 'fetches');
  if (existsSync(fdir)) {
    const files = readdirSync(fdir).filter((f) => f.endsWith('.json')).sort();
    if (files.length) {
      L.push('', '## Crawler fetches (agent_surface_fetch events, our own Cloudflare middleware)', '');
      for (const f of files) {
        const w = JSON.parse(readFileSync(join(fdir, f), 'utf8'));
        const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${k} ${v}`).join(', ');
        L.push(`- ${f.replace(/\.json$/, '')} (${w.days} days, generated ${w.generated}): ${w.total} fetch(es). By bot: ${top(w.byBot) || 'none'}. By path: ${top(w.byPath) || 'none'}.`);
      }
      L.push('', 'A fetch is a request that reached our origin. Browser and other-bot rows are people and generic tools; the AI-crawler rows are the ones the experiment is about.');
    }
  }
  return L.join('\n') + '\n';
}
