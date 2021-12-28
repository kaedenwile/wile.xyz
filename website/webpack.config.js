const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// const { readdirSync } = require('fs');
// console.log(readdirSync('./src'));

let hash = (+new Date).toString(36);
let links = {
    'belt': 'abc'
}


module.exports = {
    entry: {
        home: './src/app.js',
        battlefield: ['./src/ts/battlefield/index.ts', './src/style/battlefield.scss'],
        belt: ['./src/ts/belt.ts', './src/style/belt.scss'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${hash}/js/[name].js`,
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
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(svg|gif|png|ico|eot|woff|ttf|webmanifest)$/,
                type: 'asset/resource',
                generator: {
                    filename: `${hash}/img/[hash][ext][query]`
                }
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `${hash}/style/[name].css`
        }),
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