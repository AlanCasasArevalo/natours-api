const Tour = require('./../models/tourModel');

const getAllTours = async (req, res) => {
    try {

        const queryObj = {...req.query};

        // exclude fields from query
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(element => delete queryObj[element]);

        //We use mongoDB operators to use >=, <=, = filters
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        const queryJson = JSON.parse(queryString);
        let query = Tour.find(queryJson);

        // Sort by fields, response shows first the fields that use on it
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }

        // Filter by fields, response shows only fields that we use on it
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }

        // Pagination
        // page=2&limit=5, 1-5 page 1, 6-10 page 2, 11-15 page 3, etc
        // query = query.skip(1).limit(5);
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit || 1;
        const numTours = await Tour.countDocuments();

        if (page && typeof page !== 'undefined' && skip < numTours && limit && typeof limit !== 'undefined' && skip && typeof skip !== 'undefined') {
            query = query.skip(skip).limit(limit);
        } else {
            throw new Error('This page does not exists');
        }

        const tours = await query;

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
module.exports = {
    getAllTours,
    createNewTour,
    updateTour,
    getTour,
    deleteTour,
};