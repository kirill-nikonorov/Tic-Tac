const path = require("path");
const socketsSetting = require("./socketsSetting");


const webpack = require("webpack");
const devConfig = require("../webpack.dev");
const compiler = webpack(devConfig);

let webpackDevMiddleware = require("webpack-dev-middleware");
let webpackHotMiddleware = require("webpack-hot-middleware");

const express = require("express");
const app = express();
const http = require("http").Server(app);

app.use(webpackDevMiddleware(compiler));
app.use(webpackHotMiddleware(compiler));

app.get("/", (req, res) => {
    console.log("______________");

    console.log("get General page");
    console.log("______________");

    res.sendFile(path.resolve(__dirname + "/static/index.html"));

});

socketsSetting(http);

let port = 3001;

http.listen(port, function () {
    setTimeout(() => console.log("Example app listening on port " + port + "!"), 1000);
});



