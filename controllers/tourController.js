const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    resutlts: tours.length,
    data: {
      message: 'Data was received',
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);
  res.status(201).send('Done'); // NOTE: 201 for created
};

exports.getTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.send(404).json({
      status: 'fail',
      message: 'Invaild ID',
    });
  }

  const tour = tours.find((tour) => tour.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Here is your data',
      tour,
    },
  });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Data was changed',
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
