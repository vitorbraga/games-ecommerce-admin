const webpack = require('webpack');
const config = require('./webpack.config.js');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = Object.assign({}, config, {
    devtool: 'source-map',
    module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]---[local]---[hash:base64:5]',
                            sourceMap: true,
                            camelCase: true,
                            namedExport: true
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /\.svg$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
                }, {
                    loader: 'svgo-loader'
                }],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /\.png$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
                }],
                include: [path.resolve(__dirname, 'src')]
            }
        ])
    }),
    plugins: config.plugins.concat([
        new MiniCssExtractPlugin({
            filename: 'stylesheets/[name].[hash].css',
            chunkFilename: 'stylesheets/[id].[hash].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]),
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
});
