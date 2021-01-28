const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter')

router.use('/:tourId/reviews', reviewRouter)

// router.param('id', tourController.checkId);

// Alias to get
router.route('/top-5-cheap')
    .get(
        tourController.aliasTopTours,
        tourController.getAllTours
    );

router.route('/tour-stats')
    .get(
        tourController.getTourStats
    );

router.route('/monthly-plan/:year')
    .get(
        authController.protect,
        authController.restrictTo('admin','lead-guide', 'guide'),
        tourController.getMonthlyPlan
    );

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(
        tourController.getToursWithin
    )

router.route('/distances/:latlng/unit/:unit')
    .get(
        tourController.getDistance
    )

router.route('/')
    .get(
        tourController.getAllTours
    )
    .post(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.createNewTour
    );

router.route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeUserImage,
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.deleteTour
    );

module.exports = router;