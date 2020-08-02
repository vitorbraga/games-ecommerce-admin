const webpack = require('webpack');
const config = require('./webpack.config.js');
const path = require('path');

module.exports = Object.assign({}, config, {
    devtool: 'cheap-module-eval-source-map',
    module: Object.assign({}, config.module, {
        rules: config.module.rules.concat([
            {
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader',
                    options: {
                        sourceMap: true
                    }
                }, {
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
                }],
                include: [path.resolve(__dirname, 'src')]
            }, {
                test: /\.(svg|png)$/,
                use: [{loader: 'url-loader'}],
                include: [path.resolve(__dirname, 'src')]
            }
        ])
    }),
    plugins: config.plugins.concat([
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]),
    devServer: {
        port: 3000
    }
});
