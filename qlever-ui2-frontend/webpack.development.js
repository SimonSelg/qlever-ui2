const merge = require('webpack-merge')
const webpack = require('webpack')
const common = require('./webpack.common.js')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const SUB_PATH = '/' // '/ui-simon-selg/'

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development'
        })
        // new BundleAnalyzerPlugin()
    ],
    devServer: {
        hot: true,
        publicPath: '/',
        open: true,
        host: '0.0.0.0',
        historyApiFallback: {
            index: '/'
        },
        proxy: {
            [`${SUB_PATH}api/*`]: {
                target: 'http://localhost:9090',
                pathRewrite: {
                    [`${SUB_PATH.replace(/\/$/, '')}/api`]: ''
                }
            }
        }
    }
})
