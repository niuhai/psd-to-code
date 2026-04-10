const express = require('express');
const { psdService } = require('../services/psdService');
const { codeGeneratorService } = require('../services/codeGeneratorService');
const { fileService } = require('../services/fileService');

const router = express.Router();

// 生成代码
router.post('/code', async (req, res) => {
  try {
    const { filePath, framework, layers, assetPath } = req.body;
    
    if (!filePath || !framework) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }
    
    // 获取文件绝对路径
    const absolutePath = fileService.getAbsolutePath(filePath);
    
    // 解析PSD文件
    const psdInfo = await psdService.parsePsd(absolutePath);
    
    // 生成代码
    const result = codeGeneratorService.generateCode(psdInfo, framework, layers, assetPath);
    
    if (result.success) {
      res.json({ success: true, ...result });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate code' });
  }
});

// 解析PSD文件
router.post('/parse', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Missing file path' });
    }
    
    // 获取文件绝对路径
    const absolutePath = fileService.getAbsolutePath(filePath);
    
    // 解析PSD文件
    const psdInfo = await psdService.parsePsd(absolutePath);
    
    res.json({ success: true, psdInfo });
  } catch (error) {
    console.error('Error parsing PSD:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to parse PSD' });
  }
});

// 获取图层列表
router.post('/layers', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!filePath) {
      return res.status(400).json({ success: false, error: 'Missing file path' });
    }
    
    // 获取文件绝对路径
    const absolutePath = fileService.getAbsolutePath(filePath);
    
    // 解析PSD文件
    const psdInfo = await psdService.parsePsd(absolutePath);
    
    res.json({ success: true, layers: psdInfo.layers });
  } catch (error) {
    console.error('Error getting layers:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to get layers' });
  }
});

module.exports = router;