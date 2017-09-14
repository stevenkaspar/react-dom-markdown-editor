const isProduction = process.env.NODE_ENV === 'production';
const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/MarkdownEditor.js',
  output: {
    path: `${__dirname}/lib`,
    filename: `MarkdownEditor${isProduction ? '.min' : ''}.js`,
    library: 'MarkdownEditor',
    libraryTarget: 'umd',
  },
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
