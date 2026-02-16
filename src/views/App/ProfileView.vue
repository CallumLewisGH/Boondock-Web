<template>
  <div v-if="userProfile" class="max-w-4xl mx-auto p-6 min-h-screen">
    <!-- Profile Header with Picture Edit -->
    <div class="relative mb-8">
      <button 
        @click="fileInput?.click()"
        class="absolute -top-2 -right-2 p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity z-10"
        style="background-color: var(--accent); color: var(--header-text);"
      >
        ✏️
      </button>
      <input 
        type="file" 
        ref="fileInput" 
        class="hidden" 
        accept="image/*" 
        @change="handleFileChange"
      />
      <ProfileHeader :profile="userProfile" />
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="p-4 rounded-xl text-center border" 
           :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
        <div class="text-2xl font-bold" :style="{ color: 'var(--accent)' }">{{ userCampsites.length }}</div>
        <div class="text-sm" :style="{ color: 'var(--muted)' }">Campsites Found</div>
      </div>
      <div class="p-4 rounded-xl text-center border" 
           :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
        <div class="text-2xl font-bold" :style="{ color: 'var(--accent)' }">0</div>
        <div class="text-sm" :style="{ color: 'var(--muted)' }">Reviews Made</div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <TabNavigation 
      :tabs="tabs" 
      :active-tab="activeTab"
      @select="activeTab = $event"
    />
    
    <!-- Tab Content -->
    <div class="mt-6">
      <!-- Campsites Tab -->
      <div v-if="activeTab === 'campsites'">
        <div v-if="userCampsites.length > 0" class="grid gap-4">
          <Card 
            v-for="camp in userCampsites" 
            :key="camp.id"
            @click="selectCampsite(camp)"
          >
            <template #icon>
              <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" :style="{ backgroundColor: 'var(--surface)' }">
                ⛺
              </div>
            </template>
            <template #title>{{ camp.name }}</template>
            <template #description>{{ camp.description || 'No description provided.' }}</template>
            <template #action>
              <div class="flex items-center gap-2">
                <button
                  @click.stop="selectCampsite(camp)"
                  class="text-sm font-semibold"
                  :style="{ color: 'var(--accent)' }"
                >
                  ›
                </button>
              </div>
            </template>
          </Card>
        </div>
        <EmptyState 
          v-else
          icon="⛺"
          title="No Campsites Yet"
          message="You haven't posted any campsites yet. Start by creating one!"
        />
      </div>

      <!-- Reviews Tab -->
      <div v-else-if="activeTab === 'reviews'">
        <EmptyState 
          icon=""
          title="No Reviews Yet"
          message="You haven't made any reviews yet. Share your experience!"
        />
      </div>

      <!-- Edit Profile Tab -->
      <div v-else-if="activeTab === 'edit'">
        <div class="p-6 rounded-xl border" 
             :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-bold text-lg" :style="{ color: 'var(--text-color)' }">Edit Profile</h3>
            <Button 
              label="Delete User"
              variant="danger"
              :disabled="deleting"
              @click="handleUserDelete"
            />
          </div>

          <form @submit.prevent="handleSaveProfile" class="space-y-4">
            <TextInput 
              :model-value="editRequest.username || ''"
              label="Username"
              placeholder="Enter your username"
              required
              @update:model-value="editRequest.username = $event"
            />

            <TextInput 
              type="email"
              :model-value="editRequest.email || ''"
              label="Email"
              placeholder="Enter your email"
              required
              @update:model-value="editRequest.email = $event"
            />

            <CountedTextArea 
              :model-value="editRequest.bio || ''"
              label="Bio"
              placeholder="Tell us about yourself"
              :max-length="500"
              :show-count="true"
              :rows="3"
              @update:model-value="editRequest.bio = $event"
            />
            
            <div class="pt-4 flex gap-3">
              <Button 
                label="Save Changes"
                type="submit"
                variant="primary"
                :disabled="isSaving || !hasChanges"
              />
              <Button 
                label="Cancel"
                variant="secondary"
                @click="resetEdit"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2" :style="{ borderColor: 'var(--accent)' }"></div>
  </div>

  <!-- Error Modal -->
  <Modal :is-open="showErrorModal" title="Update Failed" @close="showErrorModal = false">
    <p class="text-sm whitespace-pre-wrap" :style="{ color: 'var(--text-color)' }">
      {{ errorMessage }}
    </p>
    <template #footer>
      <Button
        label="Close"
        variant="primary"
        @click="showErrorModal = false"
      />
    </template>
  </Modal>

  <!-- Confirm Delete User Modal -->
  <ConfirmDeleteModal
    :is-open="showDeleteModal"
    title="Delete Account"
    message="Are you sure you want to delete your account? This action cannot be undone."
    :is-deleting="deleting"
    @confirm="confirmDeleteUser"
    @close="showDeleteModal = false"
  />

  <ConfirmDeleteModal
    :is-open="showCampsiteDeleteModal"
    title="Delete Campsite"
    message="Are you sure you want to delete this campsite? This action cannot be undone."
    :is-deleting="deletingCampsite"
    @confirm="confirmDeleteCampsite"
    @close="showCampsiteDeleteModal = false"
  />
