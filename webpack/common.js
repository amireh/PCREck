var path = require("path");
var extend = require("lodash").extend;

var nodeEnv = process.env.NODE_ENV;
var baseConfig = {
  devtool: nodeEnv === "production" ? null : "eval",

  resolve: {
    fallback: path.resolve(__dirname, "../node_modules"),
    modulesDirectories: [
      "css",
      "shared",
      "node_modules"
    ],
    alias: {
      "dialects": path.resolve(__dirname, "../dialects"),
      "qtip": path.join(__dirname, '..', 'ui', 'vendor', 'jquery.qtip.js')
    }
  },

  resolveLoader: {
    fallback: path.resolve(__dirname, "../node_modules")
  },

  module: {
    loaders: [
      {
        test: /(ui|qjunk)\/(.*)\.js$/,
        loader: [
          'jsx-loader?harmony&insertPragma=React.DOM',
          'wrap-loader?js',
          'react-hot'
        ].join('!')
      },

      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },

      {
        test: /\.less$/,
        loader: 'style-loader!css-loader?importLoaders=1!less-loader'
      }
    ]
  },

  wrap: {
    js: {
      before: '(function(){\n',
      after: '}());'
    }
  }
};

module.exports = function(overrides) {
  return extend({}, baseConfig, overrides);
};
