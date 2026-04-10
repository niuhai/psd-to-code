// 简单的测试脚本，用于测试 codeGeneratorService
const { codeGeneratorService } = require('./api/services/codeGeneratorService');

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

console.log('Testing codeGeneratorService...');

// 测试 generateStyledComponents 方法
console.log('\n1. Testing generateStyledComponents with default asset path:');
const styledResult = codeGeneratorService.generateStyledComponents(mockDesignInfo);
console.log('Success:', styledResult.success);
console.log('Component count:', styledResult.componentCount);
console.log('Code contains default asset path:', styledResult.code.includes('/src/assets/slices/layer1.png'));

// 测试 generateStyledComponents 方法 with custom asset path
console.log('\n2. Testing generateStyledComponents with custom asset path:');
const customAssetPath = '/assets/images';
const styledResultCustom = codeGeneratorService.generateStyledComponents(mockDesignInfo, [], customAssetPath);
console.log('Success:', styledResultCustom.success);
console.log('Code contains custom asset path:', styledResultCustom.code.includes('/assets/images/layer1.png'));

// 测试 generateTailwindCSS 方法
console.log('\n3. Testing generateTailwindCSS with default asset path:');
const tailwindResult = codeGeneratorService.generateTailwindCSS(mockDesignInfo);
console.log('Success:', tailwindResult.success);
console.log('Element count:', tailwindResult.elementCount);
console.log('Code contains default asset path:', tailwindResult.code.includes('/src/assets/slices/layer1.png'));

// 测试 generateTailwindCSS 方法 with custom asset path
console.log('\n4. Testing generateTailwindCSS with custom asset path:');
const tailwindResultCustom = codeGeneratorService.generateTailwindCSS(mockDesignInfo, [], customAssetPath);
console.log('Success:', tailwindResultCustom.success);
console.log('Code contains custom asset path:', tailwindResultCustom.code.includes('/assets/images/layer1.png'));

// 测试 generateCode 方法
console.log('\n5. Testing generateCode with styled-components:');
const generateResultStyled = codeGeneratorService.generateCode(mockDesignInfo, 'styled-components');
console.log('Success:', generateResultStyled.success);

console.log('\n6. Testing generateCode with tailwindcss:');
const generateResultTailwind = codeGeneratorService.generateCode(mockDesignInfo, 'tailwindcss');
console.log('Success:', generateResultTailwind.success);

console.log('\n7. Testing generateCode with unsupported framework:');
const generateResultUnsupported = codeGeneratorService.generateCode(mockDesignInfo, 'unsupported');
console.log('Success:', generateResultUnsupported.success);
console.log('Error:', generateResultUnsupported.error);

console.log('\nAll tests completed!');
