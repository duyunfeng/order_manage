<template>
  <div>
    <el-upload
      :auto-upload="false"
      :show-file-list="false"
      :before-upload="handleBeforeUpload"
      :on-change="handleChange"
      accept="image/*"
    >
      <el-button type="primary">选择图片</el-button>
    </el-upload>
    <span v-if="imageUrl" style="margin-left: 12px; color: #67c23a">已选择</span>
    <img
      v-if="imageUrl"
      :src="imageUrl"
      style="max-width: 60px; max-height: 60px; margin-left: 12px; vertical-align: middle"
    />
    <el-button
      v-if="imageUrl"
      type="danger"
      size="small"
      @click="clearImage"
      style="margin-left: 8px"
      >移除</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue', 'file-change'])

const imageUrl = ref(props.modelValue || '')
const fileRaw = ref<File | null>(null)

watch(
  () => props.modelValue,
  val => {
    imageUrl.value = val
  },
)

function handleBeforeUpload(file: File) {
  // 阻止自动上传
  return false
}

function handleChange(file: any) {
  fileRaw.value = file.raw
  const reader = new FileReader()
  reader.onload = e => {
    imageUrl.value = e.target?.result as string
    emit('update:modelValue', imageUrl.value)
    emit('file-change', fileRaw.value)
  }
  reader.readAsDataURL(file.raw)
}

function clearImage() {
  imageUrl.value = ''
  fileRaw.value = null
  emit('update:modelValue', '')
  emit('file-change', null)
}

defineExpose({ fileRaw })
</script>
