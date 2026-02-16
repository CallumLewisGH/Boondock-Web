<template>
  <transition name="slide">
    <div v-if="isOpen" class="sidebar-container" :class="{ 'expanded': isExpanded }">
      <!-- Expand/Collapse Arrow Button -->
      <button @click="toggleExpanded" class="expand-btn" :title="isExpanded ? 'Collapse sidebar' : 'Expand sidebar'">
        <span class="expand-arrow">{{ isExpanded ? '←' : '→' }}</span>
      </button>

      <!-- Sidebar Content -->
      <div class="sidebar-content">
        <div v-if="campsite" class="space-y-6">
          <!-- Header -->
          <div>
            <h2 class="text-2xl font-bold">{{ campsite.name }}</h2>
            <p v-if="campsite.description" class="text-sm mt-2 italic opacity-70">
              "{{ campsite.description }}"
            </p>
            <button
              @click="navigateToCampsite"
              class="mt-3 text-sm font-semibold transition-all hover:opacity-70"
              style="color: var(--accent);"
            >
              View Campsite →
            </button>
          </div>

          <!-- Location Info -->
          <div class="p-4 rounded-xl border" style="background-color: var(--surface); border-color: var(--border);">
            <div class="text-xs font-bold uppercase tracking-wider mb-2" style="color: var(--muted);">Location</div>
            <div class="font-mono font-medium">{{ campsite.latitude.toFixed(4) }}, {{ campsite.longitude.toFixed(4) }}</div>
          </div>

          <!-- Edit Section (if owner) -->
          <div v-if="isOwner" class="space-y-4 pt-4 border-t" style="border-color: var(--border);">
            <div class="flex items-center justify-between">
              <h3 class="font-bold">Edit Details</h3>
              <button 
                @click="remove" 
                class="text-xs font-bold uppercase text-red-500 hover:opacity-70 transition-opacity"
                :disabled="deleting"
              >
                {{ deleting ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold mb-1" style="color: var(--muted);">Campsite Name</label>
                <input 
                  type="text" 
                  v-model="edited.name"
                  class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 text-sm"
                  style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
                >
              </div>

              <div>
                <label class="block text-xs font-semibold mb-1" style="color: var(--muted);">Description</label>
                <textarea 
                  v-model="edited.description"
                  class="textarea-control w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 text-sm"
                  style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
                  placeholder="Describe this campsite..."
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-semibold mb-1" style="color: var(--muted);">Latitude</label>
                  <input 
                    type="number" 
                    step="any"
                    v-model.number="edited.latitude"
                    class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 text-sm"
                    style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
                  >
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1" style="color: var(--muted);">Longitude</label>
                  <input 
                    type="number" 
                    step="any"
                    v-model.number="edited.longitude"
                    class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 text-sm"
                    style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
                  >
                </div>
              </div>
              
              <div class="pt-2 flex items-center gap-2">
                <button 
                  @click="save"
                  :disabled="saving"
                  class="flex-1 px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 text-sm"
                  style="background-color: var(--accent); color: var(--header-text);"
                >
                  {{ saving ? 'Saving...' : 'Save' }}
                </button>
                <button 
                  @click="cancelEdit"
                  class="flex-1 px-4 py-2 rounded-lg font-semibold border transition-all text-sm"
                  style="border-color: var(--border); color: var(--muted);"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2" style="border-color: var(--accent);"></div>
        </div>

        <!-- Close Button (mobile-friendly) -->
        <button @click="$emit('close')" class="close-btn" title="Close sidebar">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { CampsiteProfile, UpdateCampsiteRequest } from '@/api'
import { CampsitesService } from '@/services/CampsitesService'
import { UsersService } from '@/services/UsersService'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
  campsiteId?: string | null
}>()

const emit = defineEmits<{
  close: []
  toggle: []
  updated: [campsite: CampsiteProfile]
  deleted: []
}>()

const campsite = ref<CampsiteProfile | null>(null)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const isExpanded = ref(false)
const currentUser = ref(null as any)
const isOwner = ref(false)

const edited = ref<Partial<UpdateCampsiteRequest>>({})

watch(
  () => props.campsiteId,
  (newId) => {
    if (newId) {
      fetchCampsite(newId)
    } else {
      campsite.value = null
    }
  }
)

function fetchCampsite(id: string) {
  loading.value = true

  CampsitesService.searchCampsites().then((result) => {
    if (!result.data) {
      loading.value = false
      return
    }

    const found = result.data.find(c => c.id === id || c.name === decodeURIComponent(id))
    if (!found) {
      loading.value = false
      return
    }

    campsite.value = found
    edited.value = {
      name: found.name,
      description: found.description,
      latitude: found.latitude,
      longitude: found.longitude
    }

    UsersService.getCurrentUser().then((userResult) => {
      if (userResult.data) {
        currentUser.value = userResult.data
        isOwner.value = found.ownerId === userResult.data.id
      }
      loading.value = false
    }).catch(() => {
      loading.value = false
    })
  }).catch(() => {
    loading.value = false
  })
}

function save() {
  if (!campsite.value?.id || !edited.value.name) return
  saving.value = true

  CampsitesService.updateCampsiteById(campsite.value.id, {
    name: edited.value.name,
    description: edited.value.description,
    latitude: edited.value.latitude,
    longitude: edited.value.longitude
  }).then((result) => {
    if (result.data) {
      campsite.value = result.data
      emit('updated', result.data)
    }
    saving.value = false
  }).catch(() => {
    saving.value = false
  })
}

function remove() {
  if (!campsite.value?.id) return
  if (!confirm('Are you sure? This cannot be undone.')) return

  deleting.value = true

  CampsitesService.deleteCampsiteById(campsite.value.id).then(() => {
    emit('deleted')
    emit('close')
  }).catch(() => {
    deleting.value = false
  })
}

function cancelEdit() {
  if (!campsite.value) return
  edited.value = {
    name: campsite.value.name,
    description: campsite.value.description,
    latitude: campsite.value.latitude,
    longitude: campsite.value.longitude
  }
}

function toggleExpanded() {
  isExpanded.value = !isExpanded.value
}

function navigateToCampsite() {
  if (campsite.value?.name) {
    router.push(`/app/campsites/${campsite.value.name}`)
  }
}
</script>

<style scoped>
.sidebar-container {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 380px;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border);
  box-shadow: 4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.sidebar-container.expanded {
  width: calc(100vw - 60px);
  max-width: 800px;
}

.expand-btn {
  position: absolute;
  right: -44px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  background-color: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 0 12px 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 30;
}

.expand-btn:hover {
  transform: translateY(-50%) translateX(2px);
  border-color: var(--accent);
}

.expand-arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.close-btn:hover {
  background-color: var(--accent);
  border-color: var(--accent);
  color: white;
}

/* Textarea styling with custom scrollbar and resize handle */
.textarea-control {
  resize: vertical;
  min-height: 80px;
  max-height: 150px;
  font-family: inherit;
}

.textarea-control::-webkit-scrollbar {
  width: 6px;
}

.textarea-control::-webkit-scrollbar-track {
  background: transparent;
}

.textarea-control::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border-radius: 3px;
}

.textarea-control::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent);
}

/* Hide number input spinners */
/* Chrome, Safari and Opera */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Smooth scrollbar */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background-color: var(--border);
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--accent);
}

/* Slide transition for initial open/close */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar-container {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-container.expanded {
    width: 100%;
  }

  .expand-btn {
    display: none;
  }

  .close-btn {
    display: flex;
  }
}
</style>
