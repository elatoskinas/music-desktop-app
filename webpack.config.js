const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

ALIASES = {
  '@music-data': path.resolve(__dirname, './src/music-data'),
  '@player': path.resolve(__dirname, './src/player'),
  '@css': path.resolve(__dirname, './src/css'),
  '@common': path.resolve(__dirname, './src/common')
}

module.exports = [
  {
    mode: 'development',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
      rules: [{
        test: /\.ts$/,
        include: /src/,
        use: [{ loader: 'ts-loader' }]
      }]
    },
    output: {
      path: __dirname + '/dist',
      filename: 'electron.js'
    },
    resolve: {
      alias: ALIASES
    }
  },
  {
    mode: 'development',
    entry: './src/react.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: { rules: [{
      test: /\.ts(x?)$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }]
    }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader']
    }] },
    output: {
      path: __dirname + '/dist',
      filename: 'react.js'
    },
    resolve: {
      alias: ALIASES
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  }
];