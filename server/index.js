const path = require("path");

const webpack = require("webpack");
const devConfig = require("../webpack.dev");
const compiler = webpack(devConfig);
const jwt = require("jsonwebtoken");

let checkToken = require("./socketMiddlewere/socketCheck.js");

let webpackDevMiddlewere = require("webpack-dev-middleware");
let webpackHotMiddlewere = require("webpack-hot-middleware");

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);


app.use(webpackDevMiddlewere(compiler));
app.use(webpackHotMiddlewere(compiler));

/*app.use(express.static(path.resolve( "./client/dist/")));*/



app.get("/", (req, res) => {
	console.log("______________");

	console.log("get General page");
	console.log("______________");

	res.sendFile(path.resolve(__dirname + "/static/index.html"));

});


let authenticateSocket = io.of("/authenticate");
let roomFillerObserverSocket = io.of("/roomFillerObserver");
let chatSocket = io.of("/chat");
let ticTacToeSocket = io.of("/ticTacToe");

const isRoomFree = (socket, next) => {

	let roomId = socket.decoded.roomId;

	roomFillerObserverSocket.in(roomId).clients((err, clients) => {
		if (err) throw  err;
		console.log(`isRoomFree clients of Room № ${roomId} = `, clients);
		if (clients.length < 2) {
			next();
		}
		else socket.disconnect();
	});

};

ticTacToeSocket.use(checkToken);
chatSocket.use(checkToken);
roomFillerObserverSocket.use(checkToken);
roomFillerObserverSocket.use(isRoomFree);

let rooms = [];
authenticateSocket.on("connection", (socket) => {

	console.log("authenticate : connection ");
	socket.on("getToken", (data) => {
		let {id} = data;
		console.log("authenticate : getToken , roomId = ", id);
		if (typeof  id === "number") {
			console.log(" getToken , in existing room");

			handleJoiningInExistingRoom(id, socket);
		}
		else {
			console.log(" getToken , in new room");

			handleJoiningInNewRoom(socket);
		}
	});
	socket.on("leaveRoom", () => {

		let roomId = -1,
			socketId;
		rooms.forEach((room, id) => {
			let elementId = room.indexOf(socket);
			if (elementId !== -1) {
				socketId = elementId;
				roomId = id;
			}
		});
		console.log("leaveRoom  , room = ", roomId);

		if (roomId !== -1) {
			rooms[roomId].splice(socketId, 1);
			if (rooms[roomId].length === 0) rooms.splice(roomId, 1);
			console.log("rooms after = ", rooms);
		}
	});
	socket.on("disconnect", (socket) => {
		console.log("disconnect = authentication ");

	});
});

const handleJoiningInExistingRoom = (id, socket) => {

	if (rooms[id] && rooms[id].length < 2) {
		console.log("loin Existing room , socket = ", socket.id);
		rooms[id].push(socket);
		let token = jwt.sign({roomId: id, areYouFirst: false}, "shh");
		socket.emit("provideToken", {token: token});
	}
	else {
		socket.emit("authenticationFail");
	}
};
const handleJoiningInNewRoom = (socket) => {
	console.log("loin new room , socket = ", socket.id);

	let lastRoom = rooms.length;
	rooms.push([socket]);
	let token = jwt.sign({roomId: lastRoom, areYouFirst: true}, "shh");
	console.log("provideToken");

	socket.emit("provideToken", {token: token});

};

roomFillerObserverSocket.on("connection", (socket) => {
	console.log("______________");
	console.log("roomFillerObserverIo : User connected = ", socket.decoded);

	let roomId = socket.decoded.roomId;

	roomFillerObserverSocket.in(roomId).clients((err, clients) => {
		if (err) throw  err;

		if (clients.length < 2) {
			socket.join(roomId);
		}
		console.log(`clients of Room № ${roomId} = `, clients);

	});
	setTimeout(() => {
		roomFillerObserverSocket.in(roomId).clients((err, clients) => {
			if (err) throw  err;

			if (clients.length === 2) {
				roomFillerObserverSocket.in(roomId).emit("startGame");
			}
			console.log(`clients of Room № ${roomId} = `, clients);

		});
	}, 1);

	socket.on("disconnect", () => {

		roomFillerObserverSocket.in(roomId).emit("endGame");
		console.log("disconnected  ");

	});
	console.log("______________");

});
chatSocket.on("connection", (socket) => {
	console.log("______________");

	console.log("chatIo : User connected = ", socket.decoded);

	let roomId = socket.decoded.roomId;

	socket.join(roomId);


	socket.on("message", (data) => {
		console.log(data);
		chatSocket.in(roomId).emit("message", data);
	});


	socket.on("disconnect", () => {
		socket.disconnect();
		console.log("disconnected  ");
	});

	console.log("______________");

});

let serversSrores = [];
ticTacToeSocket.on("connection", (socket) => {
	console.log("______________");

	let localServerStore;
	let roomId = socket.decoded.roomId;

	console.log("Tic Tac toe : User Connected , room = ", roomId);


	if (!serversSrores[roomId]) {
		serversSrores[roomId] = Array(9).fill(null);
	}
	if (!localServerStore) {
		localServerStore = serversSrores[roomId];
	}


	socket.join(roomId);

	socket.on("makeStepEmit", (data) => {
		localServerStore[data.number] = data.mark;

		console.log("makeStep = ", data);
		ticTacToeSocket.in(roomId).emit("makeStep", data);
	});
	socket.on("cleanBoard", () => {
		console.log("cleanBoard");

		serversSrores[roomId] = Array(9).fill(null);
		localServerStore = serversSrores[roomId];
		ticTacToeSocket.in(roomId).emit("initialState", localServerStore);
	});

	socket.emit("initialState", localServerStore);

	socket.on("disconnect", () => {
		console.log("disconnected  ");
	});
	console.log("______________");

});

let socketsTimer = setInterval(() => {
	console.log("sockets = ", Object.keys(io.sockets.connected));
}, 2000);
let roomTimer = setInterval(() => {
	console.log("rooms = ", rooms.map((room) => {
		return room.length;
	}));
}, 2000);

let port = 3001;
http.listen(port, function () {
	setTimeout(() => console.log("Example app listening on port " + port + "!"), 1000);
});



