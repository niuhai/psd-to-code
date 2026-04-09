const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const fileService = {
  // 保存上传的文件
  saveFile: (file) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(TEMP_DIR, uniqueName);
    
    // 保存文件
    fs.writeFileSync(filePath, file.buffer);
    
    return {
      filePath: `/temp/${uniqueName}`,
      fileName: file.originalname
    };
  },
  
  // 获取文件的绝对路径
  getAbsolutePath: (relativePath) => {
    return path.join(process.cwd(), 'public', relativePath);
  },
  
  // 清理临时文件
  cleanupTempFiles: () => {
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    fs.readdirSync(TEMP_DIR).forEach(file => {
      const filePath = path.join(TEMP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > twentyFourHours) {
        fs.unlinkSync(filePath);
      }
    });
  }
};

module.exports = { fileService };