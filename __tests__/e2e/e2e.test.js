const axios = require('axios');

const userServiceURL = 'http://localhost:3001';
const bookingServiceURL = 'http://localhost:3002';
const notificationServiceURL = 'http://localhost:3004';

describe('End-to-End Flow Test', () => {
  let userId;

  test('Full Flow: Register → Book → Notify', async () => {
    try {
      // 1. Register User
      const userResponse = await axios.post(`${userServiceURL}/users/register`, {
        username: `e2eUser_${Date.now()}`,
        email: `e2e_${Date.now()}@example.com`,
        password: 'e2epass123'
      });
      expect(userResponse.status).toBe(201);
      userId = userResponse.data.id;

      // 2. Create Booking
      const bookingResponse = await axios.post(`${bookingServiceURL}/bookings`, {
        userId,
        service: 'toothpaste',
        date: new Date().toISOString()
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

    } catch (err) {
      console.error('🔥 E2E Error Details:', err.response?.data || err.message);
      throw err;
    }
  }, 10000);
});
