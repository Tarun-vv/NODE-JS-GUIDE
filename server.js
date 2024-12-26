// NOTE: ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// NOTE: UNCAUGHT EXCEPTION - come later to here
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION');
  console.log(err.name, err.message);
  process.exit(1);
});

// NOTE: config mongodb
const mongoose = require('mongoose');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB successfully connected');
  });

const app = require('./app');

// NOTE: using variables
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// NOTE: UNHANDLED REJECTION ERROR / DATABASE CONNECTION ERROR
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
