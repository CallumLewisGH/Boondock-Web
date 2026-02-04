<template>
  <div ref="mapContainer" class="map-container">
    <!-- Controls -->
    <div class="absolute top-4 left-4 flex flex-col space-y-2 z-10">      
      <button 
        @click="toggleLayer"
        class="p-3 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition"
        :title="showSatellite ? 'Switch to topographical' : 'Switch to satellite'"
      >
        <span class="text-xl">{{ showSatellite ? '🌲' : '🛰️' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps<{
  accessToken: string
}>()

const emit = defineEmits<{
  search: []
  locationFound: [lat: number, lng: number]
}>()

const mapContainer = ref<HTMLElement>()
const map = ref<mapboxgl.Map>()
const showSatellite = ref(false)

onMounted(async () => {
  await nextTick()
  
  if (!mapContainer.value || !props.accessToken) {
    console.error('Missing container or token')
    return
  }
  
  // CRITICAL: Set explicit dimensions on the container
  const container = mapContainer.value
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.position = 'absolute'
  container.style.top = '0'
  container.style.left = '0'
  
  // Set token
  mapboxgl.accessToken = props.accessToken
  
  // Initialize map
  map.value = new mapboxgl.Map({
    container: container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [-98.5795, 39.8283],
    zoom: 3,
    attributionControl: false
  })
  
  // Add controls after load
  map.value.on('load', () => {
    console.log('Map loaded successfully')
    
    // Navigation controls
    map.value?.addControl(new mapboxgl.NavigationControl(), 'top-right')
    
    // Geolocation control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true
    })
    map.value?.addControl(geolocate, 'top-right')
    
    geolocate.on('geolocate', (e: any) => {
      emit('locationFound', e.coords.latitude, e.coords.longitude)
    })
    
    // Attribution
    map.value?.addControl(new mapboxgl.AttributionControl({ compact: true }))
    
    // Force resize after load
    setTimeout(() => {
      map.value?.resize()
    }, 100)
  })
  
  // Handle errors
  map.value.on('error', (e) => {
    console.error('Map error:', e.error)
  })
})

const locateUser = () => {
  if (!navigator.geolocation) {
    alert('Geolocation not supported')
    return
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords
      
      if (map.value) {
        map.value.flyTo({
          center: [longitude, latitude],
          zoom: 14
        })
        
        // Add marker
        new mapboxgl.Marker({
          color: '#ea580c'
        })
          .setLngLat([longitude, latitude])
          .addTo(map.value)
        
        emit('locationFound', latitude, longitude)
      }
    },
    (error) => {
      alert('Location error: ' + error.message)
    }
  )
}

const toggleLayer = () => {
  if (!map.value) return
  
  showSatellite.value = !showSatellite.value
  
  if (showSatellite.value) {
    // Satellite Streets is great for campers to see actual tree cover
    map.value.setStyle('mapbox://styles/mapbox/satellite-streets-v12')
  } else {
    // Outdoors is the gold standard for your base map
    map.value.setStyle('mapbox://styles/mapbox/outdoors-v12')
  }
}

onUnmounted(() => {
  map.value?.remove()
})
</script>

<style scoped>
/* CRITICAL: These styles ensure the map container has dimensions */
.map-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Ensure Mapbox canvas fills container */
.mapboxgl-canvas {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>