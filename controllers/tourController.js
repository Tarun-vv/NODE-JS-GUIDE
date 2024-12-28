// NOTE: MODEL
const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');

// NOTE: ERROR HANDLING
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// NOTE: E) ALAISING -> routes
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // NOTE: EXECUTING QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // NOTE:#5 we finally await that query
  const tours = await features.query;

  // NOTE: IF NO FILTERING, SORTING ETC..JUST DO THIS
  // NOTE: const tours = await Tourr.find()

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });

  next();
});

exports.createTour = catchAsync(async (req, res, next) => {
  console.log('Request', req.body);
  // NOTE: creating new tours
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
  next();
});

exports.getTour = catchAsync(async (req, res, next) => {
  // NOTE: get specific tour
  // NOTE: add populate function LATER when you do referencing
  const tour = await Tour.findById(req.params.id);
  // NOTE: the name of the field

  // NOTE: 404 ERROR
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour,
    },
  });

  next();
});

exports.updateTour = catchAsync(async (req, res, next) => {
  // NOTE: update a tour
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    // NOTE: has to be set -> makes sure all the validators run again when we update a document
    runValidators: true,
  });

  // NOTE: 404 ERROR
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: {
      updatedTour,
    },
  });

  next();
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  // NOTE: 404 ERROR
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'Test deleted',
  });

  next();
});

// NOTE: AGGREGATION PIPELINE: calculate some statistics about our models

exports.getTourStats = catchAsync(async (req, res, next) => {
  // NOTE: we pass in an array of stages
  const stats = await Tour.aggregate([
    {
      // NOTE: #1 match helps us to filter the specific docs that we want based on a condition
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // NOTE: group docs together based on accumalators -> such as calculating sum, average etc ...
      $group: {
        // NOTE: id is what our data will be seperated by -> for total set to null
        // _id: null,
        // NOTE: but for specific case set this
        _id: '$ratingsAverage',
        // NOTE: finding the total number of docs
        num: { $sum: 1 },
        // NOTE: finding total number of ratins using sum
        numRatings: { $sum: '$ratingsQuantity' },
        // NOTE: $avg helps us find the average and is followed by the name of the field in String
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        // NOTE: calculating min and maxes
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // NOTE: can sort the result based on some value
      $sort: { avgPrice: 1 },
    },
  ]);

  // NOTE: send out the stats as a response
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });

  next();
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year;

  // NOTE: just watch lecture 103
  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTour: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        // NOTE: 0 if you dont want to see it, 1 if you want to see it
        _id: 0,
      },
    },
    {
      // NOTE: sorts in ascending if 1 or descending if -1
      $sort: { numTour: -1 },
    },
    {
      // NOTE: help limit the number of outputs
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });

  next();
});
