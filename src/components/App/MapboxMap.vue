<template>
  <div ref="mapContainer" class="map-container" :class="{ 'is-adding': isCreationMode }">
    <CampsiteSidebar 
      :is-open="sidebarOpen"
      :campsite-id="selectedCampsiteId"
      @close="closeSidebar"
      @toggle="toggleSidebar"
      @updated="handleCampsiteUpdated"
      @deleted="handleCampsiteDeleted"
    />

    <div class="absolute top-6 right-6 flex flex-col gap-3 z-10">      
  <button @click="toggleLayer" class="control-btn" :title="showSatellite ? 'Topographical' : 'Satellite'">
    <span>{{ showSatellite ? '🌲' : '🛰️' }}</span>
  </button>

  <button @click="locateUser" class="control-btn" title="Find my location">
    <span>🎯</span>
  </button>

  <button @click="resetNorth" class="control-btn" title="Reset North">
    <span :style="{ transform: `rotate(${mapBearing}deg)`, display: 'inline-block' }">🧭</span>
  </button>

  <button 
    @click="toggleCreationMode"
    class="control-btn"
    :class="{ 'active-mode': isCreationMode }"
    title="Add a new campsite"
  >
    <span v-if="!isCreationMode">⛺</span>
    <span v-else>✕</span>
  </button>
</div>

    <div v-if="isCreationMode && !tempCoords" class="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div class="px-4 py-2 rounded-full bg-black/70 text-white text-sm backdrop-blur-md border border-white/20">
        Tap the map to drop a pin
      </div>
    </div>

    <transition name="pop">
      <div v-if="tempCoords" class="creation-overlay">
        <div class="creation-card">
          <div class="card-header">
            <div>
              <h3 class="text-lg font-bold">Discover New Spot</h3>
              <p class="text-xs opacity-60">Fine-tune location by dragging the pin</p>
            </div>
          </div>
          
          <div class="p-5 space-y-4">
            <div class="input-group">
              <label>Campsite Name</label>
              <input v-model="newCamp.Name" placeholder="e.g. Hidden Creek Peak" />
            </div>
            
            <div class="input-group">
              <label>Description</label>
              <textarea v-model="newCamp.Description" placeholder="What makes this spot special?" rows="2"></textarea>
            </div>

            <div class="flex gap-3 pt-2">
              <button @click="cancelCreation" class="btn-secondary">Cancel</button>
              <button 
                @click="submitCampsite" 
                :disabled="!newCamp.Name || isSubmitting"
                class="btn-primary"
              >
                {{ isSubmitting ? 'Saving...' : 'Drop Pin' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, shallowRef } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import CampsiteSidebar from './CampsiteSidebar.vue'
import { CampsitesService } from '@/services/CampsitesService'
import type { CampsiteProfile } from '@/api'

const props = defineProps<{ accessToken: string }>()
const emit = defineEmits<{
  locationFound: [lat: number, lng: number],
  campsiteCreated: [campsite: CampsiteProfile]
}>()

const mapContainer = ref<HTMLElement>()
const map = shallowRef<mapboxgl.Map>()
const showSatellite = ref(false)

// Sidebar state
const sidebarOpen = ref(false)
const selectedCampsiteId = ref<string | null>(null)

// Marker Management
const campsiteMarkers = shallowRef<mapboxgl.Marker[]>([])
const tempMarker = shallowRef<mapboxgl.Marker | null>(null)

// Creation State
const isCreationMode = ref(false)
const isSubmitting = ref(false)
const tempCoords = ref<{ lat: number, lng: number } | null>(null)
const newCamp = reactive({ Name: '', Description: '' })

onMounted(async () => {
  await nextTick()
  if (!mapContainer.value || !props.accessToken) return
  
  mapboxgl.accessToken = props.accessToken
  map.value = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [-1.1743, 52.3555],
    zoom: 5.5,
    projection: {name: 'mercator'},
    attributionControl: false
  })

  map.value.on('load', () => {
    // 1. Initial Load of all campsites
    refreshCampsites()
  })

  map.value.on('click', (e) => {
    if (!isCreationMode.value) return
    handleMapClick(e.lngLat.lng, e.lngLat.lat)
  })
})

/**
 * Fetches all campsites from the API and renders them as markers
 */
const refreshCampsites = async () => {
  if (!map.value) return

  const result = await CampsitesService.searchCampsites()
  if (!result.data) return

  // Clear existing markers from map
  campsiteMarkers.value.forEach(m => m.remove())
  campsiteMarkers.value = []

  // Add new markers
  // ... inside refreshCampsites loop ...
  result.data.forEach((camp: CampsiteProfile) => {
    // Check for both casing styles just to be safe
    const lat = camp.latitude ?? camp.latitude
    const lng = camp.longitude ?? camp.longitude

    if (lat && lng) {
      // 1. Create the Wrapper (Mapbox controls this)
      const wrapper = document.createElement('div')
      wrapper.className = 'marker-wrapper'

      // 2. Create the Inner Content (We control this)
      const content = document.createElement('div')
      content.className = 'campsite-marker'
      content.innerHTML = '⛺'
      
      // Append content to wrapper
      wrapper.appendChild(content)

      // 3. Create Marker passing the WRAPPER
      const marker = new mapboxgl.Marker({ element: wrapper })
        .setLngLat([lng, lat])
        .addTo(map.value!)

      // 4. Click event goes on the wrapper or content
      wrapper.addEventListener('click', (e) => {
        e.stopPropagation()
        selectedCampsiteId.value = camp.id || camp.name || ''
        sidebarOpen.value = true
      })

      campsiteMarkers.value.push(marker)
    }
  })
}

