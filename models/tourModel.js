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
  },
  rating: {
    type: Number,
    // NOTE: setting default values
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// NOTE: #2 creating a Modal out of the Schema

// NOTE: model property: 1st arg is name of model, 2nd arg is the schema we created
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
