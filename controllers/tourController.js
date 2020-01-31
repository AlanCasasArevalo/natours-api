const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const getAllTours = async (req, res) => {
    try {

        const featureApi = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .pagination();

        const tours = await featureApi.query;

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
        if (newTour && typeof newTour !== 'undefined') {
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
const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (tour && typeof tour !== 'undefined') {
            res.status(200).json({
                status: 'success',
                data: {
                    tour
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
            message: 'The recovered tour was failed'
        })
    }
};
const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (tour && typeof tour !== 'undefined') {
            res.status(200).json({
                status: 'success',
                message: 'Updated',
                data: {
                    tour
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The updated tour was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The updated tour was failed'
        })
    }
};
const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndRemove(req.params.id);
        if (tour && typeof tour !== 'undefined') {
            res.status(204).json({
                status: 'success',
                message: 'Removed'
                // data: {
                //     tour
                // }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The removed tour was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The removed tour was failed'
        })
    }
};

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage, price';
    req.query.fields = 'name, price, ratingAverage, summary, difficulty';

    next()
};

module.exports = {
    getAllTours,
    createNewTour,
    updateTour,
    getTour,
    deleteTour,
    aliasTopTours,
};