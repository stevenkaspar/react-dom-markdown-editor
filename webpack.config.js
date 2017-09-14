'use strict';

const isProduction = process.env.NODE_ENV === 'production';
const webpack = require('webpack');

let common_config = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /prop-types/,
        use: 'null-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
					presets: [
						'es2015',
            'stage-2'
					],
					plugins: [
						['transform-react-jsx']
					]
				},
      },
      {
        test: /\.scss$/,
        use: [{
          loader: "style-loader" // creates style nodes from JS strings
        }, {
          loader: "css-loader" // translates CSS into CommonJS
        }, {
          loader: "sass-loader" // compiles Sass to CSS
        }]
      }
    ],
  }
};

let entry_outputs = {
  './src/MarkdownEditor.js': {
    path: `${__dirname}/lib`,
    filename: `MarkdownEditor${isProduction ? '.min' : ''}.js`,
    library: 'MarkdownEditor',
    libraryTarget: 'umd',
  },
  './examples/app.js': {
    path: `${__dirname}/docs`,
    filename: `bundle${isProduction ? '.min' : ''}.js`
  }
};

exports = [];

for(var entry in entry_outputs){
  exports.push(
    Object.assign({}, common_config, {
      entry: entry,
      output: entry_outputs[entry]
    })
  )
}

module.exports = exports;
