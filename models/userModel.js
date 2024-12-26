const mongoose = require('mongoose');
const validator = require('validator');

// NOTE: creating schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    // NOTE: convert input into lowercase
    lowercase: true,
    validate: [validator.isEmail, 'Please input a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must have atleast 8 charecters'],
    // NOTE: should not be visible
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    // NOTE: MANAGE PASSWORD
    validate: {
      // NOTE: works only on SAVE / creation not on UPDATE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password confirm must match the above password',
    },
  },
  passwordChangedAt: Date,
});

// NOTE: SWITCHING OUT USER'S ORIGINAL PASSWORD WITH AN ENCRYPTED PASSWORD
const bcrypt = require('bcryptjs');

userSchema.pre('save', async function (next) {
  // NOTE: only run if the password was modified
  if (!this.isModified('password')) return next();

  // NOTE: HASHING the password using bcryptjs
  this.password = await bcrypt.hash(this.password, 12);
  // NOTE: deleting the passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// NOTE: LOGGIN IN: CHECKING IF USER INPUT PASSWORD IS EQUAL TO PASSWORD IN DB
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// NOTE: JWT password changed function
userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimeStamp);
  }

  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
