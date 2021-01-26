const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('../controllers/handlerFactory')

const getAllReviews = catchAsync(async (req, res, next) => {
    let filter = {}

    if (req.params.tourId) filter = {tour: req.params.tourId}

    const reviews = await Review.find(filter);

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


const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

const createNewReview = handlerFactory.createOne(Review)

const deleteReview = handlerFactory.deleteOne(Review)

const updateReview = handlerFactory.updateOne(Review)

const getReviewById = handlerFactory.getOneById(Review)

module.exports = {
    getAllReviews,
    createNewReview,
    deleteReview,
    setTourUserIds,
    updateReview,
    getReviewById
};