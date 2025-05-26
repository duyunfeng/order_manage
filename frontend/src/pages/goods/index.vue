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
        <h1>商品管理</h1>
        <el-button type="primary" @click="openAddDialog">添加商品</el-button>
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
              长*宽*高：{{ row.spec.length }}*{{ row.spec.width }}*{{ row.spec.height
              }}{{ (row.spec.unit || 'cm') + '³' }}
            </div>
            <div>颜色：{{ row.spec.color }}</div>
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
              alt="商品图片"
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
        :title="isEdit ? '编辑商品' : '添加商品'"
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
import { useRouter } from 'vue-router'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import ImagePreviewer from '@/components/ImagePreviewer.vue'
import GoodsDetail from '@/components/GoodsDetail.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getGoods, getGood, addGood, updateGood, deleteGood } from '@/api/goods'
import { uploadFile } from '@/api/upload'

/**
 * 查询条件对象，页面维护
 */
const filter = ref({ id: '', name: '', status: '', createdAt: '' })

/**
 * 筛选项配置，页面维护
 */
const filterFields = [
  { prop: 'id', label: '商品ID', placeholder: '请输入商品ID', type: 'input' },
  { prop: 'name', label: '商品名称', placeholder: '请输入商品名称', type: 'input' },
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
 * 添加商品弹窗相关
 */
const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  name: '',
  price: null,
  spec_length: null,
  spec_width: null,
  spec_height: null,
  spec_unit: 'cm',
  spec_color: '',
  image: '',
  imageFile: null,
  factories: [],
  _id: undefined, // 编辑时用
})
const factoryOptions = [
  { label: '工厂一', value: 'f1' },
  { label: '工厂二', value: 'f2' },
  { label: '工厂三', value: 'f3' },
]
const addFields = [
  {
    prop: 'name',
    label: '商品名称',
    type: 'input',
    placeholder: '请输入商品名称',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'price',
    label: '价格($)',
    type: 'input',
    placeholder: '请输入价格',
    rules: [{ required: true, message: '必填' }],
  },
  { prop: 'spec_length', label: '长度', type: 'input', placeholder: '请输入长度' },
  { prop: 'spec_width', label: '宽度', type: 'input', placeholder: '请输入宽度' },
  { prop: 'spec_height', label: '高度', type: 'input', placeholder: '请输入高度' },
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
    label: '商品图片',
    type: 'custom-upload',
    placeholder: '请上传商品图片',
  },
  {
    prop: 'factories',
    label: '生产工厂',
    type: 'factory-select',
    placeholder: '请选择工厂',
    options: factoryOptions,
  },
]

/**
 * 表格列配置，页面维护
 */
const columns = [
  { prop: 'id', label: '商品ID', width: 200 },
  { prop: 'name', label: '名称', width: 180 },
  { prop: 'spec', label: '规格', minWidth: 200, slot: true },
  { prop: 'image', label: '图片', width: 120, slot: true },
  { prop: 'price', label: '价格($)', width: 100 },
  { prop: 'factories', label: '生产工厂', minWidth: 180, slot: true },
  { prop: 'status', label: '上架状态', width: 100, slot: true },
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
 * 商品列表数据（可替换为API请求）
 */
const goodsList = ref([])
const imagePreviewVisible = ref(false)
const imagePreviewList = ref<string[]>([])
const imagePreviewIndex = ref(0)
const showDetail = ref(false)
const detailData = ref(null)

onMounted(async () => {
  await fetchGoods()
})

async function fetchGoods() {
  // 使用API函数获取商品列表数据
  const res = await getGoods(filter.value)
  goodsList.value =
    res.data.map(item => {
      console.log(item)
      return {
        ...item,
        spec: JSON.parse(item.spec),
        factories: item.factories.map(f => f.factory),
      }
    }) || []
}

/**
 * 处理筛选查询
 * @param filter 查询条件
 */
function handleSearch(f: any) {
  // 重新拉取数据后本地过滤
  fetchGoods().then(() => {
    goodsList.value = goodsList.value.filter(item => {
      const matchId = !f.id || item.id.includes(f.id)
      const matchName = !f.name || item.name.includes(f.name)
      const matchStatus = !f.status || item.status === f.status
      const matchDate = !f.createdAt || item.createdAt.startsWith(f.createdAt)
      return matchId && matchName && matchStatus && matchDate
    })
  })
}

/**
 * 重置筛选条件
 */
function handleReset() {
  filter.value = { id: '', name: '', status: '', createdAt: '' }
  fetchGoods()
}

/**
 * 查看商品详情
 * @param row 当前商品
 */
function handleView(row: any) {
  detailData.value = row
  showDetail.value = true
}

/**
 * 编辑商品
 * @param row 当前商品
 */
function handleEdit(row: any) {
  isEdit.value = true
  dialogForm.value = {
    name: row.name,
    price: row.price,
    spec_length: row.spec.length,
    spec_width: row.spec.width,
    spec_height: row.spec.height,
    spec_color: row.spec.color,
    spec_unit: row.spec.unit || 'cm',
    image: row.image,
    imageFile: null,
    factories: row.factories?.map(f => f.id) || [],
    _id: row.id,
  }
  showDialog.value = true
}

/**
 * 删除商品
 * @param row 当前商品
 */
function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除商品：${row.name} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteGood(row.id).then(() => {
      fetchGoods()
    })
  })
}

/**
 * 上下架商品
 * @param row 当前商品
 * @param status 新状态
 */
function handleToggleStatus(row: any, status: 'on' | 'off') {
  updateGood(row.id, {
    ...row,
    status,
  }).then(() => {
    fetchGoods()
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
  dialogForm.value = {
    name: row.name,
    price: row.price,
    spec_length: row.spec.length,
    spec_width: row.spec.width,
    spec_height: row.spec.height,
    spec_color: row.spec.color,
    spec_unit: row.spec.unit || 'cm',
    image: row.image,
    imageFile: null,
    factories: row.factories?.map(f => f.id) || [],
    _id: row.id,
  }
  showDialog.value = true
}

function resetDialogForm() {
  dialogForm.value = {
    name: '',
    price: null,
    spec_length: null,
    spec_width: null,
    spec_height: null,
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
  }
  const goodsData = {
    name: form.name,
    price: Number(form.price),
    spec: JSON.stringify({
      length: form.spec_length,
      width: form.spec_width,
      height: form.spec_height,
      color: form.spec_color,
      unit: form.spec_unit || 'cm',
    }),
    image: imageUrl,
    factories: form.factories,
    status: 'on',
  }
  if (isEdit.value) {
    const submitData = { ...goodsData }
    delete submitData._id
    await updateGood(form._id, submitData)
    ElMessage.success('商品编辑成功')
  } else {
    await addGood(goodsData)
    ElMessage.success('商品添加成功')
  }
  fetchGoods()
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
