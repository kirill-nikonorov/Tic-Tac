const jwt = require('jsonwebtoken');

const rooms = [];
let timer = setInterval(() => {
    console.log(rooms.map((room) => {
        return room.length
    }))
}, 2000)

/*

const handleAuthenticatedUsers = (req, res, next) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        console.log("/OLD authinticate = token = ", token)

        try {
            jwt.verify(token, "shh")
        }
        catch (e) {
            console.log(e)
            return res.status(401).send("Не прошел проверку");
        }

        definePositionOfUser(token, req, res)
    }
    else {
        next()
    }
};


const definePositionOfUser = (token, req, res) => {
    console.log("/definePositionOfUser");

    let roomNum = req.query.room;
    console.log("definePositionOfUser + room param = ", roomNum);

    if (roomNum) {
        let roomNum = jwt.decode(token, "shh").roomNum

        let room = rooms[roomNum]
        if (!room) {
            console.log("комнаты нет")
            return res.status(401).send("Комната занята");
        } else {
            if (rooms[roomNum].indexOf(token) !== -1) {
                return res.json({token: token})
            }
            else {
                rooms[roomNum].push(token);
                res.json({token: token})
            }
        }

        console.log("возвращаю токен ")
        return res.json({token: token});

    }
    else {
        console.log("ищу комнату есть ли комната с токеном ")

        return checkContainerForContaining(token, res)

    }

}


const checkContainerForContaining = (token, res) => {
    let roomNum = jwt.decode(token, "shh").roomNum

    let room = rooms[roomNum]
    if (!room) {
        console.log("Room not found")
        return createNewRoom(res);
    } else {
        if (rooms[roomNum].indexOf(token) !== -1) {
            res.json({token: token})
        }
        else {
            rooms[roomNum].push([token]);

            res.json({token: token})
        }
    }
};


const createNewRoom = (res) => {
    let lastRoom = rooms.length;

    let token = jwt.sign({roomNum: lastRoom, areYouFirst: true}, "shh")
    rooms.push([token]);
    res.json({token: token})

};


const removeTokenFromRoom = (req, res) => {
    console.log("removed")
    res.send("aaa")
};


//Handle New User
const handleNewUsers = (req, res, next) => {
    console.log("/handleNewUsers");

    let roomNum = req.query.room;
    console.log("handleNewUsers + room param = ", roomNum);

    if (roomNum) {

        return goToExistingRoom(roomNum, req, res)

    } else {
        return createNewRoom(res)
    }

}
const goToExistingRoom = (roomNum, req, res) => {
    if (rooms[roomNum] && rooms[roomNum].length < 2) {

        let token = jwt.sign({roomNum: roomNum, areYouFirst: false}, "shh")
        rooms[roomNum].push(token);
        res.json({token: token})
    }
    else {
        Console.log("комната занята")
        return res.status(401).send("Комната занята");

    }
}
*/






const handleAuthenticatedUsers = (req, res, next) => {

    if (isUserAuthenticated(req)) {
        const token = extractToken(req);

        if (!isVirifiable(token)) {
            responceBadStatus(res, "Не прошел верификацию")
        }
        else {
            if (isURLFilledBySearch(req)) {

                let roomNum = jwt.decode(token, "shh").roomNum

                if (isThisRoomInArray(roomNum)) {
                    if (isTokenInRoomAlready(roomNum, token)) {
                        responceTheSameToken(token, res);
                    }
                    else {
                        if (isRoomSuitableForJoin(roomNum)) {
                            occupyBusyRoom(roomNum, token);
                            responceTheSameToken(token, res);
                        } else {
                            responceBadStatus(res, "комнаты такой нет , ошибка")
                        }
                    }
                } else {
                    responceBadStatus(res, "комнаты такой нет, ошибка")
                }
            }
            else {

                let roomNum = jwt.decode(token, "shh").roomNum

                if (isThisRoomInArray()) {
                    if (isTokenInRoomAlready(roomNum, token)) {
                        responceTheSameToken();
                    }
                    else {
                        if (isThisRoomEmpty()) {
                            occupyFreeRoom();
                            responceTheSameToken();
                        } else {
                            responceBadStatus(res, "Комната занята")
                        }
                    }
                } else {
                    occupyNewRoom(res);
                }
            }
        }
    }
    else {
        next()
    }
};


