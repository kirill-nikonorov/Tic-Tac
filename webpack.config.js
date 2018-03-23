let path = require("path");
let webpack = require("webpack");

module.exports = {
    entry: {
        client: ['webpack-hot-middleware/client', './client/src/index.jsx']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, './client/dist'),
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [{
            exclude: /(node_modules)/,
            test: /\.jsx?$/,
            loader: "babel-loader",
            query: {presets: ["env", "react"]}

        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    devtool: "source-map",
    mode: "development"

}