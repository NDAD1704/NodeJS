const request = require('supertest');
const app = require('../app.js');
describe('POST /login', () => {
    test('should return 400 Bad Request if no credentials provided', async () => {
      const response = await request(app).post('/login');
      expect(response.statusCode).toBe(400);
    });
  });
  describe('POST /login', () => {
    test('should return 401 Unauthorized if invalid credentials provided', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'invalid-email',
          password: 'invalid-password',
        });
      expect(response.statusCode).toBe(401);
    });
  });
  describe('POST /login', () => {
    test('should return a valid access token if valid credentials provided', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'valid-email',
          password: 'valid-password',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });
  });
  const jwt = require('jsonwebtoken');

  describe('POST /login', () => {
    test('should return a valid access token with correct user info', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'valid-email',
          password: 'valid-password',
        });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      const decoded = jwt.verify(response.body.accessToken, process.env.JWT_SECRET);
      expect(decoded.email).toBe('valid-email');
    });
  });
        