<template>
  <el-card class="user-card">
    <div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        "
      >
        <h1>用户管理</h1>
        <el-button type="primary" @click="openAddDialog">添加用户</el-button>
      </div>
      <BaseFilter
        v-if="filterFields.length"
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable
        v-if="columns.length"
        :tableData="usersList"
        :columns="columns"
        :loading="isLoading"
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
        v-if="addFields.length"
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑用户' : '添加用户'"
        :fields="addFields"
        :formData="dialogForm"
        @submit="handleDialogSubmit"
        @update:modelValue="
          (val: boolean) => {
            if (!val) resetDialogForm()
          }
        "
      >
        <template #avatar="{ form }">
          <ImageUpload
            v-model="form.avatar"
            @file-change="(file: File | null) => (form.avatarFile = file)"
          />
        </template>
      </BaseDialogForm>
      <UserDetail v-if="showDetail && detailData" v-model="showDetail" :user="detailData" />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import UserDetail from '@/components/UserDetail.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getUsers, addUser, updateUser, deleteUser } from '@/api/users'

interface User {
  id: string | number
  username: string
  name?: string
  role: string
  email?: string
  avatar?: string
  avatarFile?: File | null
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
  _id?: string | number
  password?: string
  [key: string]: any
}

interface FieldConfig {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'custom-upload'
  placeholder?: string
  options?: Array<{ label: string; value: string | number | boolean }>
  valueFormat?: string
  rules?: Array<any>
  validator?: (rule: any, value: any, callback: (error?: Error) => void) => void
  [key: string]: any
}

interface ColumnConfig {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  slot?: boolean
  getActions?: (
    row: User,
    index: number,
  ) => Array<{
    label: string
    type?: 'primary' | 'danger' | 'warning' | 'success' | 'info' | 'default'
    onClick: (row: User) => void
  }>
  [key: string]: any
}

const statusMap: Record<string, string> = {
  active: '正常',
  inactive: '禁用',
}
const filter = ref<Record<string, any>>({ id: '', username: '', status: '', registeredAt: '' })
const usersList = ref<User[]>([])
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref<Partial<User>>({
  username: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  avatarFile: null,
  status: 'active',
  _id: undefined,
})
const showDetail = ref(false)
const detailData = ref<User | null>(null)
const isLoading = ref(false)

const roleMap: Record<string, string> = {
  admin: '管理员',
  operator: '操作员',
}

const filterFields = ref<FieldConfig[]>([
  { prop: 'id', label: '用户ID', placeholder: '请输入用户ID', type: 'input' },
  { prop: 'username', label: '用户名', placeholder: '请输入用户名', type: 'input' },
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
])

const addFields = ref<FieldConfig[]>([
  {
    prop: 'username',
    label: '用户名',
    type: 'input',
    placeholder: '请输入用户名',
    rules: [
      { required: true, message: '必填' },
      { validator: validateGithubUsername, trigger: 'blur' },
    ],
  },
  {
    prop: 'name',
    label: '昵称',
    type: 'input',
    placeholder: '请输入昵称',
    rules: [{ required: true, message: '必填' }],
  },
  {
    prop: 'role',
    label: '角色',
    type: 'select',
    placeholder: '请选择角色',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '操作员', value: 'operator' },
    ],
    rules: [{ required: true, message: '必填' }],
  },
  { prop: 'email', label: '邮箱', type: 'input', placeholder: '请输入邮箱' },
  {
    prop: 'avatar',
    label: '头像',
    type: 'custom-upload',
    placeholder: '请上传头像',
  },
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
])

const columns = ref<ColumnConfig[]>([
  { prop: 'id', label: '用户ID', width: 200 },
  { prop: 'username', label: '用户名', width: 120 },
  { prop: 'name', label: '昵称', width: 120 },
  { prop: 'role', label: '角色', width: 100 },
  { prop: 'email', label: '邮箱', width: 180 },
  { prop: 'status', label: '状态', width: 100, slot: true },
  { prop: 'createdAt', label: '创建时间', width: 160 },
  { prop: 'updatedAt', label: '更新时间', width: 160 },
  {
    prop: 'actions',
    label: '操作',
    minWidth: 240,
    slot: true,
    getActions: (row: User, index: number) => [
      {
        label: '查看',
        onClick: (rowCb: User) => handleView(rowCb),
      },
      {
        label: '编辑',
        type: 'primary',
        onClick: (rowCb: User) => handleEdit(rowCb),
      },
      {
        label: '删除',
        type: 'danger',
        onClick: (rowCb: User) => handleDelete(rowCb),
      },
      {
        label: '重置密码',
        type: 'warning',
        onClick: (rowCb: User) => handleResetPassword(rowCb),
      },
    ],
  },
])

