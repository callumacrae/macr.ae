const frontmatter = require('front-matter');
const marked = require('marked');

const renderer = new marked.Renderer();

renderer.heading = function(text, level) {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  return `<h${level} id="${escapedText}">
    <a class="heading-anchor" href="#${escapedText}"><span>#</span>${text}</a>
  </h${level}>`;
};

module.exports = source => {
  if (this.cacheable) {
    this.cacheable();
  }

  source = frontmatter(source);

  // Support old date + title syntax
  if (!source.attributes.title && source.body.startsWith('# ')) {
    const lines = source.body.split('\n');

    source.attributes.title = lines.splice(0, 1)[0].slice(2);
    source.attributes.date = lines.splice(0, 1)[0].slice(2);

    source.body = lines.join('\n');
  }

  source.body = marked(source.body, {
    renderer
  });

  return JSON.stringify(source);
};
