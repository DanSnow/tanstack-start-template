/** @param {import('jscodeshift').FileInfo} file @param {import('jscodeshift').API} api */
module.exports = function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const authRoutes = new Set(['/sign-in', '/sign-up']);

  // Find the linkOptions([...]) call and remove sign-in/sign-up entries
  root
    .find(j.CallExpression, { callee: { name: 'linkOptions' } })
    .forEach((path) => {
      const arg = path.node.arguments[0];
      if (!arg || arg.type !== 'ArrayExpression') return;

      arg.elements = arg.elements.filter((el) => {
        if (!el || el.type !== 'ObjectExpression') return true;
        const toProp = el.properties.find(
          (p) => p.type === 'ObjectProperty' && p.key && p.key.name === 'to',
        );
        if (!toProp) return true;
        const val = toProp.value;
        return !(val && val.type === 'StringLiteral' && authRoutes.has(val.value));
      });
    });

  return root.toSource({ quote: 'single' });
};
