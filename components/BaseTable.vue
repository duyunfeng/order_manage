<template>
  <div class="base-table-wrapper">
    <el-table
      :data="goods"
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
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import dayjs from 'dayjs'

/**
 * 通用表格组件
 * @prop goods 表格数据
 * @prop columns 表格列配置
 * @emits factory-click 工厂跳转
 */
const { goods, columns } = defineProps<{ goods: any[]; columns: any[] }>()
const emit = defineEmits(['factory-click'])

function onFactoryClick(factory: any) {
  emit('factory-click', factory)
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
:global(html.dark) .base-table-wrapper {
  background: transparent;
  box-shadow: none;
}
:global(html.dark) .el-table {
  background: transparent !important;
  color: #e0e6ed !important;
  border-color: #23272e !important;
}
:global(html.dark) .el-table th,
:global(html.dark) .el-table td {
  background: transparent !important;
  color: #e0e6ed !important;
  border-color: #23272e !important;
}
:global(html.dark) .el-table__row {
  background: transparent !important;
}
:global(html.dark) .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #23272e !important;
}
:global(html.dark) .el-table__body tr:hover > td {
  background: #23272e !important;
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
