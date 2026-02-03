<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Profile Header -->
    <div class="flex items-center gap-6 mb-8">
      <div class="relative">
        <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
          👤
        </div>
        <button class="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow">
          ✏️
        </button>
      </div>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">Your Profile</h1>
        <p class="text-gray-600">Member since 2024</p>
        <div class="flex gap-4 mt-3">
          <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Camper
          </span>
          <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            Explorer
          </span>
        </div>
      </div>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">12</div>
        <div class="text-sm text-gray-600">Campsites Found</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">8</div>
        <div class="text-sm text-gray-600">Reviews</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">24</div>
        <div class="text-sm text-gray-600">Following</div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="border-b mb-6">
      <div class="flex space-x-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-medium',
            activeTab === tab.id 
              ? 'border-b-2 border-orange-600 text-orange-600' 
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <!-- Tab Content -->
    <div v-if="activeTab === 'campsites'" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white p-4 rounded-lg shadow">
        <h3 class="font-bold">Beautiful Campsite #{{ i }}</h3>
        <p class="text-gray-600 text-sm">Discovered 2 days ago</p>
      </div>
    </div>
    
    <div v-else-if="activeTab === 'reviews'" class="space-y-4">
      <div v-for="i in 2" :key="i" class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-yellow-500">★★★★☆</span>
          <span class="text-sm text-gray-500">3 days ago</span>
        </div> 
        <p>"Amazing spot with great views!"</p>
      </div>
    </div>
    
    <div v-else class="space-y-4">
      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="font-bold mb-4">Edit Profile</h3>
        <form @submit.prevent="saveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Display Name</label>
            <input 
              type="text" 
              v-model="profile.name"
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              v-model="profile.bio"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>
          <button 
            type="submit"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const tabs = [
  { id: 'campsites', label: 'My Campsites' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'edit', label: 'Edit Profile' }
]

const activeTab = ref('campsites')

const profile = reactive({
  name: 'Camping Enthusiast',
  bio: 'Love exploring remote wilderness areas and finding hidden gems.'
})

const saveProfile = () => {
  alert('Profile saved!')
}
</script>