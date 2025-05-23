<template>
  <el-form :inline="true" :model="modelValue" class="base-filter" @submit.prevent>
    <el-form-item v-for="item in fields" :key="item.prop" :label="item.label">
      <el-input
        v-if="item.type === 'input' || !item.type"
        v-model="modelValue[item.prop]"
        :placeholder="item.placeholder"
      />
      <el-select
        v-else-if="item.type === 'select'"
        v-model="modelValue[item.prop]"
        :placeholder="item.placeholder"
        style="width: 140px"
      >
        <el-option
          v-for="opt in item.options"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-date-picker
        v-else-if="item.type === 'date'"
        v-model="modelValue[item.prop]"
        :placeholder="item.placeholder"
        type="date"
        :value-format="item.valueFormat || 'YYYY-MM-DD'"
        style="width: 200px"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSearch">查询</el-button>
      <el-button @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
/**
 * 通用筛选组件
 * @prop modelValue 查询条件对象
 * @prop fields 筛选项配置数组 [{ prop, label, type, placeholder, options, valueFormat }]
 * @emits update:modelValue 用于v-model
 * @emits search 查询事件
 * @emits reset 重置事件
 */
const props = defineProps<{
  modelValue: Record<string, any>
  fields: Array<{
    prop: string
    label: string
    type?: string
    placeholder?: string
    options?: Array<{ label: string; value: any }>
    valueFormat?: string
  }>
}>()
const emit = defineEmits(['update:modelValue', 'search', 'reset'])

function onSearch() {
  emit('search', { ...props.modelValue })
}
function onReset() {
  const resetObj: Record<string, any> = {}
  props.fields.forEach(f => {
    resetObj[f.prop] = ''
  })
  emit('update:modelValue', resetObj)
  emit('reset')
}
</script>

<style scoped lang="scss">
.base-filter {
  margin-bottom: 16px;
}
:global(html.dark) .base-filter {
  background: transparent;
}
:global(html.dark) .el-form {
  color: #e0e6ed !important;
}
:global(html.dark) .el-input__wrapper {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-select {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-date-picker {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) .el-button {
  background: #23272e !important;
  color: #8ec8ff !important;
  border-color: #30343b !important;
}
</style>
