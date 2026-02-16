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

    <!-- Tab Navigation (only show if owner) -->
    <div v-if="isOwner" class="border-b mb-6" style="border-color: var(--border);">
      <div class="flex space-x-4">
        <button @click="activeTab = 'details'"
          :class="['px-4 py-2 font-medium transition-all border-b-2']"
          :style="{
            borderColor: activeTab === 'details' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'details' ? 'var(--accent)' : 'var(--muted)'
          }">
          Details
        </button>
        <button @click="activeTab = 'reviews'"
          :class="['px-4 py-2 font-medium transition-all border-b-2']"
          :style="{
            borderColor: activeTab === 'reviews' ? 'var(--accent)' : 'transparent',
            color: activeTab === 'reviews' ? 'var(--accent)' : 'var(--muted)'
          }">
          Reviews
        </button>
      </div>
    </div>

    <!-- Details Tab (Edit Section) -->
    <div v-if="activeTab === 'details' && isOwner" class="mt-6 space-y-4">
      <FormCard 
        :is-loading="saving"
        submit-label="Save Changes"
        cancel-label="Cancel"
        @submit="save"
        @cancel="cancelEdit"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg" :style="{ color: 'var(--text-color)' }">Edit Campsite Details</h3>
          <Button 
            label="Delete Campsite"
            variant="danger"
            size="sm"
            :disabled="deleting"
            :loading-text="'Deleting...'"
            @click="remove"
          />
        </div>
        
        <TextInput 
          :model-value="edited.name || ''"
          label="Campsite Name"
          placeholder="Enter campsite name"
          required
          @update:model-value="edited.name = $event"
        />

        <div class="grid grid-cols-2 gap-4">
          <TextInput 
            type="number"
            :model-value="String(edited.latitude || '')"
            label="Latitude"
            placeholder="0.0000"
            @update:model-value="edited.latitude = parseFloat($event) || 0"
          />
          <TextInput 
            type="number"
            :model-value="String(edited.longitude || '')"
            label="Longitude"
            placeholder="0.0000"
            @update:model-value="edited.longitude = parseFloat($event) || 0"
          />
        </div>

        <CountedTextArea 
          :model-value="edited.description || ''"
          label="Description"
          placeholder="Describe this campsite..."
          :max-length="500"
          :show-count="true"
          :rows="4"
          @update:model-value="edited.description = $event"
        />
      </FormCard>
    </div>

    <!-- Reviews Section -->
    <div v-if="!isOwner || activeTab === 'reviews'" class="mt-6">
      <h2 class="text-2xl font-bold mb-6" style="color: var(--text-color);">Reviews</h2>
      <EmptyState 
          icon=""
          title="No Reviews Yet"
          message="You haven't made any reviews yet. Share your experience!"
        />
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

  <ConfirmDeleteModal
  :is-open="showDeleteModal"
  title="Delete Campsite"
  message="Are you sure you want to delete this campsite? This action cannot be undone."
  :is-deleting="deleting"
  @confirm="confirmDelete"
  @close="showDeleteModal = false"
/>

</template>



<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CampsiteProfile, UpdateCampsiteRequest } from '@/api'
import { CampsitesService } from '@/services/CampsitesService'
import { UsersService } from '@/services/UsersService'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'
import TextInput from '@/components/ui/TextInput.vue'
import CountedTextArea from '@/components/common/CountedTextArea.vue'
import FormCard from '@/components/common/FormCard.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const campsite = ref<CampsiteProfile | null>(null)
const currentUser = ref(null as any)
const isOwner = ref(false)
const activeTab = ref('reviews')

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
  // show modal instead of native confirm
  showDeleteModal.value = true
}

const showDeleteModal = ref(false)

async function confirmDelete() {
  if (!campsite.value) return
  deleting.value = true
  try {
    await CampsitesService.deleteCampsiteById(campsite.value.id)
    router.push('/app/map')
  } catch (err) {
    console.error('Failed to delete campsite:', err)
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

watch(() => route.params.name, () => fetchCampsite())
onMounted(() => fetchCampsite())
</script>