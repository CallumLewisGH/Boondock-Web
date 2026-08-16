<template>
  <div class="h-screen flex flex-col transition-colors duration-300"
       :style="{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', paddingBottom: 'env(safe-area-inset-bottom)' }">
    <Header />
    <main class="flex-1 overflow-y-auto" :style="{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/App/Header.vue'
</script>