</template>

<script setup lang="ts">
import type { UpdateUserRequest, UserPrivateProfile, CampsiteProfile } from '@/api'
import { formatBase64 } from '@/helpers/base64'
import { getDirtyFields, hasChanged, syncRequest } from '@/helpers/diff'
import { useRouter } from 'vue-router'
import { AuthenticationService } from '@/services/AuthenticationService'
import { UsersService } from '@/services/UsersService'
import { CampsitesService } from '@/services/CampsitesService'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'
import { ref, reactive, onMounted, computed } from 'vue'
import { Modal, Button } from '@/components'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import ProfileHeader from '@/components/common/ProfileHeader.vue'
import TabNavigation from '@/components/common/TabNavigation.vue'
import Card from '@/components/common/Card.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TextInput from '@/components/ui/TextInput.vue'
import CountedTextArea from '@/components/common/CountedTextArea.vue'

const router = useRouter()

const tabs = [
  { id: 'campsites', label: 'My Campsites' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'edit', label: 'Edit Profile' }
]

const deleting = ref(false)
const showDeleteModal = ref(false)
const activeTab = ref<string | number>('campsites')
const userProfile = ref<UserPrivateProfile | null>(null)
const userCampsites = ref<CampsiteProfile[]>([])
const deletingCampsite = ref(false)
const campsiteToDelete = ref<string | null>(null)
const showCampsiteDeleteModal = ref(false)
const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showErrorModal = ref(false)
const errorMessage = ref('')

const editRequest = reactive<UpdateUserRequest>({
  username: undefined,
  bio: undefined,
  email: undefined,
  profilePicture: undefined,
  timezone: undefined
})

const hasChanges = computed(() => {
  if (!userProfile.value) return false
  return hasChanged(userProfile.value, editRequest)
})

async function fetchUserCampsites() {
  if (!userProfile.value) return
  const query = new QueryBuilder()
    .addParameter(CampsiteQueryFilters.WithOwnerId(userProfile.value.id))
    .build()
  
  const result = await CampsitesService.searchCampsites(query)
  if (result.data) {
    userCampsites.value = result.data
  }
}

function openCampsiteDeleteModal(id: string) {
  campsiteToDelete.value = id
  showCampsiteDeleteModal.value = true
}

async function confirmDeleteCampsite() {
  if (!campsiteToDelete.value) return
  deletingCampsite.value = true
  try {
    await CampsitesService.deleteCampsiteById(campsiteToDelete.value)
    await fetchUserCampsites()
  } catch (err) {
    console.error('Failed to delete campsite:', err)
  } finally {
    deletingCampsite.value = false
    showCampsiteDeleteModal.value = false
    campsiteToDelete.value = null
  }
}

onMounted(async () => {
  const result = await UsersService.getCurrentUser()
  if (result.data) {
    userProfile.value = result.data
    syncRequest(editRequest, result.data)
    await fetchUserCampsites()
  }
})

async function handleUserDelete() {
  showDeleteModal.value = true
}

async function confirmDeleteUser() {
  deleting.value = true
  try {
    await UsersService.deleteCurrentUser()
    AuthenticationService.logout()
    router.push('/')
  } catch (err) {
    console.error('Failed to delete user:', err)
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}

function selectCampsite(camp: CampsiteProfile) {
  router.push(`/app/campsites/${encodeURIComponent(camp.name)}`)
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onloadend = function() {
    const base64String = (reader.result as string).split(',')[1]
    editRequest.profilePicture = base64String
    handleSaveProfile()
  }
  reader.readAsDataURL(file)
}

async function handleSaveProfile() {
  if (!userProfile.value || !hasChanges.value) return
  isSaving.value = true
  
  const payload = getDirtyFields(userProfile.value, editRequest)
  const result = await UsersService.updateCurrentUser(payload)

  if (result.error || result.data === null) {
    errorMessage.value = result?.error?.errors?.map((e: any) => e.message).join('\n') || 'Unknown error'
    showErrorModal.value = true
    isSaving.value = false
    return
  }

  userProfile.value = result.data
  syncRequest(editRequest, result.data)
  isSaving.value = false
}

function resetEdit() {
  if (userProfile.value) {
    syncRequest(editRequest, userProfile.value)
  }
}
</script>