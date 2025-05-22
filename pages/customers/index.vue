<template>
  <el-card class="customer-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>客户管理</h1>
        <el-button type="primary" @click="openAddDialog">添加客户</el-button>
      </div>
      <BaseFilter
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable
        :goods="customersList"
        :columns="columns"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #actions="{ row, $index }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === '正常' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </BaseTable>
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑客户' : '添加客户'"
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
import { useNuxtApp } from '#app'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import { ElMessageBox } from 'element-plus'
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/api/customers'

const filter = ref({ id: '', name: '', status: '', registeredAt: '' })
const filterFields = [
  { prop: 'id', label: '客户ID', placeholder: '请输入客户ID', type: 'input' },
  { prop: 'name', label: '姓名', placeholder: '请输入姓名', type: 'input' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '正常', value: '正常' },
      { label: '禁用', value: '禁用' },
    ],
  },
  {
    prop: 'registeredAt',
    label: '注册时间',
    type: 'date',
    placeholder: '请选择注册时间',
    valueFormat: 'YYYY-MM-DD',
  },
]

const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  name: '',
  phone: '',
  address: '',
  status: '正常',
  registeredAt: '',
  _id: undefined,
})

const addFields = [
  {
    prop: 'name',
    label: '姓名',
    type: 'input',
    placeholder: '请输入姓名',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'phone',
    label: '联系方式',
    type: 'input',
    placeholder: '请输入手机号',
    rules: [{ required: true, message: '必填' }],
  },
  { prop: 'address', label: '地址', type: 'input', placeholder: '请输入地址' },
  { prop: 'registeredAt', label: '注册时间', type: 'date', placeholder: '请选择注册时间' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '正常', value: '正常' },
      { label: '禁用', value: '禁用' },
    ],
    rules: [{ required: true, message: '必填' }],
  },
]

const columns = [
  { prop: 'id', label: '客户ID', width: 200 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'phone', label: '联系方式', width: 140 },
  { prop: 'address', label: '地址', width: 200 },
  { prop: 'status', label: '状态', width: 100, slot: true },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 180,
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

const customersList = ref([])
const { $axios } = useNuxtApp()

onMounted(fetchCustomers)

async function fetchCustomers() {
  const res = await getCustomers(filter.value)
  customersList.value = res.data.data || res
}

function handleSearch(f: any) {
  fetchCustomers().then(() => {
    customersList.value = customersList.value.filter(item => {
      const matchId = !f.id || item.id.includes(f.id)
      const matchName = !f.name || item.name.includes(f.name)
      const matchStatus = !f.status || item.status === f.status
      const matchDate = !f.registeredAt || item.registeredAt.startsWith(f.registeredAt)
      return matchId && matchName && matchStatus && matchDate
    })
  })
}

function handleReset() {
  filter.value = { id: '', name: '', status: '', registeredAt: '' }
  fetchCustomers()
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
    phone: '',
    address: '',
    status: '正常',
    registeredAt: '',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  const submitData = { ...form }
  delete submitData._id
  if (isEdit.value) {
    await updateCustomer(form._id, submitData)
  } else {
    await addCustomer(submitData)
  }
  fetchCustomers()
  showDialog.value = false
  resetDialogForm()
}

function handleEdit(row: any) {
  openEditDialog(row)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除客户：${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteCustomer(row.id).then(() => {
      fetchCustomers()
    })
  })
}
</script>

<style scoped>
.customer-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
</style>
