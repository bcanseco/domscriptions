import {resolve} from 'path';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import {name} from './package.json';

export default {
  mode: 'production',
  entry: {
    [name]: resolve(__dirname, 'src'),
    options: resolve(__dirname, 'src', 'options.js'),
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
  ],
};
