<template>
  <div class="h-full relative bg-gray-200">
    <!-- Map Container (placeholder for now) -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="text-center p-8 bg-white rounded-xl shadow-lg">
        <div class="text-6xl mb-4">🗺️</div>
        <h2 class="text-2xl font-bold mb-2">Map View</h2>
        <p class="text-gray-600 mb-4">Interactive map will go here</p>
        <div class="space-y-2">
          <button 
            @click="locateUser"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            📍 Find My Location
          </button>
          <button 
            @click="$router.push('/app/search')"
            class="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            🔍 Search Campsites
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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