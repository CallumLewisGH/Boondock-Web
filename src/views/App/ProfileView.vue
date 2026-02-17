<template>
  <div v-if="userProfile" class="max-w-4xl mx-auto p-6 min-h-screen">
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
    
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="p-4 rounded-xl text-center border" 
           :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
        <div class="text-2xl font-bold" :style="{ color: 'var(--accent)' }">{{ userCampsites.length }}</div>
        <div class="text-xs font-bold uppercase tracking-tight" :style="{ color: 'var(--muted)' }">Found</div>
      </div>

      <div class="p-4 rounded-xl text-center border" 
           :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
        <div class="text-2xl font-bold" :style="{ color: 'var(--accent)' }">{{ visitedCampsites.length }}</div>
        <div class="text-xs font-bold uppercase tracking-tight" :style="{ color: 'var(--muted)' }">Visited</div>
      </div>

      <div class="p-4 rounded-xl text-center border" 
           :style="{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }">
        <div class="text-2xl font-bold" :style="{ color: 'var(--accent)' }">{{ userReviews.length }}</div>
        <div class="text-xs font-bold uppercase tracking-tight" :style="{ color: 'var(--muted)' }">Reviews</div>
      </div>
    </div>

    <TabNavigation 
      :tabs="tabs" 
      :active-tab="activeTab"
      @select="activeTab = $event.toString()"
    />
    
    <div class="mt-6">
      <div v-if="activeTab === 'found'">
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
              <div style="color: var(--accent);">›</div>
            </template>
          </Card>
        </div>
        <EmptyState 
          v-else
          icon="⛺"
          title="No Spots Found"
          message="You haven't posted any campsites yet."
        />
      </div>

      <div v-else-if="activeTab === 'visited'">
        <div v-if="visitedCampsites.length > 0" class="grid gap-4">
          <Card 
            v-for="camp in visitedCampsites" 
            :key="camp.id"
            @click="selectCampsite(camp)"
          >
            <template #icon>
              <div class="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" :style="{ backgroundColor: 'var(--surface)' }">
                📍
              </div>
            </template>
            <template #title>{{ camp.name }}</template>
            <template #description>You have visited this location.</template>
            <template #action>
              <div style="color: var(--accent);">›</div>
            </template>
          </Card>
        </div>
        <EmptyState 
          v-else
          icon="📍"
          title="No Visited Spots"
          message="Campsites you mark as visited will appear here!"
        />
      </div>

      <div v-else-if="activeTab === 'reviews'">
        <div v-if="userReviews.length > 0" class="grid gap-4">
          <Card 
            v-for="review in userReviews" 
            :key="review.id"
            @click="goToCampsite(review.campsiteId)"
          >
            <template #icon>
              <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-black text-white bg-orange-500">
                {{ review.rating }}
              </div>
            </template>
            <template #title>{{ review.title }}</template>
            <template #description>{{ review.description }}</template>
            <template #action>
              <div class="text-xs font-bold uppercase opacity-50" :style="{ color: 'var(--accent)' }">
                View Spot ›
              </div>
            </template>
          </Card>
        </div>
        <EmptyState 
          v-else
          icon="💬"
          title="No Reviews Yet"
          message="Share your experience by reviewing a campsite!"
        />
      </div>

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
              required
              @update:model-value="editRequest.username = $event"
            />

            <TextInput 
              type="email"
              :model-value="editRequest.email || ''"
              label="Email"
              required
              @update:model-value="editRequest.email = $event"
            />

            <CountedTextArea 
              :model-value="editRequest.bio || ''"
              label="Bio"
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

  <Modal :is-open="showErrorModal" title="Update Failed" @close="showErrorModal = false">
    <p class="text-sm whitespace-pre-wrap" :style="{ color: 'var(--text-color)' }">
      {{ errorMessage }}
    </p>
    <template #footer>
      <Button label="Close" variant="primary" @click="showErrorModal = false" />
    </template>
  </Modal>

  <ConfirmDeleteModal
    :is-open="showDeleteModal"
    title="Delete Account"
    message="Are you sure you want to delete your account? This action cannot be undone."
    :is-deleting="deleting"
    @confirm="confirmDeleteUser"
    @close="showDeleteModal = false"
  />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { UpdateUserRequest, UserPrivateProfile, CampsiteProfile, CampsiteReviewProfile } from '@/api'
