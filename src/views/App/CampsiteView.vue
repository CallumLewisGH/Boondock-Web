<template>
  <div class="min-h-screen" style="background-color: var(--bg-color);">
    <!-- Back button -->
    <button 
      @click="$router.back()"
      class="fixed top-4 left-4 z-10 p-3 rounded-full shadow"
      style="background-color: var(--card-bg); border: 1px solid var(--border); color: var(--text-color);"
    >
      ←
    </button>
    
    <!-- Hero Image -->
    <div class="h-64 flex items-center justify-center text-6xl" style="background-color: var(--card-bg);">
      🏕️
    </div>
    
    <!-- Content -->
    <div class="p-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold" style="color: var(--text-color);">Forest Retreat Campsite</h1>
          <p class="mt-1" style="color: var(--muted);">Lake District, United Kingdom</p>
        </div>
        <div class="text-right">
          <div class="text-2xl mb-1" style="color: #f59e0b;">★★★★☆</div>
          <div class="text-sm" style="color: var(--muted);">4.5 (24 reviews)</div>
        </div>
      </div>
      
      <!-- Quick Info -->
      <div class="flex flex-wrap gap-2 mb-6">
        <span class="px-3 py-1 rounded-full text-sm border"
              style="background-color: var(--badge-bg); border-color: var(--badge-border); color: var(--accent);">
          🌲 Forest
        </span>
        <span class="px-3 py-1 rounded-full text-sm border"
              style="background-color: var(--badge-bg); border-color: var(--badge-border); color: var(--accent);">
          🚶 Walk-in Only
        </span>
        <span class="px-3 py-1 rounded-full text-sm border"
              style="background-color: var(--badge-bg); border-color: var(--badge-border); color: var(--accent);">
          🔥 Fires Allowed
        </span>
      </div>
      
      <!-- Description -->
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-3" style="color: var(--text-color);">Description</h2>
        <p style="color: var(--text-color);">
          A secluded spot in the heart of the forest with stunning views of the surrounding mountains. 
          Perfect for those looking to escape the crowds and enjoy nature.
        </p>
      </div>
      
      <!-- Details Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="p-4 rounded-lg border"
             style="background-color: var(--card-bg); border-color: var(--border);">
          <div class="text-lg mb-1">📍</div>
          <div class="font-medium" style="color: var(--text-color);">Elevation</div>
          <div style="color: var(--muted);">320m</div>
        </div>
        <!-- Repeat for other detail boxes -->
      </div>
      
      <!-- Fixed Action Button -->
      <div class="fixed bottom-6 right-6">
        <button 
          @click="saveCampsite"
          class="px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium"
          style="background-color: var(--accent); color: white;"
        >
          <span>❤️</span>
          Save to Favorites
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const saveCampsite = () => {
  alert('Campsite saved to favorites!')
}
</script>