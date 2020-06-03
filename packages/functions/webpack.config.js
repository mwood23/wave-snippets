const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../../deploy-functions/dist'),
    libraryTarget: 'commonjs'
  },
  externals: {
    'firebase-admin': 'firebase-admin',
    'firebase-functions': 'firebase-functions'
  }
};
