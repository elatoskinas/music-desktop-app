const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

let ALIASES = {
    '@data': path.resolve(__dirname, './src/data'),
    '@backend': path.resolve(__dirname, './src/backend'),
    '@frontend': path.resolve(__dirname, './src/frontend'),
    '@css': path.resolve(__dirname, './src/css'),
    '@common': path.resolve(__dirname, './src/common'),
}

const isDevelopment = process.env.NODE_ENV === 'development'

const electronConfig = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/electron.ts',
    target: 'electron-main',
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }],
            },
        ],
    },
    output: {
        path: __dirname + '/dist',
        filename: 'electron.js',
    },
    resolve: {
        alias: ALIASES,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    node: {
        // https://github.com/webpack/webpack/issues/1599
        __dirname: false,
    },
    externals: {
        // https://stackoverflow.com/questions/50991453/electron-packager-with-sqlite3-and-webpack
        // https://github.com/JoshuaWise/better-sqlite3/issues/253
        'better-sqlite3': 'commonjs better-sqlite3',
    },
}

const reactConfig = {
    mode: isDevelopment ? 'development' : 'production',
    entry: './src/react.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    output: {
        path: __dirname + '/dist',
        filename: 'react.js',
    },
    resolve: {
        alias: {
            ...ALIASES,
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
}

module.exports = [electronConfig, reactConfig]
