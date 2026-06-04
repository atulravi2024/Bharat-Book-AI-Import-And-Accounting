const fs = require('fs');
const ts = require('typescript');

const file = 'src/components/Operations/VoucherEntry/vouchers/SalesVoucher.tsx';
const content = fs.readFileSync(file, 'utf8');

const sourceFile = ts.createSourceFile(
  'SalesVoucher.tsx',
  content,
  ts.ScriptTarget.Latest,
  true
);

let topLevelVars = new Set();
let propsName = [];

// Find the SalesVoucher component
ts.forEachChild(sourceFile, node => {
  if (ts.isVariableStatement(node)) {
    const dec = node.declarationList.declarations[0];
    if (dec.name.text === 'SalesVoucher' && dec.initializer && ts.isArrowFunction(dec.initializer)) {
      const arrow = dec.initializer;
      
      // Get props parameter names
      const propsParam = arrow.parameters[0];
      if (propsParam && ts.isObjectBindingPattern(propsParam.name)) {
        propsParam.name.elements.forEach(el => {
          propsName.push(el.name.text);
        });
      }

      // the body is a block
      if (ts.isBlock(arrow.body)) {
        arrow.body.statements.forEach(stmt => {
          if (ts.isVariableStatement(stmt)) {
            stmt.declarationList.declarations.forEach(d => {
              if (ts.isIdentifier(d.name)) {
                topLevelVars.add(d.name.text);
              } else if (ts.isArrayBindingPattern(d.name) || ts.isObjectBindingPattern(d.name)) {
                // simple binding
                d.name.elements.forEach(el => {
                  if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) {
                    topLevelVars.add(el.name.text);
                  }
                });
              }
            });
          } else if (ts.isFunctionDeclaration(stmt)) {
            if (stmt.name) topLevelVars.add(stmt.name.text);
          }
        });
      }
    }
  }
});

console.log("Props:", propsName);
console.log("Vars:", Array.from(topLevelVars));
