const express = require('express');
const morgan = require('morgan');
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours' ,tourRouter);
app.use('/api/v1/users' ,userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `We can not find ${req.originalUrl} on this server `
    // })
    // const error = new Error(`We can not find ${req.originalUrl} on this server `);
    // error.status = 'fail';
    // error.statusCode = 404;
    // next(error);
    //
    const error = new AppError(`We can not find ${req.originalUrl} on this server`, 404);
    next(error)
});

app.use(globalErrorHandler);

module.exports = app;