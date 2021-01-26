const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router
    .post('/signup', authController.signUp);

router
    .post('/login', authController.login);

router
    .post('/forgotPassword', authController.forgotPassword);

router
    .patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect)

router
    .patch('/updateMyPassword',
        authController.updatePassword
    );

router
    .get(
        '/me',
        userController.getMe,
        userController.getUserById
    )

router
     .patch('/updateMe',
        userController.updateMe
     )

router
    .delete('/deleteMe',
        userController.deleteMe
    )

router.use(authController.restrictTo('admin'))

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUsers);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUsers)
    .delete(userController.deleteUsers);

module.exports = router;