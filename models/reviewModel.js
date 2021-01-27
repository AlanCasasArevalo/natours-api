const mongoose = require('mongoose');
const Tour = require('../models/tourModel')
const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: [true, 'A review must have a number'],
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5'],
        default: 4
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    review: {
        type: String,
        required: [true, 'A review must have a review description'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour']
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// QUERY MIDDLEWARE, this middleware is use it to hide tours with parameter secretTour to true
reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // })
    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
});

reviewSchema.statics.calculateAverageRatings = async function (tourId) {
    let ratingQuantity, ratingAverage
    const stats = await this.aggregate([
        {
            $match: {
                tour: tourId
            }
        }, {
            $group: {
                _id: '$tour',
                numRating: {$sum: 1},
                avgRating: {$avg: '$rating'}
            }
        }
    ])
    ratingQuantity = stats.length > 0 ? stats[0].numRating : 0
    ratingAverage = stats.length > 0 ? stats[0].avgRating : 4.0

    await Tour.findByIdAndUpdate(tourId, {
        ratingQuantity: ratingQuantity,
        ratingAverage: ratingAverage
    })
}

reviewSchema.post('save', function (next) {
    this.constructor.calculateAverageRatings(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.review = await this.findOne()
    console.log(``, this.review)
    next()
})

reviewSchema.post(/^findOneAnd/, async function () {
    await this.review.constructor.calculateAverageRatings(this.review.tour)
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
