<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Back button -->
    <button 
      @click="$router.back()"
      class="mb-6 p-2 hover:bg-gray-100 rounded-lg"
    >
      ← Back
    </button>
    
    <!-- Profile Header -->
    <div class="flex items-center gap-6 mb-8">
      <div class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl">
        👤
      </div>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">Mountain Mike</h1>
        <p class="text-gray-600">High-altitude camping specialist</p>
        <div class="flex gap-4 mt-3">
          <span class="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            🏔️ Mountain Expert
          </span>
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            🌿 Leave No Trace
          </span>
        </div>
      </div>
      <button 
        @click="followUser"
        class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
      >
        {{ isFollowing ? 'Following' : 'Follow' }}
      </button>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">47</div>
        <div class="text-sm text-gray-600">Campsites Found</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">89</div>
        <div class="text-sm text-gray-600">Reviews</div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow text-center">
        <div class="text-2xl font-bold">312</div>
        <div class="text-sm text-gray-600">Followers</div>
      </div>
    </div>
    
    <!-- Bio -->
    <div class="mb-8">
      <h2 class="text-xl font-bold mb-3">About</h2>
      <p class="text-gray-700">
        I've been wild camping in the UK mountains for over 10 years. 
        Specialize in high-altitude spots and winter camping. 
        Always practice Leave No Trace principles and love sharing remote locations 
        with responsible campers.
      </p>
    </div>
    
    <!-- Recent Activity -->
    <div>
      <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
      <div class="space-y-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-green-600">📍</span>
            <span class="font-medium">Discovered new campsite</span>
            <span class="text-sm text-gray-500 ml-auto">2 days ago</span>
          </div>
          <p class="text-gray-700">"High Peak Summit" in the Cairngorms</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-blue-600">✍️</span>
            <span class="font-medium">Wrote a review</span>
            <span class="text-sm text-gray-500 ml-auto">1 week ago</span>
          </div>
          <p class="text-gray-700">"Great remote spot with amazing views" ★★★★★</p>
        </div>
        
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-purple-600">📸</span>
            <span class="font-medium">Added photos</span>
            <span class="text-sm text-gray-500 ml-auto">2 weeks ago</span>
          </div>
          <p class="text-gray-700">10 photos from "Forest Valley Camp"</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id
const isFollowing = ref(false)

const followUser = () => {
  isFollowing.value = !isFollowing.value
  alert(isFollowing.value ? 'You are now following this user' : 'Unfollowed user')
}
</script>