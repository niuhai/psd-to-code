const express = require('express');
const { slicingService } = require('../services/slicingService');
const { fileService } = require('../services/fileService');

const router = express.Router();

// 生成切图
router.post('/generate', async (req, res) => {
  try {
    const { filePath, options } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Missing file path' });
    }
    
    // 获取文件绝对路径
    const absolutePath = fileService.getAbsolutePath(filePath);
    
    // 生成切图
    const result = await slicingService.generateSlices(absolutePath, options || {});
    
    if (result.success) {
      res.json({ success: true, ...result });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error generating slices:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate slices' });
  }
});

// 批量生成切图
router.post('/batch', async (req, res) => {
  try {
    const { filePaths, options } = req.body;
    
    if (!filePaths || !Array.isArray(filePaths)) {
      return res.status(400).json({ success: false, error: 'Missing or invalid file paths' });
    }
    
    // 获取文件绝对路径
    const absolutePaths = filePaths.map(filePath => fileService.getAbsolutePath(filePath));
    
    // 批量生成切图
    const result = await slicingService.batchGenerateSlices(absolutePaths, options || {});
    
    if (result.success) {
      res.json({ success: true, ...result });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error in batch slice generation:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate slices' });
  }
});

// 清理切片文件
router.post('/cleanup', async (req, res) => {
  try {
    const result = slicingService.cleanupSlices();
    
    if (result.success) {
      res.json({ success: true, message: 'Slices cleaned up successfully' });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error cleaning up slices:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to clean up slices' });
  }
});

// 获取切片信息
router.get('/info', async (req, res) => {
  try {
    const { slicePath } = req.query;
    
    if (!slicePath) {
      return res.status(400).json({ success: false, error: 'Missing slice path' });
    }
    
    const result = slicingService.getSliceInfo(slicePath);
    
    if (result.success) {
      res.json({ success: true, ...result });
    } else {
      res.status(404).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error getting slice info:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to get slice info' });
  }
});

module.exports = router;