const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');
const http = require('http');
const morgan = require('morgan');
const path = require('path');

const app = express();
let server = http.createServer(app);

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// IO = esta es la comunicacion del backend
module.exports.io = socketIO(server);

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

app.use('/api/v1/tours' ,tourRouter);
app.use('/api/v1/users' ,userRouter);

server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${port}`);
});