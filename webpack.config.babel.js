import {resolve} from 'path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {DEFAULT_TINT_COLOR, SAVED_TINT_COLOR_NAME} from './src/constants';

export default {
  mode: 'production',
  entry: {
    domscriptions: resolve(__dirname, 'src'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.pug$/,
        use: 'pug-loader',
      },
    ],
  },
  output: {
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([resolve(__dirname, 'src', 'static')]),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: resolve(__dirname, 'src', 'views', 'options.pug'),
      templateParameters: {DEFAULT_TINT_COLOR, SAVED_TINT_COLOR_NAME},
      inject: false,
    }),
  ],
};
