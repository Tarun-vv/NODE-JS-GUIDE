const User = require('./../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// NOTE: mailtrap functionality
const sendEmail = require('../utils/email');

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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

  next();
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

  next();
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
  console.log('DECODED ID', decoded.id);
  // NOTE: check if user trying to access the route exists
  const freshUser = await User.findById(decoded.id);
  console.log('FRESH USER', freshUser);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token no longer exists', 401),
    );
  }

  // NOTE: check if user change the password after the token is issued -> in userModel.js
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please try again!'),
    );
  }

  // NOTE: GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

// NOTE: USER ROLE AND PERMISSION
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 401),
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // NOTE: Get user based on POSTED email
  const user = await User.findOne({ email: req.body.email });

  // NOTE: verify if user exists
  if (!user) {
    return next(new AppError('There is no user with email address'));
  }

  // NOTE: generate random token -> method on user model
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // NOTE: send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH rrequst with you rnew passowrd and passwordConform to: ${resetURL}\nIf you didnt forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token valid for 10 minutes',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to mail',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validationBeforeSave: false });

    return next(
      new AppError('There was an error sending email. Try again later!'),
    );
  }
});

const crypto = require('crypto');
exports.resetPassword = catchAsync(async (req, res, next) => {
  // NOTE: get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // NOTE: if token has not expired
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  // NOTE:  there is user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // NOTE: update changePasswordAt property for current user

  // NOTE: log the user in send JWT token to user
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    // NOTE: #2 sending token to the user
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // NOTE: get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // NOTE: check if posted password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  // NOTE: if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // NOTE: log in user, send jwt
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    // NOTE: #2 sending token to the user
    token,
  });
});
