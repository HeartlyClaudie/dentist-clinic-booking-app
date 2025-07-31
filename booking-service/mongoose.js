// mongoose.js
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookingdb';

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI).catch((err) => {
    console.error('MongoDB connection error:', err);
  });
}

module.exports = mongoose;
