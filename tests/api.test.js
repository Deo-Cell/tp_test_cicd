const request = require('supertest');
const app = require('../src/app');

describe('API Integration Tests', () => {
  beforeEach(() => {
    app.resetState();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-05-15T12:00:00Z')); // Arbitrary date for tests
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('POST /orders/simulate', () => {
    const validData = {
      items: [{ name: 'Pizza', price: 12.5, quantity: 2 }],
      distance: 5,
      weight: 2,
      hour: 15,
      dayOfWeek: 'tuesday'
    };

    test('should return 200 and correct price details for a normal order', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send(validData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        subtotal: 25.00,
        discount: 0,
        deliveryFee: 3.00,
        surge: 1.0,
        total: 28.00
      });
    });

    test('should apply valid promo code correctly', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, promoCode: 'BIENVENUE20' });

      expect(response.status).toBe(200);
      expect(response.body.discount).toBe(5.00);
      expect(response.body.total).toBe(23.00);
    });

    test('should return 400 for expired promo code', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, promoCode: 'EXPIRED10' }); // Assuming this exists in globalPromoCodes or we mock it

      // Note: EXPIRED10 is in our pricing.js globalPromoCodes with 2024-01-01 expiry
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Promo code is expired');
    });

    test('should return 400 for empty cart', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, items: [] });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Cart is empty');
    });

    test('should return 400 for delivery outside zone (> 10km)', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, distance: 15 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Delivery outside of zone');
    });

    test('should return 400 during closed hours (23h)', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, hour: 23 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Restaurant is closed');
    });

    test('should apply surge pricing for Friday 20h', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ ...validData, hour: 20, dayOfWeek: 'friday' });

      expect(response.status).toBe(200);
      expect(response.body.surge).toBe(1.8);
      expect(response.body.deliveryFee).toBe(5.40); // 3.00 * 1.8
    });

    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/orders/simulate')
        .send({ items: [] }); // Missing distance, weight, etc.

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('POST /orders', () => {
    const validOrder = {
      items: [{ name: 'Burger', price: 10, quantity: 2 }],
      distance: 2,
      weight: 1,
      hour: 10,
      dayOfWeek: 'monday'
    };

    test('should create a new order and return 201 with an ID', async () => {
      const response = await request(app)
        .post('/orders')
        .send(validOrder);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.total).toBe(22.00); // 20 subtotal + 2 delivery
    });

    test('should store and allow retrieving the order via GET', async () => {
      const postRes = await request(app).post('/orders').send(validOrder);
      const orderId = postRes.body.id;

      const getRes = await request(app).get(`/orders/${orderId}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body.id).toBe(orderId);
    });

    test('should increment IDs for consecutive orders', async () => {
      const res1 = await request(app).post('/orders').send(validOrder);
      const res2 = await request(app).post('/orders').send(validOrder);

      expect(res1.body.id).toBe(1);
      expect(res2.body.id).toBe(2);
    });

    test('should return 400 and NOT store invalid order', async () => {
      const invalidOrder = { items: [] }; // Missing fields
      const response = await request(app).post('/orders').send(invalidOrder);

      expect(response.status).toBe(400);
      
      // Verify no order was stored
      const getRes = await request(app).get('/orders/1');
      expect(getRes.status).toBe(404);
    });

    test('should return 400 for business logic errors (e.g. closed hours)', async () => {
      const response = await request(app)
        .post('/orders')
        .send({ ...validOrder, hour: 4 }); // 4 AM is closed

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Restaurant is closed');
    });
  });

  describe('GET /orders/:id', () => {
    test('should return 200 and complete order if it exists', async () => {
      const postRes = await request(app).post('/orders').send({
        items: [{ name: 'Salad', price: 8, quantity: 1 }],
        distance: 1,
        weight: 0.5,
        hour: 10,
        dayOfWeek: 'wednesday'
      });
      
      const response = await request(app).get(`/orders/${postRes.body.id}`);
      expect(response.status).toBe(200);
      expect(response.body.total).toBe(10.00); // 8 + 2
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('createdAt');
    });

    test('should return 404 for non-existing ID', async () => {
      const response = await request(app).get('/orders/999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Order not found');
    });

    test('should return 404 for invalid ID format', async () => {
      const response = await request(app).get('/orders/abc');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /promo/validate', () => {
    test('should return 200 and discount details for valid code', async () => {
      const response = await request(app)
        .post('/promo/validate')
        .send({ promoCode: 'MINUS5', subtotal: 30 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        valid: true,
        subtotal: 30,
        discount: 5,
        total: 25
      });
    });

    test('should return 400 for expired code', async () => {
      const response = await request(app)
        .post('/promo/validate')
        .send({ promoCode: 'EXPIRED10', subtotal: 50 });

      expect(response.status).toBe(400);
      expect(response.body.valid).toBe(false);
      expect(response.body.error).toBe('Promo code is expired');
    });

    test('should return 400 if subtotal is below minimum order', async () => {
      const response = await request(app)
        .post('/promo/validate')
        .send({ promoCode: 'MINUS5', subtotal: 10 }); // MINUS5 minOrder is 20.00

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Minimum order amount not reached');
    });

    test('should return 404 for unknown code', async () => {
      const response = await request(app)
        .post('/promo/validate')
        .send({ promoCode: 'GHOST', subtotal: 50 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Invalid promo code');
    });

    test('should return 400 if promoCode or subtotal is missing', async () => {
      const res1 = await request(app).post('/promo/validate').send({ subtotal: 50 });
      const res2 = await request(app).post('/promo/validate').send({ promoCode: 'MINUS5' });

      expect(res1.status).toBe(400);
      expect(res2.status).toBe(400);
    });
  });
});
