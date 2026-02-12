<template>
  <div class="fixed top-0 left-0 right-0 z-50" style="background-color: var(--header-bg); color: var(--header-text);">
    <div class="flex items-center justify-between p-4">
      <button @click="goHome()" class="flex-shrink-0 flex items-center gap-2">
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
          v-if="isDropdownOpen"
          class="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-50 flex flex-col overflow-hidden"
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
                class="flex items-center gap-3 p-2 rounded cursor-pointer transition min-w-0"
                :class="{ 'bg-black/10 dark:bg-white/10': index === selectedIndex }"
              >
                <div class="flex-shrink-0">
                  <div v-if="user.profilePicture" 
                       class="w-10 h-10 rounded-full overflow-hidden border-2" 
                       style="border-color: var(--border);">
                    <img :src="formatBase64(user.profilePicture)" alt="Profile" class="w-full h-full object-cover" />
                  </div>
                  <div v-else 
                       class="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2" 
                       style="background-color: var(--surface); border-color: var(--border);">
                    👤
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ user.username }}</div>
                  <div class="text-xs opacity-70 line-clamp-1 break-all">
                    {{ user.bio || 'No bio available' }}
                  </div>
                </div>
              </li>

              <li 
                v-for="(camp, index) in filteredCampsiteList" 
                :key="camp.id" 
                @click="selectCampsite(camp)" 
                @mouseover="selectedIndex = index + filteredUserList.length" 
                class="flex items-center gap-3 p-2 rounded cursor-pointer transition min-w-0" 
                :class="{ 'bg-black/10 dark:bg-white/10': (index + filteredUserList.length) === selectedIndex }"
              >
                <span class="flex-shrink-0 text-xl">⛺</span>
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ camp.name }}</div>
                  <div class="text-xs opacity-70 line-clamp-1 break-all">
                    {{ camp.description || 'No description' }}
                  </div>
                </div>
              </li>
            </ul>

            <div v-if="combinedCount === 0" class="p-4 text-center text-sm opacity-50 italic">
              No results found for "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center gap-4 flex-shrink-0">
        <button @click="toggleDarkMode" class="p-2 rounded-full hover:opacity-80" style="color: var(--header-text); background-color: var(--accent);">
          {{ isDark ? '☀️' : '🌙' }}
        </button>
        <button @click="toggleProfile" class="p-2" style="color: var(--header-text);">👤</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDarkMode } from '@/composables/useDarkMode';
import { UsersService } from '@/services/UsersService';
import { CampsitesService } from '@/services/CampsitesService';
import type { UserPublicProfile } from '@/api';
import type { CampsiteProfile } from '@/api';
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
const campsiteList = ref<CampsiteProfile[]>([]);
const filteredCampsiteList = ref<CampsiteProfile[]>([]);
const selectedIndex = ref(-1);

const combinedCount = computed(() => filteredUserList.value.length + filteredCampsiteList.value.length);

function goHome() { router.push('/app/map'); }
function toggleProfile() { router.push('/app/profile'); }
function toggleSettings() { router.push('/app/settings'); }

// --- Search Logic ---

watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    filteredUserList.value = userList.value;
    filteredCampsiteList.value = campsiteList.value;
  } else {
    const lowerQuery = newQuery.toLowerCase();
    filteredUserList.value = userList.value.filter(x => 
      x.username.toLowerCase().includes(lowerQuery) || 
      (x.bio && x.bio.toLowerCase().includes(lowerQuery))
    );

    filteredCampsiteList.value = campsiteList.value.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      (c.description && c.description.toLowerCase().includes(lowerQuery))
    );
  }
  selectedIndex.value = -1; // Reset selection on new search
});

async function openDropdown() {
  isDropdownOpen.value = true;
  if (userList.value.length === 0) {
    const result = await UsersService.getUsers();
    if (result.data) {
      userList.value = result.data;
      filteredUserList.value = userList.value
    }
  }

  if (campsiteList.value.length === 0) {
    const cRes = await CampsitesService.searchCampsites();
    if (cRes.data) {
      campsiteList.value = cRes.data;
      filteredCampsiteList.value = campsiteList.value;
    }
  }
}

function selectUser(user: UserPublicProfile) {
  isDropdownOpen.value = false;
  selectedIndex.value = -1;
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  router.push(`/app/users/${encodeURIComponent(user.username)}`);
  searchQuery.value = '';
}

function selectCampsite(campsiteItem: CampsiteProfile) {
  isDropdownOpen.value = false;
  selectedIndex.value = -1;
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  router.push(`/app/campsites/${encodeURIComponent(campsiteItem.name)}`);
  searchQuery.value = '';
}

// --- Keyboard Navigation ---

function handleKeydown(e: KeyboardEvent) {
  if (!isDropdownOpen.value) return;

  const usersLen = filteredUserList.value.length;
  const campsLen = filteredCampsiteList.value.length;
  const total = usersLen + campsLen;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      if (selectedIndex.value < total - 1) {
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
      if (selectedIndex.value >= 0) {
        if (selectedIndex.value < usersLen) {
          selectUser(filteredUserList.value[selectedIndex.value]!);
        } else {
          const idx = selectedIndex.value - usersLen;
          selectCampsite(filteredCampsiteList.value[idx]!);
        }
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

    const items = resultsList.value.querySelectorAll('ul li') as NodeListOf<HTMLElement>;
    if (items && items[selectedIndex.value]) {
      items[selectedIndex.value]!.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
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