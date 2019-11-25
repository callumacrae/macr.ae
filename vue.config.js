const fs = require('fs');
const path = require('path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const chromium = require('chrome-aws-lambda');
const Renderer = require('./webpack/zeit-renderer');

const articles = fs
  .readdirSync('./articles/')
  .map(file => `/article/${file.slice(0, -3)}`);

const plugins = [];

if (chromium.headless) {
  plugins.push(
    new PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/', ...articles],
      renderer: new Renderer()
    })
  );
}

module.exports = {
  configureWebpack: {
    plugins
  }
};
