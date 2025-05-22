<template>
  <teleport to="body">
    <el-image-viewer
      v-if="visible"
      :url-list="urlList"
      :z-index="3000"
      :initial-index="initialIndex"
      :hide-on-click-modal="true"
      @close="close"
    />
  </teleport>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import ElImageViewer from 'element-plus/es/components/image-viewer/index'

const { urlList, initialIndex, visible } = defineProps<{
  urlList: string[]
  initialIndex?: number
  visible: boolean
}>()
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
