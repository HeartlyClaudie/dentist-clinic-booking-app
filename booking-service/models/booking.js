const mongoose = require('../mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  username: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
