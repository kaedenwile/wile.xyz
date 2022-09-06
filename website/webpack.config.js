const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');

let hash = (+new Date).toString(36);

const chordFiles = fs.readdirSync('./src/music/chords')
    .map(filename => `./src/music/chords/${filename}`);

module.exports = {
    entry: {
        home: './src/style/home.scss',
        battlefield: ['./src/app.js', './src/ts/battlefield/index.ts'],
        belt: ['./src/ts/belt.ts', './src/style/belt.scss', './src/belt/privacy-policy.pdf'],
        colony: ['./src/style/colony.scss', './src/colony/privacy-policy.pdf'],
        music: ['./src/style/music.scss', ...chordFiles],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${hash}/js/[name].js`,
        libraryTarget: 'var',
        library: '[name]',
    },
    resolve: {
        roots: [ path.resolve(__dirname, 'src') ],
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
                test: /\.(svg|gif|png|ico|eot|woff|ttf)$/,
                type: 'asset/resource',
                generator: {
                    filename: `${hash}/img/[hash][ext][query]`
                }
            },
            {
                test: /\.(pdf)$/,
                type: 'asset/resource',
                generator: {
                    filename: ({filename}) => filename.replace(/^src\//, ''),
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
            template: 'src/404.html',
            chunks: ['home'],
            filename: '404.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/belt/index.html',
            chunks: ['belt'],
            filename: 'belt.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/belt/whats-new/index.html',
            chunks: ['belt'],
            filename: 'belt/whats-new.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/colony/index.html',
            chunks: ['colony'],
            filename: 'colony.html'
        }),
        new HtmlWebpackPlugin({
            template: 'src/music/index.html',
            chunks: ['music'],
            filename: 'music.html'
        }),
    ]
};
