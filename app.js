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

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    })
};

const createNewTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);
    if (newTour && typeof newTour !== 'undefined') {
        tours.push(newTour);
        fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
            if (error && typeof error !== 'undefined') {
                res.status(500).json({
                    status: 'failed',
                    message: 'The creation was failed'
                })
            } else {
                res.status(201).json({
                    status: 'success',
                    data: {
                        tour: newTour
                    }
                })
            }
        })
    } else {
        res.status(500).json({
            status: 'failed',
            message: 'The creation was failed'
        })
    }
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(element => element.id === id);
    if (!tour && typeof tour === 'undefined' || id > tours.length) {
        res.status(404).json({
            status: 'failed',
            message: 'The tour was not found'
        })
    } else {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        res.status(404).json({
            status: 'failed',
            message: 'The tour was not found'
        })
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Updated'
        })
    }
};

const deleteTour = (req, res) => {
    const id = req.params.id * 1;
    if (id > tours.length) {
        res.status(404).json({
            status: 'failed',
            message: 'The tour was not found'
        })
    } else {
        res.status(200).json({
            status: 'success',
            data: null
        })
    }
};

 const getAllUsers = (req, res) => {
        res.status(500).json({
            status: 'failed',
            message: 'This route was not done yet'
        })
 };
 const createNewUsers = (req, res) => {
        res.status(500).json({
            status: 'failed',
            message: 'This route was not done yet'
        })
 };
 const getUsers = (req, res) => {
        res.status(500).json({
            status: 'failed',
            message: 'This route was not done yet'
        })
 };
 const updateUsers = (req, res) => {
        res.status(500).json({
            status: 'failed',
            message: 'This route was not done yet'
        })
 };
 const deleteUsers = (req, res) => {
        res.status(500).json({
            status: 'failed',
            message: 'This route was not done yet'
        })
 };

const toursRouter = express.Router();
const usersRouter = express.Router();

toursRouter.route('/')
    .get(getAllTours)
    .post(createNewTour);

toursRouter.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

usersRouter.route('/')
    .get(getAllUsers)
    .post(createNewUsers);

usersRouter.route('/:id')
    .get(getUsers)
    .patch(updateUsers)
    .delete(deleteUsers);

app.use('/api/v1/tours' ,toursRouter);
app.use('/api/v1/users' ,usersRouter);

server.listen(port, (err) => {
    if (err) throw new Error(err);
    console.log(`Servidor corriendo en puerto ${port}`);
});