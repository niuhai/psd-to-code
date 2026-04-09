const app = require('./app');
const { fileService } = require('./services/fileService');

const PORT = process.env.PORT || 3001;

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // 启动时清理临时文件
  fileService.cleanupTempFiles();
  
  // 每小时清理一次临时文件
  setInterval(() => {
    fileService.cleanupTempFiles();
  }, 60 * 60 * 1000);
});