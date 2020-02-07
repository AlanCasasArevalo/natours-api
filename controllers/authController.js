const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create(req.body);

    if (newUser && typeof newUser !== 'undefined') {
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } else {
        return next(new AppError('No user could be created', 400))
    }
});






module.exports = {
    signUp,
};