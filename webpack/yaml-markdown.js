const path = require('path');

module.exports = api => {
  api.configureWebpack(() => {
    return {
      module: {
        rules: [
          {
            test: /\.md$/,
            loaders: ['json-loader', 'custom-markdown-loader']
          }
        ]
      },
      resolveLoader: {
        alias: {
          'custom-markdown-loader': path.resolve(
            __dirname,
            'markdown-loader.js'
          )
        }
      }
    };
  });
};
