import { readFileSync, writeFileSync } from 'node:fs';

import yaml from '@ast-grep/lang-yaml';
import { Lang, parse, registerDynamicLanguage, type Edit, type SgNode } from '@ast-grep/napi';

registerDynamicLanguage({ yaml });

export function applyTransform(filePath: string, build: (root: SgNode) => Edit[]) {
  const source = readFileSync(filePath, 'utf-8');
  const root = parse(Lang.Tsx, source).root();
  const edits = build(root);
  if (edits.length === 0) return false;
  writeFileSync(filePath, root.commitEdits(edits));
  return true;
}

export function applyYamlTransform(filePath: string, build: (root: SgNode) => Edit[]) {
  const source = readFileSync(filePath, 'utf-8');
  const root = parse('yaml' as Lang, source).root();
  const edits = build(root);
  if (edits.length === 0) return false;
  writeFileSync(filePath, root.commitEdits(edits));
  return true;
}

// Removes a block-mapping-pair node (e.g. `if: false`) along with its
// trailing newline, by spanning to the start of the next sibling — YAML has
// no comma separators, so the node's own range stops short of the newline.
export function removeYamlKey(root: SgNode, key: string): Edit[] {
  const node = root.find({ rule: { kind: 'block_mapping_pair', has: { field: 'key', regex: `^${key}$` } } });
  if (!node) return [];
  const next = node.next();
  const endPos = next ? next.range().start.index : node.range().end.index;
  return [{ startPos: node.range().start.index, endPos, insertedText: '' }];
}

// Removes a node together with an adjacent `,` separator, spanning the raw
// source range between them so the gap (whitespace/newlines) is deleted too
// — otherwise removing a list/object entry leaves a dangling comma behind.
export function replaceWithComma(node: SgNode): Edit {
  const next = node.next();
  if (next && next.kind() === ',') {
    return { startPos: node.range().start.index, endPos: next.range().end.index, insertedText: '' };
  }
  const prev = node.prev();
  if (prev && prev.kind() === ',') {
    return { startPos: prev.range().start.index, endPos: node.range().end.index, insertedText: '' };
  }
  return node.replace('');
}

export function removeImport(root: SgNode, sourceRegex: string): Edit[] {
  const node = root.find({
    rule: {
      kind: 'import_statement',
      has: { field: 'source', kind: 'string', regex: sourceRegex },
    },
  });
  return node ? [node.replace('')] : [];
}

function removeNamedImportSpecifiers(root: SgNode, sourceRegex: string, names: string[]): Edit[] {
  const stmt = root.find({
    rule: {
      kind: 'import_statement',
      has: { field: 'source', kind: 'string', regex: sourceRegex },
    },
  });
  if (!stmt) return [];

  const specifiers = stmt.findAll({ rule: { kind: 'import_specifier' } });
  const toRemove = specifiers.filter((s) => names.includes(s.text()));
  if (toRemove.length === 0) return [];

  // Drop the whole statement if every specifier is being removed.
  if (toRemove.length === specifiers.length) {
    return [stmt.replace('')];
  }

  const namedImports = stmt.find({ rule: { kind: 'named_imports' } })!;
  const remaining = specifiers.filter((s) => !names.includes(s.text())).map((s) => s.text());
  return [namedImports.replace(`{ ${remaining.join(', ')} }`)];
}

function removeVariableDeclaration(root: SgNode, pattern: string): Edit[] {
  const node = root.find({ rule: { pattern } });
  return node ? [node.replace('')] : [];
}

// Unwraps `<Tag ...>{children}</Tag>` into just `{children}`.
function unwrapJsxElement(root: SgNode, tagName: string): Edit[] {
  const node = root.find({
    rule: {
      kind: 'jsx_element',
      has: {
        field: 'open_tag',
        has: { field: 'name', regex: `^${tagName}$` },
      },
    },
  });
  if (!node) return [];

  const inner = node
    .children()
    .filter((c) => c.kind() !== 'jsx_opening_element' && c.kind() !== 'jsx_closing_element')
    .map((c) => c.text())
    .join('');
  return [node.replace(inner)];
}

// Removes a shorthand property (e.g. `session` in `{ greeting, session }` or
// `const { greeting, session } = ...`) from every object/object-pattern of the
// given kind. `containerKind` is `object` for object literals and
// `object_pattern` for destructuring; `propKind` is the matching shorthand
// property node kind for that container.
function removeShorthandProperty(root: SgNode, containerKind: string, propKind: string, propName: string): Edit[] {
  const edits: Edit[] = [];
  for (const container of root.findAll({ rule: { kind: containerKind } })) {
    const prop = container.find({ rule: { kind: propKind, regex: `^${propName}$` } });
    if (prop) edits.push(replaceWithComma(prop));
  }
  return edits;
}

function removeJsxElementReferencing(root: SgNode, tagName: string, identifier: string): Edit[] {
  const node = root.find({
    rule: {
      // A rule object only takes one `has` key per level, so matching both
      // "is a <tagName> element" and "contains identifier" on the same node
      // requires combining them with `all`.
      all: [
        { kind: 'jsx_element', has: { field: 'open_tag', has: { field: 'name', regex: `^${tagName}$` } } },
        { has: { kind: 'identifier', regex: `^${identifier}$`, stopBy: 'end' } },
      ],
    },
  });
  return node ? [node.replace('')] : [];
}

