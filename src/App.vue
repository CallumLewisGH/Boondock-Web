<template>
  <component :is="$route.meta.layout || 'div'">
    <div class="h-screen flex flex-col">
      <Header />
      
      <main class="flex-1 relative pt-16">
        <router-view></router-view>
      </main>
    </div>
  </component>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
</script>