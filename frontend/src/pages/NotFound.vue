<template>
  <div class="not-found">
    <h1>404 - 页面未找到</h1>
    <p>您访问的页面不存在或已被删除。</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 100px;
}
</style>
