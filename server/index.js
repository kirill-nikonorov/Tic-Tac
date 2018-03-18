const path = require("path")

const webpack = require("webpack");
const config = require("../webpack.config")
const compiler = webpack(config);
const authenticate = require("./middlewere/authenticate")

const jwt = require('jsonwebtoken');


let webpackDevMiddlewere = require("webpack-dev-middleware");
let webpackHotMiddlewere = require("webpack-hot-middleware");


const app = require('express')();
const http = require("http").Server(app);
const io = require("socket.io")(http);

var jwtAuth = require('socketio-jwt-auth');


app.use(webpackDevMiddlewere(compiler));
app.use(webpackHotMiddlewere(compiler));


app.get("/", (req, res) => {
    console.log("get General page")
    res.sendFile(path.resolve(__dirname + "/static/index.html"))

});
// в завиимости от параметров возвращает токен
app.use("/authinticate", authenticate.handleInvitedLink);
app.use("/authinticate", authenticate.handleNewUsers);
//app.delete("/authinticate", authenticate.removeTokenFromRoom)

io.use((socket, next) => {

    let token = socket.handshake.query.token;

    if (!token) {
        console.log("there is no token , disconnect")
        socket.disconnect();
        return;
    }

    let decoded;
    try {
        decoded = jwt.verify(token, 'shh');
    }
    catch (e) {
        console.log(e)
        socket.disconnect();
        return;
    }
    console.log("payload = ", decoded)
    socket.decoded = decoded
    next();

});
console.log("after auth");


let serversSrores = [];
io.on("connection", (socket) => {
    let localServerStore;
    let roomNum = socket.decoded.roomNum;

    if (!serversSrores[roomNum]) {
        serversSrores[roomNum] = Array(9).fill(null);
    }
    if (!localServerStore) {
        localServerStore = serversSrores[roomNum];
    }

    console.log("______________");
    console.log("user connected = ", roomNum);
    console.log("all sockets ", Object.keys(io.sockets.connected));

    socket.join(roomNum);

    socket.on("makeStepEmit", (data) => {
        localServerStore[data.number] = data.mark;

        console.log("makeStep = ", data);
        console.log("localServerStore = ", localServerStore);
        io.in(roomNum).emit("makeStep", data)
    });

    socket.emit('initialState', localServerStore)

    socket.on("disconnect", () => {
        console.log("disconnected  ")

    })

});

let port = 3001;
http.listen(port, function () {
    setTimeout(() => console.log('Example app listening on port ' + port + '!'), 1000);
});