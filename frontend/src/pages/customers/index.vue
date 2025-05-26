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
        :tableData="customersList"
        :columns="columns"
        :loading="isLoading"
        :pagination="{ page: page, pageSize: pageSize, total: total }"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
        @edit="handleEdit"
        @delete="handleDelete"
      >
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ statusMap[row.status] }}
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
      <CustomerDetail v-if="showDetail" v-model="showDetail" :customer="detailData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import CustomerDetail from '@/components/CustomerDetail.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from '@/api/customers'

const statusMap = {
  active: '正常',
  inactive: '禁用',
}

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
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'inactive' },
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
      { label: '正常', value: 'active' },
      { label: '禁用', value: 'inactive' },
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
        label: '查看',
        onClick: row => handleView(row),
      },
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
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDetail = ref(false)
const detailData = ref(null)
const isLoading = ref(false)

onMounted(fetchCustomersList)

async function fetchCustomersList() {
  isLoading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...filter.value,
    }
    const res = await getCustomers(params)
    customersList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch customers:', error)
    ElMessage.error('获取客户列表失败')
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchCustomersList()
}

function handleReset() {
  filter.value = { id: '', name: '', status: '', registeredAt: '' }
  page.value = 1
  fetchCustomersList()
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
    status: 'active',
    registeredAt: '',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  const submitData = { ...form }
  delete submitData._id
  try {
    if (isEdit.value) {
      await updateCustomer(form._id, submitData)
      ElMessage.success('客户编辑成功')
    } else {
      await addCustomer(submitData)
      ElMessage.success('客户添加成功')
    }
    fetchCustomersList()
    showDialog.value = false
    resetDialogForm()
  } catch (e) {
    ElMessage.error('操作失败，请重试')
  }
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
      fetchCustomersList()
    })
  })
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchCustomersList()
}

function handlePageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  fetchCustomersList()
}

function handleView(row) {
  detailData.value = row
  showDetail.value = true
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
