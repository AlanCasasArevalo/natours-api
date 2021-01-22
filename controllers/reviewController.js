const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getAllReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find();

    if (!reviews || typeof reviews === 'undefined') {
        return next(new AppError('No reviews was founded', 404))
    } else {
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews
            }
        })
    }
});

const createNewReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    if (!newReview || typeof newReview === 'undefined') {
        return next(new AppError('No reviews was founded', 404))
    } else  {
        res.status(201).json({
            status: 'success',
            data: {
                review: newReview
            }
        })
    }
});

module.exports = {
    getAllReviews,
    createNewReview,
};