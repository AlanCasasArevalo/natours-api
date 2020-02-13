const AppError = require('../utils/appError');

const handleErrorDB = errorDB => {
    const message = `Invalid ${errorDB.path}: ${errorDB.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = errorDB => {
    const errorValue = errorDB.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${errorValue}. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = errorDB => {
    const errors = Object.values(errorDB.errors).map(element => element.message);
    const message = `Invalid input data ${errors.join('.')}`;
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

const handlerJWTError = () => new AppError('The token is not valid, please Loggin again.', 401);
const handlerJWTExpiredError = () => new AppError('Your token was expired, please Loggin again.', 401);

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
        if (errorDes.code === 11000) errorDes = handleDuplicateFieldsDB(errorDes);
        if (errorDes.name === 'ValidationError') errorDes = handleValidationErrorDB(errorDes);

        if (errorDes.name === 'JsonWebTokenError') errorDes = handlerJWTError();
        if (errorDes.name === 'TokenExpiredError') errorDes = handlerJWTExpiredError();

        productionsError(errorDes, res);
    }
};

module.exports = globalErrorHandler;