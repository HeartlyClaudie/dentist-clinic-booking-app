const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const Booking = require('./models/booking'); // Mongoose model

const app = express();
app.use(express.json());

app.post('/bookings', async (req, res) => {
  const { userId, date, service } = req.body;

  try {
    const response = await axios.get(`http://user-service:3000/users/${userId}`);
    const user = response.data;

    const newBooking = new Booking({
      userId: user.id,
      username: user.username,
      service,
      date
    });

    await newBooking.save();

    logger.info(`New booking created for user ${user.username} (${userId}) on ${date}`);
    res.status(201).json(newBooking);

  } catch (err) {
    logger.error(`Booking failed for userId ${userId}: ${err.message}`);
    res.status(400).json({ message: 'Invalid user ID or user-service unavailable' });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    logger.info(`Fetched all bookings. Count: ${bookings.length}`);
    res.json(bookings);
  } catch (err) {
    logger.error(`Failed to fetch bookings: ${err.message}`);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
});

module.exports = app;
