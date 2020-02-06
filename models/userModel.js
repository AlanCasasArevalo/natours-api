const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
        minlength: [2, 'An password must have more or equal then 2 characters']
    },
    confirmPassword: {
        type: String,
        unique: false,
        trim: false,
        required: [true, 'An user should have a confirmPassword'],
        maxlength: [40, 'An confirmPassword must have less or equal then 40 characters'],
        minlength: [2, 'An confirmPassword must have more or equal then 2 characters']
    },
    photo: {
        type: String,
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;