const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('../controllers/handlerFactory')

const filterBodyRequest = (bodyToFilter, ...allowedFields) => {
    const bodyToReturn = {};
    Object.keys(bodyToFilter).forEach(element => {
        if (allowedFields.includes(element)) bodyToReturn[element] = bodyToFilter[element];
    });
    return bodyToReturn;
};

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    if (!users || typeof users === 'undefined') {
        return next(new AppError('No tour was founded', 404))
    } else {
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        })
    }
});

const updateMe = catchAsync(async (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const id = req.body.id;
    if (password && typeof password !== 'undefined' ||
        confirmPassword && typeof confirmPassword !== 'undefined') {
        next(new AppError('This not for password update, please use /updateMyPassword', 400))
    } else {
        const filterBody = filterBodyRequest(req.body, 'name', 'email');
        const userToUpdate = await User.findByIdAndUpdate(id, filterBody, {
            new: true,
            runValidators: true
        });

        if (userToUpdate && typeof userToUpdate !== 'undefined') {
            res.status(202).json({
                status: 'success',
                data: {
                    userToUpdate
                }
            })
        } else {
            next(new AppError('We have a problem while we tried to save the user', 500));
        }
    }
});

const deleteMe = catchAsync(async (req, res, next) => {
    const userId = req.user.id
    const userToDelete = await User.findByIdAndUpdate(userId, {active: false})

    if (userToDelete && typeof userToDelete !== 'undefined') {
        res.status(204).json({
            status: 'success',
            data: null
        })
    } else {
        next(new AppError('We have a problem while we tried to save the user', 500));
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

const deleteUsers = handlerFactory.deleteOne(User)

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    getUsers,
    deleteUsers,
    updateMe,
    deleteMe
};