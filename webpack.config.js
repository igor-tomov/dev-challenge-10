var path = require('path');

module.exports = {
    debug: true,
    devtool: 'source-map',

    entry: [
      "babel-polyfill",
      "./src/index.js"
    ],

    output: {
      path: __dirname,
      publicPath: `${__dirname}/public`,
      filename: "public/dist/app.bundle.js"
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
          test: /\.json/,
          loader: 'json'
        },
        {
          test: /\.css/,
          loader: "style-loader!css-loader?-url"          
        }
      ],

      noParse: [path.join(__dirname, "node_modules/openlayers/dist/ol.js")],
    }
};
