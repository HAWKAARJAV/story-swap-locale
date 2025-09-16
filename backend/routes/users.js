const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/:username', (req, res) => {
  res.json({ message: 'User profile - coming soon' });
});

module.exports = router;