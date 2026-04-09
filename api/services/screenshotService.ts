const puppeteer = require('puppeteer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');

// 设备配置
const devices = {
  'iphone': {
    name: 'iPhone 13',
    viewport: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true, isLandscape: false }
  },
  'android': {
    name: 'Pixel 5',
    viewport: { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true, isLandscape: false }
  },
  'ipad': {
    name: 'iPad Pro',
    viewport: { width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: false }
  }
};

const screenshotService = {
  // 捕获页面截图
  captureScreenshot: async (url, deviceType, _screenSize) => {
    let browser;
    try {
      // 启动浏览器
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      // 创建页面
      const page = await browser.newPage();
      
      // 设置设备视图
      const deviceConfig = devices[deviceType] || devices.iphone;
      await page.setViewport(deviceConfig.viewport);
      
      // 访问URL
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // 等待页面加载完成
      await page.waitForTimeout(2000);
      
      // 生成唯一文件名
      const uniqueName = `${uuidv4()}-screenshot.png`;
      const screenshotPath = path.join(TEMP_DIR, uniqueName);
      
      // 捕获截图
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });
      
      // 关闭浏览器
      await browser.close();
      
      return `/temp/${uniqueName}`;
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      if (browser) {
        await browser.close();
      }
      throw error;
    }
  }
};

module.exports = { screenshotService };