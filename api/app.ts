const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/upload');
const captureRoutes = require('./routes/capture');
const compareRoutes = require('./routes/compare');
const generateRoutes = require('./routes/generate');
const sliceRoutes = require('./routes/slice');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// 静态文件
app.use(express.static('public'));

// 路由
app.use('/api/upload', uploadRoutes);
app.use('/api/capture', captureRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/slice', sliceRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;