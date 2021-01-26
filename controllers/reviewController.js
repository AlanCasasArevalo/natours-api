const Review = require('./../models/reviewModel');
const handlerFactory = require('../controllers/handlerFactory')

const setTourUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

const getAllReviews = handlerFactory.getAll(Review)

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