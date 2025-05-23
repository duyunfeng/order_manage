<template>
  <el-dialog v-model="visible" title="工厂详情" width="500px" :close-on-click-modal="false">
    <div v-if="factory">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="工厂ID">{{ factory.id }}</el-descriptions-item>
        <el-descriptions-item label="工厂名称">{{ factory.name }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ factory.manager }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ factory.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ factory.address }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ factory.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="factory.status === 'active' ? 'success' : 'info'">
            {{ factory.status === 'active' ? '正常' : '停用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(factory.createdAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          formatDate(factory.updatedAt)
        }}</el-descriptions-item>
      </el-descriptions>
    </div>
    <template #footer>
      <el-button @click="visible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineExpose } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{ factory: any; modelValue: boolean }>()
const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  v => (visible.value = v),
)
watch(visible, v => emit('update:modelValue', v))

const emit = defineEmits(['update:modelValue'])

function formatDate(val: string) {
  if (!val) return ''
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}
defineExpose({ visible })
</script>