import { formatBase64 } from '@/helpers/base64'
import { getDirtyFields, hasChanged, syncRequest } from '@/helpers/diff'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'
import { CampsiteReviewQueryFilters } from '@/queryFilters/campsiteReviewQueryFilters'
import { Modal, Button } from '@/components'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import ProfileHeader from '@/components/common/ProfileHeader.vue'
import TabNavigation from '@/components/common/TabNavigation.vue'
import Card from '@/components/common/Card.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TextInput from '@/components/ui/TextInput.vue'
import CountedTextArea from '@/components/common/CountedTextArea.vue'
import { CampsitesService } from '@/services/CampsitesService'
import { CampsiteReviewsService } from '@/services/CampsiteReviewsService'
import { UsersService } from '@/services/UsersService'
import { AuthenticationService } from '@/services/AuthenticationService'

const router = useRouter()

const tabs = [
  { id: 'found', label: 'Found' },
  { id: 'visited', label: 'Visited' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'edit', label: 'Edit Profile' }
]

const deleting = ref(false)
const showDeleteModal = ref(false)
const activeTab = ref('found')
const userProfile = ref<UserPrivateProfile | null>(null)
const userCampsites = ref<CampsiteProfile[]>([])
const visitedCampsites = ref<CampsiteProfile[]>([]) // Stub for visited logic
const userReviews = ref<CampsiteReviewProfile[]>([])

const isSaving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const showErrorModal = ref(false)
const errorMessage = ref('')

const editRequest = reactive<UpdateUserRequest>({
  username: undefined,
  bio: undefined,
  email: undefined,
  profilePicture: undefined
})

const hasChanges = computed(() => {
  if (!userProfile.value) return false
  return hasChanged(userProfile.value, editRequest)
})

async function fetchUserData() {
  if (!userProfile.value) return
  
  // Fetch campsites created by user
  const visitedQuery = new QueryBuilder()
    .addParameter(CampsiteQueryFilters.VisitedByUserId(userProfile.value.id))
    .build()

  const foundQuery = new QueryBuilder()
    .addParameter(CampsiteQueryFilters.WithOwnerId(userProfile.value.id))
    .build()
  
  // Fetch reviews written by user
  const reviewQuery = new QueryBuilder()
    .addParameter(CampsiteReviewQueryFilters.WithOwnerId(userProfile.value.id))
    .build()

  const [campsRes, reviewsRes, visitedCampsRes] = await Promise.all([
    CampsitesService.searchCampsites(foundQuery),
    CampsiteReviewsService.searchReviews(reviewQuery),
    CampsitesService.searchCampsites(visitedQuery)
  ])

  if (campsRes.data) userCampsites.value = campsRes.data
  if (visitedCampsRes.data) visitedCampsites.value = visitedCampsRes.data
  if (reviewsRes.data) userReviews.value = reviewsRes.data
}

onMounted(async () => {
  const result = await UsersService.getCurrentUser()
  if (result.data) {
    userProfile.value = result.data
    syncRequest(editRequest, result.data)
    await fetchUserData()
  }
})

async function goToCampsite(campsiteId: string) {
  const result = await CampsitesService.getCampsiteById(campsiteId)
  if (result.data) {
    router.push(`/app/campsites/${encodeURIComponent(result.data.name)}`)
  }
}

function selectCampsite(camp: CampsiteProfile) {
  router.push(`/app/campsites/${encodeURIComponent(camp.name)}`)
}

async function handleSaveProfile() {
  if (!userProfile.value || !hasChanges.value) return
  isSaving.value = true
  const payload = getDirtyFields(userProfile.value, editRequest)
  const result = await UsersService.updateCurrentUser(payload)

  if (result.error || result.data === null) {
    errorMessage.value = result?.error?.errors?.[0]?.message || 'Unknown error'
    showErrorModal.value = true
    isSaving.value = false
    return
  }

  userProfile.value = result.data
  syncRequest(editRequest, result.data)
  isSaving.value = false
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onloadend = () => {
    editRequest.profilePicture = (reader.result as string).split(',')[1]
    handleSaveProfile()
  }
  reader.readAsDataURL(file)
}

function resetEdit() { if (userProfile.value) syncRequest(editRequest, userProfile.value) }

async function handleUserDelete() { showDeleteModal.value = true }

async function confirmDeleteUser() {
  deleting.value = true
  try {
    await UsersService.deleteCurrentUser()
    AuthenticationService.logout()
    router.push('/')
  } finally {
    deleting.value = false
    showDeleteModal.value = false
  }
}
</script>