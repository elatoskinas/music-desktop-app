const HtmlWebpackPlugin = require('html-webpack-plugin');
const npm_package = require('./package.json')

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
      alias: npm_package._moduleAliases || {}
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
      alias: npm_package._moduleAliases || {}
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  }
];