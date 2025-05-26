<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrders } from '@/api/orders'
import { getCustomers } from '@/api/customers'
import { getGoods } from '@/api/goods'

const router = useRouter()

const orderCount = ref(0)
const customerCount = ref(0)
const goodsCount = ref(0)

async function fetchStats() {
  const [orders, customers, goods] = await Promise.all([getOrders(), getCustomers(), getGoods()])
  orderCount.value = (orders.data || orders).length || 0
  customerCount.value = (customers.data || customers).length || 0
  goodsCount.value = (goods.data || goods).length || 0
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
  <div class="dashboard-content-wrapper" style="min-height: 80vh; overflow-y: auto; padding: 20px">
    <el-row :gutter="20" style="margin-top: 0">
      <el-col :span="24">
        <el-card>
          <h1>欢迎使用订单管理系统</h1>
          <p>本系统支持订单的创建、编辑、删除、合同上传等功能。</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
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
    </el-row>
    <el-row :gutter="20" style="margin-top: 0px">
      <el-col :span="24">
        <el-card>
          <el-button type="primary" @click="goOrders" size="large">进入订单管理</el-button>
          <el-button type="success" @click="goAddOrder" size="large" style="margin-left: 16px"
            >快速添加订单</el-button
          >
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
// .el-row { // Removed global margin: 0 as it might be better handled by the wrapper or specific needs
//   margin: 0;
// }
.el-col {
  min-width: 0;
}
:deep(.el-card) {
  margin-bottom: 20px;
}

.dashboard-content-wrapper {
  // Additional styles for the wrapper if needed
  // e.g., box-sizing: border-box;
}
</style>
