<template>
  <div class="h-full w-full relative"> <MapboxMap
      v-if="mapboxToken"
      :access-token="mapboxToken"
      @search="$router.push('/app/search')"
      @location-found="handleLocationFound"
    />
    
    <div v-else class="absolute inset-0 flex items-center justify-center bg-gray-100">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading map...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MapboxMap from '@/components/MapboxMap.vue'

const mapboxToken = ref<string>('')

onMounted(() => {
  mapboxToken.value = import.meta.env.VITE_MAPBOX_TOKEN || ''
})

const handleLocationFound = (lat: number, lng: number) => {
  console.log('Map focus:', lat, lng)
}
</script>