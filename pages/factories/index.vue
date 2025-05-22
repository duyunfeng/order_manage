<template>
  <el-card class="factory-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>工厂资料</h1>
        <el-button type="primary" @click="openAddDialog">添加工厂</el-button>
      </div>
      <BaseFilter
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable
        :goods="factoriesList"
        :columns="columns"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #actions="{ row, $index }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </BaseTable>
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑工厂' : '添加工厂'"
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
import { ElMessageBox } from 'element-plus'
import { getFactories, addFactory, updateFactory, deleteFactory } from '@/api/factories'
import { useNuxtApp } from '#app'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseActions from '@/components/BaseActions.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'

const statusMap = {
  active: '正常',
  inactive: '停用',
}

const filter = ref({ id: '', name: '', status: '' })
const filterFields = [
  { prop: 'id', label: '工厂ID', placeholder: '请输入工厂ID', type: 'input' },
  { prop: 'name', label: '工厂名称', placeholder: '请输入工厂名称', type: 'input' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: 'active' },
      { label: '停用', value: 'inactive' },
    ],
  },
]

const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  name: '',
  address: '',
  manager: '',
  phone: '',
  status: '正常',
  _id: undefined,
})

const addFields = [
  { prop: 'name', label: '工厂名称', type: 'input', placeholder: '请输入工厂名称', required: true },
  { prop: 'address', label: '地址', type: 'input', placeholder: '请输入地址', required: true },
  { prop: 'manager', label: '负责人', type: 'input', placeholder: '请输入负责人', required: true },
  {
    prop: 'phone',
    label: '联系方式',
    type: 'input',
    placeholder: '请输入联系方式',
    required: true,
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '正常', value: 'active' },
      { label: '停用', value: 'inactive' },
    ],
    required: true,
  },
]

const columns = [
  { prop: 'id', label: '工厂ID', width: 200 },
  { prop: 'name', label: '工厂名称', width: 120 },
  { prop: 'address', label: '地址', width: 200 },
  { prop: 'manager', label: '负责人', width: 120 },
  { prop: 'phone', label: '联系方式', width: 140 },
  { prop: 'status', label: '状态', width: 100, slot: true },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 180,
    slot: true,
    actions: BaseActions,
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

const factoriesList = ref([])
const { $axios } = useNuxtApp()

onMounted(fetchFactories)

async function fetchFactories() {
  // 使用API函数获取工厂列表数据
  const res = await getFactories(filter.value)
  factoriesList.value = res.data.data || res
}

function handleSearch(f: any) {
  fetchFactories().then(() => {
    factoriesList.value = factoriesList.value.filter(item => {
      const matchId = !f.id || item.id.includes(f.id)
      const matchName = !f.name || item.name.includes(f.name)
      const matchStatus = !f.status || item.status === f.status
      return matchId && matchName && matchStatus
    })
  })
}

function handleReset() {
  filter.value = { id: '', name: '', status: '' }
  fetchFactories()
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
    address: '',
    manager: '',
    phone: '',
    status: '正常',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  const submitData = { ...form }
  delete submitData._id
  if (isEdit.value) {
    await updateFactory(form._id, submitData)
  } else {
    await addFactory(submitData)
  }
  fetchFactories()
  showDialog.value = false
  resetDialogForm()
}

function handleEdit(row: any) {
  openEditDialog(row)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除工厂：${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteFactory(row.id).then(() => {
      fetchFactories()
    })
  })
}
</script>

<style scoped>
.factory-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
</style>
