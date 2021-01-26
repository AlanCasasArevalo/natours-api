const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createNewReview
    )
router.route('/:id')
    .get(
        reviewController.getReviewById
    )
    .delete(
        reviewController.deleteReview
    )
    .patch(
        reviewController.updateReview
    )

module.exports = router;