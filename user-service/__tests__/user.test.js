const request = require('supertest');
const express = require('express');
const app = express();

app.use(express.json());

// Copy-paste the same routes used in app.js
const users = [];

app.post('/users/register', (req, res) => {
  const { username, email } = req.body;
  const user = { id: users.length + 1, username, email };
  users.push(user);
  res.status(201).json(user);
});

describe('User Registration', () => {
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
  });
});
