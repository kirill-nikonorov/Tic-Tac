const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require('webpack');


const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {

    mode: "development",
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

});