const handleNewUsers = (req, res, next) => {

    if (isURLFilledBySearch(req)) {

        let roomNum = req.query.room;
        if (isThisRoomInArray(roomNum)) {
            if (isThereOnePlayer(roomNum)) {
                occupyBYNEWUSERonebuseRoom(res, roomNum)
            } else {
                responceBadStatus(res, "комната занята двумя или пуста")
            }
        }
        else {
            responceBadStatus(res, "Комнаты такой нет в массиве")
        }


    }
    else {

        occupyNewRoom(res)
    }
};

const isThereOnePlayer = (roomNum) => {
    if (rooms[roomNum].length == 1) {
        console.log("комната c одним игроком")
        return true;
    }
    else {
        console.log("комната не с одним , либо пустая")
        return false;
    }
}


const isUserAuthenticated = (req) => {
    if (req.headers.authorization) {
        console.log("Пользователь был аутентифицированн ")
        return true;
    }
    else {
        console.log("Пользователь НЕ был аутентифицированн ")
        return false;
    }
}
const extractToken = (req) => {
    let token = req.headers.authorization.split(' ')[1];
    console.log(" token = ", token)

    return token;
};
const isVirifiable = (token) => {
    let decoded
    try {
        decoded = jwt.verify(token, "shh")
    }
    catch (e) {
        console.log("не прошел верификацию")
        console.log(e)
    }

    if (decoded) {
        console.log("прошел верификацию ")
        return true;
    }
    else {
        console.log("Не прошел Верификация ")
        return false;
    }
}

const isURLFilledBySearch = (req) => {

    let roomNum = req.query.room;
    if (roomNum) {
        console.log("есть параметры поиска комнаты ")
        return true;
    }
    else {
        console.log("нет параметров поиска комнаты ")
        return false;
    }

};
const occupyNewRoom = (res) => {
    console.log("вступаю в новую комнату")

    let lastRoom = rooms.length;

    let token = jwt.sign({roomNum: lastRoom, areYouFirst: true}, "shh")
    rooms.push([token]);
    res.json({token: token})


};

const occupyBusyRoom = (roomNum, token) => {
    console.log("присоединяюсь к комнате")
    rooms[roomNum].push(token);
};
const occupyBYNEWUSERonebuseRoom = (res, roomNum) => {
    let token = jwt.sign({roomNum: roomNum, areYouFirst: true}, "shh")
    console.log("присоединяюсь к комнате occupyBusyRoomWithNewToken")
    rooms[roomNum].push(token);
    return res.json({token: token})

};

const occupyFreeRoom = () => {
    console.log("присоединяюсь к комнате")
    rooms[roomNum].push([token]);
};
const responceTheSameToken = (token, res) => {
    console.log("возвращаю старый токен")
    return res.json({token: token})
};
const responceBadStatus = (res, text) => {
    console.log(text)
    return res.status(401).send(text);
};

const isThisRoomInArray = (roomNum) => {
    if (rooms[roomNum]) {
        console.log("комната есть в массиве ")
        return true;
    }
    else {
        console.log("комнаты нет в массиве")
        return false;
    }
}
const isRoomSuitableForJoin = () => {
    if (rooms[roomNum].length < 2) {
        console.log("комната свобода для второго")
        return true;
    }
    else {
        console.log("комната занята для второго")
        return false;
    }
}
const isThisRoomEmpty = (roomNum) => {
    if (rooms[roomNum].length < 1) {
        console.log("комната свобода ")
        return true;
    }
    else {
        console.log("комната занята ")
        return false;
    }
}
const isTokenInRoomAlready = (roomNum, token) => {
    if (rooms[roomNum].indexOf(token) !== -1) {
        console.log("токен уже внутри комнаты ")
        return true;
    }
    else {
        console.log("токена нет в комнате ")
        return false;
    }
}

const removeTokenFromRoom = (req, res) => {
    console.log("removed")
    res.send("aaa")
};

exports.handleAuthenticatedUsers = handleAuthenticatedUsers;
exports.handleNewUsers = handleNewUsers;

exports.removeTokenFromRoom = removeTokenFromRoom;
