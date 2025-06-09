<template>
  <el-card class="goods-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>产品管理</h1>
        <el-button type="primary" @click="openAddDialog">添加产品</el-button>
      </div>
      <BaseFilter
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable
        :tableData="goodsList"
        :columns="columns"
        :loading="isLoading"
        :pagination="{ page: page, pageSize: pageSize, total: total }"
        @update:page="handlePageChange"
        @update:pageSize="handlePageSizeChange"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
        @factory-click="handleFactoryClick"
      >
        <template #spec="{ row }">
          <div>
            <div>
              规格：{{
                [row.spec.length, row.spec.width, row.spec.height]
                  .filter(v => v !== undefined && v !== null)
                  .join('*')
              }}
              {{ (row.spec.unit || 'cm') + '³' }}
            </div>
            <div>颜色：{{ row.spec.color || '-' }}</div>
          </div>
        </template>
        <template #image="{ row }">
          <div
            style="
              width: 48px;
              height: 48px;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <img
              v-if="row.image"
              style="
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 4px;
                border: 1px solid #eee;
                cursor: pointer;
              "
              :src="row.image"
              @click="openImagePreview(row.image)"
              alt="产品图片"
            />
            <span v-else style="font-size: 12px; color: #999"> 暂无图片 </span>
          </div>
        </template>
        <template #factories="{ row }">
          <el-tag
            v-for="factory in row.factories"
            :key="factory.id"
            class="factory-tag"
            @click="$emit('factory-click', factory)"
            style="cursor: pointer; margin-right: 4px"
          >
            {{ factory.name }}
          </el-tag>
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 'on' ? 'success' : 'info'">
            {{ row.status === 'on' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </BaseTable>
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑产品' : '添加产品'"
        :fields="addFields"
        :formData="dialogForm"
        @submit="handleDialogSubmit"
        @update:modelValue="
          val => {
            if (!val) resetDialogForm()
          }
        "
      >
        <template #image="{ form }">
          <ImageUpload v-model="form.image" @file-change="file => (form.imageFile = file)" />
        </template>
      </BaseDialogForm>
      <ImagePreviewer
        :url-list="imagePreviewList"
        :initial-index="imagePreviewIndex"
        :visible="imagePreviewVisible"
        @close="imagePreviewVisible = false"
      />
      <GoodsDetail v-if="showDetail" v-model="showDetail" :goods="detailData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import ImagePreviewer from '@/components/ImagePreviewer.vue'
import GoodsDetail from '@/components/GoodsDetail.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getGoods, addGood, updateGood, deleteGood } from '@/api/goods'
import { getFactories } from '@/api/factories'
import { uploadFile } from '@/api/upload'

/**
 * 查询条件对象，页面维护
 */
const filter = ref({ id: '', name: '', status: '', createdAt: '' })

/**
 * 筛选项配置，页面维护
 */
const filterFields = [
  { prop: 'id', label: '产品ID', placeholder: '请输入产品ID', type: 'input' },
  { prop: 'name', label: '产品名称', placeholder: '请输入产品名称', type: 'input' },
  {
    prop: 'status',
    label: '状态',
    type: 'select',
    placeholder: '请选择状态',
    options: [
      { label: '全部', value: '' },
      { label: '上架', value: 'on' },
      { label: '下架', value: 'off' },
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

/**
 * 添加产品弹窗相关
 */
const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  name: '',
  product_id: '',
  tw_id: '',
  price: null, // 产品价格
  priceCurrency: 'CNY', // 价格币种，默认为人民币
  factory_price: null,
  spec_size: '',
  spec_unit: 'cm',
  spec_color: '',
  image: '',
  imageFile: null,
  factories: [],
  _id: undefined, // 编辑时用
})
const factoryOptions = ref([])
const addFields = ref([
  {
    prop: 'name',
    label: '产品名称',
    type: 'input',
    placeholder: '请输入产品名称',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'price',
    label: '价格',
    type: 'input',
    placeholder: '请输入价格',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'priceCurrency',
    label: '币种',
    type: 'select',
    placeholder: '请选择币种',
    options: [
      { label: '人民币', value: 'CNY' },
      { label: '美元', value: 'USD' },
    ],
    rules: [{ required: true, message: '必选' }],
    default: 'CNY',
  },
  {
    prop: 'factory_price',
    label: '工厂价(CNY)',
    type: 'input',
    placeholder: '请输入工厂价',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'spec_size',
    label: '规格(长*宽*高)',
    type: 'input',
    placeholder: '如：10*20*30',
    rules: [],
  },
  {
    prop: 'spec_unit',
    label: '单位',
    type: 'input',
    placeholder: '请输入单位',
    rules: [],
    default: 'cm',
  },
  { prop: 'spec_color', label: '颜色', type: 'input', placeholder: '请输入颜色' },
  {
    prop: 'image',
    label: '产品图片',
    type: 'custom-upload',
    placeholder: '请上传产品图片',
  },
  {
    prop: 'factories',
    label: '生产工厂',
    type: 'factory-select',
    placeholder: '请选择工厂',
    options: factoryOptions,
  },
])

/**
 * 表格列配置，页面维护
 */
const columns = [
  { prop: 'name', label: '名称', width: 180 },
  { prop: 'product_id', label: '产品编号', width: 180 },
  { prop: 'tw_id', label: 'TW编号', width: 180 },
  { prop: 'spec', label: '规格', minWidth: 200, slot: true },
  { prop: 'image', label: '图片', width: 120, slot: true },
  {
    prop: 'price',
    label: '价格',
    width: 120,
    formatter: row => `${row.price || '-'} ${row.priceCurrency === 'USD' ? '$' : '￥'}`,
  },
  { prop: 'factory_price', label: '工厂价(CNY)', width: 120 },
  { prop: 'factories', label: '生产工厂', minWidth: 180, slot: true },
  { prop: 'status', label: '上架状态', width: 100, slot: true },
  { prop: 'id', label: '产品ID', width: 200 },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 240,
    slot: true,
    getActions: (row, index) => [
      {
        label: '查看',
        onClick: row => handleView(row),
      },
      {
        label: '编辑',
        type: 'primary',
        onClick: row => openEditDialog(row),
      },
      {
        label: row.status === 'on' ? '下架' : '上架',
        type: row.status === 'on' ? 'warning' : 'success',
        onClick: row => handleToggleStatus(row, row.status === 'on' ? 'off' : 'on'),
      },
      {
        label: '删除',
        type: 'danger',
        onClick: row => handleDelete(row),
      },
    ],
  },
]

/**
 * 产品列表数据（可替换为API请求）
 */
const goodsList = ref([])
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewIndex = ref(0)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDetail = ref(false)
const detailData = ref<any>(null)
const isLoading = ref(false)

onMounted(() => {
  fetchGoodsList()
  fetchFactoryList()
})

async function fetchGoodsList() {
  isLoading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...filter.value,
    }
    const res = await getGoods(params)
    goodsList.value = res.data.map((item: any) => {
      const imageUrl = `${import.meta.env.VITE_BASE_URL || ''}${item.image}`
      return {
        ...item,
        spec: JSON.parse(item.spec),
        image: imageUrl,
      }
    })
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch goods:', error)
    ElMessage.error('获取产品列表失败')
  } finally {
    isLoading.value = false
  }
}

