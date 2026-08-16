<template>
  <div class="fixed top-0 left-0 right-0 z-50" style="background-color: var(--header-bg); color: var(--header-text);">
    <div class="flex items-center justify-between p-4">
      <button @click="goHome()" class="flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <span class="font-bold text-xl" :style="{ color: 'var(--header-text)' }">Boondock</span>
      </button>
      
      <!-- Search Section -->
      <div class="flex-1 max-w-2xl mx-4 relative" ref="searchContainer">
        <div class="relative">
          <TextInput 
            :model-value="searchQuery"
            placeholder="Search campsites or users..."
            @update:model-value="searchQuery = $event"
            @focus="openDropdown"
            @blur="handleSearchBlur"
          />
        </div>

        <!-- Search Results Dropdown -->
        <div 
          v-if="isDropdownOpen && combinedCount > 0"
          class="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto"
          :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }"
          ref="resultsList"
        >
          <div class="p-3 space-y-1">
            <!-- Users Section -->
            <div v-if="filteredUserList.length > 0">
              <div class="text-xs font-bold uppercase px-2 py-1 opacity-50" :style="{ color: 'var(--muted)' }">Users</div>
              <button
                v-for="(user, index) in filteredUserList"
                :key="user.id || index"
                @click="selectUser(user)"
                @mouseover="selectedIndex = index"
                class="w-full flex items-center gap-3 p-2 rounded cursor-pointer transition text-left"
                :style="{
                  backgroundColor: index === selectedIndex ? 'var(--surface)' : 'transparent',
                  color: 'var(--text-color)'
                }"
              >
                <UserAvatar :name="user.username" :bio="user.bio" :profile-picture="user.profilePicture" />
              </button>
            </div>

            <!-- Campsites Section -->
            <div v-if="filteredCampsiteList.length > 0">
              <div v-if="filteredUserList.length > 0" class="border-t my-2" :style="{ borderColor: 'var(--border)' }" />
              <div class="text-xs font-bold uppercase px-2 py-1 opacity-50" :style="{ color: 'var(--muted)' }">Campsites</div>
              <button
                v-for="(camp, index) in filteredCampsiteList"
                :key="camp.id"
                @click="selectCampsite(camp)"
                @mouseover="selectedIndex = index + filteredUserList.length"
                class="w-full flex items-center gap-3 p-2 rounded cursor-pointer transition text-left"
                :style="{
                  backgroundColor: (index + filteredUserList.length) === selectedIndex ? 'var(--surface)' : 'transparent',
                  color: 'var(--text-color)'
                }"
              >
                <TentIcon class="flex-shrink-0 w-5 h-5" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ camp.name }}</div>
                  <div class="text-xs line-clamp-1 opacity-70">{{ camp.description || 'No description' }}</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div 
          v-if="isDropdownOpen && searchQuery && combinedCount === 0"
          class="absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl border p-4 text-center"
          :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--muted)' }"
        >
          No results found for "{{ searchQuery }}"
        </div>
      </div>
      
      <!-- Right Actions -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button
          :label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          variant="outline"
          @click="toggleDarkMode"
        >
          <template #icon>
            <SunIcon v-if="isDark" class="w-4 h-4" />
            <MoonIcon v-else class="w-4 h-4" />
          </template>
        </Button>
        <Button
          label="Profile"
          variant="outline"
          @click="toggleProfile"
        >
          <template #icon>
            <UserIcon class="w-4 h-4" />
          </template>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import { useClickOutside } from '@/composables/useClickOutside'
import { UsersService } from '@/services/UsersService'
import { CampsitesService } from '@/services/CampsitesService'
import type { UserPublicProfile, CampsiteProfile } from '@/api'
import { formatBase64 } from '@/helpers/base64'
import TextInput from '@/components/ui/TextInput.vue'
import Button from '@/components/ui/Button.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { TentIcon } from '@/components/icons'
import { SunIcon, MoonIcon, UserIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const { isDark, toggleDarkMode } = useDarkMode()

// Search state
const searchQuery = ref('')
const isDropdownOpen = ref(false)
const searchContainer = ref<HTMLElement | null>(null)
const resultsList = ref<HTMLElement | null>(null)

// Data
const userList = ref<UserPublicProfile[]>([])
const filteredUserList = ref<UserPublicProfile[]>([])
const campsiteList = ref<CampsiteProfile[]>([])
const filteredCampsiteList = ref<CampsiteProfile[]>([])
const selectedIndex = ref(-1)

const combinedCount = computed(() => filteredUserList.value.length + filteredCampsiteList.value.length)

function goHome() {
  router.push('/app/map')
}

function toggleProfile() {
  router.push('/app/profile')
}

// Search filtering
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    filteredUserList.value = userList.value
    filteredCampsiteList.value = campsiteList.value
  } else {
    const lowerQuery = newQuery.toLowerCase()
    filteredUserList.value = userList.value.filter(x =>
      x.username.toLowerCase().includes(lowerQuery) ||
      (x.bio && x.bio.toLowerCase().includes(lowerQuery))
    )

    filteredCampsiteList.value = campsiteList.value.filter(c =>
      c.name.toLowerCase().includes(lowerQuery) ||
      (c.description && c.description.toLowerCase().includes(lowerQuery))
    )
  }
  selectedIndex.value = -1
})

async function openDropdown() {
  isDropdownOpen.value = true

  if (userList.value.length === 0) {
    const result = await UsersService.getUsers()
    if (result.data) {
      userList.value = result.data
      filteredUserList.value = userList.value
    }
  }

  if (campsiteList.value.length === 0) {
    const cRes = await CampsitesService.searchCampsites()
    if (cRes.data) {
      campsiteList.value = cRes.data
      filteredCampsiteList.value = campsiteList.value
    }
  }
}

function selectUser(user: UserPublicProfile) {
  isDropdownOpen.value = false
  selectedIndex.value = -1
  router.push(`/app/users/${encodeURIComponent(user.username)}`)
  searchQuery.value = ''
}

function selectCampsite(campsiteItem: CampsiteProfile) {
  isDropdownOpen.value = false
  selectedIndex.value = -1
  router.push(`/app/campsites/${encodeURIComponent(campsiteItem.name)}`)
  searchQuery.value = ''
}

function handleSearchBlur() {
  setTimeout(() => {
    isDropdownOpen.value = false
  }, 150)
}

// Click outside to close
function handleClickOutside(event: MouseEvent) {
  if (searchContainer.value && !searchContainer.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>