<template>
  <div class="fixed top-0 left-0 right-0 z-50" style="background-color: var(--header-bg); color: var(--header-text);">
    <div class="flex items-center justify-between p-4">
      <!-- Logo/Home -->
      <button @click="goHome()" class="flex items-center gap-2">
        <span class="font-bold text-xl" style="color: var(--header-text);">Boondock</span>
      </button>
      
      <!-- Search Bar -->
      <div class="flex-1 max-w-2xl mx-4">
        <input 
          type="text" 
          placeholder="Search campsites or users..."
          class="w-full px-4 py-2 rounded-full"
          style="background-color: var(--card-bg); border-color: var(--border); color: var(--text-color);"
        />
      </div>
      
      <!-- User Menu -->
      <div class="flex items-center gap-4">
        <button 
          @click="toggleDarkMode" 
          class="p-2 rounded-full hover:opacity-80"
          style="color: var(--header-text); background-color: var(--accent);"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button @click="toggleProfile" class="p-2" style="color: var(--header-text);">👤</button>
        <button @click="toggleSettings" class="p-2" style="color: var(--header-text);">⚙️</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';

const router = useRouter();
const { isDark, toggleDarkMode } = useDarkMode();

function goHome() {
  router.push('/app/map');
}

function toggleProfile() {
  router.push('/app/profile');
}

function toggleSettings() {
  router.push('/app/settings');
}
</script>