import { mount } from '@vue/test-utils';
import LayerSelector from '../LayerSelector.vue';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getLayers } from '../../utils/api';

// 模拟 API 函数
vi.mock('../../utils/api', () => ({
  getLayers: vi.fn()
}));

describe('LayerSelector', () => {
  const mockLayers = [
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
    },
    {
      id: 'group1',
      name: 'Group 1',
      path: 'Group 1',
      type: 'group',
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      bounds: {
        left: 0,
        top: 0,
        right: 800,
        bottom: 600,
        width: 800,
        height: 600
      },
      hasMask: false,
      hasEffects: false,
      isGroup: true,
      parent: ''
    },
    {
      id: 'layer3',
      name: 'Text',
      path: 'Group 1/Text',
      type: 'text',
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      bounds: {
        left: 200,
        top: 200,
        right: 400,
        bottom: 250,
        width: 200,
        height: 50
      },
      hasMask: false,
      hasEffects: false,
      isGroup: false,
      parent: 'Group 1'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (getLayers as vi.MockedFunction<typeof getLayers>).mockResolvedValue({
      success: true,
      layers: mockLayers
    });
  });

  it('should render loading state when layers are being loaded', async () => {
    (getLayers as vi.MockedFunction<typeof getLayers>).mockImplementation(() => {
      return new Promise(() => {
        // 模拟异步加载
      });
    });

    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    expect(wrapper.find('.animate-spin').exists()).toBe(true);
  });

  it('should render error state when layers fail to load', async () => {
    (getLayers as vi.MockedFunction<typeof getLayers>).mockResolvedValue({
      success: false,
      error: 'Failed to load layers'
    });

    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.text-red-300').exists()).toBe(true);
    expect(wrapper.find('.text-red-300').text()).toBe('Failed to load layers');
  });

  it('should render empty state when no layers are found', async () => {
    (getLayers as vi.MockedFunction<typeof getLayers>).mockResolvedValue({
      success: true,
      layers: []
    });

    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.text-slate-400').exists()).toBe(true);
    expect(wrapper.find('.text-slate-400').text()).toBe('No layers found. Please upload a PSD file first.');
  });

  it('should render layers when they are loaded successfully', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find('.layer-item').exists()).toBe(true);
    expect(wrapper.text()).toContain('Button');
    expect(wrapper.text()).toContain('Header');
    expect(wrapper.text()).toContain('Group 1');
  });

  it('should emit update:selectedLayers when layers are selected', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 找到第一个图层的复选框并点击
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect(checkboxes.length).toBe(3); // 3个非组图层
    
    await checkboxes[0].setChecked(true);
    
    expect(wrapper.emitted('update:selectedLayers')).toBeTruthy();
    expect(wrapper.emitted('update:selectedLayers')?.[0]).toEqual([['layer1']]);
  });

  it('should toggle layer expansion when group is clicked', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 找到组图层并点击
    const groupItems = wrapper.findAll('.layer-item');
    const groupItem = groupItems.find(item => item.text().includes('Group 1'));
    expect(groupItem).toBeTruthy();

    await groupItem?.trigger('click');
    await wrapper.vm.$nextTick();

    // 检查子图层是否显示
    expect(wrapper.text()).toContain('Text');
  });

  it('should select all layers when selectAll button is clicked', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 点击全选按钮
    const selectAllButton = wrapper.find('button:contains("Select All")');
    await selectAllButton.trigger('click');

    expect(wrapper.emitted('update:selectedLayers')).toBeTruthy();
    const selectedLayers = wrapper.emitted('update:selectedLayers')?.[0][0];
    expect(selectedLayers).toHaveLength(3); // 3个非组图层
    expect(selectedLayers).toContain('layer1');
    expect(selectedLayers).toContain('layer2');
    expect(selectedLayers).toContain('layer3');
  });

  it('should deselect all layers when deselectAll button is clicked', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 先全选
    const selectAllButton = wrapper.find('button:contains("Select All")');
    await selectAllButton.trigger('click');

    // 再取消全选
    const deselectAllButton = wrapper.find('button:contains("Deselect All")');
    await deselectAllButton.trigger('click');

    expect(wrapper.emitted('update:selectedLayers')).toBeTruthy();
    const selectedLayers = wrapper.emitted('update:selectedLayers')?.[1][0];
    expect(selectedLayers).toHaveLength(0);
  });

  it('should emit update:selectedLayers when confirmSelection is clicked', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 选择一个图层
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0].setChecked(true);

    // 点击确认选择按钮
    const confirmButton = wrapper.find('button:contains("Confirm Selection")');
    await confirmButton.trigger('click');

    expect(wrapper.emitted('update:selectedLayers')).toBeTruthy();
    expect(wrapper.emitted('update:selectedLayers')?.length).toBe(2); // 选择时一次，确认时一次
  });

  it('should disable confirm button when no layers are selected', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    const confirmButton = wrapper.find('button:contains("Confirm Selection")');
    expect(confirmButton.attributes('disabled')).toBe('');
  });

  it('should enable confirm button when layers are selected', async () => {
    const wrapper = mount(LayerSelector, {
      props: {
        filePath: '/test.psd'
      }
    });

    await wrapper.vm.$nextTick();

    // 选择一个图层
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    await checkboxes[0].setChecked(true);
    await wrapper.vm.$nextTick();

    const confirmButton = wrapper.find('button:contains("Confirm Selection")');
    expect(confirmButton.attributes('disabled')).toBeUndefined();
  });
});
