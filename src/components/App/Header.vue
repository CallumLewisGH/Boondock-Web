<template>
  <div class="fixed top-0 left-0 right-0 z-50" style="background-color: var(--header-bg); color: var(--header-text);">
    <div class="flex items-center justify-between p-4">
      <button @click="goHome()" class="flex items-center gap-2">
        <span class="font-bold text-xl" style="color: var(--header-text);">Boondock</span>
      </button>
      
      <div class="flex-1 max-w-2xl mx-4 relative" ref="searchContainer">
        <input 
          v-model="searchQuery"
          @focus="openDropdown"
          type="text" 
          placeholder="Search campsites or users..."
          class="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style="background-color: var(--card-bg); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
        />

        <div 
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl overflow-hidden border z-50"
          style="background-color: var(--card-bg); border-color: var(--border); color: var(--text-color);"
        >
          <div class="p-4">
            <h3 class="font-bold mb-2 text-sm opacity-70">Recent Searches</h3>
            
            <ul class="space-y-2">
                <li v-for="user in filteredUserList" :key="user.id" class="flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer transition">
                  <div v-if="user.profilePicture" 
                    class="w-12 h-12 rounded-full overflow-hidden border-2" 
                    style="border-color: var(--border);">
                  <img 
                    :src="formatBase64(user.profilePicture)" 
                    alt="Profile Picture" 
                    class="w-full h-full object-cover" 
                  />
                </div>
                <div v-else 
                    class="w-12 h-12 rounded-full flex items-center justify-center text-3xl border-2" 
                    style="background-color: var(--surface); border-color: var(--border);">
                  👤
                </div>
                  <div>
                    <div class="font-medium">{{ user.username }}</div>
                    <div class="text-xs opacity-70">{{ user.bio ? user.bio.substring(0, 80) + (user.bio.length > 80 ? '...' : '') : 'No bio available' }}</div>
                  </div>
                </li>
               <li class="flex items-center gap-3 p-2 rounded hover:bg-black/5 cursor-pointer transition">
                <span>⛺</span>
                <div>
                  <div class="font-medium">Yosemite Valley Campsite</div>
                  <div class="text-xs opacity-70">California, USA</div>
                </div>
              </li>
            </ul>

            <div v-if="!searchQuery" class="mt-4 text-center text-sm opacity-50 italic">
              Type to see results...
            </div>
          </div>
        </div>
      </div>
      
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';
import { UsersService } from '@/services/UsersService';
import type { UserPublicProfile } from '@/api';
import { formatBase64 } from '@/helpers/base64';

const router = useRouter();
const { isDark, toggleDarkMode } = useDarkMode();

// Search State
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const searchContainer = ref<HTMLElement | null>(null);
const filteredUserList = ref<UserPublicProfile[]>([]);
const userList = ref<UserPublicProfile[]>([]);

function goHome() {
  router.push('/app/map');
}

function toggleProfile() {
  router.push('/app/profile');
}

function toggleSettings() {
  router.push('/app/settings');
}

watch(searchQuery, (newQuery) => {
  filteredUserList.value = userList.value.filter(x => x.username.includes(newQuery) || x.bio?.includes(newQuery));
});

async function openDropdown() {
  isDropdownOpen.value = true;

  const result = await UsersService.getUsers();
  if (!result.data) {
    console.error('Failed to fetch users for search dropdown:', result.error);
    return;
  }
  userList.value = result.data;
  filteredUserList.value = result.data;
}

function handleClickOutside(event: MouseEvent) {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>