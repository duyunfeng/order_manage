<template>
  <el-dialog v-model="visible" title="商品详情" width="500px" :close-on-click-modal="false">
    <div v-if="goods">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="商品ID">{{ goods.id }}</el-descriptions-item>
        <el-descriptions-item label="名称">{{ goods.name }}</el-descriptions-item>
        <el-descriptions-item label="编码">{{ goods.code }}</el-descriptions-item>
        <el-descriptions-item label="分类">{{ goods.category }}</el-descriptions-item>
        <el-descriptions-item label="价格">{{ goods.price }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="goods.status === 'on' ? 'success' : 'info'">
            {{ goods.status === 'on' ? '上架' : '下架' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="规格">{{ formatSpec(goods.spec) }}</el-descriptions-item>
        <el-descriptions-item label="图片">
          <img
            v-if="goods.image"
            :src="goods.image"
            style="
              width: 80px;
              height: 80px;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid #eee;
            "
          />
        </el-descriptions-item>
        <el-descriptions-item label="工厂">
          <el-tag v-for="f in goods.factories" :key="f.id" style="margin-right: 4px">{{
            f.name
          }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          formatDate(goods.createdAt)
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          formatDate(goods.updatedAt)
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

const props = defineProps<{ goods: any; modelValue: boolean }>()
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
function formatSpec(spec: any) {
  if (!spec) return ''
  try {
    const s = typeof spec === 'string' ? JSON.parse(spec) : spec
    return `长*宽*高: ${s.length || ''}*${s.width || ''}*${s.height || ''}${
      (s.unit || 'cm') + '³'
    } 颜色: ${s.color || ''}`
  } catch {
    return spec
  }
}
defineExpose({ visible })
</script>
