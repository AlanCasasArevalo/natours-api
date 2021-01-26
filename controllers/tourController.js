const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const handlerFactory = require('../controllers/handlerFactory')

const getAllTours = handlerFactory.getAll(Tour)

const getTour = handlerFactory.getOneById(Tour, { path: 'reviews' })

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
    } else  {
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
    } else  {
        res.status(200).json({
            status: 'success',
            message: 'Stats',
            data: {
                plan
            }
        })
    }
});

module.exports = {
    getAllTours,
    createNewTour,
    updateTour,
    getTour,
    deleteTour,
    getTourStats,
    aliasTopTours,
    getMonthlyPlan,
};