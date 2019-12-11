const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const materialFolder = path.dirname(require.resolve("material-components-web/package.json"))
const materialNodeModulesContainingFolder = path.resolve(materialFolder, '../../')

const sassLoader = {
    loader: 'sass-loader',
    options: {
        sassOptions: {
            includePaths: ['node_modules', 'node_modules/@material/*'].map((d) => path.resolve(materialNodeModulesContainingFolder, d))
        }
    }
}

const extractLoader = {
    loader: MiniCssExtractPlugin.loader
}


module.exports = {
    output: {
        path: path.resolve('assets')
    },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/_material.scss'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          extractLoader,
          'css-loader',
        ],
      }, {
        test: /\.scss/,
        use: [
            extractLoader,
            'css-loader',
            sassLoader
        ]
      }
    ],
  },
};

