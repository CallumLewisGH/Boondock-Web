<template>
  <div class="h-full relative" style="background-color: var(--bg-color);">
    <!-- Map Container (placeholder for now) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center p-8 rounded-xl shadow-lg" 
           style="background-color: var(--card-bg); border: 1px solid var(--border);">
        <div class="text-6xl mb-4">🗺️</div>
        <h2 class="text-2xl font-bold mb-2" style="color: var(--text-color);">Map View</h2>
        <p class="mb-4" style="color: var(--muted);">Interactive map will go here</p>
        <div class="space-y-2">
          <button 
            @click="locateUser"
            class="px-4 py-2 rounded-lg font-medium"
            style="background-color: var(--accent); color: white;"
          >
            📍 Find My Location
          </button>
          <button 
            @click="$router.push('/app/search')"
            class="px-4 py-2 rounded-lg font-medium"
            style="background-color: var(--card-bg); color: var(--text-color); border: 1px solid var(--border);"
          >
            🔍 Search Campsites
          </button>
        </div>
      </div>
    </div>
    
    <!-- Map Controls (floating) -->
    <div class="absolute top-4 right-4 space-y-2">
      <button 
        @click="toggleLayer"
        class="p-3 rounded-lg shadow"
        style="background-color: var(--card-bg); border: 1px solid var(--border);"
      >
        🌲
      </button>
      <button 
        @click="toggleSatellite"
        class="p-3 rounded-lg shadow"
        style="background-color: var(--card-bg); border: 1px solid var(--border);"
      >
        🛰️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const locateUser = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(`Location found: ${position.coords.latitude}, ${position.coords.longitude}`)
      },
      (error) => {
        alert('Unable to get location: ' + error.message)
      }
    )
  } else {
    alert('Geolocation is not supported by your browser')
  }
}

const toggleLayer = () => {
  alert('Toggle map layer')
}

const toggleSatellite = () => {
  alert('Toggle satellite view')
}
</script>