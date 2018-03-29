let path = require("path");
let webpack = require("webpack");

module.exports = {
    entry: {
        //client: ['./client/src/index.jsx']
        client: ['webpack-hot-middleware/client', './client/src/index.jsx']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './client/dist'),
        publicPath: "/"
    },

    module: {
        rules: [{
            exclude: /(node_modules)/,
            test: /\.jsx?$/,
            loaders: "babel-loader",


        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devtool: "source-map",


}