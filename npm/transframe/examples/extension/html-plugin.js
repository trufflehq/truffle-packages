import { minify } from 'html-minifier';

export default function html() {
  return {
    name: 'html',

    transform(html, id) {
      if (id.slice(-5) !== '.html') return null;

      this.addWatchFile(id);

      const minified = minify(html, {
        caseSensitive: true,
        collapseWhitespace: true,
      });

      return {
        code: `export default function() {
          const template = document.createElement('template');
          template.innerHTML = ${JSON.stringify(minified)};
          return template;
        }`,
        map: { mappings: '' },
      };
    },
  };
}
