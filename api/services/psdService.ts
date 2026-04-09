const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const psd = require('psd');

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');

const psdService = {
  // 处理文件，支持 PSD 和其他图像格式
  processFile: async (filePath) => {
    try {
      const fileName = path.basename(filePath);
      
      // 如果是 PSD 文件，尝试处理
      if (psdService.isPsdFile(fileName)) {
        try {
          return await psdService.processPsdWithSharp(filePath);
        } catch (error) {
          console.warn('Failed to process PSD, trying alternative method:', error);
          return await psdService.convertWithFallback(filePath);
        }
      }
      
      // 不是 PSD 文件，直接返回原路径
      return {
        convertedPath: filePath.replace(/^\/public/, ''),
        processed: false
      };
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  },

  // 使用 sharp 尝试处理 PSD（实际上 sharp 不支持 PSD，但保留接口）
  processPsdWithSharp: async (filePath) => {
    try {
      const uniqueName = `${uuidv4()}-converted.png`;
      const convertedPath = path.join(TEMP_DIR, uniqueName);
      
      // 尝试用其他方式处理，如果是其他格式伪装成 PSD，这也能工作
      await sharp(filePath)
        .png()
        .toFile(convertedPath);
      
      const metadata = await sharp(convertedPath).metadata();
      
      return {
        convertedPath: `/temp/${uniqueName}`,
        width: metadata.width,
        height: metadata.height,
        processed: true
      };
    } catch (error) {
      console.error('Sharp PSD processing failed:', error);
      throw error;
    }
  },

  // 降级方案 - 复制文件并给用户友好提示
  convertWithFallback: async (filePath) => {
    try {
      const fileName = path.basename(filePath);
      const uniqueName = `${uuidv4()}-${fileName}`;
      const fallbackPath = path.join(TEMP_DIR, uniqueName);
      
      // 复制原文件
      fs.copyFileSync(filePath, fallbackPath);
      
      console.warn(`PSD file ${fileName} copied as fallback`);
      
      return {
        convertedPath: `/temp/${uniqueName}`,
        width: 800,
        height: 600,
        processed: false,
        note: 'PSD file cannot be directly processed. Please export as PNG/JPG first.'
      };
    } catch (error) {
      console.error('Fallback conversion failed:', error);
      throw error;
    }
  },

  // 解析 PSD 文件
  parsePsd: async (filePath) => {
    try {
      console.log('Starting PSD parsing:', filePath);
      const psdFile = psd.fromFile(filePath);
      psdFile.parse();
      
      console.log('PSD parsing completed');
      
      // 获取 PSD 信息
      const info = {
        width: psdFile.width,
        height: psdFile.height,
        layers: psdService.extractLayers(psdFile.tree()),
        channels: psdFile.channels,
        resolution: {
          width: psdFile.resolution.width,
          height: psdFile.resolution.height
        },
        colorMode: psdFile.colorMode
      };
      
      console.log('PSD info extracted:', {
        width: info.width,
        height: info.height,
        layerCount: info.layers.length
      });
      
      return info;
    } catch (error) {
      console.error('PSD parsing error:', error);
      throw {
        message: 'Failed to parse PSD file',
        error: error.message
      };
    }
  },

  // 提取图层信息
  extractLayers: (tree) => {
    const layers = [];
    
    const processNode = (node, parentPath = '') => {
      if (node.type === 'layer') {
        const layerPath = parentPath ? `${parentPath}/${node.name}` : node.name;
        layers.push({
          id: node.id || uuidv4(),
          name: node.name,
          path: layerPath,
          type: node.type,
          visible: node.visible,
          opacity: node.opacity,
          blendMode: node.blendMode,
          bounds: {
            left: node.bounds.left,
            top: node.bounds.top,
            right: node.bounds.right,
            bottom: node.bounds.bottom,
            width: node.bounds.width(),
            height: node.bounds.height()
          },
          hasMask: node.mask !== null,
          hasEffects: node.effects !== null,
          isGroup: node.isGroup(),
          parent: parentPath
        });
      }
      
      // 处理子节点
      if (node.children) {
        node.children.forEach(child => {
          const childPath = parentPath ? `${parentPath}/${node.name}` : node.name;
          processNode(child, childPath);
        });
      }
    };
    
    processNode(tree);
    return layers;
  },

  // 检查文件是否为 PSD
  isPsdFile: (fileName) => {
    return fileName.toLowerCase().endsWith('.psd');
  },

  // 获取文件类型
  getFileType: (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    return ext;
  }
};

module.exports = { psdService };