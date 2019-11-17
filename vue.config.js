const fs = require('fs');
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

const articles = fs
  .readdirSync('./articles/')
  .map(file => `/article/${file.slice(0, -3)}`);

module.exports = {
  configureWebpack: {
    plugins: [
      new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/', ...articles]
      })
    ]
  }
};
