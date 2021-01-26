const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const docModel = await Model.findByIdAndRemove(req.params.id);

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else {
        res.status(204).json({
            status: 'success',
            message: 'Removed',
            data: docModel
        })
    }
})

const updateOne = Model => catchAsync(async (req, res, next) => {
    const docModel = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Updated',
            data: docModel
        })
    }
});

const createOne = Model => catchAsync(async (req, res, next) => {
    const docModel = await Model.create(req.body);

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else {
        res.status(201).json({
            status: 'success',
            data: docModel
        })
    }
});

const getOneById = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)

    if (populateOptions) query = query.populate(populateOptions)

    const docModel = await query

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else {
        res.status(200).json({
            status: 'success',
            data: docModel
        })
    }

});

const getAll = Model => catchAsync(async (req, res, next) => {
    // To allow for nested GET Reviews on tour (hack)
    let filter = {}

    if (req.params.tourId) filter = {tour: req.params.tourId}

    const featureApi = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limit()
        .pagination();

    const docModel = await featureApi.query;

    if (!docModel || typeof docModel === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else {
        res.status(200).json({
            status: 'success',
            results: docModel.length,
            data: docModel
        })
    }
});


module.exports = {
    getAll,
    getOneById,
    createOne,
    updateOne,
    deleteOne
}