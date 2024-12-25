// NOTE: #1 include express
const express = require('express');
// NOTE: #2 creating app using the express() function
const app = express();
app.use(express.json()); // NOTE: #6.1 middleware to send data in post request

// NOTE: cutom middleware - always be at the top so that they get applied to every single route
app.use((req, res, next) => {
  console.log('Hello from the middleware 💪');
  // NOTE: always call next function in the end
  next();
});
// NOTE: 3rd party middleware
const morgan = require('morgan');
app.use(morgan('dev'));

// NOTE: #5 reading data from a file
const fs = require('fs');
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);

// NOTE: #4 defining routes

// NOTE: #4.1.1 event handler defenitions
const getAllTours = (req, res) => {
  // NOTE: #4.3 to send a status -> use the .status() method and the code inside the bracket
  // NOTE: #4.4 to send a response back to the client when someone hits the route use the .send() method
  // res.status(200).send('Hello from the server');
  // NOTE: #4.5 add the data OR to send the data use the .json method(), MAKE SURE TO USE THE JSEND format like this which has three options: 'success', 'error' or 'fail'
  res.status(200).json({
    status: 'success',
    resutlts: tours.length, // NOTE: used for the number of total responses from the get or any other requests
    data: {
      // NOTE: contains main data
      message: 'Data was received',
      tours, // NOTE: the data sent has to be a JavaScript object NOT IN JSON format
    },
  });
};

// NOTE: #4.1 can use different HTTP verbs such as get, post, put, delete to define the request type and define a ROUTE and a callback function
// NOTE: #4.2 callback function has two arguments request and response
// app.get('/api/v1/tours', getAllTours);

// NOTE: FINAL VERSION OF ROUTE:
app.route('/api/v1/tours').get(getAllTours); // NOTE: can stack multiple event handler

// NOTE: #6 test post request
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);
  res.status(201).send('Done'); // NOTE: 201 for created
});

// NOTE: response to URL params
app.get('/api/v1/tours/:id', (req, res) => {
  // NOTE: multiple routes: '.get('/api/v1/tours/:id/:x...)'
  // NOTE: for optional routes: '.get('/api/v1/tours/:id/:x?...)'
  // NOTE: use regular js methods to get the tour and send it as a response

  // NOTE: params are present in req.params, the id is a string so we need to convert it into a number
  const id = req.params.id * 1;

  // NOTE: sending error if the id does not exist
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
});

// NOTE: need to update only a specific tour
app.patch('/api/v1/tours/:id', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Data was changed',
  });
});

// NOTE: #3 server setup

// NOTE: #3.1 listening to the server and a simple callback function to let us devs know it is running
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
