const AppError = require('../utils/appError');

// NOTE: operational errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data, ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// NOTE: JWT ERROR HANDLER FUNCTION
const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, res) => {
  // NOTE: if error caused by user -> send to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // NOTE: if programming error dont send to user
  else {
    console.error(err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // NOTE: ERROR DURING PRODUCTION and DEVELOPMENT
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign({}, err);

    // NOTE: 3 operational errors created by mongoose
    // NOTE: invalid id
    if (err.name === 'CastError') error = handleCastErrorDB(error);

    // NOTE: duplicate fields
    if (err.code === 11000) error = handleDuplicateErrorDB(error);

    // NOTE: mongoose validdation error
    if (error._message === 'Validation failed')
      error = handleValidationErrorDB(error);

    // NOTE: JWT ERROR HANDLING
    // NOTE: #1 wrong token
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);

    // NOTE: #2 token expired
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrProd(error, res);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalErrorHandler;
