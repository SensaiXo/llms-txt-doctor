// Layer 2 (reviewers, agent test, drafter) needs the Claude Code CLI. Without it we run layer 1 only.
import { existsSync } from 'node:fs';
import { join, delimiter } from 'node:path';
export function claudeAvailable(env = process.env) {
  const path = env.PATH ?? env.Path ?? '';
  const names = process.platform === 'win32' ? ['claude.cmd', 'claude.exe', 'claude'] : ['claude'];
  return path.split(delimiter).filter(Boolean).some((dir) => names.some((n) => existsSync(join(dir, n))));
}
