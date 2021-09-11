const path = require('path')

const tsconfig = require('./tsconfig.json')

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
    alias: Object.keys(tsconfig.compilerOptions.paths).reduce(
      (aliases, aliasName) => {
        aliases[aliasName] = path.resolve(
          __dirname,
          `src/${tsconfig.compilerOptions.paths[aliasName][0]}`,
        )

        return aliases
      },
      {},
    ),
  },
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
