const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const getAllTours = catchAsync(async (req, res, next) => {
    const featureApi = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limit()
        .pagination();

    const tours = await featureApi.query;

    if (!tours || typeof tours === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })
    }
});
const createNewTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);

    if (!newTour || typeof newTour === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    }
});
const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if (!tour || typeof tour === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }

});
const updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!tour || typeof tour === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(200).json({
            status: 'success',
            message: 'Updated',
            data: {
                tour
            }
        })
    }
});
const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndRemove(req.params.id);

    if (!tour || typeof tour === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(204).json({
            status: 'success',
            message: 'Removed',
            data: {
                tour
            }
        })
    }
});
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