const mongoose = require('mongoose');
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

let DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

// if (process.env.NODE_ENV === 'development') {
//     DB = process.env.DATABASE_LOCAL
// } else {
//     DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// }

mongoose
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then((connection) => {
        // console.log('Mongoose connection', connection.connections );
        console.log('DB connection SUCCESSFUL!!');
    });

const tourSchema = new mongoose.Schema({
   name: {
       type: String,
       unique: true,
       required: [true, 'A tour must have a name']
   },
   rating: {
       type: Number,
       default: 4.0
   },
   price: {
       type: Number,
       required: [true, 'A tour must have a price']
   }
});

const Tour = mongoose.model('Tour' , tourSchema);

const testTour = new Tour({
    name: 'Test tour to get',
    rating: 4.3,
    price: 487
});

testTour
    .save()
    .then(document => {
        console.log('Success',  document);
    })
    .catch(error => {
        console.log('Error 💥', error);
    });

const port = process.env.PORT || 3000;
server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${port}`);
});