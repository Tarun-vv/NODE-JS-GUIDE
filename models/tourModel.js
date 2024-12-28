const mongoose = require('mongoose');

const validator = require('validator');

// NOTE: IMPORT FOR EMBEDDING
const User = require('./../models/userModel');

// NOTE: CREATING MONGOOSE / MONGODB MODELS

// NOTE: #1 create a schema
const tourSchema = new mongoose.Schema(
  {
    // NOTE: add what type of data has to be the string
    name: {
      // NOTE: for more complex options add the curly braces
      type: String,
      // NOTE: required property validation
      required: [true, 'A tour must have a name'], // NOTE: second value is what error must be displayed
      unique: true, // NOTE: if property has to be unique
      trim: true, // NOTE: for string types -> cuts off the starting and ending blank spaces

      // NOTE: VALIDATORS: length for strings
      maxLength: [40, 'A tour name must have less or equal 40 charecters'],
      minLength: [10, 'A tour name must have more than 10 charecters'],
      // NOTE: custom validator USING VALIDATOR PACKAGE
      // validate: [validator.isAlpha, 'Tour name must only contain charecter'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],

      // NOTE: for only specific inputs
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium or difficult',
      },
    },
    rating: {
      type: Number,
      // NOTE: setting default values
      default: 4.5,
      // NOTE: juts max or min for numbers
      min: [1, 'Rating must be atleast 1'],
      max: [5, 'Rating must be below 5'],
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
    priceDiscount: {
      type: Number,
      // NOTE: custom validator
      validate: {
        validator: function (value) {
          // NOTE: will  only work on creating NEW documents does not run on UPDATES
          return value < this.price;
        },
        message: 'Discount price should be below regular price',
      },
    },
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
    secretTour: {
      type: Boolean,
    },
    startLocation: {
      // NOTE: for geospatial data we use geoJSON -> to let mongoDB know that this is a geospatial data we have to setup a couple of options
      type: {
        // NOTE: we need type schema options
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], // NOTE: expects an array of numbers with (longitude, latitude)
      address: String,
      description: String,
    },
    locations: [
      // NOTE: embedded documents -> specify an object in an array and each object will be one specific document
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // NOTE: REFERENCING DOCUMENTS
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // #fff NOTE: defining the virtual properties in output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// NOTE: model property: 1st arg is name of model, 2nd arg is the schema we created

// NOTE: VIRTUAL PROPERTIES: fields that we can define in our schma but it will not be saved in our MONGO database -> for fields that can be derived from one another
// NOTE: cannot use this to query becuase they r not persisted in the DB
tourSchema.virtual('durationWeeks').get(function () {
  //#fff NOTE: #1 return what you want
  return this.duration / 7;
});

// NOTE: DOCUMENT middleware
// NOTE: 'pre' means runs before save command and save command
const slugify = require('slugify');
// NOTE: runs before save  and create
tourSchema.pre('save', function (next) {
  // NOTE : 'this' refers to the currently processed doc, MAIN USE is to create a slug for each of the documents
  this.slug = slugify(this.name, { lower: true });

  // NOTE: must be done
  next();
});

// NOTE: 'post' runs after the doc is saved
tourSchema.post('save', function (doc, next) {
  // console.log(this);
  next();
});

// NOTE: QUERY MIDDLEWARE
// NOTE: find refers to current query
tourSchema.pre(/^find/, function (next) {
  console.log('working');
  this.find({ secretTour: { $ne: true } });
  next();
});

// NOTE: AGGREGATION middleware
tourSchema.pre('aggregate', function (next) {
  // NOTE: to ensure that the secret tour is not getting used in the pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// NOTE: REFERENCING DOCUMENTS POPULATE MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// NOTE: VIRTUAL POPULATE MIDDLEWARE FUNCTION to get reviews
tourSchema.virtual('review', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

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

// NOTE: all middlewarem ust happen before model initialization
// NOTE: #2 creating a Modal out of the Schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
