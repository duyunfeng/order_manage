<template>
  <div class="base-actions">
    <template v-for="(btn, idx) in visibleBtns" :key="btn.label">
      <el-button
        link
        size="small"
        :disabled="btn.disabled"
        :class="['action-link', btn.type]"
        @click="() => btn.onClick(row, index)"
      >
        {{ btn.label }}
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

/**
 * 通用操作列按钮组件
 * @prop row 当前行数据
 * @prop index 当前行索引
 * @prop actions 操作按钮数组 [{ label, type, onClick, disabled, dropdown }]
 *   - dropdown: true 表示放入更多下拉
 */
const props = defineProps<{
  row: any
  index: number
  actions: Array<{
    label: string
    type?: string
    onClick: (row: any, index: number) => void
    disabled?: boolean
    dropdown?: boolean
  }>
}>()

const visibleBtns = computed(() => props.actions)
</script>

<style scoped lang="scss">
.base-actions {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  .action-link {
    display: inline-flex;
    align-items: center;
    margin-right: 6px;
    padding: 0 4px;
    color: #409eff;
    font-size: 14px;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    text-decoration: none !important;
    &.primary {
      color: #409eff;
    }
    &.danger {
      color: #f56c6c;
    }
    &.success {
      color: #67c23a;
    }
    &.warning {
      color: #e6a23c;
    }
    &:hover {
      color: #66b1ff;
      text-decoration: none !important;
    }
  }
  .action-link:last-of-type {
    margin-right: 0;
  }
  .dropdown {
    margin-left: 12px;
    .more-link {
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      &:hover {
        text-decoration: none !important;
        color: #66b1ff;
      }
    }
  }
  .dropdown::before,
  .dropdown::after {
    content: none !important;
  }
}
</style>
