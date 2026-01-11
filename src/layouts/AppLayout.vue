<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <Header/>
    
    <div class="flex-1 relative">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/App/Header.vue'
</script>