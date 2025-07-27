// booking-service/app.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// In-memory bookings
const bookings = [];

app.post('/bookings', async (req, res) => {
  const { userId, date, service } = req.body;

  try {
    const response = await axios.get(`http://user-service:3000/users/${userId}`);
    const user = response.data;

    const booking = {
      id: bookings.length + 1,
      userId: user.id,
      username: user.username,
      service,
      date
    };
    bookings.push(booking);
    res.status(201).json(booking);

  } catch (err) {
    res.status(400).json({ message: 'Invalid user ID or user-service unavailable' });
  }
});

app.get('/bookings', (req, res) => {
  res.json(bookings);
});

module.exports = app;