const fetchFactoryList = async () => {
  const res = await getFactories()
  console.log(res)
  factoryOptions.value = res.data.map((item: any) => ({
    label: item.name,
    value: item.id,
  }))
  console.log(factoryOptions.value)
}

function handleSearch() {
  page.value = 1
  fetchGoodsList()
}

function handleReset() {
  filter.value = { id: '', name: '', status: '', createdAt: '' }
  page.value = 1
  fetchGoodsList()
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchGoodsList()
}

function handlePageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  fetchGoodsList()
}

/**
 * 查看产品详情
 * @param row 当前产品
 */
function handleView(row: any) {
  detailData.value = row
  showDetail.value = true
}

/**
 * 编辑产品
 * @param row 当前产品
 */
function handleEdit(row: any) {
  isEdit.value = true
  // 兼容后端返回 spec 为字符串或对象
  let specObj = row.spec
  if (typeof specObj === 'string') {
    try {
      specObj = JSON.parse(specObj)
    } catch {
      specObj = {}
    }
  }
  // 解析规格字符串
  let spec_size = ''
  if (specObj && typeof specObj === 'object') {
    const { length, width, height } = specObj
    spec_size = [length, width, height].filter(v => v !== undefined && v !== null).join('*')
  }
  dialogForm.value = {
    name: row.name,
    product_id: row.product_id,
    tw_id: row.tw_id,
    price: row.price,
    priceCurrency: row.priceCurrency || 'CNY',
    factory_price: row.factory_price,
    spec_size,
    spec_color: specObj.color,
    spec_unit: specObj.unit || 'cm',
    image: row.image,
    imageFile: null,
    factories: row.factories?.map((f: any) => f.id) || [],
    _id: row.id,
  }
  showDialog.value = true
}

