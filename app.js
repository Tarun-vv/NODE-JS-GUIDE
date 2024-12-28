const express = require('express');

// NOTE: MAIN APP CREATION
const app = express();
app.use(express.json({ limit: '10kb' }));

// NOTE: SECURITY
// NOTE: #1) rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests fromt this IP, please try again!',
});
app.use('/api', limiter);

// NOTE: #2) HTTP HEADERS
const helmet = require('helmet');
app.use(helmet());

// NOTE: #3) DATA SANITIZATION
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

const xss = require('xss-clean');
app.use(xss());

// NOTE: #4) PARAMETER POLLUTION
const hpp = require('hpp');
app.use(
  hpp({
    // NOTE: allow some parameters to be duplicate
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// NOTE: SIMPLE MIDDLEWARE FUNC
app.use((req, res, next) => {
  console.log(req.headers);
  next();
});

// NOTE: ERROR HANDLING
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

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
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');

// NOTE: FINAL VERSION OF ROUTE:

// NOTE: #1 create routers for each modal eg: tourROuter, userRouter etc
// const tourRouter = express.Router();

// NOTE: #2 call the middleware with the route and the router
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// app.route('/api/v1/tours').get(getAllTours);
// NOTE: #3 replace the app with tourRouter
// tourRouter.route('/api/v1/tours').get(getAllTours);
// tourRouter.route('/').get(getAllTours).post(createTour); // NOTE: replace the complete route to just '/'

// tourRouter.route('/:id').get(getTour).patch(updateTour);
// -----------------------------------------

// NOTE: ERROR HANDLING

// NOTE: UNHANDLED ROUTES -> make sure this is after all the route handler defenitions
app.all('*', (req, res, next) => {
  // NOTE: to create error create a new error in the next function and express will take it to the this global function and send the response
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// NOTE: GLOBAL ERROR HANDLING MIDDLEWARE FUNCTION
app.use(globalErrorHandler);

module.exports = app;
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// });

// test comment: "checking not useful for the guide"
