const jwt = require('jsonwebtoken');

const handleInvitedLink = (req, res, next) => {

    let roomNum = req.query.room;
    if (roomNum) {
        console.log("новый Второй игрок : есть параметры поиска комнаты ")
        if (rooms[roomNum] && rooms[roomNum].length === 1) {
            let token = jwt.sign({roomNum: roomNum, areYouFirst: false}, "shh")
            rooms[roomNum].push(token);
            res.json({token: token, areYouFirst : false})

        }

    }
    else {
        next();
    }
}
const handleNewUsers = (req, res, next) => {

    let lastRoom = rooms.length;
    console.log("новый Первый игрок : создаю тоен и отправляю ")

    let token = jwt.sign({roomNum: lastRoom, areYouFirst: true}, "shh")
    rooms.push([token]);
    res.json({token: token , areYouFirst : true})
}


const rooms = [];
let timer = setInterval(() => {
    console.log("rooms = " ,rooms.map((room) => {
        return room.length
    }))
}, 2000)


const removeTokenFromRoom = (req, res) => {
    console.log("removed")
    res.send("aaa")
};

exports.handleInvitedLink = handleInvitedLink;
exports.handleNewUsers = handleNewUsers;

exports.removeTokenFromRoom = removeTokenFromRoom;
