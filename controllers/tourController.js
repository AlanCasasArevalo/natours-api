const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new AppError('File passed is not an image, Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadTourImages = upload.fields([
    {
        name: 'imageCover',
        maxCount: 1
    },
    {
        name: 'images',
        maxCount: 3
    },
])

// Resize image square
const resizeUserImage = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next()

    const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg', {})
        .jpeg({
            quality: 75
        })
        .toFile(`public/img/tours/${imageCoverFilename}`)

    req.body.imageCover = imageCoverFilename

    req.body.images = []

    for (const file of req.files.images) {
        let index = req.files.images.indexOf(file);
        const imageFilename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`
        await sharp(req.files.images[index].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg', {})
            .jpeg({
                quality: 75
            })
            .toFile(`public/img/tours/${imageFilename}`)

        req.body.images.push(imageFilename)
    }
    next()
})

const handlerFactory = require('../controllers/handlerFactory')

const getAllTours = handlerFactory.getAll(Tour)

const getTour = handlerFactory.getOneById(Tour, {path: 'reviews'})

const createNewTour = handlerFactory.createOne(Tour)

const updateTour = handlerFactory.updateOne(Tour)

const deleteTour = handlerFactory.deleteOne(Tour)

const getTourStats = catchAsync(async (req, res, next) => {
    // Aggregate its a method to use like Pipe, you take some properties and use them to get another ones
    const stats = await Tour.aggregate([
        {
            $match: {
                // This property should be into model to be matched
                ratingAverage: {
                    $gte: 2.0
                }
            }
        },
        {
            // You could use some kind of grouped and returned properties all properties that you grouped
            // here should be returned in call
            $group: {
                _id: {
                    $toUpper: '$difficulty'
                },
                // _id: '$maxGroupSize',
                // _id: '$difficulty',
                num: {$sum: 1},
                numRating: {$sum: '$ratingQuantity'},
                avgRating: {$avg: '$ratingAverage'},
                avgPrice: {$avg: '$price'},
                minPrice: {$min: '$price'},
                maxPrice: {$max: '$price'},
            }
        }, {
            // You can sorted the properties by property that you want
            $sort: {
                avgPrice: 1
            }
        },
        // You could hide some properties using more pipes
        // {
        //     $match: {
        //         _id: {
        //             $ne: 'EASY'
        //         }
        //     }
        // }
    ]);

    if (!stats || typeof stats === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Stats',
            data: {
                stats
            }
        })
    }
});

const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage, price';
    req.query.fields = 'name, price, ratingAverage, summary, difficulty';

    next()
};

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTourStarts: {$sum: 1},
                tours: {
                    $push: '$name'
                }
            }
        },
        {
            $addFields: {month: '$_id'}
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                _id: 1
            }
        },

        // You could limit the response if you want
        // {
        //     $limit: 5
        // }
    ]);

    if (!plan || typeof plan === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else {
        res.status(200).json({
            status: 'success',
            message: 'Stats',
            data: {
                plan
            }
        })
    }
});

const getToursWithin = catchAsync(async (req, res, next) => {
    // /tours-within/:distance/center/:latlong/unit/:unit
    const {distance, latlng, unit} = req.params

    const [latitude, longitude] = latlng.split(',')

    if (!latitude || typeof latitude === 'undefined' || !longitude || typeof longitude === 'undefined') {
        next(new AppError('Please provide latitude and longitude in format latitude, longitude', 400))
    }

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

    const tours = await Tour.find({
        startLocation: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius]
            }
        }
    })

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    })
});

const getDistance = catchAsync(async (req, res, next) => {
    const {latlng, unit} = req.params
    const [latitude, longitude] = latlng.split(',')

    if (!latitude || typeof latitude === 'undefined' || !longitude || typeof longitude === 'undefined') {
        next(new AppError('Please provide latitude and longitude in format latitude, longitude', 400))
    }

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [
                        longitude * 1,
                        latitude * 1
                    ]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name:1
            }
        }
    ])

    res.status(200).json({
        status: 'success',
        results: distances.length,
        data: distances
    })
})

module.exports = {
    getAllTours,
    createNewTour,
    updateTour,
    getTour,
    deleteTour,
    getTourStats,
    aliasTopTours,
    getMonthlyPlan,
    getToursWithin,
    uploadTourImages,
    resizeUserImage,
    getDistance
};