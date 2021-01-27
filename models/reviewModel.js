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

    await Tour.findByIdAndUpdate(tourId, {
        ratingQuantity: stats[0].numRating,
        ratingAverage: stats[0].avgRating
    })
}

reviewSchema.post('save', function (next) {
    this.constructor.calculateAverageRatings(this.tour)
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
