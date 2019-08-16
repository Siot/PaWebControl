const path = require('path');

module.exports = {
  entry: './src/frontend/pactl.js',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: 'pactl.js'
  }
  /*  ,
  optimization: {
    minimize: false
  }*/
};
