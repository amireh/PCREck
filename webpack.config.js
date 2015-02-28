var path = require("path");
var webpack = require("webpack");
var commonConfig = require("./webpack/common");
var nodeEnv = process.env.NODE_ENV || 'development';
var config = {
  plugins: [],
  entry: {},

  output: {
    path: path.resolve(__dirname, "www"),
    filename: "[name].js",
    // publicPath: "http://localhost:8943/"
  },

};

config.plugins.push(
  new webpack.DefinePlugin({
    "process.env.NODE_ENV": JSON.stringify(nodeEnv)
  })
);

config.plugins.push(new webpack.optimize.DedupePlugin());

config.entry.index = [
  "./ui/index.js"
];

if (process.env.NODE_ENV === "development") {
  config.entry.index.unshift("webpack/hot/dev-server");
  config.entry.index.unshift('webpack-dev-server/client?http://localhost:8943');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (nodeEnv === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
}

module.exports = commonConfig(config);

