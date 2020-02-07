const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

const signUp = catchAsync(async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (name && typeof name !== 'undefined',
    email && typeof email !== 'undefined',
    password && typeof password !== 'undefined',
    confirmPassword && typeof confirmPassword !== 'undefined'
    ) {
        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });

        const token = jwt.sign({
            id: newUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        if (newUser && typeof newUser !== 'undefined' && token && typeof token !== 'undefined') {
            res.status(201).json({
                status: 'success',
                token,
                data: {
                    user: newUser
                }
            })
        } else {
            return next(new AppError('No user could be created', 400));
        }
    } else {
        return next(new AppError('No user could be created, some fields that you use are wrong', 400));
    }


});


module.exports = {
    signUp,
};