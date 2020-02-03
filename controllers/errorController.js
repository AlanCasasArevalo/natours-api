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
    const statusErrorCode = error.statusCode || 500;
    const status = error.status || 'error';

    if (error.isOperational) {
        res.status(statusErrorCode).json({
            status: status,
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
        productionsError(error, res);
    }
};

module.exports = globalErrorHandler;