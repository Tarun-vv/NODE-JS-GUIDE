const mongoose = require('mongoose');

// NOTE: CREATING MONGOOSE / MONGODB MODELS

// NOTE: #1 create a schema
const tourSchema = new mongoose.Schema({
  // NOTE: add what type of data has to be the string
  name: {
    // NOTE: for more complex options add the curly braces
    type: String,
    // NOTE: required property validation
    required: [true, 'A tour must have a name'], // NOTE: second value is what error must be displayed
    unique: true, // NOTE: if property has to be unique
    trim: true, // NOTE: for string types -> cuts off the starting and ending blank spaces
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  rating: {
    type: Number,
    // NOTE: setting default values
    default: 4.5,
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour  must have cover images'],
  },
  // NOTE: to store a list of items in an array
  images: [String],
  createdAt: {
    // NOTE: Date modelling
    type: Date,
    default: Date.now(),
    // NOTE: will not be displayed in the response
    select: false,
  },
  startDates: [Date],
});

// NOTE: #2 creating a Modal out of the Schema

// NOTE: model property: 1st arg is name of model, 2nd arg is the schema we created
const Tour = mongoose.model('Tour', tourSchema);

// NOTE: test tour creation
// const testTour = new Tour({
//   name: 'the test',
//   rating: 4.7,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => console.log(doc))
//   .catch((err) => console.log(err));

module.exports = Tour;
