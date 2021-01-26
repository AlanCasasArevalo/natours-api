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

router
    .patch('/updateMyPassword',
        authController.protect,
        authController.updatePassword);

router
    .patch('/updateMe',
        authController.protect,
        userController.updateMe);
router
    .delete('/deleteMe',
        authController.protect,
        userController.deleteMe);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUsers);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUsers)
    .delete(userController.deleteUsers);

module.exports = router;