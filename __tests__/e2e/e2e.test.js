const axios = require('axios');

const userServiceURL = 'http://localhost:3001';
const bookingServiceURL = 'http://localhost:3002';
const notificationServiceURL = 'http://localhost:3004';

describe('End-to-End Flow Test', () => {
  let userId;

  test('Full Flow: Register → Book → Notify', async () => {
    // 1. Register User
    const userResponse = await axios.post(`${userServiceURL}/users/register`, {
      username: 'e2eUser',
      email: 'e2e@example.com',
      password: 'e2epass123' // ✅ required
    });
    expect(userResponse.status).toBe(201);
    userId = userResponse.data.id;

    // 2. Create Booking
    const bookingResponse = await axios.post(`${bookingServiceURL}/bookings`, {
      userId,
      service: 'Toothpaste',
      date: '2025-09-10'
    });
    expect(bookingResponse.status).toBe(201);
    expect(bookingResponse.data.userId).toBe(userId);

    // 3. Send Notification
    const notificationResponse = await axios.post(`${notificationServiceURL}/notify`, {
      userId,
      message: `Your appointment is booked!`
    });
    expect(notificationResponse.status).toBe(200);
    expect(notificationResponse.data.success).toBe(true);
  }, 10000); // timeout for async flow
});
