const slsw = require("serverless-webpack");
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  //mode: slsw.lib.webpack.isLocal ? "development" : "production",
  mode:  "development",
  optimization: {
    minimize : false
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, 'dist'),
    filename: 'handler.js', // this should match the first part of function handler in serverless.yml
  },
  module: {
    rules:  [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use : {
          loader : "babel-loader",
          options : {
            babelrc: true
          }
        }
      }
    ]
  }
};
