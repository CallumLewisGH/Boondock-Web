<template>
  <div ref="mapContainer" class="map-container" :class="{ 'is-adding': isCreationMode }">
    <CampsiteSidebar 
      :is-open="sidebarOpen"
      :campsite="selectedCampsite"
      @close="closeSidebar"
    />

    <div class="absolute top-6 right-6 flex flex-col gap-3 z-10">
      <button @click="toggleLayer" class="control-btn" :class="showSatellite ? 'control-btn--green' : 'control-btn--blue'" :title="showSatellite ? 'Topographical' : 'Satellite'">
        <PineTreeIcon v-if="showSatellite" class="w-5 h-5" />
        <GlobeAltIcon v-else class="w-5 h-5" />
      </button>
      <button @click="locateUser" class="control-btn control-btn--blue" title="Find my location">
        <ViewfinderCircleIcon class="w-5 h-5" />
      </button>
      <button @click="resetNorth" class="control-btn control-btn--orange" title="Reset North">
        <CompassIcon class="w-5 h-5" :style="{ transform: `rotate(${mapBearing}deg)`, display: 'inline-block' }" />
      </button>
      <button @click="toggleCreationMode" class="control-btn control-btn--orange" :class="{ 'active-mode': isCreationMode }">
        <XMarkIcon v-if="isCreationMode" class="w-5 h-5" />
        <TentIcon v-else class="w-5 h-5" />
      </button>
    </div>

    <div v-if="isCreationMode && !tempCoords" class="absolute top-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div class="px-4 py-2 rounded-full bg-black/70 text-white text-sm backdrop-blur-md border border-white/20">
        Tap the map to drop a pin
      </div>
    </div>

    <transition name="pop">
      <div v-if="tempCoords" class="creation-overlay">
        <div class="creation-card p-5 space-y-4">
          <h3 class="text-lg font-bold">Discover New Spot</h3>
          <div class="space-y-3">
            <div class="input-group">
              <label>Campsite Name</label>
              <input v-model="newCamp.Name" placeholder="Name this spot" />
            </div>
            <div class="input-group">
              <label>Description</label>
              <textarea v-model="newCamp.Description" placeholder="Tell us about it..." rows="2"></textarea>
            </div>
          </div>
          <div class="flex gap-3">
            <button @click="cancelCreation" class="btn-secondary">Cancel</button>
            <button @click="submitCampsite" :disabled="!newCamp.Name || isSubmitting" class="btn-primary">
              {{ isSubmitting ? 'Saving...' : 'Confirm Location' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, shallowRef, nextTick } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import CampsiteSidebar from './CampsiteSidebar.vue'
import { CampsitesService } from '@/services/CampsitesService'
import type { CampsiteProfile } from '@/api'
import { TentIcon, CompassIcon, PineTreeIcon } from '@/components/icons'
import { GlobeAltIcon, ViewfinderCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Mapbox markers are plain DOM nodes outside Vue's render tree, so the tent
// icon is inlined as raw SVG here rather than mounting a Vue component.
const TENT_MARKER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 21 19H3Z"/><path d="M12 4v15"/><path d="M9.5 19 12 13.5 14.5 19"/><path d="M2 19h20"/></svg>'

const props = defineProps<{ accessToken: string }>()
const mapContainer = ref<HTMLElement>()
const map = shallowRef<mapboxgl.Map>()
const showSatellite = ref(false)
const mapBearing = ref(0)

// UI State
const sidebarOpen = ref(false)
const selectedCampsite = ref<CampsiteProfile | null>(null)
const campsiteMarkers = shallowRef<mapboxgl.Marker[]>([])

// Creation State
const isCreationMode = ref(false)
const isSubmitting = ref(false)
const tempCoords = ref<{ lat: number, lng: number } | null>(null)
const tempMarker = shallowRef<mapboxgl.Marker | null>(null)
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
    projection: 'mercator',
    attributionControl: false
  })

  map.value.on('load', refreshCampsites)
  map.value.on('rotate', () => mapBearing.value = map.value ? -map.value.getBearing() : 0)
  map.value.on('click', (e) => {
    if (isCreationMode.value) handleMapClick(e.lngLat.lng, e.lngLat.lat)
  })
})

