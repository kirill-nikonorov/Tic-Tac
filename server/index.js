const express = require('express');
const path = require("path")

const webpack = require("webpack");
const config = require("../webpack.config")
const compiler = webpack(config);

let webpackDevMiddlewere = require("webpack-dev-middleware");
let webpackHotMiddlewere = require("webpack-hot-middleware");


const app = express();

app.get("/" , (req, res)=>{
    res.sendFile(path.resolve(__dirname + "/static/index.html"))
})

app.use(webpackDevMiddlewere(compiler));
app.use(webpackHotMiddlewere(compiler));


let port = 3001;
app.listen(port, function () {
    setTimeout(() => console.log('Example app listening on port ' + port + '!'), 1000);
});