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

        <button
          @click="handleGenerateCode"
          :disabled="isGenerating"
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Code, Copy, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { generateCode, parsePsd } from '../utils/api'

const props = defineProps<{
  filePath: string
  fileName: string
  onError: (error: string) => void
}>()

const framework = ref<string>('styled-components')
const isGenerating = ref<boolean>(false)
const generatedCode = ref<string>('')
const isCodeCopied = ref<boolean>(false)
const isExpanded = ref<boolean>(false)
const componentCount = ref<number>(0)

const frameworks = [
  { value: 'styled-components', label: 'Styled Components' },
  { value: 'tailwindcss', label: 'Tailwind CSS' }
]

const handleGenerateCode = async () => {
  isGenerating.value = true
  try {
    // 先解析PSD文件
    const parseResult = await parsePsd(props.filePath)
    if (!parseResult.success) {
      throw new Error('Failed to parse PSD file')
    }

    // 生成代码
    const result = await generateCode(props.filePath, framework.value)
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
</script>

<style scoped>
/* 组件样式 */
</style>