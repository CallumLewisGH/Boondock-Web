<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">Search</h1>
      <div class="flex gap-4">
        <div class="flex-1 relative">
          <input 
            type="text" 
            v-model="searchQuery"
            @keyup.enter="performSearch"
            placeholder="Search for campsites, users, or locations..."
            class="w-full px-4 py-3 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
          <span class="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
        </div>
        <select 
          v-model="searchType"
          class="px-4 py-3 border rounded-lg"
        >
          <option value="campsites">Campsites</option>
          <option value="users">Users</option>
          <option value="locations">Locations</option>
        </select>
        <button 
          @click="performSearch"
          class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Search
        </button>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="mb-8 p-4 bg-gray-50 rounded-lg">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium">Filters</h3>
        <button @click="showFilters = !showFilters" class="text-sm text-orange-600">
          {{ showFilters ? 'Hide' : 'Show' }} Filters
        </button>
      </div>
      
      <div v-if="showFilters" class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <select v-model="filters.type" class="px-3 py-2 border rounded">
          <option value="">All Types</option>
          <option value="wild">Wild Camping</option>
          <option value="forest">Forest</option>
          <option value="mountain">Mountain</option>
        </select>
        
        <select v-model="filters.rating" class="px-3 py-2 border rounded">
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
        
        <select v-model="filters.distance" class="px-3 py-2 border rounded">
          <option value="">Any Distance</option>
          <option value="10">Within 10km</option>
          <option value="50">Within 50km</option>
        </select>
        
        <select v-model="filters.accessibility" class="px-3 py-2 border rounded">
          <option value="">All Access</option>
          <option value="walkin">Walk-in Only</option>
          <option value="vehicle">Vehicle Access</option>
        </select>
      </div>
    </div>
    
    <!-- Search Results -->
    <div v-if="searchResults.length > 0">
      <h2 class="text-xl font-bold mb-4">
        {{ searchResults.length }} Results for "{{ searchQuery }}"
      </h2>
      
      <div v-if="searchType === 'campsites'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="result in searchResults" 
          :key="result.id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/app/campsites/${result.id}`)"
        >
          <div class="h-40 bg-gray-300 flex items-center justify-center text-4xl">
            🏕️
          </div>
          <div class="p-4">
            <h3 class="font-bold text-lg mb-1">{{ result.name }}</h3>
            <p class="text-gray-600 text-sm mb-2">{{ result.location }}</p>
            <div class="flex items-center justify-between">
              <span class="text-yellow-500">★★★★☆</span>
              <span class="text-sm text-gray-500">{{ result.distance }}km away</span>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="result in searchResults" 
          :key="result.id"
          class="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="$router.push(`/app/users/${result.id}`)"
        >
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
              👤
            </div>
            <div>
              <h3 class="font-bold">{{ result.name }}</h3>
              <p class="text-gray-600 text-sm">{{ result.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- No Results / Initial State -->
    <div v-else class="text-center py-12">
      <div class="text-6xl mb-4">🔍</div>
      <h3 class="text-xl font-bold mb-2">Search Boondock</h3>
      <p class="text-gray-600 max-w-md mx-auto">
        Find campsites, connect with other campers, or discover new locations.
        Try searching for "forest campsites" or "mountain spots".
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const searchQuery = ref('')
const searchType = ref('campsites')
const showFilters = ref(false)

const filters = reactive({
  type: '',
  rating: '',
  distance: '',
  accessibility: ''
})

const searchResults = ref<any[]>([])

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    alert('Please enter a search term')
    return
  }
  
  // Mock search results
  if (searchType.value === 'campsites') {
    searchResults.value = [
      { id: 1, name: 'Forest Retreat', location: 'Lake District, UK', distance: 15, rating: 4.5 },
      { id: 2, name: 'Mountain View Spot', location: 'Snowdonia, Wales', distance: 42, rating: 4.2 },
      { id: 3, name: 'Riverside Camp', location: 'Peak District, UK', distance: 28, rating: 4.7 },
    ]
  } else {
    searchResults.value = [
      { id: 1, name: 'Alex Camper', bio: 'Wild camping enthusiast', location: 'UK' },
      { id: 2, name: 'Mountain Mike', bio: 'High-altitude specialist', location: 'Scotland' },
      { id: 3, name: 'Forest Fiona', bio: 'Nature photographer', location: 'Wales' },
    ]
  }
}
</script>