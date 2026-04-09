# DesignMatch 设计规范文档

## 🎨 项目概述
DesignMatch - 设计图比对工具，深色科技风格，玻璃拟态UI

---

## 🎯 设计风格定位
- **主色调**: 蓝色系 (Blue & Indigo)
- **背景**: 深色渐变背景
- **UI风格**: 玻璃拟态 (Glassmorphism)
- **设计感**: 高大上、科技感、专业

---

## 📋 设计资产清单

### 1. Logo设计
**文件位置**: `/workspace/design-assets/logo/`

#### Logo 设计提示词 (Prompt)
```
Modern tech company logo for 'DesignMatch', featuring overlapping layers concept, blue and indigo gradient, minimalist 3D style, glassmorphism effect, dark background, pixel perfect, 8K resolution, professional branding, tech startup aesthetic, subtle glow effects, geometric shapes, clean lines, premium feel
```

#### Logo 变体提示词
```
DesignMatch logo variation, monochrome version, minimalist style, white on dark blue background, flat design, 2048x2048, high contrast
```

```
DesignMatch icon, app icon style, rounded square, blue gradient, subtle shadow, iOS app icon aesthetic, 1024x1024
```

---

### 2. 主界面设计
**文件位置**: `/workspace/design-assets/screens/`

#### 主界面概念设计提示词
```
Professional web application dashboard for design comparison tool, dark theme, glassmorphism UI cards, blue accents, file upload section, URL input field, device selection dropdowns, modern clean layout, two-column grid, subtle glow effects, tech product aesthetic, 4K resolution, Figma quality, Dribbble award winning design
```

#### 主界面详细设计提示词
```
DesignMatch homepage hero section, dark gradient background, glassmorphism header, large title "DesignMatch", subtitle "Pixel-perfect design comparison", CTA button, floating particles, subtle animations, premium SaaS product design, 1920x1080, website landing page aesthetic
```

---

### 3. 结果展示页面设计
**文件位置**: `/workspace/design-assets/screens/`

#### 对比结果展示提示词
```
Image comparison interface, split screen view, design image on left, screenshot on right, difference overlay in red, glassmorphism panels, statistics cards showing match percentage, difference count, timeline view, dark theme, blue accents, professional UI design, 1920x1080
```

#### 详细差异分析页面提示词
```
Detailed difference analysis dashboard, heatmap showing differences, side-by-side comparison, zoom controls, annotations, glassmorphism cards, statistics dashboard, dark mode, tech professional aesthetic, 1920x1080, enterprise software design
```

---

### 4. 营销封面图
**文件位置**: `/workspace/design-assets/marketing/`

#### 产品宣传封面提示词
```
DesignMatch product hero banner, dark tech background, floating UI elements, comparison visualization, blue gradient accents, modern SaaS product marketing, "Pixel Perfect Design Comparison" headline, professional, premium, 1920x1080, startup launch aesthetic
```

#### 社交媒体宣传图提示词
```
DesignMatch social media banner, 1200x630, dark theme, glassmorphism, blue highlights, before and after comparison visualization, "Compare Designs with AI" text, modern tech company aesthetic, Instagram/Twitter ready
```

#### 博客文章封面提示词
```
Blog post cover image for design comparison article, abstract visualization of pixel differences, blue and indigo gradient, tech illustration style, "Design vs Implementation" title, 1600x900, Medium blog aesthetic
```

---

### 5. 图标和插图设计
**文件位置**: `/workspace/design-assets/logo/`

#### 功能图标提示词
```
Icon set for design comparison tool, 64x64, line art style, blue color, dark background, icons for: upload file, compare images, difference highlight, settings, download report, pixel perfect, consistent style
```

#### 特色插图提示词
```
Illustration showing design comparison process, designer and developer working together, abstract UI elements floating, blue gradient, dark background, flat design style, 2048x2048, SaaS product illustration
```

---

## 🎨 色彩系统

