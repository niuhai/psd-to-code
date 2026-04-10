<template>
  <div class="w-full border border-white/10 rounded-2xl bg-white/[0.02] p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Code class="w-5 h-5 text-blue-400" />
        </div>
        <h3 class="text-xl font-bold text-white">Code Generator</h3>
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
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Framework</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="fw in frameworks"
                :key="fw.value"
                @click="framework = fw.value"
                class="px-4 py-2 rounded-lg transition-colors"
                :class="framework === fw.value ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/15 text-slate-300'"
              >
                {{ fw.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Asset Path</label>
            <input
              v-model="assetPath"
              type="text"
              placeholder="/src/assets/slices"
              class="w-full px-4 py-2 rounded-lg input-glass text-white"
            />
            <p class="text-xs text-slate-500 mt-1">Path where slice images will be located in your project</p>
          </div>
        </div>

        <div v-if="selectedLayers.length > 0" class="flex items-center justify-between text-sm">
          <span class="text-slate-400">{{ selectedLayers.length }} layers selected</span>
          <button
            @click="clearSelection"
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Clear selection
          </button>
        </div>

        <button
          @click="handleGenerateCode"
          :disabled="isGenerating || !selectedLayers.length"
          class="w-full btn-primary text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2"
        >
          <template v-if="isGenerating">
            <Loader2 class="w-5 h-5 animate-spin" />
            Generating code...
          </template>
          <template v-else>
            <Code class="w-5 h-5" />
            Generate {{ framework }} Code
          </template>
        </button>
      </div>

      <div v-if="generatedCode" class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-400">Generated {{ componentCount }} components</span>
          </div>
          <button
            @click="handleCopyCode"
            class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition-colors"
          >
            <Check v-if="isCodeCopied" class="w-4 h-4 text-green-400" />
            <Copy v-else class="w-4 h-4" />
            {{ isCodeCopied ? 'Copied' : 'Copy code' }}
          </button>
        </div>

        <div class="relative">
          <pre class="bg-slate-900 rounded-lg p-4 overflow-x-auto max-h-96 text-sm">
            <code class="text-slate-300 font-mono">{{ generatedCode }}</code>
          </pre>
          <div class="absolute top-2 right-2 flex gap-2">
            <span class="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">{{ framework }}</span>
          </div>
        </div>

        <div v-if="slices.length > 0" class="space-y-3">
          <h4 class="text-sm font-medium text-slate-300">Generated Slices</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div v-for="slice in slices" :key="slice.path" class="bg-white/5 rounded-lg p-3">
              <div class="aspect-video bg-slate-900 rounded-lg mb-2 overflow-hidden">
                <img :src="`http://localhost:3001${slice.path}`" :alt="slice.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-400 truncate">{{ slice.name }}</span>
                <span class="text-slate-500">{{ slice.width }}x{{ slice.height }}</span>
              </div>
            </div>
          </div>
          <button
            @click="downloadAllSlices"
            class="mt-3 w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Download class="w-4 h-4" />
            Download All Slices
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Code, Copy, Check, Loader2, ChevronDown, ChevronUp, Download } from 'lucide-vue-next'
import { generateCode, generateSlices } from '../utils/api'

const props = defineProps<{
  filePath: string
  fileName: string
  selectedLayers: string[]
  onError: (error: string) => void
}>()

const framework = ref<string>('styled-components')
const assetPath = ref<string>('/src/assets/slices')
const isGenerating = ref<boolean>(false)
const generatedCode = ref<string>('')
const isCodeCopied = ref<boolean>(false)
const isExpanded = ref<boolean>(false)
const componentCount = ref<number>(0)
const slices = ref<any[]>([])

const frameworks = [
  { value: 'styled-components', label: 'Styled Components' },
  { value: 'tailwindcss', label: 'Tailwind CSS' }
]

const handleGenerateCode = async () => {
  if (props.selectedLayers.length === 0) {
    props.onError('Please select at least one layer')
    return
  }

  isGenerating.value = true
  try {
    // 先生成切图
    const sliceResult = await generateSlices(props.filePath, {
      format: 'png',
      quality: 90,
      layers: props.selectedLayers
    })

    if (sliceResult.success) {
      slices.value = sliceResult.slices
    }

    // 生成代码
      const result = await generateCode(props.filePath, framework.value, props.selectedLayers, assetPath.value)
      if ('success' in result && result.success) {
        generatedCode.value = result.code
        componentCount.value = result.componentCount || result.elementCount || 0
        isExpanded.value = true
      } else {
        throw new Error('Failed to generate code')
      }
  } catch (error) {
    props.onError((error as Error).message || 'Failed to generate code')
  } finally {
    isGenerating.value = false
  }
}

const handleCopyCode = () => {
  navigator.clipboard.writeText(generatedCode.value)
  isCodeCopied.value = true
  setTimeout(() => isCodeCopied.value = false, 2000)
}

const clearSelection = () => {
  // 触发父组件的清除选择事件
  // 这里需要通过emit通知父组件
}

const downloadAllSlices = () => {
  // 下载所有切图
  slices.value.forEach(slice => {
    const link = document.createElement('a')
    link.href = `http://localhost:3001${slice.path}`
    link.download = slice.name
    link.click()
  })
}
</script>

<style scoped>
/* 组件样式 */
</style>