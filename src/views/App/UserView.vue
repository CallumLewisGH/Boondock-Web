<template>
  <div v-if="userProfile" class="max-w-4xl mx-auto p-6 min-h-screen" style="color: var(--text-color);">
    <div class="flex items-center gap-6 mb-8">
      <div class="relative">
        <div v-if="userProfile.profilePicture" 
             class="w-24 h-24 rounded-full overflow-hidden border-2" 
             style="border-color: var(--border);">
          <img :src="formatBase64(userProfile.profilePicture)" alt="Profile Picture" class="w-full h-full object-cover" />
        </div>
        <div v-else class="w-24 h-24 rounded-full flex items-center justify-center text-3xl border-2" 
             style="background-color: var(--surface); border-color: var(--border);">
          👤
        </div>
      </div>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ userProfile.username }}</h1>
        <p v-if="userProfile.bio" class="text-sm mt-1 italic" style="color: var(--muted);">
          "{{ userProfile.bio }}"
        </p>
        <p class="text-xs mt-2" style="color: var(--muted);">
          Member since {{ new Date(userProfile.createdAt).toLocaleDateString() }}
        </p>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="p-4 rounded-xl shadow-sm text-center border" style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">{{ userCampsites?.length || 0 }}</div>
        <div class="text-sm" style="color: var(--muted);">Campsites Found</div>
      </div>
      <div class="p-4 rounded-xl shadow-sm text-center border" style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">0</div>
        <div class="text-sm" style="color: var(--muted);">Reviews Made</div>
      </div>
    </div>

    <div class="border-b mb-6" style="border-color: var(--border);">
      <div class="flex space-x-4">
        <button v-for="tab in publicTabs" :key="tab.id" @click="activeTab = tab.id"
          :class="['px-4 py-2 font-medium transition-all border-b-2']"
          :style="{
            borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)'
          }">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="min-h-[200px]">
      <div v-if="activeTab === 'campsites'">
        <div v-if="userCampsites && userCampsites.length > 0" class="grid gap-4">
          <div 
            v-for="camp in userCampsites" 
            :key="camp.id" 
            @click="selectCampsite(camp)"
            class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all"
            style="background-color: var(--card-bg); border-color: var(--border);"
          >
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style="background-color: var(--surface);">
              ⛺
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold truncate" style="color: var(--text-color);">{{ camp.name }}</h3>
              <p class="text-sm truncate" style="color: var(--muted);">{{ camp.description || 'No description provided.' }}</p>
            </div>
            <div class="text-accent">
              <span class="text-xl">›</span>
            </div>
          </div>
        </div>
        <div v-else class="space-y-4 text-center py-10 rounded-lg border-2 border-dashed"
             style="color: var(--muted); border-color: var(--border); background-color: var(--surface);">
          {{ userProfile.username }} hasn't posted any campsites yet.
        </div>
      </div>

      <div v-else-if="activeTab === 'reviews'">
        <div class="space-y-4 text-center py-10 rounded-lg border-2 border-dashed"
             style="color: var(--muted); border-color: var(--border); background-color: var(--surface);">
          No reviews yet.
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: var(--accent);"></div>
  </div>

  <div v-else class="flex flex-col justify-center items-center min-h-[400px] text-center">
    <span class="text-5xl mb-4">🕵️‍♂️</span>
    <h2 class="text-xl font-bold">User not found</h2>
    <p style="color: var(--muted);">The adventurer you are looking for doesn't exist.</p>
    <button @click="router.push('/app/map')" class="mt-4 text-accent underline">Back to Map</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CampsiteProfile, UserPublicProfile } from '@/api'
import { formatBase64 } from '@/helpers/base64'
import { UsersService } from '@/services/UsersService'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { UserQueryFilters } from '@/queryFilters/userQueryFilters'
import { CampsitesService } from '@/services/CampsitesService'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'

const route = useRoute()
const router = useRouter()

const publicTabs = [
  { id: 'campsites', label: 'Campsites' },
  { id: 'reviews', label: 'Reviews' }
]

const activeTab = ref('campsites')
const userProfile = ref<UserPublicProfile | null>(null)
const userCampsites = ref<CampsiteProfile[]>([])
const loading = ref(true)

async function fetchCampsites() {
  if (!userProfile.value) return
  
  const query = new QueryBuilder()
    .addParameter(CampsiteQueryFilters.WithOwnerId(userProfile.value.id))
    .build()

  const result = await CampsitesService.searchCampsites(query)
  if (result.data) {
    userCampsites.value = result.data
  }
}

async function fetchUser() {
  const username = route.params.name as string
  if (!username) {
    loading.value = false
    return
  }

  loading.value = true
  try {
    const query = new QueryBuilder()
      .addParameter(UserQueryFilters.WithUsernames([username]))
      .build()

    const result = await UsersService.getUsers(query)

    if (result.data && result.data.length > 0) {
      if (!result.data[0]) {
        return;
      }
      userProfile.value = result.data[0]
      // Fetch campsites once we have the user ID
      await fetchCampsites()
    } else {
      userProfile.value = null
    }
  } catch (err) {
    userProfile.value = null
    console.error('Failed to fetch user:', err)
  } finally {
    loading.value = false
  }
}

function selectCampsite(campsiteItem: CampsiteProfile) {
  router.push(`/app/campsites/${encodeURIComponent(campsiteItem.name)}`)
}

watch(() => route.params.name, () => {
  fetchUser()
})

onMounted(() => {
  fetchUser()
})
</script>