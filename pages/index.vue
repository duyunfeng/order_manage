<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNuxtApp } from '#app'
import { getOrders } from '@/api/orders'
import { getCustomers } from '@/api/customers'
import { getGoods } from '@/api/goods'

const { $axios } = useNuxtApp()
const router = useRouter()

const orderCount = ref(0)
const customerCount = ref(0)
const goodsCount = ref(0)

async function fetchStats() {
  const [orders, customers, goods] = await Promise.all([getOrders(), getCustomers(), getGoods()])
  orderCount.value = (orders.data.data || orders).length || 0
  customerCount.value = (customers.data.data || customers).length || 0
  goodsCount.value = (goods.data.data || goods).length || 0
}

function goOrders() {
  router.push('/orders')
}

function goAddOrder() {
  router.push('/orders?add=1')
}

onMounted(() => {
  fetchStats()
})
</script>

<template>
  <el-row :gutter="20" style="margin-top: 40px">
    <el-col :span="24">
      <el-card>
        <h1>欢迎使用订单管理系统</h1>
        <p>本系统支持订单的创建、编辑、删除、合同上传等功能。</p>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <div style="display: flex; align-items: center">
          <el-icon style="font-size: 32px; color: #409eff; margin-right: 12px">
            <i class="el-icon-document"></i>
          </el-icon>
          <div>
            <div>订单总数</div>
            <div style="font-size: 24px; font-weight: bold">{{ orderCount }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <div style="display: flex; align-items: center">
          <el-icon style="font-size: 32px; color: #67c23a; margin-right: 12px">
            <i class="el-icon-user"></i>
          </el-icon>
          <div>
            <div>客户总数</div>
            <div style="font-size: 24px; font-weight: bold">{{ customerCount }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <div style="display: flex; align-items: center">
          <el-icon style="font-size: 32px; color: #e6a23c; margin-right: 12px">
            <i class="el-icon-goods"></i>
          </el-icon>
          <div>
            <div>商品总数</div>
            <div style="font-size: 24px; font-weight: bold">{{ goodsCount }}</div>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="24" style="margin-top: 20px">
      <el-card>
        <el-button type="primary" @click="goOrders" size="large">进入订单管理</el-button>
        <el-button type="success" @click="goAddOrder" size="large" style="margin-left: 16px"
          >快速添加订单</el-button
        >
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
.el-row {
  margin: 0;
}
.el-col {
  min-width: 0;
}
:deep(.el-card) {
  margin-bottom: 20px;
}
body,
html,
#__nuxt {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  min-height: 100vh;
}
.layout {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  background: #f0f2f5;
  overflow: hidden;
}
.sidebar {
  width: 220px;
  background: #263445;
  color: #fff;
  display: flex;
  flex-direction: column;
  .logo {
    display: flex;
    align-items: center;
    height: 60px;
    font-size: 20px;
    font-weight: bold;
    padding-left: 24px;
    border-bottom: 1px solid #1e293b;
    .title {
      margin-left: 8px;
    }
  }
  nav {
    flex: 1;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        margin: 0;
        a {
          display: block;
          color: #bfcbd9;
          padding: 16px 24px;
          text-decoration: none;
          transition:
            background 0.2s,
            color 0.2s;
          border-left: 4px solid transparent;
        }
        a.active,
        a.router-link-exact-active {
          background: #1e293b;
          color: #409eff;
          border-left: 4px solid #409eff;
        }
        a:hover {
          background: #1e293b;
          color: #fff;
        }
      }
    }
  }
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
  padding: 0 32px;
  border-bottom: 1px solid #eee;
  .user {
    font-weight: bold;
    color: #333;
  }
}
</style>
