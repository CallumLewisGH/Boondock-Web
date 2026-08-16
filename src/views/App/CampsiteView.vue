<template>
  <div v-if="campsite" class="max-w-4xl mx-auto p-6 min-h-screen" style="color: var(--text-color);">
    <div class="flex items-center gap-6 mb-8">
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ campsite.name }}</h1>
        <p v-if="campsite.description" class="text-sm mt-2 italic" style="color: var(--muted);">
          "{{ campsite.description }}"
        </p>

        <div class="mt-4 flex items-center gap-3">
          <button 
            @click="handleToggleVisit" 
            :disabled="togglingVisit"
            :class="['flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border-2 text-sm', 
              hasUserVisited 
                ? 'bg-green-500/10 border-green-500 text-green-500' 
                : 'bg-transparent border-dashed border-gray-400 hover:border-accent opacity-70 hover:opacity-100']"
          >
            <ArrowPathIcon v-if="togglingVisit" class="w-4 h-4 animate-spin" />
            <span v-else class="flex items-center gap-1">
              <CheckIcon v-if="hasUserVisited" class="w-4 h-4" /><PlusIcon v-else class="w-4 h-4" />
              {{ hasUserVisited ? 'Visited' : "I've Been Here" }}
            </span>
          </button>
          <span v-if="campsite.visits?.length" class="text-xs font-medium opacity-60">
            {{ campsite.visits?.length }} {{ campsite.visits?.length === 1 ? 'person has' : 'people have' }} explored this spot
          </span>
        </div>
      </div>
      
      <div class="flex gap-4">
        <div class="text-center p-4 rounded-xl border" style="background-color: var(--surface); border-color: var(--border);">
          <div class="text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--muted);">Visits</div>
          <div class="text-xl font-bold text-blue-500 flex items-center justify-center gap-1"><MapPinIcon class="w-5 h-5" /> {{ campsite.visits?.length || 0 }}</div>
        </div>
        <div v-if="campsite.boondockScore !== undefined" class="text-center p-4 rounded-xl border" style="background-color: var(--surface); border-color: var(--border);">
          <div class="text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--muted);">Score</div>
          <div class="text-xl font-bold text-orange-500 flex items-center justify-center gap-1"><StarIcon class="w-5 h-5" /> {{ campsite.boondockScore.toFixed(1) }}</div>
        </div>
        <div class="text-right p-4 rounded-xl border" style="background-color: var(--surface); border-color: var(--border);">
          <div class="text-xs font-bold uppercase tracking-wider mb-1" style="color: var(--muted);">Location</div>
          <div class="font-mono font-medium">{{ campsite.latitude.toFixed(4) }}, {{ campsite.longitude.toFixed(4) }}</div>
        </div>
      </div>
    </div>

    <div v-if="isOwner" class="border-b mb-6" style="border-color: var(--border);">
      <div class="flex space-x-4">
        <button @click="activeTab = 'details'" :class="['px-4 py-2 font-medium border-b-2 transition-all', activeTab === 'details' ? 'border-accent text-accent' : 'border-transparent text-muted']">
          Edit Details
        </button>
        <button @click="activeTab = 'reviews'" :class="['px-4 py-2 font-medium border-b-2 transition-all', activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-muted']">
          Reviews
        </button>
      </div>
    </div>

    <div v-if="activeTab === 'details' && isOwner" class="mt-6">
      <FormCard :is-loading="saving" submit-label="Save Changes" @submit="save" @cancel="cancelEdit">
        <div class="flex justify-between mb-4">
          <h3 class="font-bold text-lg">Campsite Settings</h3>
          <Button label="Delete Campsite" variant="danger" size="sm" @click="triggerDeleteCampsite" />
        </div>
        <TextInput :model-value="edited.name || ''" label="Name" @update:model-value="edited.name = $event" />
        <div class="grid grid-cols-2 gap-4 mt-4">
          <TextInput type="number" :model-value="String(edited.latitude || '')" label="Lat" @update:model-value="edited.latitude = parseFloat($event) || 0" />
          <TextInput type="number" :model-value="String(edited.longitude || '')" label="Lng" @update:model-value="edited.longitude = parseFloat($event) || 0" />
        </div>
        <CountedTextArea class="mt-4" :model-value="edited.description || ''" label="Description" :max-length="500" @update:model-value="edited.description = $event" />
      </FormCard>
    </div>

    <div v-if="!isOwner || activeTab === 'reviews'" class="mt-6">
      <div id="review-form" class="mb-12">
        <FormCard 
          v-if="!hasUserReviewed || isEditingReview"
          :is-loading="submittingReview"
          :submit-label="isEditingReview ? 'Update My Review' : 'Post Review'"
          @submit="postReview"
          @cancel="resetReviewForm"
        >
          <h3 class="font-bold text-xl mb-4">{{ isEditingReview ? 'Edit Your Review' : 'Leave a Review' }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <TextInput type="number" label="Rating (1-10)" :model-value="String(newReview.rating)" @update:model-value="newReview.rating = parseInt($event) || 0" />
            <div class="md:col-span-3">
              <TextInput label="Title" placeholder="Sum it up..." :model-value="newReview.title" @update:model-value="newReview.title = $event" />
            </div>
          </div>
          <CountedTextArea label="Comments" placeholder="How was the ground? Cell service?" :max-length="2000" :model-value="newReview.description" @update:model-value="newReview.description = $event" />
        </FormCard>

        <div v-else class="p-8 rounded-2xl border-2 border-dashed text-center" style="border-color: var(--border); background-color: var(--surface);">
          <p class="mb-4 opacity-80">You've already reviewed this campsite!</p>
          <Button label="Edit My Review" variant="outline" @click="startEditReview(userReview)" />
        </div>
      </div>

      <div class="space-y-6">
        <h2 class="text-2xl font-bold">Community Feedback</h2>
        <div v-if="campsite.reviews && campsite.reviews.length > 0" class="space-y-4">
          <div v-for="review in campsite.reviews" :key="review.id" class="p-6 rounded-2xl border" style="background-color: var(--surface); border-color: var(--border);">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500 text-white font-black">{{ review.rating }}</div>
                <div>
                  <h4 class="font-bold text-lg">{{ review.title }} <span v-if="review.ownerId === campsite.ownerId" class="ml-2 text-[10px] bg-accent px-2 py-0.5 rounded text-white">Owner</span></h4>
                  <p class="text-xs opacity-60">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                </div>
              </div>
              <div v-if="currentUser && review.ownerId === currentUser.id" class="flex gap-2">
                <button @click="startEditReview(review)" class="text-xs font-bold text-accent">Edit</button>
                <button @click="triggerDeleteReview(review.id)" class="text-xs font-bold text-red-500">Delete</button>
              </div>
            </div>
            <p class="text-sm leading-relaxed">{{ review.description }}</p>
          </div>
        </div>
        <EmptyState v-else :icon="ChatBubbleLeftEllipsisIcon" title="No Reviews Yet" message="Be the first to share!" />
      </div>
    </div>
  </div>

  <ConfirmDeleteModal 
    :is-open="deleteModal.isOpen" 
    :title="deleteModal.title" 
    :message="deleteModal.message" 
    :is-deleting="deleting" 
    @confirm="handleConfirmDelete" 
    @close="deleteModal.isOpen = false" 
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CampsiteProfile, UpdateCampsiteRequest } from '@/api'
import { CampsitesService } from '@/services/CampsitesService'
import { CampsiteReviewsService } from '@/services/CampsiteReviewsService'
import { CampsiteVisitsService } from '@/services/CampsiteVisitsService'
import { UsersService } from '@/services/UsersService'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'

