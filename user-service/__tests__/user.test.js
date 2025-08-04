const request = require('supertest');
const app = require('../app'); // Import the real app
const sequelize = require('../sequelize'); // DB instance
const User = require('../models/user');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset DB
});

afterAll(async () => {
  await sequelize.close(); // Close connection
});

describe('User Service - Integration Tests', () => {

  it('should register a new user with password', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'secure123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).toHaveProperty('email', 'test@example.com');
    expect(res.body).not.toHaveProperty('password'); // Password should not be exposed
  });

  it('should login an existing user with correct password', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'secure123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Login success');
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpass'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should fetch user by ID without exposing password', async () => {
    const res = await request(app).get('/users/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username', 'testuser');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should return 404 for non-existing user', async () => {
    const res = await request(app).get('/users/999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User not found');
  });
});
