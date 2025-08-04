const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const Booking = require('./models/booking');

const app = express();
app.use(express.json());

app.post('/bookings', async (req, res) => {
  const { userId, date, service } = req.body;

  if (!userId || !date || !service) {
    logger.warn("Booking failed: Missing required fields.");
    return res.status(400).json({ message: 'userId, service, and date are required' });
  }

  try {
    // Step 1: Validate user
    const userResponse = await axios.get(`http://user-service:3000/users/${userId}`);
    const user = userResponse.data;

    // Step 2: Validate service exists in product-service
    const productResponse = await axios.get(`http://product-service:3000/products`);
    const availableServices = productResponse.data;

    const matchedService = availableServices.find(
      (p) => p.name.toLowerCase() === service.toLowerCase()
    );

    if (!matchedService) {
      logger.warn(`Booking failed: Service "${service}" not found`);
      return res.status(400).json({ message: `Service "${service}" does not exist` });
    }

    // Step 3: Save booking
    const newBooking = new Booking({
      userId: user.id,
      username: user.username,
      service: matchedService.name,
      date
    });

    await newBooking.save();
    logger.info(`Booking created for ${user.username} on ${date} for ${matchedService.name}`);

    // Step 4: Notify user
    try {
      await axios.post(`http://notification-service:3004/notify`, {
        userId: user.id,
        message: `Hi ${user.username}, your booking for ${matchedService.name} on ${date} is confirmed.`
      });
      logger.info(`Notification sent to user ${user.username} (${user.id})`);
    } catch (notifyErr) {
      logger.warn(`Booking saved but notification failed: ${notifyErr.message}`);
    }

    res.status(201).json(newBooking);

  } catch (err) {
    logger.error(`Booking failed for userId ${userId}: ${err.message}`);
    res.status(400).json({ message: 'Invalid user ID, service, or service unavailable' });
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
