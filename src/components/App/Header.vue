<!-- WARNING HEAVILY VIBE CODED -->
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
          @keydown="handleKeydown"
          type="text" 
          placeholder="Search campsites or users..."
          class="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-opacity-50"
          style="background-color: var(--card-bg); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
        />

        <div 
          v-if="isDropdownOpen && (filteredUserList.length > 0 || !searchQuery)"
          class="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-50 flex flex-col"
          style="background-color: var(--card-bg); border-color: var(--border); color: var(--text-color); max-height: 400px;"
        >
          <div class="p-2 overflow-y-auto" ref="resultsList">
            <h3 class="font-bold mb-2 text-sm opacity-70 px-2">Results</h3>
            
            <ul class="space-y-1">
              <li 
                v-for="(user, index) in filteredUserList" 
                :key="user.id || index"
                @click="selectUser(user)"
                @mouseover="selectedIndex = index"
                class="flex items-center gap-3 p-2 rounded cursor-pointer transition"
                :class="{ 'bg-black/10 dark:bg-white/10': index === selectedIndex }"
              >
                <div v-if="user.profilePicture" 
                     class="w-10 h-10 min-w-[2.5rem] rounded-full overflow-hidden border-2" 
                     style="border-color: var(--border);">
                  <img :src="formatBase64(user.profilePicture)" alt="Profile" class="w-full h-full object-cover" />
                </div>
                <div v-else 
                     class="w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center text-xl border-2" 
                     style="background-color: var(--surface); border-color: var(--border);">
                  👤
                </div>

                <div class="overflow-hidden">
                  <div class="font-medium truncate">{{ user.username }}</div>
                  <div class="text-xs opacity-70 truncate">
                    {{ user.bio || 'No bio available' }}
                  </div>
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

            <div v-if="filteredUserList.length === 0" class="p-4 text-center text-sm opacity-50 italic">
              No results found for "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <button @click="toggleDarkMode" class="p-2 rounded-full hover:opacity-80" style="color: var(--header-text); background-color: var(--accent);">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button @click="toggleProfile" class="p-2" style="color: var(--header-text);">👤</button>
        <button @click="toggleSettings" class="p-2" style="color: var(--header-text);">⚙️</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';
import { UsersService } from '@/services/UsersService';
import type { UserPublicProfile } from '@/api';
import { formatBase64 } from '@/helpers/base64';

const router = useRouter();
const { isDark, toggleDarkMode } = useDarkMode();

// Refs
const searchQuery = ref('');
const isDropdownOpen = ref(false);
const searchContainer = ref<HTMLElement | null>(null);
const resultsList = ref<HTMLElement | null>(null);

// Data & Selection
const userList = ref<UserPublicProfile[]>([]);
const filteredUserList = ref<UserPublicProfile[]>([]);
const selectedIndex = ref(-1);

function goHome() { router.push('/app/map'); }
function toggleProfile() { router.push('/app/profile'); }
function toggleSettings() { router.push('/app/settings'); }

// --- Search Logic ---

watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    filteredUserList.value = userList.value;
  } else {
    const lowerQuery = newQuery.toLowerCase();
    filteredUserList.value = userList.value.filter(x => 
      x.username.toLowerCase().includes(lowerQuery) || 
      (x.bio && x.bio.toLowerCase().includes(lowerQuery))
    );
  }
  selectedIndex.value = -1; // Reset selection on new search
});

async function openDropdown() {
  isDropdownOpen.value = true;
  
  // Prevent re-fetching if we already have data (optional optimization)
  if (userList.value.length === 0) {
    const result = await UsersService.getUsers();
    if (result.data) {
      userList.value = result.data;
      // Initialize with full list or duplicates for testing as you requested
      filteredUserList.value = [...result.data]; 
      
      // Duplicating data for testing scroll (as requested in prompt)
      for(let i=0; i<5; i++) {
         filteredUserList.value = [...filteredUserList.value, ...result.data];
      }
    }
  }
}

function selectUser(user: UserPublicProfile) {
  searchQuery.value = user.username;
  isDropdownOpen.value = false;
  console.log('Selected user:', user);
  // router.push(`/profile/${user.id}`); // Example navigation
}

// --- Keyboard Navigation ---

function handleKeydown(e: KeyboardEvent) {
  if (!isDropdownOpen.value) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (selectedIndex.value < filteredUserList.value.length - 1) {
        selectedIndex.value++;
        scrollToSelected();
      }
      break;
      
    case 'ArrowUp':
      e.preventDefault();
      if (selectedIndex.value > 0) {
        selectedIndex.value--;
        scrollToSelected();
      }
      break;
      
    case 'Enter':
      e.preventDefault();
      if (selectedIndex.value >= 0 && filteredUserList.value[selectedIndex.value]) {
        selectUser(filteredUserList.value[selectedIndex.value]!);
      }
      break;
      
    case 'Escape':
      e.preventDefault();
      isDropdownOpen.value = false;
      (e.target as HTMLInputElement).blur();
      break;
  }
}

// Helper to keep the selected item in view
function scrollToSelected() {
  nextTick(() => {
    if (!resultsList.value) return;
    
    const selectedEl = resultsList.value.children[1]?.children[selectedIndex.value] as HTMLElement;
    
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
}

// --- Click Outside ---

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