<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 class="w-5 h-5 text-green-400" />
        </div>
        <h3 class="text-xl font-bold text-white">Comparison Result</h3>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full" :class="differences === 0 ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'">
        <AlertCircle v-if="differences > 0" class="w-4 h-4" />
        <CheckCircle2 v-else class="w-4 h-4" />
        <span class="text-sm font-medium">{{ differences === 0 ? 'Perfect match' : `${differences} differences found` }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="space-y-3">
        <h4 class="text-sm font-medium text-slate-300">Design</h4>
        <div class="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
          <img :src="`http://localhost:3001${designPath}`" alt="Design" class="w-full h-full object-contain" />
          <div class="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-xs text-white">Design</div>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="text-sm font-medium text-slate-300">Screenshot</h4>
        <div class="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
          <img :src="`http://localhost:3001${screenshotPath}`" alt="Screenshot" class="w-full h-full object-contain" />
          <div class="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-xs text-white">Screenshot</div>
        </div>
      </div>

      <div class="space-y-3">
        <h4 class="text-sm font-medium text-slate-300">Differences</h4>
        <div class="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10">
          <img :src="`http://localhost:3001${comparisonPath}`" alt="Differences" class="w-full h-full object-contain" />
          <div class="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 text-xs text-white">Differences</div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button
        @click="$emit('onViewDetails')"
        class="btn-primary text-white font-semibold rounded-xl px-6 py-3 flex items-center gap-2"
      >
        <Eye class="w-5 h-5" />
        View Detailed Report
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Eye } from 'lucide-vue-next'

const props = defineProps<{
  designPath: string
  screenshotPath: string
  comparisonPath: string
  differences: number
}>()

const emit = defineEmits<{
  'onViewDetails': []
}>()
</script>

<style scoped>
/* 组件样式 */
</style>