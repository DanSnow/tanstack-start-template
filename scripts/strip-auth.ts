#!/usr/bin/env tsx
/**
 * Strip better-auth and drizzle ORM from the TanStack Start template.
 * Run with: pnpm tsx scripts/strip-auth.ts
 */
import { $ } from 'zx';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

$.cwd = ROOT;
$.verbose = true;

// ─── Phase 1: AST transforms ────────────────────────────────────────────────

console.log('\n=== Phase 1: AST transforms ===\n');

const transforms: [string, string][] = [
  ['scripts/transforms/remove-auth-provider.js', 'src/WrapComponent.tsx'],
  ['scripts/transforms/remove-session.js', 'src/routes/index.tsx'],
  ['scripts/transforms/remove-authed-procedure.js', 'src/server/orpc.ts'],
  ['scripts/transforms/remove-nav-links.js', 'src/routes/__root.tsx'],
];

for (const [transform, target] of transforms) {
  const targetPath = resolve(ROOT, target);
  if (!existsSync(targetPath)) {
    console.log(`Skipping ${target} (not found)`);
    continue;
  }
  await $`pnpm dlx jscodeshift --parser=tsx --extensions=tsx,ts -t ${transform} ${target}`;
}

// ─── Phase 2: Delete files & directories ────────────────────────────────────

console.log('\n=== Phase 2: Deleting files and directories ===\n');

const toDelete = [
  'src/drizzle',
  'src/components/auth',
  'src/lib/server/auth.ts',
  'src/lib/auth-client.ts',
  'src/routes/sign-in.tsx',
  'src/routes/sign-up.tsx',
  'src/routes/api/auth.$.ts',
  'src/utils/server-session.ts',
  'src/server/utils/hashid.ts',
  'src/env.ts',
  'src/components/ui/calendar.tsx',
  'drizzle.config.ts',
  'db.sqlite',
  'test.sqlite',
];

for (const rel of toDelete) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) {
    console.log(`Already gone: ${rel}`);
    continue;
  }
  rmSync(p, { recursive: true, force: true });
  console.log(`Deleted: ${rel}`);
}

// Clean up empty directories
const emptyDirs = ['src/lib/server', 'src/server/utils', 'src/routes/api'];
for (const rel of emptyDirs) {
  const p = resolve(ROOT, rel);
  if (!existsSync(p)) continue;
  try {
    // rmdir fails if not empty — that's intentional
    const { readdirSync } = await import('node:fs');
    const remaining = readdirSync(p);
    if (remaining.length === 0) {
      rmSync(p, { recursive: true });
      console.log(`Removed empty dir: ${rel}`);
    } else {
      console.log(`Kept non-empty dir: ${rel} (${remaining.join(', ')})`);
    }
  } catch {
    // ignore
  }
}

// ─── Phase 3: Remove package.json dependencies ──────────────────────────────

console.log('\n=== Phase 3: Updating package.json ===\n');

const pkgPath = resolve(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const depsToRemove = [
  'better-auth',
  '@better-auth-ui/core',
  '@better-auth-ui/react',
  'drizzle-orm',
  '@libsql/client',
  'hashids',
  'date-fns',
  'react-day-picker',
  '@t3-oss/env-core',
];
const devDepsToRemove = ['drizzle-kit'];

for (const dep of depsToRemove) {
  if (pkg.dependencies?.[dep]) {
    delete pkg.dependencies[dep];
    console.log(`Removed dep: ${dep}`);
  }
}
for (const dep of devDepsToRemove) {
  if (pkg.devDependencies?.[dep]) {
    delete pkg.devDependencies[dep];
    console.log(`Removed devDep: ${dep}`);
  }
}

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('package.json updated.');

// ─── Phase 4: Strip env files ───────────────────────────────────────────────

console.log('\n=== Phase 4: Stripping env files ===\n');

const AUTH_KEYS = new Set([
  'DB_FILE_NAME',
  'HASH_ID_SECRET',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'OIDC_PROVIDER_URL',
  'OIDC_AUTHORIZATION_URL',
  'OIDC_TOKEN_URL',
  'OIDC_CLIENT_ID',
  'OIDC_CLIENT_SECRET',
]);

function stripEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const kept: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip lines that assign a removed key (KEY=value or # KEY=... or # KEY)
    const match = trimmed.match(/^#?\s*([A-Z_][A-Z0-9_]*)\s*[=:]/);
    if (match && AUTH_KEYS.has(match[1])) continue;
    // Skip standalone comment lines that only mention removed keys
    const commentMatch = trimmed.match(/^#\s*([A-Z_][A-Z0-9_]*)$/);
    if (commentMatch && AUTH_KEYS.has(commentMatch[1])) continue;
    kept.push(line);
  }

  // Remove trailing blank lines, then write
  let result = kept.join('\n').trimEnd();
  if (!result || result.replace(/\s|#.*/g, '').length === 0) {
    result = '# Add your environment variables here';
  }

  writeFileSync(filePath, result + '\n');
  console.log(`Stripped: ${filePath}`);
}

for (const envFile of ['.env', '.env.example', '.env.docker', '.env.test']) {
  stripEnvFile(resolve(ROOT, envFile));
}

// ─── Phase 5: Reinstall ─────────────────────────────────────────────────────

console.log('\n=== Phase 5: pnpm install ===\n');

await $`pnpm install`;

console.log(`
✓ Done! Next steps:
  1. Start the dev server once to regenerate routeTree.gen.ts:
       pnpm dev   (then Ctrl+C after the server starts)
  2. Type-check:
       pnpm exec tsc --noEmit
  3. Build:
       pnpm build
  4. Check no auth references remain:
       rg "better-auth|auth-client|AuthProvider|getSession|authedProcedure|drizzle|hashids" src/
`);
