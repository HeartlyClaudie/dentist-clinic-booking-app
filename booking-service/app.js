const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory bookings
const bookings = [];

// Create a new booking (validates user ID with user-service)
app.post('/bookings', async (req, res) => {
  const { userId, date, service } = req.body;

  try {
    // Validate user ID via user-service (calls container or localhost)
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

// Optional: Get all bookings
app.get('/bookings', (req, res) => {
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`Booking service running on port ${PORT}`);
});
