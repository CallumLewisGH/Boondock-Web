<template>
  <div v-if="campsite" class="max-w-4xl mx-auto p-6 min-h-screen" style="color: var(--text-color);">
    <div class="flex items-center gap-6 mb-8">
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ campsite.name }}</h1>
        <p v-if="campsite.description" class="text-sm mt-2 italic" style="color: var(--muted);">
          "{{ campsite.description }}"
        </p>
      </div>
      <div class="text-right p-4 rounded-xl border" style="background-color: var(--surface); border-color: var(--border);">
        <div class="text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--muted);">Location</div>
        <div class="font-mono font-medium">{{ campsite.latitude.toFixed(4) }}, {{ campsite.longitude.toFixed(4) }}</div>
      </div>
    </div>

    <div v-if="isOwner" class="mt-12 space-y-4">
      <div class="p-6 rounded-xl shadow-md border" 
           style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-lg">Edit Campsite Details</h3>
          <button @click="remove" 
                  class="text-xs font-bold uppercase text-red-500 hover:opacity-70 transition-opacity"
                  :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Campsite' }}
          </button>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Campsite Name</label>
            <input 
              type="text" 
              v-model="edited.name"
              class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
              style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Latitude</label>
              <input 
                type="number" 
                step="any"
                v-model.number="edited.latitude"
                class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
                style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
              >
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Longitude</label>
              <input 
                type="number" 
                step="any"
                v-model.number="edited.longitude"
                class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
                style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea 
              v-model="edited.description"
              rows="4"
              class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
              style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
            ></textarea>
          </div>
          
          <div class="pt-4 flex items-center gap-3">
            <button 
              @click="save"
              :disabled="saving"
              class="px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
              style="background-color: var(--accent); color: var(--header-text);"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
            <button 
              @click="cancelEdit"
              class="px-6 py-2 rounded-lg font-bold border transition-all"
              style="border-color: var(--border); color: var(--muted);"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: var(--accent);"></div>
  </div>

  <div v-else class="flex flex-col justify-center items-center min-h-[400px] text-center">
    <div class="w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4" 
         style="background-color: var(--surface); border-color: var(--border);">
      🗺️
    </div>
    <h2 class="text-xl font-bold">Campsite not found</h2>
    <p style="color: var(--muted);">The campsite you are looking for doesn't exist.</p>
    <button @click="router.push('/app/map')" class="mt-6 font-bold" style="color: var(--accent);">
      ← Back to Map
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CampsiteProfile, UpdateCampsiteRequest } from '@/api'
import { CampsitesService } from '@/services/CampsitesService'
import { UsersService } from '@/services/UsersService'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const campsite = ref<CampsiteProfile | null>(null)
const currentUser = ref(null as any)
const isOwner = ref(false)

const edited = ref<Partial<UpdateCampsiteRequest>>({})

async function fetchCampsite() {
  const name = route.params.name as string
  if (!name) {
    loading.value = false
    return
  }
  loading.value = true

  try {
    const query = new QueryBuilder()
      .addParameter(CampsiteQueryFilters.WithNames([name]))
      .build()

    const result = await CampsitesService.searchCampsites(query)
    if (result.data && result.data.length > 0) {
      const found = result.data[0]
      if (!found) return
      
      campsite.value = found
      edited.value = {
        name: found.name,
        description: found.description,
        latitude: found.latitude,
        longitude: found.longitude,
      }

      const userRes = await UsersService.getCurrentUser()
      if (userRes.data) {
        currentUser.value = userRes.data
        isOwner.value = currentUser.value.id === found.ownerId
      }
    } else {
      campsite.value = null
    }
  } catch (err) {
    console.error('Failed to fetch campsite:', err)
    campsite.value = null
  } finally {
    loading.value = false
  }
}

async function save() {
  if (!campsite.value) return
  saving.value = true
  
  try {
    const res = await CampsitesService.updateCampsiteById(campsite.value.id, edited.value as UpdateCampsiteRequest)
    if (res.data) {
      campsite.value = res.data
      syncEdited(res.data)
    }
  } catch (err) {
    console.error('Failed to update campsite:', err)
  } finally {
    saving.value = false
  }
}

function syncEdited(data: CampsiteProfile) {
  edited.value = {
    name: data.name,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
  }
}

function cancelEdit() {
  if (campsite.value) syncEdited(campsite.value)
}

async function remove() {
  if (!campsite.value) return
  if (!confirm('Delete this campsite? This cannot be undone.')) return
  deleting.value = true
  try {
    await CampsitesService.deleteCampsiteById(campsite.value.id)
    router.push('/app/map')
  } catch (err) {
    console.error('Failed to delete campsite:', err)
  } finally {
    deleting.value = false
  }
}

watch(() => route.params.name, () => fetchCampsite())
onMounted(() => fetchCampsite())
</script>