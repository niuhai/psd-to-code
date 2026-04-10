<template>
  <div class="w-full border border-white/10 rounded-2xl bg-white/[0.02] p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Layers class="w-5 h-5 text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-white">Layer Selector</h3>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="selectAll"
          class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition-colors"
        >
          Select All
        </button>
        <button
          @click="deselectAll"
          class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition-colors"
        >
          Deselect All
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
      <p class="text-red-300 text-sm">{{ error }}</p>
    </div>

    <div v-else-if="layers.length === 0" class="p-8 text-center">
      <FileQuestion class="w-12 h-12 mx-auto mb-4 text-slate-500" />
      <p class="text-slate-400">No layers found. Please upload a PSD file first.</p>
    </div>

    <div v-else class="space-y-2 max-h-96 overflow-y-auto pr-2">
      <!-- 递归渲染图层树 -->
      <LayerTreeNode
        v-for="layer in layerTree"
        :key="layer.id"
        :layer="layer"
        :selectedLayers="selectedLayers"
        @toggle="toggleLayer"
        @select="toggleLayerSelection"
      />
    </div>

    <div v-if="layers.length > 0" class="mt-6 flex items-center justify-between">
      <div class="text-sm text-slate-400">
        {{ selectedLayers.length }} of {{ layers.filter(l => !l.isGroup).length }} layers selected
      </div>
      <button
        @click="confirmSelection"
        :disabled="selectedLayers.length === 0"
        class="px-4 py-2 rounded-lg transition-colors"
        :class="selectedLayers.length === 0 ? 'bg-white/5 text-slate-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'"
      >
        Confirm Selection
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineComponent, h } from 'vue'
import { Layers, Image, ChevronRight, ChevronDown, FileQuestion } from 'lucide-vue-next'
import { getLayers } from '../utils/api'

// 递归图层节点组件
const LayerTreeNode = defineComponent({
  name: 'LayerTreeNode',
  props: {
    layer: {
      type: Object,
      required: true
    },
    selectedLayers: {
      type: Array,
      required: true
    }
  },
  emits: ['toggle', 'select'],
  setup(props, { emit }) {
    const handleToggle = () => {
      emit('toggle', props.layer)
    }

    const handleSelect = (layerId: string) => {
      emit('select', layerId)
    }

    return () => h('div', { class: 'layer-item' }, [
      h('div', {
        onClick: handleToggle,
        class: 'flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer'
      }, [
        props.layer.isGroup ? h('div', {
          class: 'w-4 h-4 flex items-center justify-center'
        }, [
          props.layer.expanded ? h(ChevronDown, { class: 'w-4 h-4 text-slate-400 transition-transform' }) : h(ChevronRight, { class: 'w-4 h-4 text-slate-400 transition-transform' })
        ]) : h('input', {
          type: 'checkbox',
          checked: props.selectedLayers.includes(props.layer.id),
          onChange: () => handleSelect(props.layer.id),
          class: 'w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500'
        }),
        props.layer.isGroup ? h(Layers, { class: 'w-4 h-4 text-slate-400' }) : h(Image, { class: 'w-4 h-4 text-slate-400' }),
        h('span', { class: 'text-slate-300 text-sm flex-1' }, props.layer.name),
        !props.layer.isGroup ? h('span', { class: 'text-xs text-slate-500' }, `${props.layer.bounds?.width}x${props.layer.bounds?.height}`) : null
      ]),
      props.layer.expanded && props.layer.children && props.layer.children.length > 0 ? h('div', {
        class: 'pl-6 mt-1 space-y-1'
      }, props.layer.children.map((child: any) => h(LayerTreeNode, {
        key: child.id,
        layer: child,
        selectedLayers: props.selectedLayers,
        onToggle: (layer: any) => emit('toggle', layer),
        onSelect: (layerId: string) => emit('select', layerId)
      }))) : null
    ])
  }
})

const props = defineProps<{
  filePath: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedLayers', layers: string[]): void
  (e: 'onError', error: string): void
}>()

const layers = ref<any[]>([])
const selectedLayers = ref<string[]>([])
const loading = ref<boolean>(false)
const error = ref<string>('')

// 构建图层树状结构
const layerTree = computed(() => {
  const tree: any[] = []
  const layerMap = new Map<string, any>()

  // 首先创建所有图层的映射
  layers.value.forEach(layer => {
    layerMap.set(layer.id, {
      ...layer,
      children: [],
      expanded: false
    })
  })

  // 构建树状结构
  layers.value.forEach(layer => {
    if (!layer.parent) {
      // 根图层
      tree.push(layerMap.get(layer.id))
    } else {
      // 子图层，找到父图层并添加到children中
      const parentPath = layer.parent
      // 查找父图层
      const parentLayer = layers.value.find(l => l.path === parentPath)
      if (parentLayer) {
        const parentNode = layerMap.get(parentLayer.id)
        if (parentNode) {
          parentNode.children.push(layerMap.get(layer.id))
        }
      }
    }
  })

  return tree
})

// 加载图层信息
const loadLayers = async () => {
  if (!props.filePath) return

  loading.value = true
  error.value = ''
  
  try {
    const result = await getLayers(props.filePath)
    if (result.success) {
      layers.value = result.layers
      selectedLayers.value = []
    } else {
      error.value = result.error || 'Failed to load layers'
      emit('onError', error.value)
    }
  } catch (err) {
    error.value = 'Failed to load layers'
    emit('onError', error.value)
  } finally {
    loading.value = false
  }
}

// 监听文件路径变化
watch(() => props.filePath, () => {
  loadLayers()
}, { immediate: true })

// 切换图层展开/折叠
const toggleLayer = (layer: any) => {
  layer.expanded = !layer.expanded
}

// 切换图层选择状态
const toggleLayerSelection = (layerId: string) => {
  const index = selectedLayers.value.indexOf(layerId)
  if (index > -1) {
    selectedLayers.value.splice(index, 1)
  } else {
    selectedLayers.value.push(layerId)
  }
  emit('update:selectedLayers', selectedLayers.value)
}

// 全选
const selectAll = () => {
  const layerIds = layers.value
    .filter(layer => !layer.isGroup)
    .map(layer => layer.id)
  selectedLayers.value = layerIds
  emit('update:selectedLayers', selectedLayers.value)
}

// 取消全选
const deselectAll = () => {
  selectedLayers.value = []
  emit('update:selectedLayers', selectedLayers.value)
}

// 确认选择
const confirmSelection = () => {
  emit('update:selectedLayers', selectedLayers.value)
}
</script>

<style scoped>
.layer-item {
  transition: all 0.2s ease;
}

.layer-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>