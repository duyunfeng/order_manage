<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component, route }">
      <keep-alive :include="keepAliveIncludes">
        <component :is="Component" :key="route.name" />
      </keep-alive>
    </router-view>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Layout from '@/components/Layout.vue'
import EmptyLayout from '@/layouts/empty.vue'

const route = useRoute()
const router = useRouter()

const layoutComponent = computed(() => {
  if (route.meta.layout === 'empty') return EmptyLayout
  return Layout
})

const keepAliveIncludes = computed(() => {
  return router
    .getRoutes()
    .filter(r => r.meta.keepAlive && r.name)
    .map(r => r.name as string)
})
</script>
