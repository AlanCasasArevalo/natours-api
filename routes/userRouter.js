const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router
    .post('/signup', authController.signUp);

router
    .post('/login', authController.login);

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createNewUsers);

router.route('/:id')
    .get(userController.getUsers)
    .patch(userController.updateUsers)
    .delete(userController.deleteUsers);

module.exports = router;