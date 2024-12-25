// NOTE: ENVIRONMENT VARIABLES
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

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
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

console.log(process.env);
