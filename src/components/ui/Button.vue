<template>
  <button
    :type="type"
    :disabled="disabled || isLoading"
    @click="handleClick"
    class="px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm"
    :style="{
      backgroundColor: variant === 'primary' ? 'var(--accent)' : variant === 'danger' ? 'rgb(239, 68, 68)' : 'var(--surface)',
      color: variant === 'primary' ? 'var(--header-text)' : variant === 'danger' ? 'white' : 'var(--text-color)',
      border: variant === 'outline' ? '1px solid var(--border)' : 'none'
    }"
  >
    <span v-if="isLoading" class="mr-2">⏳</span>
    {{ isLoading ? loadingText : label }}
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  label: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  disabled?: boolean
  loadingText?: string
}>()

const emit = defineEmits<{
  'click': []
}>()

const isLoading = ref(false)

function handleClick() {
  emit('click')
}

defineExpose({
  setLoading(loading: boolean) {
    isLoading.value = loading
  }
})
</script>
