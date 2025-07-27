const request = require('supertest');
const app = require('../app');

describe('Product Service', () => {
  test('should add a new product', async () => {
    const newProduct = {
      name: 'Toothbrush',
      description: 'Electric toothbrush with soft bristles',
      price: 29.99
    };

    const res = await request(app).post('/products').send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('name', 'Toothbrush');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('price', 29.99);
  });

  test('should return all products', async () => {
    const res = await request(app).get('/products');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // At least the product from above test
  });
});
