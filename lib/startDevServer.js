var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var path = require('path');
var modRewrite = require('connect-modrewrite');
var rgxConfig = require('../config');
var webpackConfig = require('../webpack.config');
var ROOT = path.join(__dirname, '..');

module.exports = function(app) {
  var compiler = webpack(webpackConfig);
  var port = rgxConfig.WEBPACK_DEVSERVER_PORT;
  var host = rgxConfig.WEBPACK_DEVSERVER_HOST;

  var server = new WebpackDevServer(compiler, {
    contentBase: path.resolve(ROOT, 'www'),
    publicPath: webpackConfig.output.publicPath,
    // filename: "/index.js",

    hot: true,

    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    lazy: false,
    inline: true,
    watchDelay: 300,
    // headers: { "X-Custom-Header": "yes" },
    stats: { colors: true },

    // set this as true if you want to access dev server from arbitrary url
    // this is handy if you are using a html5 router
    historyApiFallback: false,
  });

  server.listen(port, host, function(err) {
    if (err) {
      console.error(err);
    }

    console.log('Hot server listening at ' + host +':'+ port);
  });

  app.use(modRewrite([
    '^/index.js$ http://' + host + ':' + port + '/index.js [P]',
    '^/(.*).hot-update.(js|json)$ http://' + host + ':' + port + '/$1.hot-update.$2 [P]'
  ]));
};