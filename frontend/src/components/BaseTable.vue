<template>
  <div class="base-table-wrapper">
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-style="{ height: '80px' }"
      style="width: 100%"
      class="base-table"
      :border="true"
      :fit="true"
      :scrollbar-always-on="true"
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
            <span>{{
              scope.row[col.prop] ? dayjs(scope.row[col.prop]).format('YYYY-MM-DD HH:mm:ss') : '-'
            }}</span>
          </template>
          <template v-else-if="col.prop === 'actions' && typeof col.getActions === 'function'">
            <div style="display: flex; align-items: center; gap: 4px; height: 100%">
              <el-button
                v-for="(action, idx) in col.getActions(scope.row, scope.$index)"
                link
                :key="idx"
                :type="action.type || 'primary'"
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
      style="margin: 16px 0 0; text-align: right; float: right"
      background
      layout="total, prev, pager, next, jumper"
      :hide-on-single-page="true"
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
import { defineProps, defineEmits, PropType } from 'vue'
import dayjs from 'dayjs'

interface ActionItem {
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
  onClick: (row: any, index: number) => void
  buttonProps?: Record<string, any>
}

interface TableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  slot?: boolean
  fixed?: 'left' | 'right' | boolean
  getActions?: (row: any, index: number) => ActionItem[]
  // Element Plus el-table-column supports more properties, add them as needed
}

interface PaginationConfig {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
}

const props = defineProps({
  tableData: { type: Array as PropType<any[]>, default: () => [] },
  columns: { type: Array as PropType<TableColumn[]>, default: () => [] },
  pagination: { type: Object as PropType<PaginationConfig | null>, default: null },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:page', 'update:pageSize'])

function onPageChange(page: number) {
  emit('update:page', page)
}
function onSizeChange(size: number) {
  emit('update:pageSize', size)
}
</script>

<style scoped lang="scss">
.base-table-wrapper {
  width: 100%;
  overflow-x: auto; /* Keep horizontal scroll if content overflows */
  background: transparent;
  border-radius: 16px;
  // box-shadow: none; // Retained from original
  // padding: 0; // Retained from original
  // margin-bottom: 0; // Retained from original
}

.base-table {
  .factory-tag {
    cursor: pointer;
    user-select: none;
  }
}

// Removed problematic global style overrides for el-table internals
// :deep(.el-table__row) td { height: 100px !important; }
</style>
