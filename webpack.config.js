const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const PROD = process.env.NODE_ENV === 'production';
const DEV = !PROD;

const filename = (ext) => DEV ? `bundle.${ext}` : `bundle.[hash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: ['@babel/polyfill', './index.js'],
    output: {
        filename: 'bundle.[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@core': path.resolve(__dirname, 'src/core')
        },
    },
    devtool: DEV ? 'source-map': false,
    devServer: {
        port: 3000,
        hot: DEV,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin( {
            template: 'index.html',
            minify: {
                removeComments: PROD,
                collapseWhitespace: PROD
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
    ],
    module: {
        rules: [
            {
              test: /\.s[ac]ss$/i,
              use: [
                {
                    loader: MiniCssExtractPlugin.loader
                },
                'css-loader',
                'sass-loader'
              ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        },
                    }
                ]
              },
          ],
    },
}
