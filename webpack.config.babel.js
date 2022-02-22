import {resolve} from 'path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {DEFAULT_TINT_COLOR, SAVED_TINT_COLOR_NAME} from './src/constants';
import {name} from './package.json';

export default {
  mode: 'production',
  entry: {
    [name]: resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src', 'static'),
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: resolve(__dirname, 'src', 'views', 'options.ejs'),
      templateParameters: {DEFAULT_TINT_COLOR, SAVED_TINT_COLOR_NAME},
      inject: false,
    }),
  ],
};
