<template>
  <div class="h-screen flex flex-col">
    <Header />
    <main class="flex-1 overflow-y-auto pt-16"> 
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/App/Header.vue'
</script>