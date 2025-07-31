const request = require('supertest');
const app = require('../app'); // Import the real app
const sequelize = require('../sequelize'); // DB instance
const User = require('../models/user');

beforeAll(async () => {
  // Sync database before running tests (force: true drops and recreates)
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Close DB connection after all tests
  await sequelize.close();
});

describe('User Service - Integration Tests', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('test@example.com');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Login success');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should fetch user by ID', async () => {
    const res = await request(app).get('/users/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toBe('testuser');
  });

  it('should return 404 for non-existing user', async () => {
    const res = await request(app).get('/users/999');
    expect(res.statusCode).toEqual(404);
  });
});
