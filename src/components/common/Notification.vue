<template>
  <div v-if="isVisible" class="p-4 rounded-lg border" 
       :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
    <div class="flex items-start gap-3">
      <span class="text-lg flex-shrink-0">{{ icon }}</span>
      <div class="flex-1">
        <h3 v-if="title" class="font-semibold text-sm mb-1" :style="{ color: 'var(--text-color)' }">
          {{ title }}
        </h3>
        <p class="text-sm" :style="{ color: 'var(--muted)' }">
          <slot>{{ message }}</slot>
        </p>
        <div v-if="$slots.actions" class="mt-3 flex gap-2">
          <slot name="actions" />
        </div>
      </div>
      <button
        v-if="closable"
        @click="close"
        class="flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
        :style="{ color: 'var(--muted)' }"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  icon?: string
  title?: string
  message?: string
  closable?: boolean
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'ℹ',
  closable: true,
  duration: 5000
})

const isVisible = ref(true)

function close() {
  isVisible.value = false
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

defineExpose({
  close,
  isVisible
})
</script>
