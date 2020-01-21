const express = require('express');
const router = express.Router();

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route was not done yet'
    })
};
const createNewUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route was not done yet'
    })
};
const getUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route was not done yet'
    })
};
const updateUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route was not done yet'
    })
};
const deleteUsers = (req, res) => {
    res.status(500).json({
        status: 'failed',
        message: 'This route was not done yet'
    })
};

router.route('/')
    .get(getAllUsers)
    .post(createNewUsers);

router.route('/:id')
    .get(getUsers)
    .patch(updateUsers)
    .delete(deleteUsers);

module.exports = router;