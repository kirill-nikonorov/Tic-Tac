const path = require("path")

const webpack = require("webpack");
const config = require("../webpack.config");
const compiler = webpack(config);
const authenticate = require("./middlewere/authenticate");

const jwt = require('jsonwebtoken');


let webpackDevMiddlewere = require("webpack-dev-middleware");
let webpackHotMiddlewere = require("webpack-hot-middleware");


const app = require('express')();
const http = require("http").Server(app);
const io = require("socket.io")(http);


app.use(webpackDevMiddlewere(compiler));
app.use(webpackHotMiddlewere(compiler));


app.get("/", (req, res) => {
    console.log("______________");

    console.log("get General page")
    console.log("______________");

    res.sendFile(path.resolve(__dirname + "/static/index.html"))

});
// в завиимости от параметров возвращает токен-----
app.use("/authinticate", authenticate.handleInvitedLink);
app.use("/authinticate", authenticate.handleNewUsers);
//app.delete("/authinticate", authenticate.removeTokenFromRoom)


console.log("after auth");

const checkToken = (socket, next) => {

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
    console.log("decoded = ", decoded)
    socket.decoded = decoded
    next();

};
const isRoomFree = (socket, next) => {

    let roomNum = socket.decoded.roomNum;

    roomFillerObserverIo.in(roomNum).clients((err, clients) => {
        if (err) throw  err;
        console.log(`isRoomFree clients of Room № ${roomNum} = `, clients)
        if (clients.length < 2) {
            next();
        }
        else socket.disconnect();
    })

}

let chatIo = io.of("/chat");
let ticTacToeIo = io.of("/ticTacToe");
let roomFillerObserverIo = io.of("/roomFillerObserver");

let timer = setInterval(() => {
    console.log("sockets = ", Object.keys(io.sockets.connected))
}, 2000);

ticTacToeIo.use(checkToken);
chatIo.use(checkToken);
roomFillerObserverIo.use(checkToken);
roomFillerObserverIo.use(isRoomFree);

roomFillerObserverIo.on("connection", (socket) => {
    console.log("______________");
    console.log("roomFillerObserverIo : User connected = ", socket.decoded)

    let roomNum = socket.decoded.roomNum;


    roomFillerObserverIo.in(roomNum).clients((err, clients) => {
        if (err) throw  err;

        if (clients.length < 2) {
            socket.join(roomNum);
        }
        console.log(`clients of Room № ${roomNum} = `, clients)

    });
    setTimeout(() => {
        roomFillerObserverIo.in(roomNum).clients((err, clients) => {
            if (err) throw  err;

            if (clients.length === 2) {
                roomFillerObserverIo.in(roomNum).emit("startGame")
            }
            console.log(`clients of Room № ${roomNum} = `, clients)

        });
    }, 1);


    socket.on("disconnect", () => {

        roomFillerObserverIo.in(roomNum).emit("endGame")
        console.log("disconnected  ")

    })
    console.log("______________");

});


chatIo.on("connection", (socket) => {
    console.log("______________");

    console.log("chatIo : User connected = ", socket.decoded)

    let roomNum = socket.decoded.roomNum;

    socket.join(roomNum);


    socket.on("message", (data) => {
        console.log(data)
        chatIo.in(roomNum).emit("message", data)
    })


    socket.on("disconnect", () => {
        socket.disconnect();
        console.log("disconnected  ")
    })

    console.log("______________");

});

let serversSrores = [];
ticTacToeIo.on("connection", (socket) => {
    console.log("______________");

    let localServerStore;
    let roomNum = socket.decoded.roomNum;

    console.log("Tic Tac toe : User Connected , room = ", roomNum)


    if (!serversSrores[roomNum]) {
        serversSrores[roomNum] = Array(9).fill(null);
    }
    if (!localServerStore) {
        localServerStore = serversSrores[roomNum];
    }


    socket.join(roomNum);

    socket.on("makeStepEmit", (data) => {
        localServerStore[data.number] = data.mark;

        console.log("makeStep = ", data);
        ticTacToeIo.in(roomNum).emit("makeStep", data)
    });
    socket.on("cleanBoard", () => {
        console.log("cleanBoard");

        serversSrores[roomNum] = Array(9).fill(null);
        localServerStore = serversSrores[roomNum]
        ticTacToeIo.in(roomNum).emit('initialState', localServerStore);
    });

    socket.emit('initialState', localServerStore)

    socket.on("disconnect", () => {
        console.log("disconnected  ")
    })
    console.log("______________");

});


let port = 3001;
http.listen(port, function () {
    setTimeout(() => console.log('Example app listening on port ' + port + '!'), 1000);
});



