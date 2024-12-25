// NOTE: MODEL
const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
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

exports.createTour = async (req, res) => {
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
};

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
