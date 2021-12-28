const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { readdirSync } = require('fs');

console.log(readdirSync('./src'));

module.exports = {
    entry: {
        home: './src/app.js',
        battlefield: ['./src/ts/battlefield/index.ts', './src/style/battlefield.scss'],
        belt: './src/ts/belt.ts',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'var',
        library: '[name]',
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js', '.scss' ],
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(svg|gif|png|eot|woff|ttf)$/,
                use: 'url-loader',
            },
            // {
                // test: /\.html$/,
                // use: 'html-loader',
            // }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunks: ['home', 'battlefield']
        }),
        new HtmlWebpackPlugin({
            template: 'src/belt.html',
            chunks: ['belt'],
            filename: 'belt.html'
        })
    ]
};