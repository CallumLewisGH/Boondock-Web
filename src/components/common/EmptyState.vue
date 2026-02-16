<template>
  <div class="space-y-4">
    <div class="p-4 rounded-xl border text-center" 
         :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
      <div class="text-3xl mb-2">{{ icon }}</div>
      <h3 class="font-bold text-lg mb-1" :style="{ color: 'var(--text-color)' }">{{ title }}</h3>
      <p :style="{ color: 'var(--muted)' }">{{ message }}</p>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  message: string
}>()
</script>
