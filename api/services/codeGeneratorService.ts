const codeGeneratorService = {
  // 生成 styled-components 代码
  generateStyledComponents: (designInfo, selectedLayerIds = [], assetPath = '/src/assets/slices') => {
    try {
      console.log('Generating styled-components code...');
      
      if (!designInfo || !designInfo.layers) {
        throw new Error('Invalid design information');
      }
      
      const filteredLayers = selectedLayerIds.length > 0 
        ? designInfo.layers.filter(layer => selectedLayerIds.includes(layer.id) && !layer.isGroup && layer.bounds.width > 0 && layer.bounds.height > 0)
        : designInfo.layers.filter(layer => layer.visible && !layer.isGroup && layer.bounds.width > 0 && layer.bounds.height > 0);
      
      const components = filteredLayers.map(layer => {
        const componentName = codeGeneratorService.toPascalCase(layer.name);
        const styles = codeGeneratorService.generateStyledComponentStyles(layer);
        
        return `export const ${componentName} = styled.div\`
  position: absolute;
  left: ${layer.bounds.left}px;
  top: ${layer.bounds.top}px;
  width: ${layer.bounds.width}px;
  height: ${layer.bounds.height}px;
  ${styles}
  background-image: url('${assetPath}/${layer.id}.png');
  background-size: cover;
  background-position: center;
\`;`;
      });
      
      const code = `import styled from 'styled-components';

${components.join('\n\n')}

// Usage example:
/*
<div style={{ position: 'relative', width: '${designInfo.width}px', height: '${designInfo.height}px' }}>
  ${filteredLayers.map(layer => {
    const componentName = codeGeneratorService.toPascalCase(layer.name);
    return `  <${componentName} />`;
  }).join('\n')}
</div>
*/`;
      
      console.log('Styled-components code generated successfully');
      return {
        success: true,
        code: code,
        componentCount: components.length
      };
    } catch (error) {
      console.error('Error generating styled-components code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 生成 tailwindcss 代码
  generateTailwindCSS: (designInfo, selectedLayerIds = [], assetPath = '/src/assets/slices') => {
    try {
      console.log('Generating tailwindcss code...');
      
      if (!designInfo || !designInfo.layers) {
        throw new Error('Invalid design information');
      }
      
      const filteredLayers = selectedLayerIds.length > 0 
        ? designInfo.layers.filter(layer => selectedLayerIds.includes(layer.id) && !layer.isGroup && layer.bounds.width > 0 && layer.bounds.height > 0)
        : designInfo.layers.filter(layer => layer.visible && !layer.isGroup && layer.bounds.width > 0 && layer.bounds.height > 0);
      
      const elements = filteredLayers.map(layer => {
        const tailwindClasses = codeGeneratorService.generateTailwindClasses(layer);
        return `<div class="absolute left-[${layer.bounds.left}px] top-[${layer.bounds.top}px] w-[${layer.bounds.width}px] h-[${layer.bounds.height}px] ${tailwindClasses}" style="background-image: url('${assetPath}/${layer.id}.png'); background-size: cover; background-position: center;">
  <!-- ${layer.name} -->
</div>`;
      });
      
      const code = `<div class="relative w-[${designInfo.width}px] h-[${designInfo.height}px]">
${elements.join('\n\n')}
</div>`;
      
      console.log('Tailwindcss code generated successfully');
      return {
        success: true,
        code: code,
        elementCount: elements.length
      };
    } catch (error) {
      console.error('Error generating tailwindcss code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // 生成 styled-components 样式
  generateStyledComponentStyles: (layer) => {
    const styles = [];
    
    if (layer.opacity !== 1) {
      styles.push(`opacity: ${layer.opacity};`);
    }
    
    if (layer.blendMode !== 'normal') {
      styles.push(`mix-blend-mode: ${layer.blendMode};`);
    }
    
    return styles.join('\n  ');
  },

  // 生成 tailwindcss 类
  generateTailwindClasses: (layer) => {
    const classes = [];
    
    if (layer.opacity !== 1) {
      const opacityClass = `opacity-${Math.round(layer.opacity * 100)}`;
      classes.push(opacityClass);
    }
    
    return classes.join(' ');
  },

  // 转换为 PascalCase
  toPascalCase: (str) => {
    return str
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('') || 'Component';
  },

  // 生成完整的代码生成结果
  generateCode: (designInfo, framework, selectedLayerIds = [], assetPath = '/src/assets/slices') => {
    switch (framework.toLowerCase()) {
      case 'styled-components':
        return codeGeneratorService.generateStyledComponents(designInfo, selectedLayerIds, assetPath);
      case 'tailwindcss':
        return codeGeneratorService.generateTailwindCSS(designInfo, selectedLayerIds, assetPath);
      default:
        return {
          success: false,
          error: 'Unsupported framework. Please use "styled-components" or "tailwindcss".'
        };
    }
  }
};

module.exports = { codeGeneratorService };