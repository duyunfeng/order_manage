<template>
  <el-card class="order-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>订单管理</h1>
        <el-button type="primary" @click="openAddDialog">添加订单</el-button>
      </div>
      <BaseFilter
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable
        :tableData="ordersList"
        :columns="columns"
        :loading="isLoading"
        :pagination="{ page: page, pageSize: pageSize, total: total }"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
      >
        <template #goodsList="{ row }">
          <div>
            <span v-for="item in row.goodsList" :key="item.name" style="margin-right: 8px">
              {{ item.name }} x{{ item.quantity }}
            </span>
          </div>
        </template>
        <template #contractUrl="{ row }">
          <el-button
            v-if="row.contractUrl"
            type="primary"
            link
            @click="previewContractFile(row.contractUrl)"
            >预览</el-button
          >
          <el-button
            v-if="row.contractUrl"
            type="danger"
            link
            @click="downloadFile(row.contractUrl as string)"
            >下载</el-button
          >
          <span v-else>无</span>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 'paid' ? 'success' : 'warning'">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </BaseTable>
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑订单' : '添加订单'"
        :fields="orderFields"
        :formData="dialogForm"
        @submit="handleDialogSubmit"
        @update:modelValue="
          val => {
            if (!val) resetDialogForm()
          }
        "
      >
        <template #goodsList="{ form }">
          <div
            v-for="(item, idx) in form.goodsList"
            :key="idx"
            style="display: flex; align-items: center; margin-bottom: 8px"
          >
            <el-select
              v-model="item.name"
              placeholder="请选择商品"
              style="width: 160px; margin-right: 8px"
            >
              <el-option v-for="g in goodsOptions" :key="g.name" :label="g.name" :value="g.name" />
            </el-select>
            <el-input-number
              v-model="item.quantity"
              :min="1"
              style="width: 100px; margin-right: 8px"
            />
            <el-button
              type="danger"
              :icon="Delete"
              @click="form.goodsList.splice(idx, 1)"
              v-if="form.goodsList.length > 1"
            >
              删除
            </el-button>
          </div>
          <el-button
            type="primary"
            plain
            :icon="Plus"
            @click="form.goodsList.push({ name: '', quantity: 1 })"
            >添加商品</el-button
          >
        </template>
        <template #contractUrl="{ form }">
          <el-upload
            ref="contractUploader"
            :file-list="form.contractFileList"
            :show-file-list="true"
            :on-success="(res, file, fileList) => handleContractUploadSuccess(res, file, fileList)"
            :on-preview="file => handleContractPreview(file)"
            :before-remove="(file, fileList) => handleContractRemove(file, fileList)"
            :auto-upload="true"
            :limit="1"
            action="/api/upload"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          >
            <el-button type="primary">上传合同</el-button>
            <span
              v-if="form.contractFileList && form.contractFileList.length"
              style="margin-left: 8px; color: #67c23a"
              >已上传</span
            >
          </el-upload>
        </template>
        <template #actions>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </template>
      </BaseDialogForm>
      <el-dialog
        v-model="previewDialogVisible"
        title="合同预览"
        width="80vw"
        top="5vh"
        custom-class="preview-dialog"
      >
        <div class="preview-dialog-flex">
          <div class="preview-dialog-body-full">
            <iframe v-if="previewUrl" :src="previewUrl" class="preview-iframe-full"></iframe>
            <div v-else class="preview-empty-tip">暂不支持预览该类型文件，请下载后查看</div>
          </div>
          <div v-if="downloadUrl" class="preview-dialog-footer">
            <el-button type="primary" @click="downloadFile(downloadUrl)">下载文件</el-button>
          </div>
        </div>
      </el-dialog>
      <OrderDetail v-if="showDetail" v-model="showDetail" :order="detailData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    __vuePreviewContractFile?: (url: string) => void
    __vueDownloadContractFile?: (url: string) => void
  }
}
import { ref, onMounted, computed, onBeforeUnmount, reactive } from 'vue'
import BaseFilter from '@/components/BaseFilter.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseActions from '@/components/BaseActions.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { getOrders, addOrder, updateOrder, deleteOrder } from '@/api/orders'
import { getCustomers } from '@/api/customers'
import { getGoods } from '@/api/goods'
import OrderDetail from '@/components/OrderDetail.vue'

const statusMap = {
  paid: '已支付',
  pending: '待支付',
}

