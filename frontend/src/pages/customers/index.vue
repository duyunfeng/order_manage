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
        :expand="true"
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
        <template #expand="{ row }">
          <div style="padding: 0 16px; width: 100%">
            <el-row>
              <el-col :span="12">
                <span>国家： {{ row.country || '-' }}</span>
              </el-col>
              <el-col :span="12">
                <span>网址： {{ row.website || '-' }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span>地址： {{ row.address || '-' }}</span>
              </el-col>
              <el-col :span="12">
                <span>成立时间： {{ row.establishedAt || '-' }}</span>
              </el-col>
            </el-row>
            <!-- 新增联系人按钮 -->
            <el-button
              type="primary"
              style="margin-bottom: 8px; margin-top: 8px"
              @click="addContact(row)"
            >
              新增联系人
            </el-button>
            <el-table :data="row.contacts || []" size="small" border style="width: 100%">
              <el-table-column prop="name" label="联系人姓名" />
              <el-table-column prop="phone" label="电话" />
              <el-table-column prop="email" label="邮箱" />
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="editContact(row, scope.row)"
                    >编辑</el-button
                  >
                  <el-button size="small" type="danger" @click="deleteContact(row, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
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
      <!-- 联系人编辑弹窗 -->
      <el-dialog
        v-model="contactDialogVisible"
        title="编辑联系人"
        width="400px"
        :close-on-click-modal="false"
      >
        <el-form :model="contactDialogForm" label-width="80px">
          <el-form-item label="姓名" required>
            <el-input v-model="contactDialogForm.name" />
          </el-form-item>
          <el-form-item label="电话" required>
            <el-input v-model="contactDialogForm.phone" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="contactDialogForm.email" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="contactDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleContactDialogSubmit">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
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
  country: '',
  website: '',
  address: '',
  establishedAt: '',
  status: 'active',
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
  { prop: 'country', label: '国家', type: 'input', placeholder: '请输入国家' },
  { prop: 'website', label: '网址', type: 'input', placeholder: '请输入网址' },
  { prop: 'address', label: '地址', type: 'input', placeholder: '请输入地址' },
  { prop: 'establishedAt', label: '成立时间', type: 'date', placeholder: '请选择成立时间' },
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

// 联系人编辑弹窗相关
const contactDialogVisible = ref(false)
const contactDialogForm = reactive({
  name: '',
  phone: '',
  email: '',
})
const contactDialogCustomer = ref<any>(null)
const contactDialogIndex = ref<number | null>(null) // 编辑时的联系人索引，null为新增

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
  if (!('country' in dialogForm.value)) dialogForm.value.country = ''
  if (!('website' in dialogForm.value)) dialogForm.value.website = ''
  if (!('establishedAt' in dialogForm.value)) dialogForm.value.establishedAt = ''
  showDialog.value = true
}

function resetDialogForm() {
  dialogForm.value = {
    name: '',
    phone: '',
    country: '',
    website: '',
    address: '',
    establishedAt: '',
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

// 打开编辑弹窗
function editContact(customer: any, contact: any) {
  contactDialogCustomer.value = customer
  contactDialogIndex.value = customer.contacts.findIndex((c: any) => c === contact)
  Object.assign(contactDialogForm, contact)
  contactDialogVisible.value = true
}

// 新增联系人
function addContact(customer: any) {
  contactDialogCustomer.value = customer
  contactDialogIndex.value = null
  Object.assign(contactDialogForm, { name: '', phone: '', email: '' })
  contactDialogVisible.value = true
}

// 保存联系人
async function handleContactDialogSubmit() {
  if (!contactDialogCustomer.value) return
  const contacts = contactDialogCustomer.value.contacts || []
  if (contactDialogIndex.value !== null && contactDialogIndex.value >= 0) {
    // 编辑
    contacts[contactDialogIndex.value] = { ...contactDialogForm }
  } else {
    // 新增
    contacts.push({ ...contactDialogForm })
  }
  // 调用后端接口，更新contacts
  const res = await updateCustomer(contactDialogCustomer.value.id, {
    ...contactDialogCustomer.value,
    contacts,
  })
  if (res.code === 0) {
    ElMessage.success('保存成功')
    contactDialogVisible.value = false
    fetchCustomersList()
  } else {
    ElMessage.error('保存失败')
  }
}

// 删除联系人
async function deleteContact(customer: any, contact: any) {
  ElMessageBox.confirm('确定要删除该联系人吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const idx = customer.contacts.findIndex((c: any) => c === contact)
    if (idx !== -1) customer.contacts.splice(idx, 1)
    // 同步到后端
    await updateCustomer(customer.id, {
      contacts: customer.contacts,
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
