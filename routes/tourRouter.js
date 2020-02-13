const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// router.param('id', tourController.checkId);

// Alias to get
router.route('/top-5-cheap')
    .get(
        tourController.aliasTopTours,
        tourController.getAllTours
    );

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year')
    .get(tourController.getMonthlyPlan);

router.route('/')
    .get(
        authController.protect,
        tourController.getAllTours)
    .post(
        tourController.createNewTour
    );

router.route('/:id')
    .get(tourController.getTour)
    .patch(
        authController.protect,
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo('admin','lead-guide'),
        tourController.deleteTour
    );

module.exports = router;