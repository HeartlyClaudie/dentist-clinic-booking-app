const axios = require('axios');

const userServiceURL = 'http://localhost:3001';
const bookingServiceURL = 'http://localhost:3002';
const notificationServiceURL = 'http://localhost:3004';

describe('End-to-End Flow Test', () => {
  let userId;

  test('Full Flow: Register → Book → Notify', async () => {
    // 1. Register User (unique email to avoid conflict)
    const userResponse = await axios.post(`${userServiceURL}/users/register`, {
      username: `e2eUser_${Date.now()}`,  // unique username
      email: `e2e_${Date.now()}@example.com`, // unique email
      password: 'e2epass123'
    });
    expect(userResponse.status).toBe(201);
    userId = userResponse.data.id;

    // 2. Create Booking (ISO string includes time = unique)
    const bookingResponse = await axios.post(`${bookingServiceURL}/bookings`, {
      userId,
      service: 'Toothpaste',
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
  }, 10000);
});
