const fs = require('fs');
const path = require('path');
const PrerenderSPAPlugin = require('./webpack/prerender-spa-plugin');
const chromium = require('chrome-aws-lambda');
const Renderer = require('./webpack/zeit-renderer');

const articles = fs
  .readdirSync('./articles/')
  .map(file => `/article/${file.slice(0, -3)}`);

const plugins = [];

console.log({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: chromium.executablePath,
  headless: chromium.headless,
});

console.log(process.env.AWS_LAMBDA_FUNCTION_NAME)

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
  },
  devServer: {
    disableHostCheck: true
  }
};
