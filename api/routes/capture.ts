const express = require('express');
const { screenshotService } = require('../services/screenshotService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url, deviceType, screenSize } = req.body;
    
    if (!url) {
      return res.status(400).json({ success: false, error: 'URL is required' });
    }
    
    const screenshotPath = await screenshotService.captureScreenshot(url, deviceType, screenSize);
    
    res.json({ success: true, screenshotPath });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    res.status(500).json({ success: false, error: 'Failed to capture screenshot' });
  }
});

module.exports = router;