process.env.NODE_ENV = 'test';


const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const mongoose = require('../mongoose'); // Import the MongoDB connection
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
const Booking = require('../models/booking'); // Import the Booking model

jest.mock('axios');

describe('Booking Service (MongoDB)', () => {
  // Connect to DB before tests run
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await mongoose.connection.db.dropDatabase(); // clear after each test
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
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
    // Insert a fake booking
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