const refreshCampsites = async () => {
  if (!map.value) return
  const result = await CampsitesService.searchCampsites()
  if (!result.data) return

  campsiteMarkers.value.forEach(m => m.remove())
  campsiteMarkers.value = []

  result.data.forEach((camp) => {
    const el = document.createElement('div')
    el.className = 'marker-wrapper'
    el.innerHTML = `<div class="campsite-marker">${TENT_MARKER_SVG}</div>`
    
    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([camp.longitude, camp.latitude])
      .addTo(map.value!)

    el.addEventListener('click', (e) => {
      e.stopPropagation()
      selectedCampsite.value = camp
      sidebarOpen.value = true
    })

    campsiteMarkers.value.push(marker)
  })
}

const handleMapClick = (lng: number, lat: number) => {
  if (tempMarker.value) tempMarker.value.remove()
  tempCoords.value = { lat, lng }
  
  const el = document.createElement('div')
  el.className = 'custom-tent-marker active-pin'
  el.innerHTML = TENT_MARKER_SVG

  tempMarker.value = new mapboxgl.Marker({ element: el, draggable: true })
    .setLngLat([lng, lat])
    .on('dragend', () => {
      const pos = tempMarker.value?.getLngLat()
      if (pos) tempCoords.value = { lat: pos.lat, lng: pos.lng }
    })
    .addTo(map.value!)
}

const submitCampsite = async () => {
  if (!tempCoords.value || isSubmitting.value) return
  isSubmitting.value = true
  try {
    const res = await CampsitesService.createCampsite({
      name: newCamp.Name,
      description: newCamp.Description,
      latitude: tempCoords.value.lat,
      longitude: tempCoords.value.lng
    })
    if (res.data) {
      cancelCreation()
      refreshCampsites()
    }
  } finally { isSubmitting.value = false }
}

const toggleCreationMode = () => {
  isCreationMode.value = !isCreationMode.value
  if (!isCreationMode.value) cancelCreation()
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
  map.value.once('style.load', refreshCampsites)
}

const locateUser = () => {
  navigator.geolocation.getCurrentPosition((pos) => {
    map.value?.flyTo({ center: [pos.coords.longitude, pos.coords.latitude], zoom: 14 })
  })
}

const resetNorth = () => map.value?.easeTo({ bearing: 0, duration: 1000 })
const closeSidebar = () => { sidebarOpen.value = false; selectedCampsite.value = null }

onUnmounted(() => map.value?.remove())
</script>

<style scoped>
/* Re-use your existing styles here */
.map-container { position: absolute; inset: 0; }
.control-btn {
  width: 44px; height: 44px; border: 1px solid var(--border); border-radius: 12px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.15s, background 0.15s;
}
.control-btn:hover { transform: scale(1.06); }
.control-btn--orange { background: var(--card-bg); border-color: var(--accent); color: var(--accent); }
.control-btn--blue { background: var(--card-bg); border-color: rgb(59, 130, 246); color: rgb(59, 130, 246); }
.control-btn--green { background: var(--card-bg); border-color: rgb(34, 197, 94); color: rgb(34, 197, 94); }
.active-mode { background: var(--accent) !important; border-color: var(--accent) !important; color: white !important; }
:deep(.campsite-marker) {
  width: 34px; height: 34px; padding: 7px; box-sizing: border-box;
  display: flex; align-items: center; justify-content: center;
  background: var(--card-bg); color: var(--accent);
  border: 2px solid var(--accent); border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s; cursor: pointer;
}
:deep(.campsite-marker svg) { width: 100%; height: 100%; }
:deep(.marker-wrapper:hover .campsite-marker) { transform: scale(1.3) translateY(-5px); }
:deep(.custom-tent-marker) {
  width: 38px; height: 38px; padding: 8px; box-sizing: border-box;
  display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: white; border-radius: 50%;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
}
:deep(.custom-tent-marker svg) { width: 100%; height: 100%; }
.creation-overlay { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 380px; z-index: 20; }
.creation-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
.input-group input, .input-group textarea { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text-color); padding: 10px; border-radius: 8px; }
.btn-primary { background: var(--accent); color: white; padding: 10px 20px; border-radius: 8px; font-weight: bold; flex: 2; }
.btn-secondary { color: var(--muted); flex: 1; }
</style>