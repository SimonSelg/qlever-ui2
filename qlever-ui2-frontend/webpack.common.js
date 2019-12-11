const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const childProcess = require('child_process')

const materialFolder = path.dirname(
    require.resolve('@material/button/package.json')
)
const materialNodeModulesContainingFolder = path.resolve(
    materialFolder,
    '../../../'
)

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sassOptions: {
            includePaths: ['node_modules', 'node_modules/@material/*'].map(d =>
                path.resolve(materialNodeModulesContainingFolder, d)
            )
        }
    }
}

const devMode = process.env.NODE_ENV !== 'production'

const extractLoader = {
    loader: MiniCssExtractPlugin.loader,
    options: {
        hmr: devMode
    }
}

// get git info from command line
const commitHash = childProcess
    .execSync('git rev-parse --short HEAD')
    .toString()
const commitHashLong = childProcess.execSync('git rev-parse HEAD').toString()

module.exports = {
    entry: ['./src/index.js'],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-flow']
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [extractLoader, 'css-loader']
            },
            {
                test: /\.module\.scss$/,
                use: [
                    extractLoader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[path]__[name]___[local]'
                            }
                        }
                    },
                    sassLoader
                ]
            },
            {
                test: /^(?!.*?\.module).*\.scss$/,
                use: [extractLoader, 'css-loader', sassLoader]
            },
            {
                test: /\.(png|jpe?g|gif|mp4)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            publicPath: './'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/dist',
        publicPath: './',
        filename: 'bundle.js'
    },
    plugins: [
        new htmlWebpackPlugin({
            title: 'QLever UI2',
            template: 'src/index.html'
        }),
        new webpack.DefinePlugin({
            __DEV__: '(process.env.NODE_ENV !== "production")',
            __COMMIT_HASH__: JSON.stringify(commitHash),
            __COMMIT_HASH_LONG__: JSON.stringify(commitHashLong)
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
        })
    ]
}
