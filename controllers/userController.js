const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    if (!users || typeof users === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else  {
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        })
    }
});
const createNewUsers = catchAsync(async (req, res, next) => {
    next(new AppError('This route is not defined yet', 404))
});
const getUsers = catchAsync(async (req, res, next) => {
    next(new AppError('This route is not defined yet', 404))
});
const updateUsers = catchAsync(async (req, res, next) => {
    next(new AppError('This route is not defined yet', 404))
});
const deleteUsers = catchAsync(async (req, res, next) => {
    next(new AppError('This route is not defined yet', 404))
});

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    getUsers,
    deleteUsers
};