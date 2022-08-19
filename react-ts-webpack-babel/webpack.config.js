const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

/**
 *
 * @returns {import('webpack').Configuration}
 */
module.exports = function createWebpackConfig(
  { WEBPACK_SERVE },
  { mode = 'development' }
) {
  if (WEBPACK_SERVE) {
    console.log(`
  🏗️  Starting dev server in mode ${mode}
    `);
  } else {
    console.log(`
  🏗️  Building for ${mode}
    `);
  }

  const dev = mode === 'development';

  const paths = {};
  paths.root = path.resolve(process.cwd());
  paths.src = path.resolve(paths.root, 'src');
  paths.dist = path.resolve(paths.root, 'dist');
  paths.entry = path.resolve(paths.root, 'src/index.tsx');
  paths.entryRelative = './' + path.relative(paths.root, paths.entry);
  paths.favicon = path.resolve(paths.root, 'src/assets/cascadeLarger.svg');

  return {
    mode: mode,
    devtool: dev ? 'eval-source-map' : 'source-map',
    entry: paths.entryRelative,
    devServer: {
      port: 3000,
    },
    output: {
      path: paths.dist,
      filename: dev ? '[name].js' : 'static/[name].[contenthash].js',
      publicPath: '/',
      chunkFilename: dev
        ? '[name].chunk.js'
        : 'static/[name].chunk.[contenthash].js',
    },
    plugins: compact([
      new FaviconsWebpackPlugin(paths.favicon),
      new MiniCssExtractPlugin({
        filename: dev ? '[name].css' : 'static/[name].[contenthash].css',
        chunkFilename: dev
          ? '[name].chunk.css'
          : 'static/[name].chunk.[contenthash].css',
      }),
      new HtmlWebpackPlugin({ template: 'src/index.html' }),
      dev && new ReactRefreshWebpackPlugin(),
    ]),
    resolve: {
      modules: ['node_modules', paths.src],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: compact([dev && 'react-refresh/babel']),
          },
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false, // Required as image imports should be handled via JS/TS import statements
              },
            },
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/,
          type: 'asset',
        },
      ],
    },
  };
};

function compact(array) {
  return array.filter(Boolean);
}
