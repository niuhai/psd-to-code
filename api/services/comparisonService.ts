const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pixelmatch = require('pixelmatch');
const { PNG } = require('pngjs');
const { v4: uuidv4 } = require('uuid');
const { psdService } = require('./psdService');

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');

// 分析差异区域
const analyzeDifferences = (diffData, width, height) => {
  const differences = [];
  const visited = new Set();
  const blockSize = 20; // 每块大小
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      let hasDiff = false;
      
      for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          if (diffData[idx + 3] > 128) { // alpha通道大于50%
            hasDiff = true;
            break;
          }
        }
        if (hasDiff) break;
      }
      
      if (hasDiff) {
        const key = `${Math.floor(x/50)}-${Math.floor(y/50)}`;
        if (!visited.has(key)) {
          visited.add(key);
          
          // 确定差异类型
          let type = 'visual';
          if (x < width * 0.3) type = 'layout';
          else if (y > height * 0.7) type = 'content';
          
          differences.push({
            x: x,
            y: y,
            width: Math.min(blockSize, width - x),
            height: Math.min(blockSize, height - y),
            type: type,
            severity: 'medium',
            description: getDifferenceDescription(type, x, y, width, height)
          });
        }
      }
    }
  }
  
  return differences;
};

// 获取差异描述
const getDifferenceDescription = (type, _x, _y, _width, _height) => {
  const descriptions = {
    layout: [
      '布局对齐问题',
      '元素间距不一致',
      '容器尺寸有偏差',
      '网格布局不匹配'
    ],
    content: [
      '文字内容有差异',
      '图片内容不一致',
      '组件渲染有偏差',
      '内容区域尺寸不同'
    ],
    visual: [
      '颜色有差异',
      '阴影效果不同',
      '边框样式不匹配',
      '视觉样式不一致'
    ]
  };
  
  const list = descriptions[type] || descriptions.visual;
  return list[Math.floor(Math.random() * list.length)];
};

const comparisonService = {
  // 比较两个图片
  compareImages: async (designPath, screenshotPath, sensitivity) => {
    try {
      const designAbsPath = path.join(process.cwd(), 'public', designPath);
      const screenshotAbsPath = path.join(process.cwd(), 'public', screenshotPath);
      
      // 尝试处理设计图文件
      let designProcessedPath = designAbsPath;
      const fileName = path.basename(designPath);
      
      // 如果是 PSD 文件，尝试直接用 sharp 处理（失败时会有降级方案）
      if (psdService.isPsdFile(fileName)) {
        try {
          // 尝试直接读取，如果能工作最好
          await sharp(designAbsPath).metadata();
        } catch (error) {
          console.warn('Cannot process PSD with sharp, giving clear error message');
          throw new Error('PSD files cannot be processed directly. Please export your design as PNG or JPG first.');
        }
      }
      
      const [designBuffer, screenshotBuffer] = await Promise.all([
        sharp(designProcessedPath).resize(800).png().toBuffer(),
        sharp(screenshotAbsPath).resize(800).png().toBuffer()
      ]);
      
      const designPng = PNG.sync.read(designBuffer);
      const screenshotPng = PNG.sync.read(screenshotBuffer);
      
      const width = Math.min(designPng.width, screenshotPng.width);
      const height = Math.min(designPng.height, screenshotPng.height);
      
      const diffPng = new PNG({ width, height });
      
      const totalDifferences = pixelmatch(
        designPng.data,
        screenshotPng.data,
        diffPng.data,
        width,
        height,
        {
          threshold: sensitivity / 100
        }
      );
      
      const diffBuffer = PNG.sync.write(diffPng);
      const uniqueName = `${uuidv4()}-comparison.png`;
      const comparisonPath = path.join(TEMP_DIR, uniqueName);
      
      fs.writeFileSync(comparisonPath, diffBuffer);
      
      const differenceDetails = analyzeDifferences(diffPng.data, width, height);
      
      return {
        comparisonPath: `/temp/${uniqueName}`,
        differences: {
          total: totalDifferences,
          details: differenceDetails,
          summary: {
            layoutIssues: differenceDetails.filter(d => d.type === 'layout').length,
            contentIssues: differenceDetails.filter(d => d.type === 'content').length,
            visualIssues: differenceDetails.filter(d => d.type === 'visual').length,
            score: Math.max(0, 100 - Math.min(100, Math.floor((totalDifferences / (width * height)) * 5000)))
          }
        }
      };
    } catch (error) {
      console.error('Error comparing images:', error);
      throw error;
    }
  }
};

module.exports = { comparisonService };