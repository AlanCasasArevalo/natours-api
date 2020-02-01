const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        required: [true, 'A tour must have a name'],
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [10, 'A tour name must have more or equal then 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contains characters.']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'The values allowed are easy, medium or difficult'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.0,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0']
    },
    ratingQuantity: {
        type: Number,
        default: 4.0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (value) {
                return value < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },

}, {
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
});

tourSchema.virtual('durationWeeks')
    .get(function () {
        return this.duration / 7
    });

// Will be called before to save into DB save / create
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    next()
});

// tourSchema.pre('save', function (next) {
//
//     next()
// });
//
// tourSchema.post('save', function (doc, next) {
//     next()
// });

// QUERY MIDDLEWARE, this middleware is use it to hide tours with parameter secretTour to true
tourSchema.pre(/^find/, function (next) {
    this.find({
        secretTour: {
            $ne: true
        }
    });
    this.start = Date.now();
    next();
});

// QUERY MIDDLEWARE, this middleware is use it to get information of calls
tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${ Date.now() - this.start } milliseconds`);
    next();
});

// AGGREGATION MIDDLEWARE this middleware is use to hide secret tour from all endpoint that could return a tour with secret tour to true.
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { secretTour : { $ne: true } }
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
