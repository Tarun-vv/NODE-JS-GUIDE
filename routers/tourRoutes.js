const express = require('express');
const tourController = require('./../controllers/tourController');

// NOTE: rename tourRouter to router and export it , rename it as tourRouter in the app.js file

const router = express.Router();

// NOTE: param middleware take in the value for which this middleware will run and the callback function
router.param('id', (req, res, next, value) => {
  console.log(`Tour id: ${value}`);
  next();
});

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); // NOTE: replace the complete route to just '/'

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
