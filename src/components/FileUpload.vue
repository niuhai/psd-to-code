<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-white">Design File</h2>
      <div v-if="isUploaded" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
        <CheckCircle2 class="w-4 h-4" />
        Ready
      </div>
    </div>
    
    <template v-if="!file">
      <div
        class="border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer group"
        :class="{
          'border-blue-500 bg-blue-500/10 scale-[1.02]': isDragging,
          'border-white/15 bg-white/[0.02] hover:border-blue-400/50 hover:bg-white/[0.04]': !isDragging
        }"
        @dragenter.prevent="handleDragEnter"
        @dragleave.prevent="handleDragLeave"
        @dragover.prevent="handleDragOver"
        @drop.prevent="handleDrop"
      >
        <input
          type="file"
          class="hidden"
          id="file-upload"
          accept=".png,.jpg,.jpeg,.psd"
          @change="handleFileInputChange"
        />
        <label for="file-upload" class="cursor-pointer block">
          <div class="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6 transition-all duration-300"
               :class="{
                 'bg-blue-500/20 text-blue-400 scale-110': isDragging,
                 'bg-white/5 text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400': !isDragging
               }">
            <Upload class="w-10 h-10" />
          </div>
          <p class="text-lg font-semibold text-white mb-2">Drop your design here</p>
          <p class="text-slate-400 mb-6">or click to browse</p>
          <div class="flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
            <span class="px-2 py-1 rounded bg-white/5 border border-white/10">PNG</span>
            <span class="px-2 py-1 rounded bg-white/5 border border-white/10">JPG</span>
            <span class="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400">PSD</span>
            <span class="ml-2">up to 500MB</span>
          </div>
          <p class="text-xs text-amber-400/80 mt-3">
            PS: Export PSD files as PNG/JPG for best compatibility
          </p>
        </label>
      </div>
    </template>
    
    <template v-else>
      <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
        <div v-if="showPsdWarning" class="p-4 border-b border-amber-500/30 bg-amber-500/10">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-amber-200">PSD File</h4>
              <p class="text-sm text-amber-300/80 mt-1">For best results, export your PSD as PNG or JPG from your design software before uploading.</p>
            </div>
          </div>
        </div>
        
        <template v-if="previewUrl">
          <div class="relative aspect-video bg-slate-900 overflow-hidden">
            <img 
              :src="previewUrl" 
              alt="Preview" 
              class="w-full h-full object-contain"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <button
              @click="handleRemoveFile"
              class="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-red-500/80 text-white flex items-center justify-center transition-all duration-200 hover:scale-110"
            >
              <X class="w-5 h-5" />
            </button>
            <div class="absolute bottom-4 left-4 right-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <FileImage class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white font-semibold truncate">{{ file.name }}</p>
                  <p class="text-slate-300 text-sm">{{ Math.round(file.size / 1024) }} KB ({{ (file.size / (1024 * 1024)).toFixed(2) }} MB)</p>
                </div>
              </div>
            </div>
          </div>
        </template>
        
        <template v-else-if="!showPsdWarning">
          <div class="p-8 text-center">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <FileImage class="w-8 h-8 text-slate-400" />
            </div>
            <p class="text-white font-semibold">{{ file?.name }}</p>
            <p class="text-slate-400 text-sm mt-1">
              {{ Math.round((file?.size || 0) / 1024) }} KB ({{ ((file?.size || 0) / (1024 * 1024)).toFixed(2) }} MB)
            </p>
          </div>
        </template>
        
        <div class="p-6">
          <template v-if="!isUploaded">
            <button
              @click="handleUpload"
              class="w-full btn-primary text-white font-semibold rounded-xl py-4 flex items-center justify-center gap-2"
              :disabled="isUploading"
            >
              <template v-if="isUploading">
                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </template>
              <template v-else>
                <ArrowRightCircle class="w-5 h-5" />
                Upload File
              </template>
            </button>
          </template>
          <template v-else>
            <div class="flex items-center justify-center gap-2 py-2 text-green-400 font-medium">
              <CheckCircle2 class="w-5 h-5" />
              File uploaded successfully
            </div>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Upload, X, FileImage, CheckCircle2, ArrowRightCircle } from 'lucide-vue-next'
import { uploadFile } from '../utils/api'

const props = defineProps<{
  onFileUpload: (filePath: string, fileName: string) => void
  onError: (error: string) => void
}>()

const isDragging = ref(false)
const file = ref<File | null>(null)
const isUploading = ref(false)
const isUploaded = ref(false)
const previewUrl = ref<string | null>(null)
const showPsdWarning = ref(false)

const handleDragEnter = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDragOver = () => {
  // 阻止默认行为
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  
  if (e.dataTransfer?.files.length) {
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }
}

const handleFileSelect = (selectedFile: File) => {
  const fileName = selectedFile.name.toLowerCase()
  const isValidExtension = fileName.endsWith('.png') || 
                         fileName.endsWith('.jpg') || 
                         fileName.endsWith('.jpeg') || 
                         fileName.endsWith('.psd')
                          
  if (!isValidExtension) {
    props.onError('Invalid file type. Only PNG, JPG, JPEG, and PSD files are allowed.')
    return
  }
  
  const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
  console.log('File size:', selectedFile.size, 'bytes')
  console.log('Max size:', MAX_FILE_SIZE, 'bytes')
  console.log('File size in MB:', (selectedFile.size / (1024 * 1024)).toFixed(2))
  
  if (selectedFile.size > MAX_FILE_SIZE) {
    props.onError('File size exceeds 500MB limit.')
    return
  }
  
  // Check if it's a PSD file
  const isPsd = fileName.endsWith('.psd')
  showPsdWarning.value = isPsd
  
  file.value = selectedFile
  isUploaded.value = false
  
  // Don't try to preview PSD files in browser
  if (!isPsd) {
    previewUrl.value = URL.createObjectURL(selectedFile)
  } else {
    previewUrl.value = null
  }
}

const handleFileInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length) {
    handleFileSelect(target.files[0])
  }
}

const handleUpload = async () => {
  if (!file.value) return
  
  isUploading.value = true
  try {
    const result = await uploadFile(file.value)
    if (result.success) {
      isUploaded.value = true
      props.onFileUpload(result.filePath, result.fileName)
    } else {
      props.onError('Failed to upload file.')
    }
  } catch {
    props.onError('An error occurred while uploading the file.')
  } finally {
    isUploading.value = false
  }
}

const handleRemoveFile = () => {
  file.value = null
  isUploaded.value = false
  previewUrl.value = null
  showPsdWarning.value = false
}
</script>

<style scoped>
/* 组件样式 */
</style>