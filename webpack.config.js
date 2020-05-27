/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.tsx',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  externals: ['react', 'react-dom'],
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
}
