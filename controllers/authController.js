const User = require('../models/userModel');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')

const signToken = id => {
    return jwt.sign({
        id: id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

    res.cookie('jwt', token, cookieOptions)

    // remove password to the data base
    user.password = undefined

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user
        }
    })
};

const signUp = catchAsync(async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const role = req.body.role;

    if (name && typeof name !== 'undefined' &&
        email && typeof email !== 'undefined' &&
        password && typeof password !== 'undefined' &&
        confirmPassword && typeof confirmPassword !== 'undefined'
    ) {
        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            role: role
        });

        if (newUser && typeof newUser !== 'undefined') {
            createSendToken(newUser, 201, res);
        } else {
            return next(new AppError('No user could be created', 400));
        }
    } else {
        return next(new AppError('No user could be created, some fields that you use are wrong', 400));
    }
});

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if (email && typeof email !== 'undefined' && password && typeof password !== 'undefined') {
        const user = await User.findOne({
            email
        }).select('+password');

        const correct = await user.correctPassword(password, user.password);

        if (user && typeof user !== 'undefined' && correct && typeof correct !== 'undefined') {
            createSendToken(user, 200, res);
        } else {
            return next(new AppError('Email or password are wrong, please try again', 401));
        }
    } else {
        return next(new AppError('Please provide correct email and password', 400));
    }
});

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && typeof req.headers.authorization !== 'undefined' && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token && typeof token !== 'undefined') {
        const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decode.id);

        if (currentUser && typeof currentUser !== 'undefined') {
            if (currentUser.changedPasswordAfter(decode.iat)) {
                return next(new AppError('Please use your new password', 401));
            }
            req.user = currentUser;
        } else {
            return next(new AppError('The user was not found in our data base', 401));
        }
    } else {
        return next(new AppError('You are not logged in, please Log in to get access to our great tours', 401));
    }

    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles is an array
        const rolesUserContained = roles.includes(req.user.role);
        if (!rolesUserContained && typeof rolesUserContained !== 'undefined') {
            return new AppError('You do not have permission to use this functionality', 403)
        } else {
            next()
        }
    };
};

const forgotPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    if (email && typeof email !== 'undefined') {
        const user = await User.findOne({
            email
        });

        if (user && typeof user !== 'undefined') {

            const resetToken = user.createPasswordResetToken();

            const userUpdated = await user.save({validateBeforeSave: false});

            if (userUpdated && typeof userUpdated !== 'undefined') {
                const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
                const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

                try {
                    await sendEmail({
                        email,
                        subject: 'Your password reset token (valid for 10 min)',
                        message
                    });

                    res.status(200).json({
                        status: 'success',
                        message: 'Token sent to email!'
                    })
                } catch (error) {
                    userUpdated.passwordResetToken = undefined;
                    userUpdated.passwordResetExpired = undefined;
                    await user.save({validateBeforeSave: false});
                    return next(new AppError('There was an error sending the email. Please try again later!', 500));
                }
            } else {
                return next(new AppError('We have an error when we tried to updated your user', 500));
            }
        } else {
            return next(new AppError('The email was not found in our data base', 401));
        }
    } else {
        return next(new AppError('The email was not found in our data base', 401));
    }
});

const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const passwordResetToken = req.body.passwordResetToken;
    const passwordResetExpired = req.body.passwordResetExpired;

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpired: {
            $gt: Date.now()
        }
    });

    if (user && typeof user !== 'undefined') {
        user.password = password;
        user.confirmPassword = confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpired = undefined;

        const userSaved = await user.save();

        if (userSaved && typeof userSaved !== 'undefined') {
            createSendToken(userSaved, 200, res);
        } else {
            return next(new AppError('The user could not be saved please try later', 400));
        }
    } else {
        return next(new AppError('Token is invalid or has expired', 400));
    }

});

const updatePassword = catchAsync( async  (req, res, next) => {

    const id = req.user.id;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const passwordCurrent = req.body.passwordCurrent;
    // 1) get user from collection
    const user = await User.findById(id).select('+password');

    // 2) check if posted current password is correct
    const isCorrectPassword = await user.correctPassword(passwordCurrent, user.password);
    if (isCorrectPassword) {
        user.password = password;
        user.confirmPassword = confirmPassword;
        const userUpdated = await user.save();

        if (userUpdated && typeof userUpdated !== 'undefined') {
            createSendToken(userUpdated, 201, res);
        } else {
            return next(new AppError('We has a problem with this operation, please try it later', 500));
        }
    } else {
        return next(new AppError('Your password is wrong', 401));
    }
});

module.exports = {
    signUp,
    login,
    protect,
    forgotPassword,
    resetPassword,
    updatePassword,
    restrictTo,
};