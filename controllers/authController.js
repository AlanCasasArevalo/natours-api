const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util')

const signToken = id => {
    return jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const signUp = catchAsync(async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (name && typeof name !== 'undefined' &&
    email && typeof email !== 'undefined' &&
    password && typeof password !== 'undefined' &&
    confirmPassword && typeof confirmPassword !== 'undefined'
    ) {
        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword
        });

        const token = signToken(newUser._id);

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

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (email && typeof email !== 'undefined' && password && typeof password !== 'undefined') {
        const user = await User.findOne({
            email
        }).select('+password');

        const correct = await user.correctPassword(password, user.password);

        if (user && typeof user !== 'undefined' && correct && typeof correct !== 'undefined') {
            const token = signToken(user._id);
            res.status(200).json({
                status: 'success',
                token
            })
        } else {
            return next(new AppError('Email or password are wrong, please try again', 401));
        }
    } else {
        return next(new AppError('Please provide correct email and password', 400));
    }
});

const protect = catchAsync( async (req, res, next) => {
    let token;
    if (req.headers.authorization && typeof req.headers.authorization !== 'undefined' && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token && typeof token !== 'undefined') {
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const freshUser = await User.findById(decode.id);

        if (freshUser && typeof freshUser !== 'undefined') {
            if (freshUser.changedPasswordAfter(decode.iat)) {
                return next(new AppError('Please use your new password', 401));
            }
        } else {
            return next(new AppError('The user was not found in our data base', 401));
        }
    } else {
        return next(new AppError('You are not logged in, please Log in to get access to our great tours', 401));
    }

    next();
});


module.exports = {
    signUp,
    login,
    protect,
};