const AppError = require('../utils/appError');

const handleErrorDB = errorDB => {
    const message = `Invalid ${errorDB.path}: ${errorDB.value}`;
    return new AppError(message, 400);
};

const developmentError = (error, res) => {
    const statusErrorCode = error.statusCode || 500;
    const status = error.status || 'error';

    res.status(statusErrorCode).json({
        status: status,
        message: error.message,
        error: error,
        stack: error.stack
    })
};
const productionsError = (error, res) => {
    if (error.isOperational) {
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        })
    } else {
        console.error('ERRORRRRRR 💥💥💥💥💥💥💥', error);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong!!!!!!'
        })
    }
};


const globalErrorHandler = (error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        developmentError(error, res);
    } else if (process.env.NODE_ENV === 'production') {
        let errorDes = {...error};
        if (errorDes.name === 'CastError') errorDes = handleErrorDB(errorDes);

        productionsError(errorDes, res);
    }
};

module.exports = globalErrorHandler;