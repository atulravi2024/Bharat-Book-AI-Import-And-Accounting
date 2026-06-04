const ts = require('typescript');
const fs = require('fs');

const logicCode = fs.readFileSync('src/components/Operations/VoucherEntry/vouchers/SalesVoucher/hooks/useSalesVoucherLogic.tsx', 'utf8');

const sourceFile = ts.createSourceFile('temp.tsx', logicCode, ts.ScriptTarget.Latest, true);

let topLevelVars = new Set();
// We must traverse all children, because inside export const useSalesVoucherLogic it's a block
ts.forEachChild(sourceFile, node => {
  if (ts.isVariableStatement(node)) {
    const list = node.declarationList.declarations;
    if (list[0].name.text === 'useSalesVoucherLogic' && list[0].initializer) {
      if (ts.isArrowFunction(list[0].initializer) && ts.isBlock(list[0].initializer.body)) {
        list[0].initializer.body.statements.forEach(stmt => {
           if (ts.isVariableStatement(stmt)) {
              stmt.declarationList.declarations.forEach(d => {
                 if (ts.isIdentifier(d.name)) topLevelVars.add(d.name.text);
                 else if (ts.isArrayBindingPattern(d.name) || ts.isObjectBindingPattern(d.name)) {
                   d.name.elements.forEach(el => {
                     if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) topLevelVars.add(el.name.text);
                   });
                 }
              });
           } else if (ts.isFunctionDeclaration(stmt) && stmt.name) {
              topLevelVars.add(stmt.name.text);
           }
        });
      }
    }
  }
});
console.log(Array.from(topLevelVars));
