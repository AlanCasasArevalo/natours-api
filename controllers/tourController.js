// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
const Tour = require('./../models/tourModel');

const checkBodyRequest = (req, res, next) => {
    // const name = req.body.name;
    // const price = req.body.price;
    // if (!name && typeof name === 'undefined' || !price && typeof price === 'undefined'){
    //     return res.status(400).json({
    //         status: 'failed',
    //         message: 'Name or Price are not passing into request'
    //     })
    // }
    next()
};

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        // results: tours.length,
        // data: {
        //     tours
        // }
    })
};

const createNewTour = (req, res) => {
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({id: newId}, req.body);
    // if (newTour && typeof newTour !== 'undefined') {
    //     tours.push(newTour);
    //     fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
    //         if (error && typeof error !== 'undefined') {
    //             res.status(500).json({
    //                 status: 'failed',
    //                 message: 'The creation was failed'
    //             })
    //         } else {
    //             res.status(201).json({
    //                 status: 'success',
    //                 data: {
    //                     tour: newTour
    //                 }
    //             })
    //         }
    //     })
    // } else {
        res.status(500).json({
            status: 'failed',
            message: 'The creation was failed'
        })
    // }
};

const getTour = (req, res) => {
    // const id = req.params.id * 1;
    // const tour = tours.find(element => element.id === id);
    // if (!tour && typeof tour === 'undefined' || id > tours.length) {
        res.status(404).json({
            status: 'failed',
            message: 'The tour was not found'
        })
    // } else {
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             tour
    //         }
    //     })
    // }
};

const updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Updated'
    })
};

const deleteTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: null
    })
};

module.exports = {
    getAllTours,
    createNewTour,
    updateTour,
    getTour,
    deleteTour,
    checkBodyRequest,
};