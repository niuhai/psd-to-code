<template>
  <div class="relative z-10 min-h-screen">
    <div class="container mx-auto px-4 py-8 md:py-12">
      <div class="flex items-center gap-4 mb-8">
        <button
          @click="router.back()"
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Home
        </button>
        <h1 class="text-2xl md:text-3xl font-bold text-white">Detailed Comparison Report</h1>
      </div>

      <div v-if="!designPath" class="glass-card rounded-3xl p-12 text-center">
        <FileQuestion class="w-20 h-20 mx-auto mb-6 text-slate-500" />
        <h3 class="text-xl font-bold text-white mb-2">No comparison data found</h3>
        <p class="text-slate-400 mb-8">Please run a comparison first</p>
        <button
          @click="router.push('/')"
          class="btn-primary text-white font-semibold rounded-xl px-6 py-3"
        >
          Go Back
        </button>
      </div>

      <template v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div class="glass-card rounded-3xl p-6 md:p-8">
            <h3 class="text-xl font-bold text-white mb-6">Side by Side Comparison</h3>
            <div class="space-y-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-medium text-slate-300 mb-3">Design</h4>
                  <div class="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
                    <img :src="`http://localhost:3001${designPath}`" alt="Design" class="w-full h-full object-contain" />
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-slate-300 mb-3">Screenshot</h4>
                  <div class="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
                    <img :src="`http://localhost:3001${screenshotPath}`" alt="Screenshot" class="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-slate-300 mb-3">Differences</h4>
                <div class="aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
                  <img :src="`http://localhost:3001${comparisonPath}`" alt="Differences" class="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          <div class="glass-card rounded-3xl p-6 md:p-8">
            <h3 class="text-xl font-bold text-white mb-6">Difference Analysis</h3>
            <div class="space-y-6">
              <div class="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <span class="text-slate-300">Total Differences</span>
                <span class="text-xl font-bold text-amber-400">{{ differenceData?.total || 0 }}</span>
              </div>
              
              <div v-if="differenceData?.summary" class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span class="text-slate-300">Layout Issues</span>
                  <span class="font-medium text-amber-400">{{ differenceData.summary.layoutIssues || 0 }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span class="text-slate-300">Content Issues</span>
                  <span class="font-medium text-amber-400">{{ differenceData.summary.contentIssues || 0 }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span class="text-slate-300">Visual Issues</span>
                  <span class="font-medium text-amber-400">{{ differenceData.summary.visualIssues || 0 }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span class="text-slate-300">Match Score</span>
                  <span class="font-medium text-green-400">{{ differenceData.summary.score || 0 }}%</span>
                </div>
              </div>

              <div v-if="differenceData?.details && differenceData.details.length > 0" class="mt-6">
                <h4 class="text-sm font-medium text-slate-300 mb-3">Detailed Issues</h4>
                <div class="space-y-3 max-h-96 overflow-y-auto">
                  <div v-for="(detail, index) in differenceData.details" :key="index" class="p-4 rounded-lg bg-white/5">
                    <div class="flex items-center justify-between mb-2">
                      <span class="font-medium text-white">Issue {{ index + 1 }}</span>
                      <span class="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">{{ detail.type || 'Unknown' }}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-sm text-slate-400">
                      <div>Position: {{ detail.x }}, {{ detail.y }}</div>
                      <div>Size: {{ detail.width }}x{{ detail.height }}</div>
                    </div>
                    <p v-if="detail.description" class="mt-2 text-sm text-slate-300">{{ detail.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-3xl p-6 md:p-8">
          <h3 class="text-xl font-bold text-white mb-6">Measurement Tools</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 rounded-xl bg-white/5">
              <h4 class="text-sm font-medium text-slate-300 mb-2">Design Dimensions</h4>
              <div class="text-2xl font-bold text-white">1920 × 1080</div>
              <div class="text-xs text-slate-400 mt-1">Full HD</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5">
              <h4 class="text-sm font-medium text-slate-300 mb-2">Screenshot Dimensions</h4>
              <div class="text-2xl font-bold text-white">1920 × 1080</div>
              <div class="text-xs text-slate-400 mt-1">Full HD</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5">
              <h4 class="text-sm font-medium text-slate-300 mb-2">Difference Area</h4>
              <div class="text-2xl font-bold text-white">{{ calculateDifferenceArea() }} px²</div>
              <div class="text-xs text-slate-400 mt-1">{{ calculateDifferencePercentage() }}% of total area</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, FileQuestion } from 'lucide-vue-next'
import type { Differences } from '../utils/api'

const router = useRouter()
const route = useRoute()

const designPath = ref<string>('')
const screenshotPath = ref<string>('')
const comparisonPath = ref<string>('')
const differenceData = ref<Differences | null>(null)

onMounted(() => {
  // 从路由参数获取数据
  designPath.value = route.query.designPath as string || ''
  screenshotPath.value = route.query.screenshotPath as string || ''
  comparisonPath.value = route.query.comparisonPath as string || ''
  
  if (route.query.differenceData) {
    try {
      differenceData.value = JSON.parse(route.query.differenceData as string)
    } catch (error) {
      // Error parsing difference data, will use null instead
    }
  }
})

const calculateDifferenceArea = () => {
  if (!differenceData.value?.details) return 0
  
  return differenceData.value.details.reduce((total, detail) => {
    return total + (detail.width * detail.height)
  }, 0)
}

const calculateDifferencePercentage = () => {
  const totalArea = 1920 * 1080 // 假设设计尺寸为1920x1080
  const differenceArea = calculateDifferenceArea()
  return ((differenceArea / totalArea) * 100).toFixed(2)
}
</script>

<style scoped>
/* 页面样式 */
</style>