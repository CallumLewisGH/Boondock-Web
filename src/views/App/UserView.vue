<template>
  <div v-if="userProfile" class="max-w-4xl mx-auto p-6 min-h-screen" style="color: var(--text-color);">
    <div class="flex items-center gap-6 mb-8">
      <div class="w-24 h-24 rounded-full overflow-hidden border-2 flex-shrink-0" style="border-color: var(--border);">
        <img v-if="userProfile.profilePicture" :src="userProfile.profilePicture" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center" style="background-color: var(--surface); color: var(--muted);"><UserIcon class="w-10 h-10" /></div>
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-3xl font-bold truncate">{{ userProfile.username }}</h1>
        <p v-if="userProfile.bio" class="text-sm mt-1 italic opacity-70">"{{ userProfile.bio }}"</p>
        <p class="text-[10px] uppercase font-bold tracking-widest mt-2 opacity-40">Explorer since {{ new Date(userProfile.createdAt).getFullYear() }}</p>
      </div>
    </div>
    
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="p-4 rounded-xl text-center border" style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">{{ userCampsites.length }}</div>
        <div class="text-[10px] uppercase font-bold opacity-60">Found</div>
      </div>
      <div class="p-4 rounded-xl text-center border" style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">{{ visitedCampsites.length }}</div>
        <div class="text-[10px] uppercase font-bold opacity-60">Visited</div>
      </div>
      <div class="p-4 rounded-xl text-center border" style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">{{ userReviews.length }}</div>
        <div class="text-[10px] uppercase font-bold opacity-60">Reviews</div>
      </div>
    </div>

    <div class="border-b mb-6" style="border-color: var(--border);">
      <div class="flex space-x-4">
        <button v-for="tab in publicTabs" :key="tab.id" @click="activeTab = tab.id"
          class="px-4 py-2 font-medium transition-all border-b-2"
          :style="{ borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent', color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)' }">
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="min-h-[200px]">
      <div v-if="activeTab === 'campsites'">
        <div v-if="userCampsites.length > 0" class="grid gap-4">
          <div v-for="camp in userCampsites" :key="camp.id" @click="selectCampsite(camp)" class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all" style="background-color: var(--card-bg); border-color: var(--border);">
            <img v-if="camp.images?.[0]" :src="camp.images[0]" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--surface); color: var(--accent);"><TentIcon class="w-6 h-6" /></div>
            <div class="flex-1 min-w-0"><h3 class="font-bold truncate">{{ camp.name }}</h3><p class="text-sm line-clamp-1 opacity-60">{{ camp.description }}</p></div>
            <div style="color: var(--accent);">›</div>
          </div>
        </div>
        <EmptyState v-else :icon="TentIcon" title="No Spots" message="This explorer hasn't found any spots yet." />
      </div>

      <div v-else-if="activeTab === 'visited'">
        <div v-if="visitedCampsites.length > 0" class="grid gap-4">
          <div v-for="camp in visitedCampsites" :key="camp.id" @click="selectCampsite(camp)" class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all" style="background-color: var(--card-bg); border-color: var(--border);">
            <img v-if="camp.images?.[0]" :src="camp.images[0]" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
            <div v-else class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background-color: var(--surface); color: var(--accent);"><MapPinIcon class="w-6 h-6" /></div>
            <div class="flex-1 min-w-0"><h3 class="font-bold truncate">{{ camp.name }}</h3><p class="text-sm opacity-60">Visited this spot</p></div>
            <div style="color: var(--accent);">›</div>
          </div>
        </div>
        <EmptyState v-else :icon="MapPinIcon" title="No Visits" message="This explorer hasn't logged any visits yet." />
      </div>

      <div v-else-if="activeTab === 'reviews'">
        <div v-if="userReviews.length > 0" class="grid gap-4">
          <div v-for="review in userReviews" :key="review.id" @click="goToCampsite(review.campsiteId)" class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer hover:scale-[1.01] transition-all" style="background-color: var(--card-bg); border-color: var(--border);">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-black text-white bg-orange-500">{{ review.rating }}</div>
            <div class="flex-1 min-w-0"><h3 class="font-bold truncate">{{ review.title }}</h3><p class="text-sm line-clamp-1 opacity-60">{{ review.description }}</p></div>
            <div class="text-xs font-bold uppercase opacity-50" style="color: var(--accent);">View Spot ›</div>
          </div>
        </div>
        <EmptyState v-else :icon="ChatBubbleLeftEllipsisIcon" title="No Reviews" message="This explorer hasn't written any reviews yet." />
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: var(--accent);"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CampsiteProfile, UserPublicProfile, CampsiteReviewProfile } from '@/api'
import { QueryBuilder } from '@/helpers/queryBuilder'
import { UserQueryFilters } from '@/queryFilters/userQueryFilters'
import { CampsiteQueryFilters } from '@/queryFilters/campsiteQueryFilters'
import { CampsiteReviewQueryFilters } from '@/queryFilters/campsiteReviewQueryFilters'
import EmptyState from '@/components/common/EmptyState.vue'
import { UserIcon, MapPinIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/vue/24/outline'
import { TentIcon } from '@/components/icons'
import { UsersService } from '@/services/UsersService'
import { CampsitesService } from '@/services/CampsitesService'
import { CampsiteReviewsService } from '@/services/CampsiteReviewsService'

const route = useRoute()
const router = useRouter()
const publicTabs = [{ id: 'campsites', label: 'Found' }, { id: 'visited', label: 'Visited' }, { id: 'reviews', label: 'Reviews' }]
const activeTab = ref('campsites')
const userProfile = ref<UserPublicProfile | null>(null)
const userCampsites = ref<CampsiteProfile[]>([])
const visitedCampsites = ref<CampsiteProfile[]>([]) // Stubbed
const userReviews = ref<CampsiteReviewProfile[]>([])
const loading = ref(true)

async function fetchUser() {
  const username = route.params.name as string
  if (!username) return (loading.value = false)
  loading.value = true
  try {
    const query = new QueryBuilder().addParameter(UserQueryFilters.WithUsernames([username])).build()
    const result = await UsersService.getUsers(query)
    if (result.data?.[0]) {
      userProfile.value = result.data[0]
      if (!userProfile.value?.id) throw new Error('User ID is missing')
        const visitedQuery = new QueryBuilder().addParameter(CampsiteQueryFilters.VisitedByUserId(userProfile.value.id)).build()
      const queryFound = new QueryBuilder().addParameter(CampsiteQueryFilters.WithOwnerId(userProfile.value.id)).build()
      const queryReviews = new QueryBuilder().addParameter(CampsiteReviewQueryFilters.WithOwnerId(userProfile.value.id)).build()
      
      const [found, reviews, visited] = await Promise.all([
        CampsitesService.searchCampsites(queryFound),
        CampsiteReviewsService.searchReviews(queryReviews),
        CampsitesService.searchCampsites(visitedQuery)
      ])
      if (found.data) userCampsites.value = found.data
      if (visited.data) visitedCampsites.value = visited.data
      if (reviews.data) userReviews.value = reviews.data
    }
  } finally { loading.value = false }
}

function selectCampsite(c: CampsiteProfile) { router.push(`/app/campsites/${encodeURIComponent(c.name)}`) }
async function goToCampsite(id: string) {
  const res = await CampsitesService.getCampsiteById(id)
  if (res.data) router.push(`/app/campsites/${encodeURIComponent(res.data.name)}`)
}

watch(() => route.params.name, fetchUser)
onMounted(fetchUser)
</script>