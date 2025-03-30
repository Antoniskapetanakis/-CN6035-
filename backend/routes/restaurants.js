const express = require('express');
const router = express.Router();
const { promisePool } = require('../config/db');  
router.get('/', async (req, res) => {
  try {
    const [restaurants] = await promisePool.query('SELECT * FROM restaurants');

    const restaurantsWithPhotographs = restaurants.map(restaurant => ({
      ...restaurant,
      image: `/images/${restaurant.photographs}` 
    }));

    res.json(restaurantsWithPhotographs);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ message: 'Error fetching restaurants' });
  }
});

module.exports = router;
