const express = require('express');
const router = express.Router();

router.get('/queue', (req, res) => {
  res.json({ message: 'Moderation queue - coming soon' });
});

module.exports = router;