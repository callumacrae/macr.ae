export function roundDp(number, dp) {
  const factor = Math.pow(10, dp);
  return Math.round(number * factor) / factor;
}

let articles = [];

export function getArticles() {
  if (!articles.length) {
    const req = require.context('@/../articles', false, /\.md$/);
    articles = req
      .keys()
      .map(key => {
        const article = req(key);
        article.attributes.path = key.replace(/(?:\.\/|\.md$)/g, '');
        if (article.attributes.date) {
          article.attributes.date = new Date(article.attributes.date);
        }
        return article;
      })
      // @todo convert over legacy articles
      .filter(article => article.attributes.date)
      .sort((a, b) => (a.attributes.date > b.attributes.date ? -1 : 1));
  }

  return articles;
}
