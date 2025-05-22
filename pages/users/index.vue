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
        v-model:modelValue="filter"
        :fields="filterFields"
        @search="handleSearch"
        @reset="handleReset"
      />
      <BaseTable :goods="usersList" :columns="columns" @edit="handleEdit" @delete="handleDelete">
        <template #actions="{ row, $index }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          <el-button type="warning" size="small" @click="handleResetPassword(row)"
            >重置密码</el-button
          >
        </template>
        <template #status="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '正常' : '禁用' }}
          </el-tag>
        </template>
      </BaseTable>
      <BaseDialogForm
        v-model:modelValue="showDialog"
        :title="isEdit ? '编辑用户' : '添加用户'"
        :fields="addFields"
        :formData="dialogForm"
        @submit="handleDialogSubmit"
        @update:modelValue="
          val => {
            if (!val) resetDialogForm()
          }
        "
      >
        <template #avatar="{ form }">
          <ImageUpload v-model="form.avatar" @file-change="file => (form.avatarFile = file)" />
        </template>
      </BaseDialogForm>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNuxtApp } from '#app'
import BaseFilter from '@/components/BaseFilter.vue'
import BaseTable from '@/components/BaseTable.vue'
import BaseDialogForm from '@/components/BaseDialogForm.vue'
import ImageUpload from '@/components/ImageUpload.vue'
import { ElMessageBox } from 'element-plus'
import { getUsers, addUser, updateUser, deleteUser } from '@/api/users'

const statusMap = {
  active: '正常',
  inactive: '禁用',
}
const filter = ref({ id: '', username: '', status: '', registeredAt: '' })
const filterFields = [
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
]

const showDialog = ref(false)
const isEdit = ref(false)
const dialogForm = ref({
  username: '',
  name: '',
  role: '',
  email: '',
  avatar: '',
  avatarFile: null,
  status: 'active',
  _id: undefined,
})

const addFields = [
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
    type: 'input',
    placeholder: '请输入角色',
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
]

const columns = [
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
    minWidth: 180,
    slot: true,
  },
]

const usersList = ref([])

onMounted(fetchUsers)

async function fetchUsers() {
  // 使用API函数获取用户列表数据
  const res = await getUsers(filter.value)
  usersList.value = (res.data.data || res).map(item => ({
    ...item,
    createdAt: item.createdAt || '',
    updatedAt: item.updatedAt || '',
  }))
}

function handleSearch(f: any) {
  fetchUsers().then(() => {
    usersList.value = usersList.value.filter((item: any) => {
      const matchId = !f.id || item.id.includes(f.id)
      const matchUsername = !f.username || item.username.includes(f.username)
      const matchStatus = !f.status || item.status === f.status
      const matchDate = !f.registeredAt || item.registeredAt.startsWith(f.registeredAt)
      return matchId && matchUsername && matchStatus && matchDate
    })
  })
}

function handleReset() {
  filter.value = { id: '', username: '', status: '', registeredAt: '' }
  fetchUsers()
}

function openAddDialog() {
  isEdit.value = false
  resetDialogForm()
  showDialog.value = true
}

function openEditDialog(row: any) {
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

async function handleDialogSubmit(form: any) {
  let avatarUrl = form.avatar
  if (form.avatarFile) {
    avatarUrl = await uploadFile(form.avatarFile)
  }
  const submitData = { ...form, avatar: avatarUrl }
  delete submitData._id
  if (isEdit.value) {
    await updateUser(form._id, submitData)
  } else {
    const password = generateRandomPassword()
    await addUser({ ...submitData, password })
    showPasswordTip(password, '用户添加成功，初始密码为：')
  }
  fetchUsers()
  showDialog.value = false
  resetDialogForm()
}

function handleEdit(row: any) {
  openEditDialog(row)
}

function handleDelete(row: any) {
  ElMessageBox.confirm(`确定要删除用户：${row.username} 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteUser(row.id).then(() => {
      fetchUsers()
    })
  })
}

function generateRandomPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let pwd = ''
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return pwd
}

async function handleResetPassword(row: any) {
  const password = generateRandomPassword()
  await updateUser(row.id, { password })
  showPasswordTip(password)
}

async function validateGithubUsername(rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('用户名不能为空'))
  }
  // GitHub 用户名正则
  const githubUsernameReg = /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$/
  if (!githubUsernameReg.test(value)) {
    return callback(
      new Error('用户名仅支持字母、数字、单个\"-\",不能以\"-\"开头/结尾，不能连续\"-\",长度1-39'),
    )
  }
  // 异步唯一性校验
  const res = await getUsers({ username: value })
  if (res.data.data && res.data.data.length > 0) {
    // 如果是编辑，允许和自己重名
    const editingId = dialogForm.value._id
    const exist = res.data.data.find(u => u.id !== editingId)
    if (exist) {
      return callback(new Error('用户名已存在'))
    }
  }
  callback()
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

async function uploadFile(file: File) {
  // 实现文件上传逻辑
  // 这里应该返回上传后的文件URL
  return URL.createObjectURL(file)
}

function validateUsername(rule: any, value: any, callback: any) {
  // ... existing code ...
}

function validateEmail(rule: any, value: any, callback: any) {
  // ... existing code ...
}

function validatePassword(rule: any, value: any, callback: any) {
  // ... existing code ...
}

function uploadAvatar(u: any) {
  // ... existing code ...
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
