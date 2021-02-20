const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

router.use(authController.protect)

router.route('/checkout-session/:tourId')
    .get(
        authController.protect,
        bookingController.getCheckoutSession
    )

module.exports = router;