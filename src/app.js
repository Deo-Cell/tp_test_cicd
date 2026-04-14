const express = require('express');
const { calculateOrderTotal, applyPromoCode, globalPromoCodes } = require('./pricing');

const app = express();
app.use(express.json());

// In-memory store for orders
let orders = [];
let nextId = 1;

// Route: POST /orders/simulate
app.post('/orders/simulate', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;
    
    // Basic validation of required fields
    if (!items || distance === undefined || weight === undefined || hour === undefined || !dayOfWeek) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route: POST /orders
app.post('/orders', (req, res) => {
  try {
    const { items, distance, weight, promoCode, hour, dayOfWeek } = req.body;

    if (!items || distance === undefined || weight === undefined || hour === undefined || !dayOfWeek) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const priceDetail = calculateOrderTotal(items, distance, weight, promoCode, hour, dayOfWeek);
    
    const newOrder = {
      id: nextId++,
      ...priceDetail,
      items,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route: GET /orders/:id
app.get('/orders/:id', (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Route: POST /promo/validate
app.post('/promo/validate', (req, res) => {
  try {
    const { promoCode, subtotal } = req.body;

    if (!promoCode) {
      return res.status(400).json({ error: 'Promo code is required' });
    }
    if (subtotal === undefined) {
      return res.status(400).json({ error: 'Subtotal is required' });
    }

    const discountedTotal = applyPromoCode(subtotal, promoCode, globalPromoCodes);
    const discount = subtotal - discountedTotal;

    res.json({
      valid: true,
      subtotal,
      discount: Math.round(discount * 100) / 100,
      total: Math.round(discountedTotal * 100) / 100
    });
  } catch (error) {
    // Determine the status code based on error message if possible, or default to 400
    const message = error.message;
    let status = 400;
    if (message === 'Invalid promo code') status = 404;
    
    res.status(status).json({ valid: false, error: message });
  }
});

// Helper for tests to reset state
app.resetState = () => {
  orders = [];
  nextId = 1;
};

module.exports = app;
