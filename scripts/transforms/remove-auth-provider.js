/** @param {import('jscodeshift').FileInfo} file @param {import('jscodeshift').API} api */
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Remove AuthProvider import
  root
    .find(j.ImportDeclaration, { source: { value: '~/components/auth/auth-provider' } })
    .remove();

  // Remove authClient import
  root
    .find(j.ImportDeclaration, { source: { value: '~/lib/auth-client' } })
    .remove();

  // Remove Link and useRouter from @tanstack/react-router import
  root
    .find(j.ImportDeclaration, { source: { value: '@tanstack/react-router' } })
    .forEach((path) => {
      path.node.specifiers = path.node.specifiers.filter(
        (s) => !(s.type === 'ImportSpecifier' && (s.local.name === 'Link' || s.local.name === 'useRouter')),
      );
      if (path.node.specifiers.length === 0) {
        j(path).remove();
      }
    });

  // Remove `const router = useRouter()` statement
  root
    .find(j.VariableDeclaration)
    .filter((path) => {
      const decl = path.node.declarations[0];
      return (
        decl &&
        decl.type === 'VariableDeclarator' &&
        decl.id.type === 'Identifier' &&
        decl.id.name === 'router' &&
        decl.init &&
        decl.init.type === 'CallExpression' &&
        decl.init.callee.name === 'useRouter'
      );
    })
    .remove();

  // Unwrap <AuthProvider ...>{children}</AuthProvider> → {children}
  root
    .find(j.JSXElement, {
      openingElement: { name: { name: 'AuthProvider' } },
    })
    .replaceWith((path) => {
      const children = path.node.children;
      if (children.length === 1) {
        return children[0];
      }
      return j.jsxFragment(j.jsxOpeningFragment(), j.jsxClosingFragment(), children);
    });

  return root.toSource({ quote: 'single' });
};
