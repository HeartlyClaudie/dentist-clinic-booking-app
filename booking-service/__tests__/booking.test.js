process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const mongoose = require('../mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Booking = require('../models/booking');

let mongoServer;

jest.mock('axios');

describe('Booking Service (MongoDB)', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  test('should create a booking if user and service are valid', async () => {
    const fakeUser = { id: 1, username: 'mockuser', email: 'mock@example.com' };
    const fakeProducts = [
      { name: 'Cleaning', price: 100 },
      { name: 'Filling', price: 150 }
    ];
    const fakeNotifResponse = { data: { success: true, message: 'Notification sent to user 1' } };

    // Mock user-service, product-service, and notification-service
    axios.get
      .mockResolvedValueOnce({ data: fakeUser })       // user-service
      .mockResolvedValueOnce({ data: fakeProducts });  // product-service

    axios.post.mockResolvedValueOnce(fakeNotifResponse); // notification-service

    const response = await request(app)
      .post('/bookings')
      .send({ userId: 1, service: 'Cleaning', date: '2025-08-31' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', 'mockuser');
    expect(response.body).toHaveProperty('service', 'Cleaning');

    // Confirm the notification-service was called correctly
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('notification-service'),
      expect.objectContaining({
        userId: 1,
        message: expect.stringContaining('mockuser')
      })
    );
  });

  test('should reject booking if service does not exist', async () => {
    const fakeUser = { id: 1, username: 'mockuser', email: 'mock@example.com' };
    const fakeProducts = [
      { name: 'Cleaning', price: 100 },
      { name: 'Filling', price: 150 }
    ];

    axios.get
      .mockResolvedValueOnce({ data: fakeUser })       // user-service
      .mockResolvedValueOnce({ data: fakeProducts });  // product-service

    const response = await request(app)
      .post('/bookings')
      .send({ userId: 1, service: 'NonExistentService', date: '2025-08-31' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toMatch(/does not exist/i);

    // Notification service should not be called
    expect(axios.post).not.toHaveBeenCalled();
  });

  test('should return all bookings', async () => {
    await Booking.create({
      userId: 1,
      username: 'testuser',
      service: 'Test Service',
      date: '2025-08-31'
    });

    const response = await request(app).get('/bookings');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('username', 'testuser');
  });
});
