<template>
  <div class="h-full w-full relative"> 
    <MapboxMap
      v-if="mapboxToken"
      :access-token="mapboxToken"
      @search="$router.push('/app/search')"
      @location-found="handleLocationFound"
      @campsite-created="handleNewCampsite"
    />
    
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MapboxMap from '@/components/App/MapboxMap.vue'

const mapboxToken = ref<string>('')

onMounted(() => {
  mapboxToken.value = import.meta.env.VITE_MAPBOX_TOKEN || ''
})

const handleLocationFound = (lat: number, lng: number) => {
  console.log('Map focus:', lat, lng)
}

const handleNewCampsite = (campsite: any) => {
  console.log('New campsite saved:', campsite)
}
</script>