<template>
  <div class="max-w-6xl mx-auto p-6">
    <!-- Search Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-4" :style="{ color: 'var(--text-color)' }">Search</h1>
      <div class="flex gap-4 mb-4">
        <TextInput 
          :model-value="searchQuery"
          placeholder="Search for campsites, users, or locations..."
          @update:model-value="searchQuery = $event"
          @blur="performSearch"
        />
        <Select 
          :model-value="searchType"
          :options="searchTypeOptions"
          placeholder="Search Type"
          @update:model-value="searchType = $event"
        />
        <Button 
          label="Search"
          variant="primary"
          @click="performSearch"
        />
      </div>
    </div>
    
    <!-- Filter Toggle -->
    <div class="mb-6">
      <button 
        @click="showFilters = !showFilters"
        class="text-sm font-semibold transition-colors"
        :style="{ color: 'var(--accent)' }"
      >
        {{ showFilters ? '▼' : '▶' }} {{ showFilters ? 'Hide' : 'Show' }} Filters
      </button>
    </div>

    <!-- Filters -->
    <div v-if="showFilters" class="mb-8 p-4 rounded-lg border"
         :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Select 
          :model-value="filters.type"
          :options="typeOptions"
          placeholder="Type"
          @update:model-value="filters.type = $event"
        />
        <Select 
          :model-value="filters.rating"
          :options="ratingOptions"
          placeholder="Rating"
          @update:model-value="filters.rating = $event"
        />
        <Select 
          :model-value="filters.distance"
          :options="distanceOptions"
          placeholder="Distance"
          @update:model-value="filters.distance = $event"
        />
        <Select 
          :model-value="filters.accessibility"
          :options="accessibilityOptions"
          placeholder="Accessibility"
          @update:model-value="filters.accessibility = $event"
        />
      </div>
    </div>
    
    <!-- Search Results -->
    <div v-if="searchResults.length > 0">
      <h2 class="text-xl font-bold mb-4" :style="{ color: 'var(--text-color)' }">
        {{ searchResults.length }} Results for "{{ searchQuery }}"
      </h2>
      
      <!-- Campsite Results Grid -->
      <div v-if="searchType === 'campsites'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          v-for="result in searchResults" 
          :key="result.id"
          @click="navigateToCampsite(result.id)"
        >
          <template #icon>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center" :style="{ backgroundColor: 'var(--surface)', color: 'var(--accent)' }">
              <TentIcon class="w-6 h-6" />
            </div>
          </template>
          <template #title>{{ result.name }}</template>
          <template #description>{{ result.location }}</template>
          <template #footer>
            <div class="flex items-center justify-between text-xs">
              <span class="flex items-center gap-1"><StarIcon class="w-3.5 h-3.5" style="color: var(--accent);" /> {{ result.rating }}/5</span>
              <span :style="{ color: 'var(--muted)' }">{{ result.distance }}km</span>
            </div>
          </template>
        </Card>
      </div>
      
      <!-- User Results List -->
      <div v-else class="space-y-3">
        <Card 
          v-for="result in searchResults" 
          :key="result.id"
          @click="navigateToUser(result.id)"
        >
          <template #icon>
            <div class="w-12 h-12 rounded-full flex items-center justify-center" :style="{ backgroundColor: 'var(--surface)', color: 'var(--muted)' }">
              <UserIcon class="w-6 h-6" />
            </div>
          </template>
          <template #title>{{ result.name }}</template>
          <template #description>{{ result.bio }}</template>
        </Card>
      </div>
    </div>
    
    <!-- No Results / Initial State -->
    <EmptyState
      v-else
      :icon="MagnifyingGlassIcon"
      title="Search Boondock"
      message="Find campsites, connect with other campers, or discover new locations. Try searching for 'forest campsites' or 'mountain spots'."
    />
  </div>

  <!-- Error Modal -->
  <Modal :is-open="showErrorModal" title="Search Required" @close="showErrorModal = false">
    <p class="text-sm" :style="{ color: 'var(--text-color)' }">
      Please enter a search term to continue.
    </p>
    <template #footer>
      <Button
        label="Close"
        variant="primary"
        @click="showErrorModal = false"
      />
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { TextInput, Select, Button, Modal } from '@/components'
import Card from '@/components/common/Card.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'
import { TentIcon } from '@/components/icons'

const router = useRouter()

const searchQuery = ref('')
const searchType = ref('campsites')
const showFilters = ref(false)
const showErrorModal = ref(false)

const filters = reactive({
  type: '',
  rating: '',
  distance: '',
  accessibility: ''
})

const searchResults = ref<any[]>([])

const searchTypeOptions = [
  { value: 'campsites', label: 'Campsites' },
  { value: 'users', label: 'Users' },
  { value: 'locations', label: 'Locations' }
]

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'wild', label: 'Wild Camping' },
  { value: 'forest', label: 'Forest' },
  { value: 'mountain', label: 'Mountain' }
]

const ratingOptions = [
  { value: '', label: 'Any Rating' },
  { value: '4', label: '4+ Stars' },
  { value: '3', label: '3+ Stars' }
]

const distanceOptions = [
  { value: '', label: 'Any Distance' },
  { value: '10', label: 'Within 10km' },
  { value: '50', label: 'Within 50km' }
]

const accessibilityOptions = [
  { value: '', label: 'All Access' },
  { value: 'walkin', label: 'Walk-in Only' },
  { value: 'vehicle', label: 'Vehicle Access' }
]

function performSearch() {
  if (!searchQuery.value.trim()) {
    showErrorModal.value = true
    return
  }
  
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

function navigateToCampsite(id: number) {
  router.push(`/app/campsites/${id}`)
}

function navigateToUser(id: number) {
  router.push(`/app/users/${id}`)
}
</script>