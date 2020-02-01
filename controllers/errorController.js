const globalErrorHandler = (error, req, res, next) => {
    const statusErrorCode = error.statusCode || 500;
    const status = error.status || 'error';
    res.status(statusErrorCode).json({
        status: status,
        message: error.message
    })
};

module.exports = globalErrorHandler;