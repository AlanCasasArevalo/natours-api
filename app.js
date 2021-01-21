const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xssClean = require('xss-clean')
const helmet = require('helmet')
const path = require('path');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));
app.use(express.json({ limit: '10kb'}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XXS
app.use(xssClean())

app.use(express.static(`${__dirname}/public`));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Este limitador te obliga a no pasarte de las 100 peticiones en una hora. De hacer mas peticiones de 100 te obliga a esperar 1 hora a volver a realizar peticiones
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!!!'
})

app.use('/api', limiter)

// Set Security http headers
app.use(helmet())

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