const toggleCreationMode = () => {
  isCreationMode.value = !isCreationMode.value
  if (!isCreationMode.value) cancelCreation()
}

const handleMapClick = (lng: number, lat: number) => {
  if (tempMarker.value) tempMarker.value.remove()
  tempCoords.value = { lat, lng }
  
  const el = document.createElement('div')
  el.className = 'custom-tent-marker active-pin'
  el.innerHTML = '⛺'

  tempMarker.value = new mapboxgl.Marker({ element: el, draggable: true })
    .setLngLat([lng, lat])
    .addTo(map.value!)
}

const submitCampsite = async () => {
  if (!tempCoords.value || !newCamp.Name || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const res = await CampsitesService.createCampsite({
      Name: newCamp.Name,
      Description: newCamp.Description,
      Latitude: tempCoords.value.lat,
      Longitude: tempCoords.value.lng
    })
    if (res.data) {
      emit('campsiteCreated', res.data)
      cancelCreation()
      refreshCampsites() // 2. Refresh the map so the new spot appears for everyone
    }
  } finally {
    isSubmitting.value = false
  }
}

const cancelCreation = () => {
  isCreationMode.value = false
  tempCoords.value = null
  newCamp.Name = ''; newCamp.Description = ''
  if (tempMarker.value) { tempMarker.value.remove(); tempMarker.value = null }
}

const toggleLayer = () => {
  if (!map.value) return
  showSatellite.value = !showSatellite.value
  map.value.setStyle(showSatellite.value ? 'mapbox://styles/mapbox/satellite-streets-v12' : 'mapbox://styles/mapbox/outdoors-v12')
  
  // Changing style removes all markers, so we re-add them after the style loads
  map.value.once('style.load', () => refreshCampsites())
}

const mapBearing = ref(0)

// Inside onMounted, after initializing map.value:
map.value?.on('rotate', () => {
  // Update our ref so the UI icon rotates with the map
  mapBearing.value = map.value ? -map.value.getBearing() : 0
})

/**
 * Uses the browser Geolocation API to fly to the user
 */
const locateUser = () => {
  if (!map.value) return
  
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      map.value?.flyTo({
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: 14,
        essential: true
      })
    },
    (err) => {
      console.error("Locate failed:", err)
      alert("Could not find your location. Please check your browser permissions.")
    },
    { enableHighAccuracy: true }
  )
}

/**
 * Resets map rotation to North (0 degrees)
 */
const resetNorth = () => {
  if (!map.value) return
  map.value.easeTo({
    bearing: 0,
    pitch: 0, // Optional: flattens the map if you were in 3D mode
    duration: 1000
  })
}

const closeSidebar = () => {
  sidebarOpen.value = false
  selectedCampsiteId.value = null
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleCampsiteUpdated = (campsite: CampsiteProfile) => {
  // Optionally refresh markers if needed
  refreshCampsites()
}

const handleCampsiteDeleted = () => {
  closeSidebar()
  refreshCampsites()
}

onUnmounted(() => map.value?.remove())
</script>

<style scoped>
.map-container {
  position: absolute;
  inset: 0;
  background-color: var(--surface);
}

.is-adding { cursor: crosshair !important; }

/* Control Buttons */
.control-btn {
  width: 48px;
  height: 48px;
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}
.control-btn:hover { transform: translateY(-2px); border-color: var(--accent); }
.active-mode { background-color: var(--accent) !important; color: white !important; }

:deep(.marker-wrapper) {
  cursor: pointer;
  /* Optional: keeps the click target size reasonable */
  width: 30px; 
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Inner content that we can animate freely */
:deep(.campsite-marker) {
  font-size: 1.5rem;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* That fun bounce */
  will-change: transform;
}

/* Hover effect targets the child when wrapper is hovered */
:deep(.marker-wrapper:hover .campsite-marker) {
  transform: scale(1.5) translateY(-5px);
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

/* New Pin Dragging Marker */
:deep(.custom-tent-marker.active-pin) {
  font-size: 2.5rem;
  cursor: grab;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.4));
}

.creation-overlay {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  z-index: 20;
}

.creation-card {
  background-color: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.card-header {
  padding: 16px 24px;
  background: linear-gradient(to bottom, var(--surface), var(--card-bg));
  border-bottom: 1px solid var(--border);
}

.input-group { display: flex; flex-direction: column; gap: 4px; }
.input-group label { font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; }
.input-group input, .input-group textarea {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text-color);
  border-radius: 10px;
  padding: 12px;
  font-size: 0.95rem;
}

.btn-primary { flex: 2; background: var(--accent); color: white; border-radius: 12px; font-weight: 700; padding: 14px; }
.btn-secondary { flex: 1; color: var(--muted); font-weight: 600; }

.pop-enter-active, .pop-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translate(-50%, 100px); }
</style>