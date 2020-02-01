const Tour = require('./../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const getAllTours = async (req, res) => {
    try {

        const featureApi = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limit()
            .pagination();

        const tours = await featureApi.query;

        if (tours && typeof tours !== 'undefined') {
            res.status(200).json({
                status: 'success',
                results: tours.length,
                data: {
                    tours
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The recovered tours was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The recovered tours was failed'
        })
    }
};
const createNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        if (newTour && typeof newTour !== 'undefined') {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The creation was failed'
            })
        }
    } catch (error) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid data sent'
        })
    }

};
const getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        if (tour && typeof tour !== 'undefined') {
            res.status(200).json({
                status: 'success',
                data: {
                    tour
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The recovered tours was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The recovered tour was failed'
        })
    }
};
const updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (tour && typeof tour !== 'undefined') {
            res.status(200).json({
                status: 'success',
                message: 'Updated',
                data: {
                    tour
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The updated tour was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The updated tour was failed'
        })
    }
};
const deleteTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndRemove(req.params.id);
        if (tour && typeof tour !== 'undefined') {
            res.status(204).json({
                status: 'success',
                message: 'Removed'
                // data: {
                //     tour
                // }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The removed tour was failed'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The removed tour was failed'
        })
    }
};
const getTourStats = async (req, res) => {
    try {
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
        ])

        if (stats && typeof stats !== 'undefined') {
            res.status(200).json({
                status: 'success',
                message: 'Stats',
                data: {
                    stats
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The stats were not found'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The stats were not found'
        })
    }
};
const aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingAverage, price';
    req.query.fields = 'name, price, ratingAverage, summary, difficulty';

    next()
};
const getMonthlyPlan = async (req, res) => {
    try {
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

        if (plan && typeof plan !== 'undefined') {
            res.status(200).json({
                status: 'success',
                message: 'Stats',
                data: {
                    plan
                }
            })
        } else {
            res.status(500).json({
                status: 'failed',
                message: 'The monthly was not found'
            })
        }
    } catch (error) {
        res.status(404).json({
            status: 'failed',
            message: 'The monthly was not found'
        })
    }
};

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