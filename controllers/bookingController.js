const stripe = require('stripe')(process.env.STRIPE_PRE_SECRET_KEY)
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('../controllers/handlerFactory')

const getCheckoutSession = catchAsync(async (req, res, next) => {
    const tourId = req.params.tourId
    const tour = await Tour.findById(tourId)
    let session

    if (!tour || typeof tour === 'undefined') {
        return next(new AppError('No document was founded with that ID', 404))
    } else {
        const creationSession = {
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: tourId,
            line_items: [
                {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [
                        `https://www.natours.dev/img/tours/${tour.imageCover}`
                    ],
                    amount: tour.price * 100,
                    currency: 'eur', // Euros si se quieren dolares usar 'usd'
                    quantity: 1
                }
            ],
        }

        session = await stripe.checkout.sessions.create(creationSession)
    }

    res.status(200).json({
        status: 'success',
        data: session
    })
});

module.exports = {
    getCheckoutSession,
};