const express = require('express');
const { comparisonService } = require('../services/comparisonService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { designPath, screenshotPath, sensitivity } = req.body;
    
    if (!designPath || !screenshotPath) {
      return res.status(400).json({ success: false, error: 'Design path and screenshot path are required' });
    }
    
    const result = await comparisonService.compareImages(designPath, screenshotPath, sensitivity || 50);
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Error comparing images:', error);
    res.status(500).json({ success: false, error: 'Failed to compare images' });
  }
});

module.exports = router;