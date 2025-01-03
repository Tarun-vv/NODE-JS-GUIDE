const express = require('express');
const tourController = require('./../controllers/tourController');

// NOTE: FOR NESTED ROUTE FUNCTIONALITY
const reviewController = require('./../controllers/reviewController');

// NOTE: FOR PROTECT ROUTE:
const authController = require('./../controllers/authController');

// NOTE: rename tourRouter to router and export it , rename it as tourRouter in the app.js file

const router = express.Router();

// NOTE: param middleware take in the value for which this middleware will run and the callback function
router.param('id', (req, res, next, value) => {
  console.log(`Tour id: ${value}`);
  next();
});

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

// NOTE: AGGREGATION PIPELINE ROUTES
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  // NOTE: use protect when u come to JWT section
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour); // NOTE: replace the complete route to just '/'

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// NOTE: NESTED ROUTE FUNCTIONALITY
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = router;
