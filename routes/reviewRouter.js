const express = require('express');
const router = express.Router({mergeParams: true});
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

router.route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.protect,
        reviewController.createNewReview
    )
router.route('/:id')
    .delete(
        reviewController.deleteReview
    )

module.exports = router;