const jwt = require('jsonwebtoken');

const checkToken = (socket, next) => {
    console.log("checkToken")

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
module.exports = checkToken;