/**
 * 删除产品
 * @param row 当前产品
 */
function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除产品：${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteGood(row.id).then(() => {
      fetchGoodsList()
    })
  })
}

/**
 * 上下架产品
 * @param row 当前产品
 * @param status 新状态
 */
function handleToggleStatus(row: any, status: 'on' | 'off') {
  updateGood(row.id, {
    ...row,
    status,
  }).then(() => {
    fetchGoodsList()
  })
}

/**
 * 工厂标签点击，跳转到工厂管理并按工厂ID查询
 * @param factory 工厂对象
 */
function handleFactoryClick(factory: any) {
  router.push({ path: '/factories', query: { id: factory.id } })
}

function openAddDialog() {
  isEdit.value = false
  resetDialogForm()
  showDialog.value = true
}

function openEditDialog(row: any) {
  isEdit.value = true
  // 兼容后端返回 spec 为字符串或对象
  let specObj = row.spec
  if (typeof specObj === 'string') {
    try {
      specObj = JSON.parse(specObj)
    } catch {
      specObj = {}
    }
  }
  // 解析规格字符串
  let spec_size = ''
  if (specObj && typeof specObj === 'object') {
    const { length, width, height } = specObj
    spec_size = [length, width, height].filter(v => v !== undefined && v !== null).join('*')
  }
  dialogForm.value = {
    name: row.name,
    product_id: row.product_id,
    tw_id: row.tw_id,
    factory_price: row.factory_price,
    price: row.price,
    priceCurrency: row.priceCurrency || 'CNY',
    spec_size,
    spec_color: specObj.color,
    spec_unit: specObj.unit || 'cm',
    image: row.image,
    imageFile: null,
    factories: row.factories?.map((f: any) => f.id) || [],
    _id: row.id,
  }
  showDialog.value = true
}

function resetDialogForm() {
  dialogForm.value = {
    name: '',
    product_id: '',
    tw_id: '',
    factory_price: null,
    price: null,
    priceCurrency: 'CNY',
    spec_size: '',
    spec_unit: 'cm',
    spec_color: '',
    image: '',
    imageFile: null,
    factories: [],
    _id: undefined,
  }
}

async function handleDialogSubmit(form: any) {
  let imageUrl = form.image
  if (form.imageFile) {
    imageUrl = await uploadFile(form.imageFile)
  } else if (typeof form.image === 'string' && form.image.startsWith('data:')) {
    imageUrl = ''
  }
  // 修复：去除前缀，只保留相对路径
  const baseUrl = import.meta.env.VITE_BASE_URL || ''
  if (imageUrl && baseUrl && imageUrl.startsWith(baseUrl)) {
    imageUrl = imageUrl.replace(baseUrl, '')
  }
  // 解析规格字符串为对象
  let length = '',
    width = '',
    height = ''
  if (form.spec_size) {
    ;[length, width, height] = form.spec_size.split('*')
  }
  // 组装产品数据，包含币种
  const goodsData = {
    name: form.name,
    product_id: form.product_id,
    tw_id: form.tw_id,
    factory_price: Number(form.factory_price),
    price: Number(form.price),
    priceCurrency: form.priceCurrency || 'CNY', // 带上币种
    spec: JSON.stringify({
      length,
      width,
      height,
      color: form.spec_color,
      unit: form.spec_unit || 'cm',
    }),
    image: imageUrl,
    factories: form.factories,
    status: 'on',
  }
  if (isEdit.value) {
    const submitData = { ...goodsData }
    await updateGood(form._id, submitData)
    ElMessage.success('产品编辑成功')
  } else {
    await addGood(goodsData)
    ElMessage.success('产品添加成功')
  }
  fetchGoodsList()
  showDialog.value = false
  resetDialogForm()
}

function openImagePreview(url: string) {
  imagePreviewList.value = [url]
  imagePreviewIndex.value = 0
  imagePreviewVisible.value = true
}
</script>

<style scoped>
.goods-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
:global(html.dark) .goods-card {
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
.image-preview-dialog .el-dialog__body {
  padding: 0;
  background: transparent;
  overflow: hidden;
}
.image-preview-dialog .el-dialog {
  background: transparent !important;
  box-shadow: none !important;
}
.image-preview-dialog .el-dialog__header {
  display: none;
}
</style>
