const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const psd = require('psd');

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
const SLICE_DIR = path.join(process.cwd(), 'public', 'slices');

// 确保切片目录存在
if (!fs.existsSync(SLICE_DIR)) {
  fs.mkdirSync(SLICE_DIR, { recursive: true });
}

const slicingService = {
  // 生成切图
  generateSlices: async (filePath, options: any = {}) => {
    try {
      console.log('Starting slice generation:', filePath);
      
      const { format = 'png', quality = 90, layers = [] } = options;
      
      // 解析PSD文件
      const psdFile = psd.fromFile(filePath);
      psdFile.parse();
      
      const slices = [];
      const allLayers = psdFile.tree().descendants();
      
      // 确定要切的图层
      const targetLayers = layers.length > 0 
        ? allLayers.filter(layer => layers.includes(layer.name))
        : allLayers.filter(layer => layer.type === 'layer' && layer.visible && !layer.isGroup());
      
      console.log(`Processing ${targetLayers.length} layers for slicing`);
      
      for (const layer of targetLayers) {
        try {
          // 跳过不可见或空图层
          if (!layer.visible || layer.bounds.width() <= 0 || layer.bounds.height() <= 0) {
            continue;
          }
          
          // 生成切片
          const sliceResult = await slicingService.generateLayerSlice(layer, { format, quality });
          slices.push(sliceResult);
        } catch (error) {
          console.error(`Error processing layer ${layer.name}:`, error);
          // 继续处理其他图层
        }
      }
      
      console.log(`Slice generation completed: ${slices.length} slices generated`);
      
      return {
        success: true,
        slices: slices,
        totalSlices: slices.length
      };
    } catch (error) {
      console.error('Error generating slices:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 生成单个图层的切图
  generateLayerSlice: async (layer, options: any = {}) => {
    try {
      const { format = 'png', quality = 90 } = options;
      
      // 生成唯一文件名
      const safeLayerName = layer.name.replace(/[^a-zA-Z0-9]/g, '_');
      const uniqueName = `${uuidv4()}_${safeLayerName}.${format}`;
      const slicePath = path.join(SLICE_DIR, uniqueName);
      
      // 提取图层图像数据
      const imageBuffer = layer.image.toPng();
      
      // 使用sharp处理图像
      let sharpInstance = sharp(imageBuffer);
      
      // 设置质量
      if (format === 'jpg' || format === 'jpeg') {
        sharpInstance = sharpInstance.jpeg({ quality });
      } else if (format === 'png') {
        sharpInstance = sharpInstance.png({ quality });
      } else if (format === 'webp') {
        sharpInstance = sharpInstance.webp({ quality });
      }
      
      // 保存切图
      await sharpInstance.toFile(slicePath);
      
      // 获取图像信息
      const metadata = await sharp(slicePath).metadata();
      
      return {
        name: layer.name,
        path: `/slices/${uniqueName}`,
        absolutePath: slicePath,
        format: format,
        width: metadata.width,
        height: metadata.height,
        size: fs.statSync(slicePath).size,
        bounds: {
          left: layer.bounds.left,
          top: layer.bounds.top,
          width: layer.bounds.width(),
          height: layer.bounds.height()
        }
      };
    } catch (error) {
      console.error('Error generating layer slice:', error);
      throw error;
    }
  },

  // 批量生成切图
  batchGenerateSlices: async (filePaths, options = {}) => {
    try {
      const results = [];
      
      for (const filePath of filePaths) {
        const result = await slicingService.generateSlices(filePath, options);
        results.push({
          filePath: filePath,
          result: result
        });
      }
      
      return {
        success: true,
        results: results
      };
    } catch (error) {
      console.error('Error in batch slice generation:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 清理切片文件
  cleanupSlices: () => {
    try {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (fs.existsSync(SLICE_DIR)) {
        fs.readdirSync(SLICE_DIR).forEach(file => {
          const filePath = path.join(SLICE_DIR, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtime.getTime() > twentyFourHours) {
            fs.unlinkSync(filePath);
            console.log(`Cleaned up old slice: ${file}`);
          }
        });
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error cleaning up slices:', error);
      return { success: false, error: error.message };
    }
  },

  // 获取切片信息
  getSliceInfo: (slicePath) => {
    try {
      const absolutePath = path.join(process.cwd(), 'public', slicePath);
      
      if (!fs.existsSync(absolutePath)) {
        throw new Error('Slice file not found');
      }
      
      const stats = fs.statSync(absolutePath);
      const metadata = sharp(absolutePath).metadataSync();
      
      return {
        success: true,
        info: {
          path: slicePath,
          absolutePath: absolutePath,
          size: stats.size,
          width: metadata.width,
          height: metadata.height,
          format: metadata.format
        }
      };
    } catch (error) {
      console.error('Error getting slice info:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = { slicingService };