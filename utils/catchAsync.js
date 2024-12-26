module.exports = catchAsync = (fn) => {
  return (req, res, next) => {
    // NOTE: new AppError() is not called here ->
    fn(req, res, next).catch((err) => next(err));
  };
};
