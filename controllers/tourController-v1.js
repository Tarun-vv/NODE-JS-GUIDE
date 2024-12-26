// NOTE: MODEL
const Tour = require('./../models/tourModel');

const APIFeatures = require('./../utils/apiFeatures');

// NOTE: E) ALAISING -> routes
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'COuld not get all tours',
    });
  }
};

exports.createTour = catchAsync(async (req, res) => {
  console.log('Request', req.body);
  try {
    // NOTE: creating new tours
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});

exports.getTour = async (req, res) => {
  try {
    // NOTE: get specific tour
    const tour = await Tour.findById(req.params.id);

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    // NOTE: update a tour
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      // NOTE: has to be set -> makes sure all the validators run again when we update a document
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Test deleted',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// NOTE: AGGREGATION PIPELINE: calculate some statistics about our models

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
