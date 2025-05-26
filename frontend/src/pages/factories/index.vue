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
        :tableData="factoriesList"
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
      <FactoryDetail v-if="showDetail" v-model="showDetail" :factory="detailData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getFactories, addFactory, updateFactory, deleteFactory } from '@/api/factories'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseActions from '@/components/BaseActions.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import FactoryDetail from '@/components/FactoryDetail.vue'

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
  status: 'active',
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

const factoriesList = ref([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDetail = ref(false)
const detailData = ref(null)
const isLoading = ref(false)

onMounted(fetchFactoriesList)

async function fetchFactoriesList() {
  isLoading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...filter.value,
    }
    const res = await getFactories(params)
    factoriesList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch factories:', error)
    ElMessage.error('获取工厂列表失败')
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchFactoriesList()
}

function handleReset() {
  filter.value = { id: '', name: '', status: '' }
  page.value = 1
  fetchFactoriesList()
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
    status: 'active',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  const submitData = { ...form }
  delete submitData._id
  try {
    if (isEdit.value) {
      await updateFactory(form._id, submitData)
      ElMessage.success('工厂编辑成功')
    } else {
      await addFactory(submitData)
      ElMessage.success('工厂添加成功')
    }
    fetchFactoriesList()
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
  ElMessageBox.confirm(`确定要删除工厂：${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteFactory(row.id).then(() => {
      fetchFactoriesList()
    })
  })
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchFactoriesList()
}

function handlePageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  fetchFactoriesList()
}

function handleView(row) {
  detailData.value = row
  showDetail.value = true
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
