const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const morgan = require('./config/morgan');

const { errorConverter, errorHandler } = require('./middlewares/error');
const config = require('./config/config');
const AppError = require('./utils/AppError');

const app = express();

if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}


// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to AppError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;