onMounted(() => {
  fetchUsersList()
})

async function fetchUsersList() {
  isLoading.value = true
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      ...filter.value,
    }
    const res = await getUsers(params)
    usersList.value = res.data
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch users:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    isLoading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchUsersList()
}

function handleReset() {
  filter.value = { id: '', username: '', status: '', registeredAt: '' }
  page.value = 1
  fetchUsersList()
}

function handlePageChange(newPage: number) {
  page.value = newPage
  fetchUsersList()
}

function handlePageSizeChange(newPageSize: number) {
  pageSize.value = newPageSize
  page.value = 1
  fetchUsersList()
}

function openAddDialog() {
  isEdit.value = false
  resetDialogForm()
  showDialog.value = true
}

function openEditDialog(row: User) {
  isEdit.value = true
  dialogForm.value = { ...row, _id: row.id, avatarFile: null }
  showDialog.value = true
}

function resetDialogForm() {
  dialogForm.value = {
    username: '',
    name: '',
    role: '',
    email: '',
    avatar: '',
    avatarFile: null,
    status: 'active',
    _id: undefined,
  }
}

async function handleDialogSubmit(form: Partial<User>) {
  let avatarUrl = form.avatar
  if (form.avatarFile) {
    console.warn('uploadFile function is not implemented yet')
    avatarUrl = form.avatarFile ? URL.createObjectURL(form.avatarFile) : ''
  }
  const submitData = { ...form, avatar: avatarUrl }
  delete submitData._id
  delete submitData.avatarFile

  try {
    if (isEdit.value) {
      if (!form.id) {
        ElMessage.error('用户ID不存在，无法编辑')
        return
      }
      await updateUser(form.id, submitData as User)
      ElMessage.success('用户编辑成功')
    } else {
      const password = generateRandomPassword()
      await addUser({ ...submitData, password } as User)
      showPasswordTip(password, '用户添加成功，初始密码为：')
    }
    fetchUsersList()
    showDialog.value = false
    resetDialogForm()
  } catch (e) {
    console.error('Dialog submit error:', e)
    ElMessage.error('操作失败，请重试')
  }
}

function handleView(row: User) {
  detailData.value = row
  showDetail.value = true
}

function handleEdit(row: User) {
  openEditDialog(row)
}

function handleDelete(row: User) {
  ElMessageBox.confirm(`确定要删除用户：${row.username} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteUser(row.id as string)
        ElMessage.success('用户删除成功')
        fetchUsersList()
      } catch (error) {
        console.error('Delete user error:', error)
        ElMessage.error('删除失败，请重试')
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}

function generateRandomPassword(length = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

async function handleResetPassword(row: User) {
  const password = generateRandomPassword()
  try {
    await updateUser(row.id as string, { password } as Partial<User>)
    showPasswordTip(password)
  } catch (error) {
    console.error('Reset password error:', error)
    ElMessage.error('重置密码失败')
  }
}

async function validateGithubUsername(rule: any, value: string, callback: (error?: Error) => void) {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }
  const githubUsernameReg = /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/
  if (!githubUsernameReg.test(value)) {
    return callback(
      new Error('用户名仅支持字母、数字、单个"-",不能以"-"开头/结尾，不能连续"-",长度1-39'),
    )
  }
  try {
    const res = await getUsers({ username: value })
    const usersData = res.data?.list || res.data || res || []
    if (usersData && usersData.length > 0) {
      const editingId = dialogForm.value._id || dialogForm.value.id
      const exist = usersData.find((u: User) => u.id !== editingId && u.username === value)
      if (exist) {
        return callback(new Error('用户名已存在'))
      }
    }
    callback()
  } catch (error) {
    console.error('Error validating username:', error)
    callback(new Error('验证用户名时出错，请重试'))
  }
}

function showPasswordTip(password: string, msg = '密码已重置，新的初始密码为：') {
  return ElMessageBox.alert(
    `${msg}<b style="color:#409EFF">${password}</b>，请妥善保存！`,
    '提示',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '知道了',
    },
  )
}

async function uploadFile(file: File): Promise<string> {
  console.warn('uploadFile function is a placeholder and not fully implemented.')
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(URL.createObjectURL(file))
    }, 500)
  })
}
</script>

<style scoped lang="scss">
.user-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(31, 56, 88, 0.1);
  padding: 24px 24px 8px 24px;
  margin-bottom: 24px;
  transition: background 0.3s;
}
</style>
