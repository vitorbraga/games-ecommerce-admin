const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const dotenv = require('dotenv');

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
}, {});

module.exports = {
    context: __dirname,
    entry: [
        path.resolve(__dirname, 'src/main.tsx')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'javascripts/bundle.js',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json', '.svg', '.ico']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        compiler: 'ttypescript'
                    }
                }],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /favicon\.ico$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'favicon.ico'
                    }
                }],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /(.otf|.ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /\.gif$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'images/[name].[ext]'
                    }
                }],
                include: [path.resolve(__dirname, 'src')]
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/^webworkify$/, 'webworkify-webpack'),
        new webpack.ProvidePlugin({
            ReactDOM: 'react-dom',
            React: 'react'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        }),
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: true
        }),
        new webpack.DefinePlugin(envKeys)
    ]
};
