<template>
  <el-card>
    <h2>菜单设置</h2>
    <el-table :data="routes" style="width: 100%" row-key="id">
      <el-table-column prop="title" label="标题">
        <template #default="{ row }">
          <el-input v-model="row.title" @change="updateRoute(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="icon" label="图标" />
      <el-table-column prop="index" label="排序">
        <template #default="{ row }">
          <el-input-number v-model="row.index" @change="updateRoute(row)" :min="0" />
        </template>
      </el-table-column>
      <el-table-column prop="show" label="显示">
        <template #default="{ row }">
          <el-switch v-model="row.show" @change="updateRoute(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="deleteRoute(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRoutes, updateRoute, deleteRoute } from '@/api/routes'
import { ElMessage } from 'element-plus'

const routes = ref([])

async function fetchRoutes() {
  const res = await getRoutes()
  routes.value = res.data.data
}

async function updateRouteItem(row: any) {
  await updateRoute(row.id, row)
  ElMessage.success('更新成功')
}

async function deleteRouteItem(id: string) {
  await deleteRoute(id)
  ElMessage.success('删除成功')
  fetchRoutes()
}

onMounted(fetchRoutes)

// 兼容模板调用
const updateRoute = updateRouteItem
const deleteRoute = deleteRouteItem
</script>
