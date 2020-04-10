const fs = require('fs');
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

const articles = fs
  .readdirSync('./articles/')
  .map(file => `/article/${file.slice(0, -3)}`);

const plugins = [];

plugins.push(
  new PrerenderSPAPlugin({
    staticDir: path.join(__dirname, 'dist'),
    routes: ['/', ...articles]
  })
);

module.exports = {
  configureWebpack: {
    plugins
  },
  devServer: {
    disableHostCheck: true
  }
};
