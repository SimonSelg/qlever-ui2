const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const TerserPlugin = require('terser-webpack-plugin')

// new BundleAnalyzerPlugin()
module.exports = merge(common, {
    mode: 'production',
    //devtool: 'inline-source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false
                }
            })
        ]
    },
    resolve: {
        alias: {
            'react-dom': 'react-dom/profiling',
            'scheduler/tracing': 'scheduler/tracing-profiling'
        }
    },
    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'production'
        })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        hot: true,
        open: true,
        host: '0.0.0.0',
        historyApiFallback: true,
        publicPath: '/',
        proxy: {
            '/api/*': {
                target: 'http://localhost:9090',
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
})
