<template>
  <div class="space-y-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
        <Settings class="w-5 h-5 text-purple-400" />
      </div>
      <h3 class="text-xl font-bold text-white">Comparison Settings</h3>
    </div>

    <div class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-3">Website URL</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            <Globe class="w-4 h-4" />
          </span>
          <input
            type="url"
            v-model="localUrl"
            @input="$emit('update:url', localUrl)"
            placeholder="Enter website URL (e.g., https://example.com)"
            class="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">Device Type</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="device in devices"
              :key="device.value"
              @click="localDeviceType = device.value; $emit('update:deviceType', device.value)"
              class="px-4 py-3 rounded-xl transition-all flex items-center gap-3"
              :class="localDeviceType === device.value ? 'bg-purple-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'"
            >
              <component :is="device.icon" class="w-5 h-5" />
              <span>{{ device.label }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-3">Screen Size</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="size in screenSizes"
              :key="size.value"
              @click="localScreenSize = size.value; $emit('update:screenSize', size.value)"
              class="px-3 py-2 rounded-xl transition-all text-center"
              :class="localScreenSize === size.value ? 'bg-purple-500 text-white' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300'"
            >
              {{ size.label }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="text-sm font-medium text-slate-300">Sensitivity: {{ localSensitivity }}%</label>
          <span class="text-xs text-slate-400">
            {{ localSensitivity < 33 ? 'Low' : localSensitivity < 66 ? 'Medium' : 'High' }}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          v-model.number="localSensitivity"
          @input="$emit('update:sensitivity', localSensitivity)"
          class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
          :style="{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${localSensitivity}%, rgba(255,255,255,0.1) ${localSensitivity}%, rgba(255,255,255,0.1) 100%)`
          }"
        />
        <div class="flex justify-between text-xs text-slate-500 mt-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Settings, Globe, Smartphone, Monitor, LayoutGrid, LayoutGrid2, LayoutGrid3 } from 'lucide-vue-next'

const props = defineProps<{
  deviceType: string
  screenSize: string
  sensitivity: number
  url: string
}>()

const emit = defineEmits<{
  'update:deviceType': [value: string]
  'update:screenSize': [value: string]
  'update:sensitivity': [value: number]
  'update:url': [value: string]
}>()

const localDeviceType = ref(props.deviceType)
const localScreenSize = ref(props.screenSize)
const localSensitivity = ref(props.sensitivity)
const localUrl = ref(props.url)

// 监听props变化
watch(() => props.deviceType, (newValue) => {
  localDeviceType.value = newValue
})

watch(() => props.screenSize, (newValue) => {
  localScreenSize.value = newValue
})

watch(() => props.sensitivity, (newValue) => {
  localSensitivity.value = newValue
})

watch(() => props.url, (newValue) => {
  localUrl.value = newValue
})

const devices = [
  {
    value: 'iphone',
    label: 'Mobile',
    icon: Smartphone
  },
  {
    value: 'desktop',
    label: 'Desktop',
    icon: Monitor
  }
]

const screenSizes = [
  {
    value: 'small',
    label: 'Small'
  },
  {
    value: 'medium',
    label: 'Medium'
  },
  {
    value: 'large',
    label: 'Large'
  }
]
</script>

<style scoped>
/* 组件样式 */
</style>