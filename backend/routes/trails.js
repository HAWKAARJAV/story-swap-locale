const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Story trails - coming soon' });
});

module.exports = router;