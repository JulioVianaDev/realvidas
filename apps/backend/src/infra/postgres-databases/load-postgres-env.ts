import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Directory that contains docker-compose.yaml / docker-compose.yml (monorepo root).
 * Docker Compose loads `.env` from this folder automatically; we mirror that for Nest/CLI.
 */
function findProjectRootWithCompose(startDir: string): string | null {
  let dir = path.resolve(startDir);
  for (let i = 0; i < 10; i++) {
    if (
      fs.existsSync(path.join(dir, 'docker-compose.yaml')) ||
      fs.existsSync(path.join(dir, 'docker-compose.yml'))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return null;
}

/**
 * `apps/backend` whether this file lives under `src/` or `dist/`.
 * From `.../infra/postgres-databases` → three levels up = backend package root.
 */
function backendPackageRootFromThisFile(): string {
  return path.resolve(__dirname, '../../..');
}

/**
 * Load `.env` from the same places Docker Compose uses (repo root next to compose file)
 * and common fallbacks when cwd is `apps/backend` or repo root.
 * `override: false` — never replace variables already set (e.g. Docker `environment:`).
 */
export function loadPostgresEnv(): void {
  const candidates: string[] = [];

  const composeRootFromCwd = findProjectRootWithCompose(process.cwd());
  if (composeRootFromCwd) {
    candidates.push(path.join(composeRootFromCwd, '.env'));
  }

  const composeRootFromBackend = findProjectRootWithCompose(
    backendPackageRootFromThisFile(),
  );
  if (composeRootFromBackend) {
    candidates.push(path.join(composeRootFromBackend, '.env'));
  }

  candidates.push(
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '..', '..', '.env'),
    path.resolve(process.cwd(), 'apps', 'backend', '.env'),
    path.resolve(backendPackageRootFromThisFile(), '.env'),
    path.resolve(__dirname, '../../../../../.env'),
  );

  const seen = new Set<string>();
  for (const file of candidates) {
    const norm = path.normalize(file);
    if (seen.has(norm)) {
      continue;
    }
    seen.add(norm);
    if (fs.existsSync(norm)) {
      config({ path: norm, override: false });
    }
  }
}

export { coercePgPassword } from '../../config/config';

loadPostgresEnv();