// Components
import TextInput from '@/components/ui/TextInput.vue'
import CountedTextArea from '@/components/common/CountedTextArea.vue'
import FormCard from '@/components/common/FormCard.vue'
import Button from '@/components/ui/Button.vue'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { ArrowPathIcon, CheckIcon, PlusIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const router = useRouter()

const campsite = ref<CampsiteProfile | null>(null)
const currentUser = ref(null as any)
const loading = ref(true)
const isOwner = ref(false)
const activeTab = ref('reviews')

// Forms/State
const edited = ref<Partial<UpdateCampsiteRequest>>({})
const newReview = ref({ rating: 10, title: '', description: '' })
const isEditingReview = ref(false)
const editingReviewId = ref<string | null>(null)
const saving = ref(false)
const deleting = ref(false)
const submittingReview = ref(false)
const togglingVisit = ref(false)

// Delete Modal State
const deleteModal = ref({ isOpen: false, type: 'campsite' as 'campsite' | 'review', targetId: '', title: '', message: '' })

// Computed properties for Review logic
const hasUserReviewed = computed(() => {
  if (!currentUser.value || !campsite.value?.reviews) return false
  return campsite.value.reviews.some(r => r.ownerId === currentUser.value.id)
})

const userReview = computed(() => {
  if (!currentUser.value || !campsite.value?.reviews) return null
  return campsite.value.reviews.find(r => r.ownerId === currentUser.value.id)
})

// Computed for Visit logic
const hasUserVisited = computed(() => {
  if (!currentUser.value || !campsite.value?.visits) return false
  return campsite.value.visits.some(v => v.ownerId === currentUser.value.id)
})

async function fetchCampsite() {
  const name = route.params.name as string
  if (!name) return
  loading.value = true
  try {
    const query = new QueryBuilder()
      .addParameter(CampsiteQueryFilters.WithNames([name]))
      .build()
      
    const result = await CampsitesService.searchCampsites(query)
    if (result.data && result.data.length > 0 && result.data[0]) {
      campsite.value = result.data[0]
      edited.value = { 
        name: campsite.value.name, 
        description: campsite.value.description, 
        latitude: campsite.value.latitude, 
        longitude: campsite.value.longitude 
      }
      
      const userRes = await UsersService.getCurrentUser()
      if (userRes.data) {
        currentUser.value = userRes.data
        isOwner.value = currentUser.value.id === campsite.value.ownerId
      }
    }
  } finally { 
    loading.value = false 
  }
}

async function handleToggleVisit() {
  if (!campsite.value || !currentUser.value || !campsite.value.visits) return;
  
  togglingVisit.value = true
  
  const originalVisits = [...(campsite.value.visits || [])]
  const alreadyVisited = hasUserVisited.value
  

  if (alreadyVisited) {
    campsite.value.visits = campsite.value.visits.filter(v => v.ownerId !== currentUser.value.id)
  } else {
    const tempVisit = { 
        id: 'temp',
        ownerId: currentUser.value.id, 
        campsiteId: campsite.value.id,
        updatedAt: new Date().toISOString(),  
        createdAt: new Date().toISOString() 
    }
    campsite.value.visits = [...originalVisits, tempVisit]
  }

  try {
    const { error } = await CampsiteVisitsService.toggleVisit(campsite.value.id)
    if (error) throw new Error()
    
    // 3. Re-fetch to sync real IDs and the backend-calculated Boondock Score
    await fetchCampsite()
  } catch (err) {
    // 4. Rollback: If the API fails, revert the array to its original state
    campsite.value.visits = originalVisits
    console.error("Visit toggle failed:", err)
  } finally {
    togglingVisit.value = false
  }
}

function startEditReview(review: any) {
  newReview.value = { rating: review.rating, title: review.title, description: review.description }
  isEditingReview.value = true
  editingReviewId.value = review.id
  document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })
}

