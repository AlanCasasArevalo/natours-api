const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.use(authController.protect)

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createNewReview
    )
router.route('/:id')
    .get(
        reviewController.getReviewById
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )

module.exports = router;