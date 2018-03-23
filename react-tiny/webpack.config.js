const webpack = require("webpack");
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'app/2_begin/index.js'),
    devtool: '#source-map',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.js/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }],
    },
    devServer: {
        inline: true,
        hot: true,
        port: 4000
    },
}