function removeExportedDeclaration(root: SgNode, declName: string): Edit[] {
  const node = root.find({
    rule: {
      kind: 'export_statement',
      has: {
        kind: 'variable_declarator',
        has: { field: 'name', regex: `^${declName}$` },
        stopBy: 'end',
      },
    },
  });
  return node ? [node.replace('')] : [];
}

function filterLinkOptionsEntries(root: SgNode, removeToValues: Set<string>): Edit[] {
  const call = root.find({
    rule: { kind: 'call_expression', has: { field: 'function', regex: '^linkOptions$' } },
  });
  if (!call) return [];

  const edits: Edit[] = [];
  for (const obj of call.findAll({ rule: { kind: 'object' } })) {
    const toProp = obj.find({
      rule: { kind: 'pair', has: { field: 'key', regex: '^to$' } },
    });
    const value = toProp
      ?.field('value')
      ?.text()
      .replace(/^['"]|['"]$/g, '');
    if (value && removeToValues.has(value)) {
      edits.push(replaceWithComma(obj));
    }
  }
  return edits;
}

function removeCreateEnvKeys(root: SgNode, objectKey: string, keysToRemove: string[]): Edit[] {
  const call = root.find({
    rule: { kind: 'call_expression', has: { field: 'function', regex: '^createEnv$' } },
  });
  const arg = call?.find({ rule: { kind: 'object' } });
  const target = arg?.find({ rule: { kind: 'pair', has: { field: 'key', regex: `^${objectKey}$` } } })?.field('value');
  if (!target) return [];

  const edits: Edit[] = [];
  for (const key of keysToRemove) {
    const pair = target.find({ rule: { kind: 'pair', has: { field: 'key', regex: `^${key}$` } } });
    if (pair) edits.push(replaceWithComma(pair));
  }
  return edits;
}

// ─── remove-auth-provider: src/WrapComponent.tsx ────────────────────────────

export function removeAuthProvider(filePath: string) {
  return applyTransform(filePath, (root) => [
    ...removeImport(root, 'components/auth/auth-provider'),
    ...removeImport(root, '~/lib/auth-client'),
    ...removeNamedImportSpecifiers(root, '@tanstack/react-router', ['Link', 'useRouter']),
    ...removeVariableDeclaration(root, 'const router = useRouter()'),
    ...unwrapJsxElement(root, 'AuthProvider'),
  ]);
}

// ─── remove-session: src/routes/index.tsx ───────────────────────────────────

export function removeSession(filePath: string) {
  return applyTransform(filePath, (root) => [
    ...removeImport(root, '~/utils/server-session'),
    ...removeVariableDeclaration(root, 'const session = await getSession()'),
    ...removeShorthandProperty(root, 'object', 'shorthand_property_identifier', 'session'),
    ...removeShorthandProperty(root, 'object_pattern', 'shorthand_property_identifier_pattern', 'session'),
    ...removeJsxElementReferencing(root, 'p', 'session'),
  ]);
}

// ─── remove-authed-procedure: src/server/orpc.ts ────────────────────────────

export function removeAuthedProcedure(filePath: string) {
  return applyTransform(filePath, (root) => [
    ...removeImport(root, '~/lib/server/auth'),
    ...removeNamedImportSpecifiers(root, '@orpc/server', ['ORPCError']),
    ...removeExportedDeclaration(root, 'authedProcedure'),
  ]);
}

// ─── remove-nav-links: src/routes/__root.tsx ────────────────────────────────

export function removeNavLinks(filePath: string) {
  return applyTransform(filePath, (root) => filterLinkOptionsEntries(root, new Set(['/sign-in', '/sign-up'])));
}

// ─── strip-auth-env-keys: src/env.ts ────────────────────────────────────────

const AUTH_ENV_KEYS = [
  'DB_FILE_NAME',
  'HASH_ID_SECRET',
  'BETTER_AUTH_URL',
  'BETTER_AUTH_SECRET',
  'OIDC_PROVIDER_URL',
  'OIDC_AUTHORIZATION_URL',
  'OIDC_TOKEN_URL',
  'OIDC_CLIENT_ID',
  'OIDC_CLIENT_SECRET',
];

export function stripAuthEnvKeys(filePath: string) {
  return applyTransform(filePath, (root) => {
    const edits = [
      ...removeCreateEnvKeys(root, 'server', AUTH_ENV_KEYS),
      ...removeCreateEnvKeys(root, 'runtimeEnvStrict', AUTH_ENV_KEYS),
    ];
    if (edits.length === 0) return edits;

    // `process.env.*` reads only exist inside the removed auth keys — if no
    // other `process.` usage remains, the `node:process` import is now dead.
    const processUsages = root.findAll({ rule: { pattern: 'process.$$$REST' } });
    const removedRanges = edits.map((e) => [e.startPos, e.endPos] as const);
    const stillUsed = processUsages.some(
      (n) => !removedRanges.some(([start, end]) => n.range().start.index >= start && n.range().end.index <= end),
    );
    if (!stillUsed) {
      edits.push(...removeImport(root, "^'node:process'$"));
    }
    return edits;
  });
}

// ─── enable-deploy-workflow: .github/workflows/deploy.yml ──────────────────

export function enableDeployWorkflow(filePath: string) {
  return applyYamlTransform(filePath, (root) => removeYamlKey(root, 'if'));
}
