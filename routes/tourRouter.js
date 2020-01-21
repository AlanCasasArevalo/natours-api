const express = require('express');
const router = express.Router();
const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));



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
        fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), error => {
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

router.route('/')
    .get(getAllTours)
    .post(createNewTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;