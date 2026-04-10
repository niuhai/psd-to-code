<template>
  <div class="w-full border border-white/10 rounded-2xl bg-white/[0.02] p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Scissors class="w-5 h-5 text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-white">Slicing Tool</h3>
      </div>
      <button
        @click="isExpanded = !isExpanded"
        class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronUp v-if="isExpanded" class="w-4 h-4" />
        <ChevronDown v-else class="w-4 h-4" />
      </button>
    </div>

    <div v-if="isExpanded" class="space-y-6">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Format</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="fmt in formats"
                :key="fmt.value"
                @click="format = fmt.value"
                class="px-3 py-2 rounded-lg transition-colors"
                :class="format === fmt.value ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'"
              >
                {{ fmt.label }}
              </button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Quality: {{ quality }}%</label>
            <input
              type="range"
              min="10"
              max="100"
              v-model.number="quality"
              class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              :style="{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${quality}%, rgba(255,255,255,0.1) ${quality}%, rgba(255,255,255,0.1) 100%)`
              }"
            />
          </div>
        </div>

        <div v-if="selectedLayers.length > 0" class="flex items-center justify-between text-sm">
          <span class="text-slate-400">{{ selectedLayers.length }} layers selected</span>
          <button
            @click="clearSelection"
            class="text-green-400 hover:text-green-300 transition-colors"
          >
            Clear selection
          </button>
        </div>

        <button
          @click="handleGenerateSlices"
          :disabled="isGenerating || !selectedLayers.length"
          class="w-full btn-primary text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2"
        >
          <template v-if="isGenerating">
            <Loader2 class="w-5 h-5 animate-spin" />
            Generating slices...
          </template>
          <template v-else>
            <Scissors class="w-5 h-5" />
            Generate Slices
          </template>
        </button>
      </div>

      <div v-if="slices.length > 0" class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Generated {{ slices.length }} slices</span>
          <button
            @click="downloadAllSlices"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition-colors"
          >
            <Download class="w-4 h-4" />
            Download All
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="(slice, index) in slices" :key="index" class="border border-white/10 rounded-lg p-3 bg-white/[0.02]">
            <div class="aspect-video bg-slate-900 rounded mb-3 overflow-hidden">
              <img 
                :src="`http://localhost:3001${slice.path}`" 
                :alt="slice.name" 
                class="w-full h-full object-contain"
              />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-white truncate" :title="slice.name">
                  {{ slice.name }}
                </span>
                <button
                  @click="handleDownloadSlice(slice.path, `${slice.name}.${format}`)"
                  class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  title="Download"
                >
                  <Download class="w-4 h-4" />
                </button>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span>{{ slice.width }}x{{ slice.height }}</span>
                <span>•</span>
                <span>{{ (slice.size / 1024).toFixed(1) }} KB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Scissors, Download, Loader2, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { generateSlices } from '../utils/api'

const props = defineProps<{
  filePath: string
  fileName: string
  selectedLayers: string[]
  onError: (error: string) => void
}>()

const format = ref<string>('png')
const quality = ref<number>(90)
const isGenerating = ref<boolean>(false)
const slices = ref<any[]>([])
const isExpanded = ref<boolean>(false)

const formats = [
  { value: 'png', label: 'PNG' },
  { value: 'jpg', label: 'JPG' },
  { value: 'webp', label: 'WebP' }
]

const handleGenerateSlices = async () => {
  if (props.selectedLayers.length === 0) {
    props.onError('Please select at least one layer')
    return
  }

  isGenerating.value = true
  try {
    // 生成切图
    const result = await generateSlices(props.filePath, {
      format: format.value,
      quality: quality.value,
      layers: props.selectedLayers
    })
    if ('success' in result && result.success) {
      slices.value = result.slices
      isExpanded.value = true
    } else {
      throw new Error('Failed to generate slices')
    }
  } catch (error) {
    props.onError((error as Error).message || 'Failed to generate slices')
  } finally {
    isGenerating.value = false
  }
}

const handleDownloadSlice = (slicePath: string, sliceName: string) => {
  const downloadUrl = `http://localhost:3001${slicePath}`
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = sliceName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadAllSlices = () => {
  slices.value.forEach(slice => {
    handleDownloadSlice(slice.path, `${slice.name}.${format.value}`)
  })
}

const clearSelection = () => {
  // 触发父组件的清除选择事件
  // 这里需要通过emit通知父组件
}
</script>

<style scoped>
/* 组件样式 */
</style>