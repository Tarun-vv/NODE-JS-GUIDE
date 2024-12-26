const User = require('./../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// NOTE: function to promisify the jwt.verify() process
const { promisify } = require('util');

// NOTE: JWT
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// NOTE: #1 CREATING A NEW USER
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // NOTE: implementing JWT
  // NOTE: #1 sign takes in a payload which is the only thing we want to store in the token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    // NOTE: #2 sending token to the user
    token,
    data: {
      user: newUser,
    },
  });
});

// NOTE: LOGGIN IN USER FUNCTIONALITY
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // NOTE: checkign if the email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // NOTE: check if user exists
  const user = await User.findOne({ email }).select('+password');

  // NOTE: checking if the password is correct -> function in userModel.js

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // NOTE: send token
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

// NOTE: PROTECTING ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  // NOTE: get the token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  // NOTE:  check if it exists
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  // NOTE: validate the token

  // NOTE: #1 will be promisifying this function so get the promisify() from utils
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // NOTE: check if user trying to access the route exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists', 401),
    );
  }

  // NOTE: check if user change the password after the token is issued -> in userModel.js
  freshUser.changedPasswordAfter(decoded.iat);

  next();
});
