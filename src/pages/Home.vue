<template>
  <div class="relative z-10 min-h-screen">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <header class="mb-12 text-center animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
          <Zap class="w-4 h-4 text-amber-400" />
          <span class="text-xs font-medium text-slate-300 uppercase tracking-wider">New</span>
          <span class="text-xs text-slate-400">Pixel-perfect comparison</span>
        </div>
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Layers class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Design<span class="text-blue-400">Match</span>
          </h1>
        </div>
        <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Bridge the gap between design and implementation. Compare your PSDs & images with live mobile pages instantly.
        </p>
      </header>

      <div v-if="error" class="mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-1">
        <div class="glass-card rounded-2xl p-4 border-red-500/30 bg-red-500/5">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-red-200">Error</h4>
              <p class="text-sm text-red-300/80 mt-1">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div class="glass-card rounded-3xl p-6 md:p-8 animate-fade-in-up animate-delay-1">
          <FileUpload @onFileUpload="handleFileUpload" @onError="handleError" />
        </div>

        <div class="glass-card rounded-3xl p-6 md:p-8 animate-fade-in-up animate-delay-2">
          <ComparisonSettings
            :deviceType="deviceType"
            @update:deviceType="deviceType = $event"
            :screenSize="screenSize"
            @update:screenSize="screenSize = $event"
            :sensitivity="sensitivity"
            @update:sensitivity="sensitivity = $event"
            :url="url"
            @update:url="url = $event"
          />

          <button
            @click="handleCompare"
            class="mt-8 w-full px-6 py-4 btn-primary text-white font-semibold rounded-2xl text-lg flex items-center justify-center gap-3"
            :disabled="!designPath || !url || isProcessing"
          >
            <template v-if="isProcessing">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </template>
            <template v-else>
              <CheckCircle2 class="w-5 h-5" />
              Start Comparison
            </template>
          </button>
        </div>
      </div>

      <div v-if="designPath" class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto animate-fade-in-up">
        <div class="glass-card rounded-3xl p-6 md:p-8">
          <CodeGenerator
            :filePath="designPath"
            :fileName="fileName"
            @onError="handleError"
          />
        </div>
        <div class="glass-card rounded-3xl p-6 md:p-8">
          <SlicingTool
            :filePath="designPath"
            :fileName="fileName"
            @onError="handleError"
          />
        </div>
      </div>

      <div v-if="comparisonPath" class="mt-10 max-w-7xl mx-auto animate-fade-in-up">
        <div class="glass-card rounded-3xl p-6 md:p-8">
          <ResultDisplay
            :designPath="designPath"
            :screenshotPath="screenshotPath"
            :comparisonPath="comparisonPath"
            :differences="differences"
            @onViewDetails="handleViewDetails"
          />
        </div>
      </div>

      <footer class="mt-16 text-center animate-fade-in-up animate-delay-3">
        <p class="text-slate-500 text-sm">
          © 2026 DesignMatch. Crafted with precision.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FileUpload from '../components/FileUpload.vue'
import ComparisonSettings from '../components/ComparisonSettings.vue'
import ResultDisplay from '../components/ResultDisplay.vue'
import CodeGenerator from '../components/CodeGenerator.vue'
import SlicingTool from '../components/SlicingTool.vue'
import { captureScreenshot, compareImages, type Differences } from '../utils/api'
import { Layers, Zap, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const designPath = ref<string>('')
const fileName = ref<string>('')
const url = ref<string>('')
const deviceType = ref<string>('iphone')
const screenSize = ref<string>('medium')
const sensitivity = ref<number>(50)
const screenshotPath = ref<string>('')
const comparisonPath = ref<string>('')
const differences = ref<number>(0)
const differenceData = ref<Differences | null>(null)
const isProcessing = ref<boolean>(false)
const error = ref<string>('')

const handleFileUpload = (filePath: string, uploadedFileName: string) => {
  designPath.value = filePath
  fileName.value = uploadedFileName
  error.value = ''
}

const handleError = (errorMessage: string) => {
  error.value = errorMessage
}

const handleCompare = async () => {
  if (!designPath.value || !url.value) {
    error.value = 'Please upload a design file and enter a URL'
    return
  }

  isProcessing.value = true
  error.value = ''

  try {
    const screenshotResult = await captureScreenshot(url.value, deviceType.value, screenSize.value)
    if (!screenshotResult.success) {
      throw new Error('Failed to capture screenshot')
    }
    screenshotPath.value = screenshotResult.screenshotPath

    const compareResult = await compareImages(designPath.value, screenshotResult.screenshotPath, sensitivity.value)
    if (!compareResult.success) {
      throw new Error('Failed to compare images')
    }
    comparisonPath.value = compareResult.comparisonPath
    differences.value = compareResult.differences.total
    differenceData.value = compareResult.differences
  } catch (err) {
    error.value = 'An error occurred during comparison. Please try again.'
    console.error(err)
  } finally {
    isProcessing.value = false
  }
}

const handleViewDetails = () => {
  router.push({
    path: '/result',
    query: {
      designPath: designPath.value,
      screenshotPath: screenshotPath.value,
      comparisonPath: comparisonPath.value,
      differenceData: JSON.stringify(differenceData.value)
    }
  })
}
</script>

<style scoped>
/* 页面样式 */
</style>