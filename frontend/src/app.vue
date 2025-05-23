<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/Layout.vue'
import EmptyLayout from '@/layouts/empty.vue'

const route = useRoute()
const layoutComponent = computed(() => {
  if (route.meta.layout === 'empty') return EmptyLayout
  return Layout
})
</script>
