const express = require('express');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 💪');

  next();
});

// NOTE: adding the ENVIRONMENT VARIABLE
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// NOTE: serving static file middleware -> the static() function takes in the directory from which we want to serve static files
app.use(express.static(`${__dirname}/public`)); // NOTE: file does not exist here in this example

// NOTE: event handlers

// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     resutlts: tours.length,
//     data: {
//       message: 'Data was received',
//       tours,
//     },
//   });
// };

// const createTour = (req, res) => {
//   // console.log(req.body);
//   res.status(201).send('Done'); // NOTE: 201 for created
// };

// const getTour = (req, res) => {
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     return res.send(404).json({
//       status: 'fail',
//       message: 'Invaild ID',
//     });
//   }

//   const tour = tours.find((tour) => tour.id === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       message: 'Here is your data',
//       tour,
//     },
//   });
// };

// const updateTour = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     message: 'Data was changed',
//   });
// };

// ------------------------------------
// NOTE: IMPORTING tourRouter from file
const tourRouter = require('./routers/tourRoutes');

// NOTE: FINAL VERSION OF ROUTE:

// NOTE: #1 create routers for each modal eg: tourROuter, userRouter etc
// const tourRouter = express.Router();

// NOTE: #2 call the middleware with the route and the router
app.use('/api/v1/tours', tourRouter);

// app.route('/api/v1/tours').get(getAllTours);
// NOTE: #3 replace the app with tourRouter
// tourRouter.route('/api/v1/tours').get(getAllTours);
// tourRouter.route('/').get(getAllTours).post(createTour); // NOTE: replace the complete route to just '/'

// tourRouter.route('/:id').get(getTour).patch(updateTour);
// -----------------------------------------

module.exports = app;
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// });