const filter = ref({ id: '', customer: '', status: '', createdAt: '' })
const filterFields = [
  { prop: 'id', label: '订单ID', placeholder: '请输入订单ID', type: 'input' },
  { prop: 'customer', label: '客户', placeholder: '请输入客户名', type: 'input' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '已支付', value: 'paid' },
      { label: '待支付', value: 'pending' },
    ],
  },
  {
    prop: 'createdAt',
    label: '创建时间',
    type: 'date',
    placeholder: '请选择创建时间',
    valueFormat: 'YYYY-MM-DD',
  },
]

const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  customer: '',
  goodsList: [{ name: '', quantity: 1 }],
  amount: null,
  status: 'pending',
  shippingDate: '',
  contractUrl: '',
  contractFileList: [],
  _id: undefined,
})

const ordersList = ref<any[]>([])

const previewDialogVisible = ref(false)
const previewUrl = ref('')
const downloadUrl = ref('')

// 客户和商品选项
const customerOptions = ref<any[]>([])
const goodsOptions = ref<any[]>([])

// 商品搜索
const goodsSearchKeyword = ref('')
const filteredGoodsOptions = computed(() => {
  if (!goodsSearchKeyword.value) return goodsOptions.value
  return goodsOptions.value.filter((item: any) => item.name.includes(goodsSearchKeyword.value))
})
function goodsSearch(query: any) {
  goodsSearchKeyword.value = query
}

async function fetchCustomers() {
  const res = await getCustomers()
  customerOptions.value = (res.data || []).filter((item: any) => item.status === 'active')
}
async function fetchGoods() {
  const res = await getGoods()
  goodsOptions.value = res.data || res
}

const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

const showDetail = ref(false)
const detailData = ref(null)
const isLoading = ref(false)

const contractUploader = ref(null)

onMounted(() => {
  fetchOrders()
  fetchCustomers()
  fetchGoods()
  window.__vuePreviewContractFile = previewContractFile
  window.__vueDownloadContractFile = downloadFile
})
onBeforeUnmount(() => {
  delete window.__vuePreviewContractFile
  delete window.__vueDownloadContractFile
})

async function fetchOrders() {
  isLoading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...filter.value,
    }
    const res = await getOrders(params)
    ordersList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch orders:', error)
    ElMessage.error('获取订单列表失败')
  } finally {
    isLoading.value = false
  }
}

function handleSearch(f: any) {
  fetchOrders().then(() => {
    ordersList.value = ordersList.value.filter((item: any) => {
      const matchId = !f.id || item.id.includes(f.id)
      const matchCustomer = !f.customer || item.customer.includes(f.customer)
      const matchStatus = !f.status || item.status === f.status
      const matchDate = !f.createdAt || item.createdAt.startsWith(f.createdAt)
      return matchId && matchCustomer && matchStatus && matchDate
    })
  })
}

function handleReset() {
  filter.value = { id: '', customer: '', status: '', createdAt: '' }
  page.value = 1
  fetchOrders()
}

