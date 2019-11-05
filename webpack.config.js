const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './src/frontend/app.js',
  devServer: {
    contentBase: './dist/client'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'PaWebControl',
      favicon: './src/frontend/favicon.png',
      meta: {
        viewport: 'width=device-width, initial-scale=1.0'
      }
    })
  ],
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.png$/,
        use: ['file-loader?name=[name].[ext]']
      }
    ]
  }
  /*  ,
  optimization: {
    minimize: false
  }*/
};
