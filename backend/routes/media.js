const express = require('express');
const router = express.Router();

router.get('/presign', (req, res) => {
  res.json({ message: 'Media upload - coming soon' });
});

module.exports = router;