function resetReviewForm() {
  newReview.value = { rating: 10, title: '', description: '' }
  isEditingReview.value = false
  editingReviewId.value = null
}

async function postReview() {
  if (!campsite.value) return
  submittingReview.value = true
  try {
    if (isEditingReview.value && editingReviewId.value) {
      await CampsiteReviewsService.updateReviewById(editingReviewId.value, newReview.value)
    } else {
      await CampsiteReviewsService.createReview(campsite.value.id, newReview.value)
    }
    resetReviewForm()
    await fetchCampsite()
  } finally { 
    submittingReview.value = false 
  }
}

function triggerDeleteCampsite() {
  deleteModal.value = { 
    isOpen: true, 
    type: 'campsite', 
    targetId: campsite.value!.id, 
    title: 'Delete Campsite', 
    message: 'Delete this entire campsite location? This cannot be undone.' 
  }
}

function triggerDeleteReview(id: string) {
  deleteModal.value = { 
    isOpen: true, 
    type: 'review', 
    targetId: id, 
    title: 'Delete Review', 
    message: 'Remove your review from this campsite?' 
  }
}

async function handleConfirmDelete() {
  deleting.value = true
  try {
    if (deleteModal.value.type === 'campsite') {
      await CampsitesService.deleteCampsiteById(deleteModal.value.targetId)
      router.push('/app/map')
    } else {
      await CampsiteReviewsService.deleteReviewById(deleteModal.value.targetId)
      await fetchCampsite()
      deleteModal.value.isOpen = false
    }
  } finally { 
    deleting.value = false 
  }
}

async function save() {
  if (!campsite.value) return
  saving.value = true
  try {
    await CampsitesService.updateCampsiteById(campsite.value.id, edited.value as UpdateCampsiteRequest)
    await fetchCampsite()
  } finally { 
    saving.value = false 
  }
}

const cancelEdit = () => fetchCampsite()
watch(() => route.params.name, fetchCampsite)
onMounted(fetchCampsite)
</script>