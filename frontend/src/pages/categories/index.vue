<template>
  <el-card class="category-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>类目管理</h1>
        <el-button type="primary" @click="openAddDialog">添加类目</el-button>
      </div>
      <BaseTable :tableData="categoriesList" :columns="columns" :loading="isLoading" />
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑类目' : '添加类目'"
        :fields="addFields"
        :formData="dialogForm"
        @submit="handleDialogSubmit"
        @update:modelValue="
          val => {
            if (!val) resetDialogForm()
          }
        "
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/api/categories'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'

const categoriesList = ref([])
const isLoading = ref(false)
const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  name: '',
  description: '',
  _id: undefined,
})

const addFields = [
  { prop: 'name', label: '类目名称', type: 'input', placeholder: '请输入类目名称', required: true },
  { prop: 'description', label: '描述', type: 'input', placeholder: '请输入描述', required: false },
]

const columns = [
  { prop: 'name', label: '类目名称', width: 200 },
  { prop: 'description', label: '描述', width: 300 },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 120,
    slot: true,
    getActions: (row, index) => [
      {
        label: '编辑',
        type: 'primary',
        onClick: row => handleEdit(row),
      },
      {
        label: '删除',
        type: 'danger',
        onClick: row => handleDelete(row),
      },
    ],
  },
]

onMounted(fetchCategoriesList)

async function fetchCategoriesList() {
  isLoading.value = true
  try {
    const res = await getCategories()
    categoriesList.value = res.data
  } catch (e) {
    categoriesList.value = []
  } finally {
    isLoading.value = false
  }
}

function openAddDialog() {
  isEdit.value = false
  resetDialogForm()
  showDialog.value = true
}

function openEditDialog(row: any) {
  isEdit.value = true
  dialogForm.value = { ...row, _id: row.id }
  showDialog.value = true
}

function resetDialogForm() {
  dialogForm.value = {
    name: '',
    description: '',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  const submitData = { ...form }
  delete submitData._id
  try {
    if (isEdit.value) {
      await updateCategory(form._id, submitData)
      ElMessage.success('类目编辑成功')
    } else {
      await addCategory(submitData)
      ElMessage.success('类目添加成功')
    }
    fetchCategoriesList()
    showDialog.value = false
    resetDialogForm()
  } catch (e) {
    ElMessage.error('操作失败，请重试')
  }
}

function handleEdit(row: any) {
  openEditDialog(row)
}

async function handleDelete(row: any) {
  try {
    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    fetchCategoriesList()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}
</script>

<style scoped>
.category-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
</style>
