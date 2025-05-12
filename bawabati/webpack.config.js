const path = require('path');

module.exports = {
  entry: './frontend/src/index.js',  // React app entry point
  output: {
    path: path.resolve(__dirname, './static/frontend'),
    filename: 'main.js',  // bundled JavaScript file
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}; 