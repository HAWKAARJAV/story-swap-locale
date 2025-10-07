const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const logger = require('../utils/logger');

// POST /chat  (AI chat proxy stub)
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, context = {} } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_MESSAGE', message: 'message (string) is required' }
      });
    }

    // Placeholder AI logic – deterministic stub for now
    const lower = message.toLowerCase();
    let theme = 'general inspiration';
    if (/(mountain|hike|trek)/.test(lower)) theme = 'mountain adventure';
    else if (/(beach|sea|island)/.test(lower)) theme = 'coastal retreat';
    else if (/(history|temple|heritage|culture)/.test(lower)) theme = 'cultural exploration';
    else if (/(food|cuisine|eat)/.test(lower)) theme = 'culinary journey';

    const reply = `Let’s build a ${theme}. Tell me: preferred climate, trip length, and mood you want to feel when it ends.`;

    res.json({
      success: true,
      id: 'ax-' + Date.now(),
      content: reply,
      timestamp: new Date().toISOString(),
      meta: { theme, context }
    });
  } catch (error) {
    logger.error('AgentX chat route error', { error: error.message });
    res.status(500).json({
      success: false,
      error: { code: 'AGENTX_CHAT_FAILED', message: 'Failed to process chat request' }
    });
  }
});

module.exports = router;
