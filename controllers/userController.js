const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const handlerFactory = require('../controllers/handlerFactory')
const multer = require('multer')
const sharp = require('sharp')

// const multerStorage = multer.diskStorage({
//     destination: (req, file, callback)  => {
//         callback(null, 'public/img/users')
//     },
//     filename: (req, file, callback) => {
//         // user-userId-timestamp.jpeg
//         const extension = file.mimetype.split('/')[1]
//         callback(null, `user-${req.user.id}-${Date.now()}.${extension}`)
//     }
// })

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    } else {
        callback(new AppError('File passed is not an image, Please upload only images', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

const uploadUserPhoto = upload.single('photo')

// Resize image square
const resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`

    await sharp(req.file.buffer).resize(500, 500)
        .toFormat('jpeg', {})
        .jpeg({
            quality: 75
        }).toFile(`public/img/users/${req.file.filename}`)

    next()
})

const filterBodyRequest = (bodyToFilter, ...allowedFields) => {
    const bodyToReturn = {};
    Object.keys(bodyToFilter).forEach(element => {
        if (allowedFields.includes(element)) bodyToReturn[element] = bodyToFilter[element];
    });
    return bodyToReturn;
};

const getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}

const updateMe = catchAsync(async (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const id = req.user.id;
    if (password && typeof password !== 'undefined' ||
        confirmPassword && typeof confirmPassword !== 'undefined') {
        next(new AppError('This not for password update, please use /updateMyPassword', 400))
    } else {
        const filterBody = filterBodyRequest(req.body, 'name', 'email');

        if (req.file) filterBody.photo = req.file.filename

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
    next(new AppError('This route is not defined. Please use /signup instead', 404))
});

const getAllUsers = handlerFactory.getAll(User)

const getUserById = handlerFactory.getOneById(User)

// Do not update password with this endpoint
const updateUsers = handlerFactory.updateOne(User)

const deleteUsers = handlerFactory.deleteOne(User)

module.exports = {
    getAllUsers,
    createNewUsers,
    updateUsers,
    getUserById,
    deleteUsers,
    updateMe,
    uploadUserPhoto,
    resizeUserPhoto,
    deleteMe,
    getMe
};