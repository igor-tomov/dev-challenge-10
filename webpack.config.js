var path = require('path');

module.exports = {
    debug: true,
    devtool: 'source-map',

    entry: [
      "babel-polyfill",
      "./src/index.js"
    ],

    output: {
      path: __dirname + '/public',
      filename: "dist/app.bundle.js"
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        },
        {
          test: /\.json$/,
          loader: 'json'
        },
        {
          test: /\.css$/,
          loader: "style-loader!css-loader?-url"
        },
        {
          test: /\.png$/,
          loader: "file-loader",
          query: {
            name: "assets/img/[name].[ext]",
          }
        }
      ],

      noParse: [path.join(__dirname, "node_modules/openlayers/dist/ol.js")],
    }
};
