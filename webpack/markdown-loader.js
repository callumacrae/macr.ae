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

  source.body = marked(source.body, {
    renderer
  });

  return JSON.stringify(source);
};
