const request = require('supertest');
const app = require('../app');
const axios = require('axios');

// Mock axios using Jest
jest.mock('axios');

describe('Booking Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  test('should create a booking if user exists', async () => {
    const fakeUser = { id: 1, username: 'mockuser', email: 'mock@example.com' };

    axios.get.mockResolvedValueOnce({ data: fakeUser });

    const response = await request(app)
      .post('/bookings')
      .send({ userId: 1, service: 'Cleaning', date: '2025-08-31' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', 'mockuser');
    expect(response.body).toHaveProperty('service', 'Cleaning');
  });

  test('should return all bookings', async () => {
    const response = await request(app).get('/bookings');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