### 主色调
```css
/* 主要蓝色 */
--primary-50: #eff6ff
--primary-100: #dbeafe
--primary-200: #bfdbfe
--primary-300: #93c5fd
--primary-400: #60a5fa
--primary-500: #3b82f6
--primary-600: #2563eb
--primary-700: #1d4ed8
--primary-800: #1e40af
--primary-900: #1e3a8a

/* 靛蓝色 */
--indigo-50: #eef2ff
--indigo-100: #e0e7ff
--indigo-200: #c7d2fe
--indigo-300: #a5b4fc
--indigo-400: #818cf8
--indigo-500: #6366f1
--indigo-600: #4f46e5
--indigo-700: #4338ca
--indigo-800: #3730a3
--indigo-900: #312e81
```

### 中性色
```css
--slate-50: #f8fafc
--slate-100: #f1f5f9
--slate-200: #e2e8f0
--slate-300: #cbd5e1
--slate-400: #94a3b8
--slate-500: #64748b
--slate-600: #475569
--slate-700: #334155
--slate-800: #1e293b
--slate-900: #0f172a
```

### 功能色
```css
/* 成功 */
--success-500: #10b981
--success-600: #059669

/* 警告 */
--warning-500: #f59e0b
--warning-600: #d97706

/* 错误 */
--error-500: #ef4444
--error-600: #dc2626
```

---

## 🔤 字体系统

### 主字体
- **品牌字体**: SF Pro Display / Inter
- **代码字体**: SF Mono / Fira Code

### 字体层级
```css
/* 标题 */
.text-5xl: 3rem / 48px
.text-4xl: 2.25rem / 36px
.text-3xl: 1.875rem / 30px
.text-2xl: 1.5rem / 24px

/* 正文 */
.text-xl: 1.25rem / 20px
.text-lg: 1.125rem / 18px
.text-base: 1rem / 16px
.text-sm: 0.875rem / 14px
.text-xs: 0.75rem / 12px
```

---

## 🪟 玻璃拟态组件规范

### 玻璃卡片
```css
.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}
```

### 主按钮
```css
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  padding: 16px 32px;
  font-weight: 600;
  box-shadow: 
    0 4px 16px rgba(59, 130, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}
```

### 输入框
```css
.input-glass {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px;
}
```

---

## ✨ 动画效果

### 淡入上移动画
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### 脉冲发光效果
```css
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(59, 130, 246, 0.5);
  }
}
```

---

## 📱 响应式断点

```css
/* 移动设备 */
sm: 640px

/* 平板 */
md: 768px

/* 笔记本 */
lg: 1024px

/* 桌面 */
xl: 1280px

/* 大屏 */
2xl: 1536px
```

---

## 🎯 使用说明

### 如何使用这些提示词生成设计图？

1. **使用 byted-seedream-image-generate 技能**:
   ```bash
   cd /data/user/skills/byted-seedream-image-generate/scripts
   python seedream_image_generate.py -p "你的提示词" --version 5.0 -s 2048x2048 --no-watermark
   ```

2. **使用其他 AI 图像生成工具**:
   - Midjourney
   - DALL-E
   - Stable Diffusion
   - 复制粘贴对应的提示词即可

3. **保存位置**:
   - Logo: `/workspace/design-assets/logo/`
   - 界面: `/workspace/design-assets/screens/`
   - 营销: `/workspace/design-assets/marketing/`

---

## 📚 参考资源

- [Dribbble](https://dribbble.com) - 设计灵感
- [Awwwards](https://www.awwwards.com) - 优秀网站设计
- [Figma Community](https://www.figma.com/community) - UI组件库
- [Tailwind CSS](https://tailwindcss.com) - 样式框架

---

## 🎉 设计检查清单

- [ ] Logo 设计完成
- [ ] 主界面设计完成
- [ ] 结果展示页面设计完成
- [ ] 营销封面图设计完成
- [ ] 图标和插图设计完成
- [ ] 色彩系统确认
- [ ] 字体系统确认
- [ ] 组件规范确认

---

**最后更新**: 2026-03-31
**设计版本**: v1.0
