<template>
  <div class="h-screen flex flex-col" style="background-color: var(--bg-color);">
    <!-- Top Navigation -->
    <Header />
    
    <!-- Main Content Area -->
    <div class="flex-1 relative pt-16"> <!-- pt-16 to account for fixed header -->
      <!-- Map (always visible) -->
      <MapView />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import MapView from '@/views/MapView.vue'
</script>