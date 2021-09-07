const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  devtool: 'inline-source-map',
  mode: 'development',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};