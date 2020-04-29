const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    "mandelbrot-set": path.resolve('../01-mandelbrot-set/js/entry.js'),
    "mandelbulb": path.resolve('../02-mandelbulb/js/entry.js'),
    "diffusion": path.resolve('../03-diffusion/js/entry.js',),
    "gsvideo": path.resolve('../04-gray-scott/js/entry.js'),
    "gol": path.resolve('../05-game-of-life/js/entry.js')
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '127.0.0.1',
    port: 9001,
    publicPath: '/dist/',
    contentBase: path.resolve('../'),
    compress: true,
    open: true,
    watchContentBase: true
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('../dist')
  },
}
