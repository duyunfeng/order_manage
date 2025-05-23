<template>
  <el-dialog v-model="visible" title="客户详情" width="500px" :close-on-click-modal="false">
    <div v-if="customer">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="客户ID">{{ customer.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ customer.name }}</el-descriptions-item>
        <el-descriptions-item label="联系方式">{{ customer.phone }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ customer.address }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ customer.email }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="customer.status === '正常' ? 'success' : 'info'">
            {{ customer.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{
          formatDate(customer.registeredAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(customer.createdAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          formatDate(customer.updatedAt)
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

const props = defineProps<{ customer: any; modelValue: boolean }>()
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
