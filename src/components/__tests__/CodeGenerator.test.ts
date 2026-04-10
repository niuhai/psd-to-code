import { mount } from '@vue/test-utils';
import CodeGenerator from '../CodeGenerator.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCode, generateSlices } from '../../utils/api';

// 模拟 API 函数
vi.mock('../../utils/api', () => ({
  generateCode: vi.fn(),
  generateSlices: vi.fn()
}));

// 模拟 clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

describe('CodeGenerator', () => {
  const mockSlices = [
    {
      name: 'Button.png',
      path: '/slices/layer1.png',
      absolutePath: '/path/to/slices/layer1.png',
      format: 'png',
      width: 200,
      height: 50,
      size: 1024,
      bounds: {
        left: 100,
        top: 100,
        width: 200,
        height: 50
      }
    },
    {
      name: 'Header.png',
      path: '/slices/layer2.png',
      absolutePath: '/path/to/slices/layer2.png',
      format: 'png',
      width: 800,
      height: 100,
      size: 2048,
      bounds: {
        left: 0,
        top: 0,
        width: 800,
        height: 100
      }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (generateSlices as vi.MockedFunction<typeof generateSlices>).mockResolvedValue({
      success: true,
      slices: mockSlices,
      totalSlices: 2
    });
    (generateCode as vi.MockedFunction<typeof generateCode>).mockResolvedValue({
      success: true,
      code: 'import styled from \'styled-components\';\n\nexport const Button = styled.div\`\n  position: absolute;\n  left: 100px;\n  top: 100px;\n  width: 200px;\n  height: 50px;\n  background-image: url(\'/src/assets/slices/layer1.png\');\n  background-size: cover;\n  background-position: center;\n\`;',
      componentCount: 1
    });
  });

  it('should render framework selection buttons', () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    expect(wrapper.find('button:contains("Styled Components")').exists()).toBe(true);
    expect(wrapper.find('button:contains("Tailwind CSS")').exists()).toBe(true);
  });

  it('should render asset path input', () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    expect(wrapper.find('input[placeholder="/src/assets/slices"]').exists()).toBe(true);
  });

  it('should render generate code button', () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    expect(wrapper.find('button:contains("Generate Styled Components Code")').exists()).toBe(true);
  });

  it('should disable generate button when no layers are selected', () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: [],
        onError: vi.fn()
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    expect(generateButton.attributes('disabled')).toBe('');
  });

  it('should enable generate button when layers are selected', () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    expect(generateButton.attributes('disabled')).toBeUndefined();
  });

  it('should call generateSlices and generateCode when generate button is clicked', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');

    expect(generateSlices).toHaveBeenCalledWith('/test.psd', {
      format: 'png',
      quality: 90,
      layers: ['layer1']
    });

    expect(generateCode).toHaveBeenCalledWith('/test.psd', 'styled-components', ['layer1'], '/src/assets/slices');
  });

  it('should display generated code when code is generated successfully', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('pre').exists()).toBe(true);
    expect(wrapper.find('code').text()).toContain('import styled from \'styled-components\'');
  });

  it('should display generated slices when slices are generated successfully', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('h4:contains("Generated Slices")').exists()).toBe(true);
    expect(wrapper.findAll('.bg-white\/5').length).toBe(2);
  });

  it('should call onError when code generation fails', async () => {
    const onError = vi.fn();
    (generateCode as vi.MockedFunction<typeof generateCode>).mockRejectedValue(new Error('Failed to generate code'));

    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError
      }
    });

    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(onError).toHaveBeenCalledWith('Failed to generate code');
  });

  it('should copy code to clipboard when copy button is clicked', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    // 先生成代码
    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');
    await wrapper.vm.$nextTick();

    // 点击复制按钮
    const copyButton = wrapper.find('button:contains("Copy code")');
    await copyButton.trigger('click');

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('import styled from \'styled-components\';\n\nexport const Button = styled.div\`\n  position: absolute;\n  left: 100px;\n  top: 100px;\n  width: 200px;\n  height: 50px;\n  background-image: url(\'/src/assets/slices/layer1.png\');\n  background-size: cover;\n  background-position: center;\n\`;');
  });

  it('should change framework when framework button is clicked', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    // 点击 Tailwind CSS 按钮
    const tailwindButton = wrapper.find('button:contains("Tailwind CSS")');
    await tailwindButton.trigger('click');

    // 检查生成按钮文本是否更新
    const generateButton = wrapper.find('button:contains("Generate")');
    expect(generateButton.text()).toContain('Generate Tailwind CSS Code');
  });

  it('should update asset path when input is changed', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    const assetPathInput = wrapper.find('input[placeholder="/src/assets/slices"]');
    await assetPathInput.setValue('/assets/images');

    // 点击生成按钮
    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');

    // 检查是否使用了新的资产路径
    expect(generateCode).toHaveBeenCalledWith('/test.psd', 'styled-components', ['layer1'], '/assets/images');
  });

  it('should download all slices when download button is clicked', async () => {
    // 模拟 document.createElement 和 link.click
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: vi.fn()
    } as any);

    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    // 先生成代码和切图
    const generateButton = wrapper.find('button:contains("Generate")');
    await generateButton.trigger('click');
    await wrapper.vm.$nextTick();

    // 点击下载按钮
    const downloadButton = wrapper.find('button:contains("Download All Slices")');
    await downloadButton.trigger('click');

    // 检查是否为每个切图创建了下载链接
    expect(createElementSpy).toHaveBeenCalledTimes(2);
  });

  it('should toggle expanded state when toggle button is clicked', async () => {
    const wrapper = mount(CodeGenerator, {
      props: {
        filePath: '/test.psd',
        fileName: 'test.psd',
        selectedLayers: ['layer1'],
        onError: vi.fn()
      }
    });

    // 初始状态应该是折叠的
    expect(wrapper.find('.space-y-6').exists()).toBe(false);

    // 点击切换按钮
    const toggleButton = wrapper.find('button.w-8.h-8');
    await toggleButton.trigger('click');

    // 应该展开
    expect(wrapper.find('.space-y-6').exists()).toBe(true);

    // 再次点击切换按钮
    await toggleButton.trigger('click');

    // 应该折叠
    expect(wrapper.find('.space-y-6').exists()).toBe(false);
  });
});
