const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: false,
        trim: true,
        required: [true, 'An user should have a name'],
        maxlength: [40, 'A tour name must have less or equal then 40 characters'],
        minlength: [2, 'A tour name must have more or equal then 2 characters'],
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'An user should have a email'],
        maxlength: [40, 'An email must have less or equal then 40 characters'],
        minlength: [2, 'An email must have more or equal then 2 characters'],
        validate: [validator.isEmail, 'An email must be a validate email']
    },
    password: {
        type: String,
        unique: false,
        trim: false,
        required: [true, 'An user should have a password'],
        maxlength: [40, 'An password must have less or equal then 40 characters'],
        minlength: [2, 'An password must have more or equal then 2 characters'],
        select: false
    },
    confirmPassword: {
        type: String,
        unique: false,
        trim: false,
        required: [true, 'An user should have a confirmPassword'],
        maxlength: [40, 'An confirmPassword must have less or equal then 40 characters'],
        minlength: [2, 'An confirmPassword must have more or equal then 2 characters'],
        validate: {
            // This only works with CREATE AND SAVED
            validator: function (element) {
                return element === this.password;
            },
            message: 'Password and confirmPassword are not the same'
        }
    },
    photo: {
        type: String,
    },
    role: {
        type: String,
        enum: [
            'user', 'guide', 'lead-guide', 'admin'
        ],
        default: 'user'
    },
    passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next;
    } else {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    }
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {

    if (this.passwordChangedAt && typeof this.passwordChangedAt !== 'undefined'){
        const changedJWTTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log('',  changedJWTTimeStamp);
        return JWTTimeStamp < changedJWTTimeStamp;
    }

    return false
};

const User = mongoose.model('User', userSchema);
module.exports = User;