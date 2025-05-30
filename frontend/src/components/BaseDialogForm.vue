<template>
  <el-dialog :title="title" v-model="visible" width="700px" @close="handleCancel" destroy-on-close>
    <el-form :model="form" :rules="rules" ref="formRef" label-width="140px">
      <el-form-item
        v-for="field in fields"
        :key="field.prop"
        :label="field.label"
        :prop="field.prop"
        :rules="field.rules"
      >
        <el-input
          v-if="field.type === 'input'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder"
          :disabled="field.disabled"
          style="width: 320px"
        />
        <el-input-number
          v-else-if="field.type === 'number'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder"
          :min="field.min"
          :max="field.max"
          :disabled="field.disabled"
          style="width: 320px"
        />
        <el-select
          v-else-if="field.type === 'select'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder"
          :disabled="field.disabled"
          style="width: 320px"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-else-if="field.type === 'date'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder"
          type="date"
          value-format="YYYY-MM-DD"
          :disabled="field.disabled"
          style="width: 320px"
        />
        <el-select
          v-else-if="field.type === 'factory-select'"
          v-model="form[field.prop]"
          :placeholder="field.placeholder"
          :multiple="true"
          :disabled="field.disabled"
          style="width: 320px"
        >
          <el-option
            v-for="opt in field.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <template v-else-if="field.type === 'custom-upload'">
          <slot :name="field.prop" :form="form" :field="field" />
        </template>
        <template v-else-if="field.type === 'goods-list'">
          <slot :name="field.prop" :form="form" :field="field" />
        </template>
        <!-- 可扩展更多类型 -->
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleOk">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  title: string
  fields: Array<any>
  formData?: Record<string, any>
}>()
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const visible = ref(props.modelValue)
watch(
  () => props.modelValue,
  v => (visible.value = v),
)
watch(visible, v => emit('update:modelValue', v))

const form = computed({
  get: () => props.formData,
  set: v => Object.assign(props.formData, v),
})

const formRef = ref()
const rules = {}

function handleOk() {
  formRef.value?.validate?.((valid: boolean) => {
    if (valid) {
      emit('submit', { ...form.value })
      visible.value = false
    }
  })
}
function handleCancel() {
  emit('cancel')
  visible.value = false
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 16px !important;
  box-shadow: 0 8px 32px 0 rgba(31, 56, 88, 0.12) !important;
  background: #fff;
  color: #222;
  transition: background 0.3s;
}
:global(html.dark) :deep(.el-dialog) {
  background: #23272e !important;
  color: #e0e6ed !important;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.45) !important;
}
:global(html.dark) :deep(.el-form-item),
:global(html.dark) :deep(.el-form) {
  color: #e0e6ed !important;
}
:global(html.dark) :deep(.el-input__wrapper),
:global(html.dark) :deep(.el-input__inner) {
  background: #23272e !important;
  color: #e0e6ed !important;
  border-color: #30343b !important;
}
:global(html.dark) :deep(.el-button) {
  background: #23272e !important;
  color: #8ec8ff !important;
  border-color: #30343b !important;
}
:deep(.el-dialog__header) {
  font-size: 20px;
  font-weight: 600;
  color: #3a5afe;
  padding-top: 24px;
}
:deep(.el-dialog__body) {
  padding: 32px 32px 12px 32px !important;
}
:deep(.el-form-item) {
  margin-bottom: 24px !important;
}
:deep(.el-input__wrapper),
:deep(.el-input__inner) {
  border-radius: 8px !important;
  font-size: 16px;
}
:deep(.el-button) {
  border-radius: 8px !important;
  font-size: 16px;
  height: 40px;
}
</style>
