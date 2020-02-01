const express = require('express');
const morgan = require('morgan');
const path = require('path');

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
    res.status(404).json({
        status: 'fail',
        message: `We can not find ${req.originalUrl} on this server `
    })
});


module.exports = app;