function handleContractUploadSuccess(res: any, file: any, fileList: any) {
  if (res.code === 0) {
    ElMessage.success('上传成功')
    dialogForm.value.contractUrl = res.data.url
    dialogForm.value.contractFileList = fileList
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

function handleContractPreview(file: any) {
  previewContractFile(file.url)
}

function handleContractRemove(file: any, fileList: any) {
  dialogForm.value.contractUrl = ''
  dialogForm.value.contractFileList = fileList
}

function openAddDialog() {
  isEdit.value = false
  resetDialogForm()
  showDialog.value = true
}
function openEditDialog(row: any) {
  isEdit.value = true
  dialogForm.value = {
    ...row,
    _id: row.id,
    contractFileList: row.contractUrl
      ? [{ name: '合同文件', url: row.contractUrl, status: 'success' }]
      : [],
  }
  showDialog.value = true
}
function resetDialogForm() {
  dialogForm.value = {
    customer: '',
    goodsList: [{ name: '', quantity: 1 }],
    amount: null,
    status: 'pending',
    shippingDate: '',
    contractUrl: '',
    contractFileList: [],
    _id: undefined,
  }
}
async function handleDialogSubmit(form: any) {
  const submitData = { ...form, amount: Number(form.amount) }
  delete submitData._id
  console.log(form.contractFileList)
  try {
    if (isEdit.value) {
      await updateOrder(form._id, submitData)
      ElMessage.success('订单编辑成功')
    } else {
      await addOrder(submitData)
      ElMessage.success('订单添加成功')
    }
    fetchOrders()
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
  ElMessageBox.confirm(`确定要删除订单：${row.id} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteOrder(row.id).then(() => {
      fetchOrders()
    })
  })
}

async function previewContractFile(url: string) {
  const ext = url.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') {
    previewUrl.value = url
    previewDialogVisible.value = true
    downloadUrl.value = url
    return
  }
  const officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt']
  if (officeExts.includes(ext)) {
    const filename = url.split('/').pop()
    try {
      const res = await fetch('/api/convert/to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      }).then(r => r.json())
      if (res.url) {
        previewUrl.value = res.url
        previewDialogVisible.value = true
        downloadUrl.value = res.url
      } else {
        ElMessageBox.alert('文件转换失败，请下载后查看', '提示')
      }
    } catch (e) {
      ElMessageBox.alert('文件转换失败，请下载后查看', '提示')
    }
    return
  }
  ElMessageBox.alert('暂不支持预览该类型文件，请下载后查看', '提示')
}

function downloadFile(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = ''
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchOrders()
}
function handlePageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  fetchOrders()
}

function handleView(row) {
  detailData.value = row
  showDetail.value = true
}

const orderFields = computed(() => [
  {
    prop: 'customer',
    label: '客户',
    type: 'select',
    placeholder: '请选择客户',
    options: customerOptions.value.map((item: any) => ({ label: item.name, value: item.name })),
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'goodsList',
    label: '商品列表',
    type: 'goods-list',
  },
  {
    prop: 'amount',
    label: '金额',
    type: 'input',
    placeholder: '请输入金额',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '已支付', value: 'paid' },
      { label: '待支付', value: 'pending' },
    ],
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'shippingDate',
    label: '船期',
    type: 'date',
    placeholder: '请选择船期',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'contractUrl',
    label: '合同文件',
    type: 'custom-upload',
  },
])

const columns = [
  { prop: 'id', label: '订单ID', width: 200 },
  { prop: 'customer', label: '客户', width: 120 },
  { prop: 'goodsList', label: '商品列表', minWidth: 200, slot: true },
  { prop: 'amount', label: '金额', width: 100 },
  { prop: 'status', label: '状态', width: 100, slot: true },
  { prop: 'shippingDate', label: '船期', width: 120 },
  {
    prop: 'contractUrl',
    label: '合同预览',
    width: 160,
    slot: true,
    getSlot: (row: any) =>
      row.contractUrl
        ? `<span class='contract-actions'>
            <button class='el-button el-button--text' onclick='window.__vuePreviewContractFile && window.__vuePreviewContractFile("${row.contractUrl}")'>预览</button>
            <button class='el-button el-button--text' onclick='window.__vueDownloadContractFile && window.__vueDownloadContractFile("${row.contractUrl}")'>下载</button>
          </span>`
        : '无',
  },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 180,
    slot: true,
    actions: BaseActions,
    getActions: (row: any, index: any) => [
      {
        label: '查看',
        onClick: (row: any) => handleView(row),
      },
      {
        label: '编辑',
        type: 'primary',
        onClick: (row: any) => handleEdit(row),
      },
      {
        label: '删除',
        type: 'danger',
        onClick: (row: any) => handleDelete(row),
      },
    ],
  },
]

function handleSubmit() {
  // 只做表单校验和提交
  handleDialogSubmit(dialogForm.value)
}

// expose 相关方法，确保 template 可访问
defineExpose({ handleContractPreview, handleContractRemove })
</script>

<style scoped>
.order-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
:global(html.dark) .order-card {
  background: #23272e;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.45);
  border: 1px solid #23272e;
}
:global(html.dark) .el-card__body {
  background: #23272e !important;
}
:global(html.dark) .el-table {
  background: #23272e !important;
  color: #e0e6ed !important;
}
:global(html.dark) .el-table th,
:global(html.dark) .el-table td {
  background: #23272e !important;
  color: #e0e6ed !important;
}
:global(html.dark) .el-table__row {
  background: #23272e !important;
}
:global(html.dark) .el-tag {
  background: #30343b !important;
  color: #8ec8ff !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-button {
  background: #23272e !important;
  color: #8ec8ff !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-input__wrapper {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-dialog {
  background: #23272e !important;
  color: #e0e6ed !important;
}
.contract-actions {
  display: flex;
  gap: 8px;
}
.preview-dialog .el-dialog__body {
  padding: 0;
  height: 80vh;
  min-height: 400px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.preview-dialog-flex {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 500px;
  flex: 1 1 0;
}

.preview-dialog-body-full {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.preview-iframe-full {
  width: 100%;
  height: 100%;
  border: none;
  flex: 1 1 0;
  display: block;
  min-height: 0;
}

.preview-empty-tip {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  padding: 40px 0;
  box-sizing: border-box;
}

.preview-dialog-footer {
  text-align: right;
  padding: 16px;
  background: #fff;
}
</style>
