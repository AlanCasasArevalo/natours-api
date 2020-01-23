const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
});
const socketIO = require('socket.io');
const app = require('./app');
const http = require('http');
let server = http.createServer(app);
// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);


const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${port}`);
});