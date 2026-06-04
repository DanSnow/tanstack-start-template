/** @param {import('jscodeshift').FileInfo} file @param {import('jscodeshift').API} api */
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Remove getSession import
  root
    .find(j.ImportDeclaration, { source: { value: '~/utils/server-session' } })
    .remove();

  // Remove `const session = await getSession()` from loader
  root
    .find(j.VariableDeclaration)
    .filter((path) => {
      const decl = path.node.declarations[0];
      if (!decl || decl.type !== 'VariableDeclarator') return false;
      const init = decl.init;
      return (
        init &&
        init.type === 'AwaitExpression' &&
        init.argument &&
        init.argument.type === 'CallExpression' &&
        init.argument.callee.name === 'getSession'
      );
    })
    .remove();

  // Remove `session` shorthand property from return objects (e.g. `return { greeting, session }`)
  root
    .find(j.ObjectExpression)
    .forEach((path) => {
      const hasSession = path.node.properties.some(
        (p) => p.type === 'ObjectProperty' && p.shorthand === true && p.key && p.key.name === 'session',
      );
      if (hasSession) {
        path.node.properties = path.node.properties.filter(
          (p) => !(p.type === 'ObjectProperty' && p.shorthand === true && p.key && p.key.name === 'session'),
        );
      }
    });

  // Remove `session` from destructure patterns
  root
    .find(j.ObjectPattern)
    .forEach((path) => {
      const hasSession = path.node.properties.some(
        (p) => p.type === 'ObjectProperty' && p.key && p.key.name === 'session',
      );
      if (hasSession) {
        path.node.properties = path.node.properties.filter(
          (p) => !(p.type === 'ObjectProperty' && p.key && p.key.name === 'session'),
        );
      }
    });

  // Remove the <p>...</p> JSX element that references `session`
  root
    .find(j.JSXElement, { openingElement: { name: { name: 'p' } } })
    .filter((path) => {
      let hasSession = false;
      j(path.node).find(j.Identifier, { name: 'session' }).forEach(() => {
        hasSession = true;
      });
      return hasSession;
    })
    .remove();

  return root.toSource({ quote: 'single' });
};
