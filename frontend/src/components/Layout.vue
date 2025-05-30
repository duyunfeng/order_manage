<template>
  <div class="layout">
    <aside class="sidebar" :style="{ width: sidebarWidth }">
      <div class="logo">
        <span>🌿</span>
        <span class="title" v-if="showLogoTitle">订单管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical-demo"
        background-color="#263445"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :collapse="isCollapse"
        :router="true"
      >
        <template v-for="item in menuItems" :key="item.path">
          <el-sub-menu v-if="item.children" :index="item.path">
            <template #title>
              <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="sub in item.children" :key="sub.path" :index="sub.path">
              <el-icon v-if="sub.icon"><component :is="sub.icon" /></el-icon>
              <span>{{ sub.title }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.path">
            <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>
    <div class="main-area">
      <header class="header">
        <!--菜单控制-->
        <div class="header-left">
          <span class="toggle-btn" @click="toggleSidebar">
            <el-icon v-if="!isCollapse"><Fold /></el-icon>
            <el-icon v-else><Expand /></el-icon>
          </span>
          <span class="title">首页</span>
        </div>
        <div class="header-right" style="position: relative">
          <!--黑暗模式-->
          <el-switch v-model="isDarkMode" @change="toggleDarkMode" />
          <div
            class="user-dropdown-trigger"
            style="
              display: flex;
              align-items: center;
              cursor: pointer;
              user-select: none;
              outline: none;
            "
            @click="onUserDropdownClick"
            tabindex="0"
          >
            <el-avatar :size="32" style="margin-right: 8px" :src="userStore.user.avatar">
              {{ avatarText }}
            </el-avatar>
            {{ username }}
          </div>
          <div
            v-if="showUserDropdown"
            class="user-dropdown-menu"
            style="
              position: absolute;
              right: 0;
              top: 48px;
              background: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
              border-radius: 6px;
              min-width: 120px;
              z-index: 1000;
            "
          >
            <div
              class="user-dropdown-item"
              style="padding: 10px 20px; cursor: pointer; color: #333"
              @click="onLogoutClick"
            >
              退出系统
            </div>
          </div>
        </div>
      </header>
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as Icons from '@element-plus/icons-vue'
import { Fold, Expand } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const sidebarWidth = ref('220px')
const isCollapse = ref(false)
const showLogoTitle = ref(true)
const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

const userStore = useUserStore()
const username = computed(() => userStore.user.username)
const avatarText = computed(() => (username.value ? username.value[0].toUpperCase() : 'U'))

const isDarkMode = ref(false)
const showUserDropdown = ref(false)

const menuItems = computed(() => {
  // 只取一级菜单且show为true，按index排序
  return router
    .getRoutes()
    .filter(
      route =>
        route.meta &&
        route.meta.icon &&
        route.meta.show !== false &&
        !route.parent &&
        route.path !== '/login' &&
        route.path !== '/:pathMatch(.*)*' &&
        route.name !== undefined &&
        // 排除系统设置的子路由被提升为一级菜单
        route.name !== 'UserSetting' &&
        route.name !== 'MenuSetting',
    )
    .sort((a, b) => (a.meta?.index ?? 0) - (b.meta?.index ?? 0))
    .map(route => {
      // 系统设置特殊处理，带children
      if (route.name === 'SystemSetting' && route.children) {
        const children = route.children
          .filter(child => child.meta && child.meta.show !== false)
          .sort((a, b) => (a.meta?.index ?? 0) - (b.meta?.index ?? 0))
          .map(child => ({
            path: route.path + '/' + child.path,
            title: child.meta?.title || child.name,
            icon: (Icons as Record<string, any>)[child.meta?.icon] || Icons.Menu,
          }))
        return {
          path: route.path,
          title: route.meta.title || route.name,
          icon: (Icons as Record<string, any>)[route.meta.icon] || Icons.Setting,
          children,
        }
      }
      return {
        path: route.path,
        title: route.meta.title || route.name,
        icon: (Icons as Record<string, any>)[route.meta.icon] || Icons.HomeFilled,
      }
    })
})

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
  sidebarWidth.value = isCollapse.value ? '64px' : '220px'
}

function onUserDropdownClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  showUserDropdown.value = !showUserDropdown.value
}

function onLogoutClick() {
  showUserDropdown.value = false
  handleLogout()
}

function closeUserDropdown(e: MouseEvent) {
  const trigger = document.querySelector('.user-dropdown-trigger')
  const menu = document.querySelector('.user-dropdown-menu')
  if (trigger && trigger.contains(e.target as Node)) return
  if (menu && menu.contains(e.target as Node)) return
  showUserDropdown.value = false
}

const toggleDarkMode = () => {
  document.documentElement.classList.remove('light')
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('dark_mode', isDarkMode.value ? 'true' : 'false')
}

onMounted(() => {
  document.addEventListener('click', closeUserDropdown)
  document.documentElement.classList.toggle('dark')
  const local = localStorage.getItem('dark_mode')
  if (local === 'true') {
    isDarkMode.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDarkMode.value = false
    document.documentElement.classList.remove('dark')
  }
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeUserDropdown)
})

watch(isCollapse, val => {
  setTimeout(() => {
    showLogoTitle.value = !val
  }, 300)
})
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
  transition: background 0.3s;
}
.sidebar {
  background: #263445;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 220px;
  min-width: 64px;
  max-width: 220px;
}
.logo {
  display: flex;
  align-items: center;
  height: 60px;
  font-size: 20px;
  font-weight: bold;
  padding-left: 24px;
  border-bottom: 1px solid #1e293b;
  box-sizing: border-box;
  overflow: hidden;
  .title {
    margin-left: 8px;
    display: inline-block;
    white-space: nowrap;
  }
}
.el-menu {
  border-right: none;
  background: #263445;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}
.header {
  height: 56px;
  min-height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid #eee;
  .user {
    font-weight: bold;
    color: #333;
  }
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 56px;
  .toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #f5f5f5;
    }
  }
  .title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
    margin-left: 0;
  }
}
.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
  position: relative;
  .user-dropdown-trigger {
    display: flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
    outline: none;
    border-radius: 20px;
    padding: 4px 12px 4px 4px;
    transition: background 0.2s;
    &:hover {
      background: #f5f5f5;
    }
    .el-avatar {
      background: #e5eaf3;
      color: #222;
    }
    .username {
      font-weight: 500;
      color: #333;
      margin-left: 2px;
    }
  }
}
.main-content {
  flex: 1;
  min-height: 0;
  padding: 24px;
  background: #f0f2f5;
  overflow-y: auto;
}
.user-dropdown-menu {
  animation: fadeIn 0.2s;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 1000;
  .user-dropdown-item {
    padding: 10px 20px;
    cursor: pointer;
    color: #333;
    &:hover {
      background: #f5f5f5;
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    tansform: translateY(0);
  }
}
.user-dropdown-trigger {
  user-select: none;
  outline: none;
}
</style>
