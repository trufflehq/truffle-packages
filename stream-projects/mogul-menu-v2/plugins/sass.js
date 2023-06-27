import jscodeshift from "jscodeshift";
import { applyTransform } from "jscodeshift/src/testUtils.js";
import sass from "sass";

const j = jscodeshift.withParser("tsx");

export function isSassJsFile(filename) {
  return filename.match(/\.s(a|c)ss\.js$/);
}

export function viteSassToCss() {
  return {
    name: "sass-literal-to-css-literal",
    transform(src, id) {
      if (isSassJsFile(id)) {
        src = replaceSassLiteralWithCssLiteral(src);

        return {
          code: src,
          map: null, // provide source map if available
        };
      }
    },
  };
}

function isSassTag(node) {
  return node.tag.name.match(/^s(a|c)ss$/);
}

export function transformSassLiteral(js) {
  jscodeshift;
  return j(js)
    .find(j.TaggedTemplateExpression, isSassTag)
    .replaceWith((node) => {
      if (node.value.quasi.quasis.length > 1) {
        throw new Error("Interpolations not supported atm");
      }
      const sassStr = node.value.quasi.quasis[0].value.raw;
      const result = sass.compileString(sassStr);
      // TODO: instead of modifying in place we should j.taggedTemplateExpression(...)
      // jscodeshift docs suck though
      node.value.quasi.quasis[0].value.raw = result.css;
      node.value.quasi.quasis[0].value.cooked = result.css;
      return node.value;
    })
    .toSource();
}

export function replaceSassLiteralWithCssLiteral(js) {
  return applyTransform(transformSassLiteral, {}, js);
}
