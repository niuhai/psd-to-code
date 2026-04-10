import { codeGeneratorService } from '../codeGeneratorService.js';

describe('codeGeneratorService', () => {
  // 模拟设计信息
  const mockDesignInfo = {
    width: 800,
    height: 600,
    layers: [
      {
        id: 'layer1',
        name: 'Button',
        path: 'Button',
        type: 'pixel',
        visible: true,
        opacity: 1,
        blendMode: 'normal',
        bounds: {
          left: 100,
          top: 100,
          right: 300,
          bottom: 150,
          width: 200,
          height: 50
        },
        hasMask: false,
        hasEffects: false,
        isGroup: false,
        parent: ''
      },
      {
        id: 'layer2',
        name: 'Header',
        path: 'Header',
        type: 'pixel',
        visible: true,
        opacity: 0.8,
        blendMode: 'normal',
        bounds: {
          left: 0,
          top: 0,
          right: 800,
          bottom: 100,
          width: 800,
          height: 100
        },
        hasMask: false,
        hasEffects: false,
        isGroup: false,
        parent: ''
      }
    ]
  };

  describe('generateStyledComponents', () => {
    it('should generate styled-components code with default asset path', () => {
      const result = codeGeneratorService.generateStyledComponents(mockDesignInfo);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('import styled from \'styled-components\'');
      expect(result.code).toContain('export const Button');
      expect(result.code).toContain('export const Header');
      expect(result.code).toContain('background-image: url(\'/src/assets/slices/layer1.png\')');
      expect(result.code).toContain('background-image: url(\'/src/assets/slices/layer2.png\')');
      expect(result.componentCount).toBe(2);
    });

    it('should generate styled-components code with custom asset path', () => {
      const customAssetPath = '/assets/images';
      const result = codeGeneratorService.generateStyledComponents(mockDesignInfo, [], customAssetPath);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('background-image: url(\'/assets/images/layer1.png\')');
      expect(result.code).toContain('background-image: url(\'/assets/images/layer2.png\')');
    });

    it('should generate styled-components code for selected layers only', () => {
      const selectedLayerIds = ['layer1'];
      const result = codeGeneratorService.generateStyledComponents(mockDesignInfo, selectedLayerIds);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('export const Button');
      expect(result.code).not.toContain('export const Header');
      expect(result.componentCount).toBe(1);
    });

    it('should handle error when design info is invalid', () => {
      const result = codeGeneratorService.generateStyledComponents(null);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid design information');
    });
  });

  describe('generateTailwindCSS', () => {
    it('should generate tailwindcss code with default asset path', () => {
      const result = codeGeneratorService.generateTailwindCSS(mockDesignInfo);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('<div class="relative w-[800px] h-[600px]">');
      expect(result.code).toContain('background-image: url(\'/src/assets/slices/layer1.png\')');
      expect(result.code).toContain('background-image: url(\'/src/assets/slices/layer2.png\')');
      expect(result.elementCount).toBe(2);
    });

    it('should generate tailwindcss code with custom asset path', () => {
      const customAssetPath = '/assets/images';
      const result = codeGeneratorService.generateTailwindCSS(mockDesignInfo, [], customAssetPath);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('background-image: url(\'/assets/images/layer1.png\')');
      expect(result.code).toContain('background-image: url(\'/assets/images/layer2.png\')');
    });

    it('should generate tailwindcss code for selected layers only', () => {
      const selectedLayerIds = ['layer1'];
      const result = codeGeneratorService.generateTailwindCSS(mockDesignInfo, selectedLayerIds);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('<!-- Button -->');
      expect(result.code).not.toContain('<!-- Header -->');
      expect(result.elementCount).toBe(1);
    });

    it('should handle error when design info is invalid', () => {
      const result = codeGeneratorService.generateTailwindCSS(null);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid design information');
    });
  });

  describe('generateCode', () => {
    it('should generate styled-components code when framework is styled-components', () => {
      const result = codeGeneratorService.generateCode(mockDesignInfo, 'styled-components');
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('import styled from \'styled-components\'');
    });

    it('should generate tailwindcss code when framework is tailwindcss', () => {
      const result = codeGeneratorService.generateCode(mockDesignInfo, 'tailwindcss');
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('<div class="relative');
    });

    it('should pass assetPath to underlying generators', () => {
      const customAssetPath = '/assets/images';
      const result = codeGeneratorService.generateCode(mockDesignInfo, 'styled-components', [], customAssetPath);
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('background-image: url(\'/assets/images/layer1.png\')');
    });

    it('should return error for unsupported framework', () => {
      const result = codeGeneratorService.generateCode(mockDesignInfo, 'unsupported');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unsupported framework. Please use "styled-components" or "tailwindcss".');
    });
  });

  describe('toPascalCase', () => {
    it('should convert string to PascalCase', () => {
      // 由于 toPascalCase 是私有方法，我们通过调用生成器间接测试
      const result = codeGeneratorService.generateStyledComponents({
        width: 100,
        height: 100,
        layers: [{
          id: 'test',
          name: 'test layer',
          path: 'test layer',
          type: 'pixel',
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          bounds: {
            left: 0,
            top: 0,
            right: 100,
            bottom: 100,
            width: 100,
            height: 100
          },
          hasMask: false,
          hasEffects: false,
          isGroup: false,
          parent: ''
        }]
      });
      
      expect(result.success).toBe(true);
      expect(result.code).toContain('export const TestLayer');
    });
  });
});
