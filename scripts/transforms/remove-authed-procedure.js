/** @param {import('jscodeshift').FileInfo} file @param {import('jscodeshift').API} api */
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Remove auth import
  root
    .find(j.ImportDeclaration, { source: { value: '~/lib/server/auth' } })
    .remove();

  // Remove ORPCError from @orpc/server import (keep `os`)
  root
    .find(j.ImportDeclaration, { source: { value: '@orpc/server' } })
    .forEach((path) => {
      path.node.specifiers = path.node.specifiers.filter(
        (s) => !(s.type === 'ImportSpecifier' && s.local.name === 'ORPCError'),
      );
      if (path.node.specifiers.length === 0) {
        j(path).remove();
      }
    });

  // Remove `export const authedProcedure = ...`
  root
    .find(j.ExportNamedDeclaration)
    .filter((path) => {
      const decl = path.node.declaration;
      return (
        decl &&
        decl.type === 'VariableDeclaration' &&
        decl.declarations[0] &&
        decl.declarations[0].type === 'VariableDeclarator' &&
        decl.declarations[0].id.name === 'authedProcedure'
      );
    })
    .remove();

  return root.toSource({ quote: 'single' });
};
