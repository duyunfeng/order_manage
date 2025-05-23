<template>
  <el-dialog v-model="visible" title="订单详情" width="600px" :close-on-click-modal="false">
    <div v-if="order">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="订单ID">{{ order.id }}</el-descriptions-item>
        <el-descriptions-item label="客户">{{ order.customer }}</el-descriptions-item>
        <el-descriptions-item label="商品列表">
          <div>
            <span v-for="item in order.goodsList" :key="item.name" style="margin-right: 8px">
              {{ item.name }} x{{ item.quantity }}
            </span>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="金额">{{ order.amount }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ order.status }}</el-descriptions-item>
        <el-descriptions-item label="船期">{{ order.shippingDate }}</el-descriptions-item>
        <el-descriptions-item label="合同文件">
          <el-link v-if="order.contractUrl" :href="order.contractUrl" target="_blank"
            >下载合同</el-link
          >
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(order.createdAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          formatDate(order.updatedAt)
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

const props = defineProps<{ order: any; modelValue: boolean }>()
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
