<template>
  <div class="base-table-wrapper">
    <el-table
      :data="tableData"
      style="width: 100%"
      class="base-table"
      :border="true"
      :fit="true"
      :scrollbar-always-on="true"
      :max-height="null"
      :show-overflow-tooltip="true"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        :fixed="col.prop === 'actions' ? 'right' : undefined"
      >
        <template #default="scope">
          <template v-if="col.slot && col.prop !== 'actions'">
            <slot :name="col.prop" v-bind="scope" />
          </template>
          <template v-else-if="['createdAt', 'updatedAt'].includes(col.prop)">
            <span>{{ dayjs(scope.row[col.prop]).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
          <template v-else-if="col.prop === 'actions' && typeof col.getActions === 'function'">
            <div style="display: flex; gap: 4px">
              <el-button
                v-for="(action, idx) in col.getActions(scope.row, scope.$index)"
                link
                :key="idx"
                :type="action.type || 'default'"
                @click="action.onClick(scope.row, scope.$index)"
                v-bind="action.buttonProps || {}"
              >
                {{ action.label }}
              </el-button>
            </div>
          </template>
          <template v-else>
            <span>{{ scope.row[col.prop] }}</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pagination && pagination.total > 0"
      style="margin: 16px 0 0; text-align: right"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.page"
      :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'

/**
 * 通用表格组件
 * @prop tableData 表格数据
 * @prop columns 表格列配置
 * @prop pagination 分页配置
 * @emits factory-click 工厂跳转
 * @emits update:page 更新页码
 * @emits update:pageSize 更新页大小
 */
const props = defineProps({
  tableData: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  pagination: { type: Object, default: null },
})
const emit = defineEmits(['factory-click', 'update:page', 'update:pageSize'])

function onFactoryClick(factory: any) {
  emit('factory-click', factory)
}
function onPageChange(page: number) {
  emit('update:page', page)
}
function onSizeChange(size: number) {
  emit('update:pageSize', size)
}
function formatDate(val: string) {
  if (!val) return ''
  return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
}
</script>

<style scoped lang="scss">
.base-table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible !important;
  background: transparent;
  border-radius: 16px;
  box-shadow: none;
  padding: 0;
  margin-bottom: 0;
}
.base-table {
  .factory-tag {
    cursor: pointer;
    user-select: none;
  }
}

.main-content {
  flex: 1;
  min-height: 0;
  padding: 24px;
  background: #f0f2f5;
  overflow-y: visible !important;
}

.el-table__body-wrapper {
  overflow-y: visible !important;
}
.el-scrollbar__bar.is-vertical {
  display: none !important;
}
:deep(.el-table__row) {
  td {
    height: 100px !important;
  }
}
</style>
