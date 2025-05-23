<template>
  <el-dialog v-model="visible" title="用户详情" width="400px" :close-on-click-modal="false">
    <div v-if="user">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="用户ID">{{ user.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ user.username }}</el-descriptions-item>
        <el-descriptions-item label="昵称">{{ user.name }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{ user.role }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ user.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="user.status === 'active' ? 'success' : 'info'">
            {{ user.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(user.createdAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          formatDate(user.updatedAt)
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

const props = defineProps<{ user: any; modelValue: boolean }>()
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
