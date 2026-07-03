#!/usr/bin/env tsx
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Convert the TanStack Start template from SSR to SPA mode (static prerender,
 * e.g. for GitHub Pages). Run with: pnpm tsx scripts/configure-spa.ts
 */
import { $ } from 'zx';

import { applyTransform, enableDeployWorkflow, removeImport, replaceWithComma } from './transforms/ast-grep-transforms';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

$.cwd = ROOT;
$.verbose = true;

// ─── Phase 1: vite.config.ts — swap nitro SSR preset for SPA prerender ─────

console.log('\n=== Phase 1: Updating vite.config.ts ===\n');

function configureViteForSpa(filePath: string) {
  return applyTransform(filePath, (root) => {
    const nitroCall = root.find({
      rule: { kind: 'call_expression', has: { field: 'function', regex: '^nitro$' } },
    });
    const tanstackStartArg = root
      .find({ rule: { kind: 'call_expression', has: { field: 'function', regex: '^tanstackStart$' } } })
      ?.find({ rule: { kind: 'object' } });

    if (!nitroCall || !tanstackStartArg) {
      console.log('Already configured or unexpected shape, skipping vite.config.ts');
      return [];
    }

    return [
      ...removeImport(root, 'nitro/vite'),
      tanstackStartArg.replace(
        `{
      spa: {
        enabled: true,
        prerender: {
          outputPath: '/index.html',
        },
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    }`,
      ),
      replaceWithComma(nitroCall),
    ];
  });
}

const viteConfigPath = resolve(ROOT, 'vite.config.ts');
const viteConfigChanged = configureViteForSpa(viteConfigPath);
console.log(viteConfigChanged ? 'Transformed: vite.config.ts' : 'Unchanged: vite.config.ts');

if (viteConfigChanged) {
  await $`pnpm exec oxfmt --write ${viteConfigPath}`;
}

// ─── Phase 2: Enable the GitHub Pages deploy workflow ──────────────────────

console.log('\n=== Phase 2: Enabling deploy workflow ===\n');

const deployWorkflowPath = resolve(ROOT, '.github/workflows/deploy.yml');
if (existsSync(deployWorkflowPath)) {
  const changed = enableDeployWorkflow(deployWorkflowPath);
  console.log(
    changed
      ? 'Enabled: .github/workflows/deploy.yml'
      : 'Already enabled or `if` key not found: .github/workflows/deploy.yml',
  );
} else {
  console.log('Skipping .github/workflows/deploy.yml (not found)');
}

// ─── Phase 3: Remove the nitro devDependency ───────────────────────────────

console.log('\n=== Phase 3: Updating package.json ===\n');

const pkgPath = resolve(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

if (pkg.devDependencies?.nitro) {
  delete pkg.devDependencies.nitro;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log('Removed devDep: nitro');
} else {
  console.log('nitro devDep already absent');
}

console.log(`
✓ Done! Next steps:
  1. Reinstall dependencies:
       pnpm install
  2. Build and check the static output:
       pnpm build
       ls dist/client
  3. If deploying under a subpath (e.g. GitHub Pages project site), set
     VITE_BASE_PATH=/your-repo-name/ when building.
`);
