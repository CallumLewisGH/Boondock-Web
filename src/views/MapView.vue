<template>
  <!-- CHANGE: Replace h-full with h-screen for full viewport height -->
  <div class="h-screen relative">
    <!-- Map with your custom style -->
    <MapboxMap
      v-if="mapboxToken"
      :access-token="mapboxToken"
      @search="$router.push('/app/search')"
      @location-found="handleLocationFound"
    />
    
    <!-- Loading state -->
    <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading your custom map...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MapboxMap from '@/components/MapboxMap.vue'

const router = useRouter()
const mapboxToken = ref<string>('')

onMounted(() => {
  // Get your token
  mapboxToken.value = import.meta.env.VITE_MAPBOX_TOKEN || ''
  
  if (!mapboxToken.value) {
    console.error('Add VITE_MAPBOX_TOKEN to your .env file')
  }
})

const handleLocationFound = (lat: number, lng: number) => {
  console.log('Custom map location:', lat, lng)
}
</script>

<style scoped>
/* Add this to ensure proper sizing */
.h-screen {
  height: 100vh; /* Full viewport height */
}
</style>