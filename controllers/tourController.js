const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        if (tours && typeof tours !== 'undefined') {
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The recovered tours was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The recovered tours was failed'
        })
    }
};

const createNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        if (newTour && typeof newTour !== 'undefined'){
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The creation was failed'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent'
        })
    }

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
};