<template>
  <div 
    class="fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 ease-in-out border-r shadow-2xl"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
    style="background-color: var(--card-bg); border-color: var(--border);"
  >
    <div v-if="campsite" class="flex flex-col h-full">
      <div class="p-6 flex justify-between items-start">
        <h2 class="text-xl font-bold pr-4" style="color: var(--text-color);">
          {{ campsite.name }}
        </h2>
        <button @click="$emit('close')" class="opacity-50 hover:opacity-100" aria-label="Close"><XMarkIcon class="w-5 h-5" /></button>
      </div>

      <div class="px-6 grid grid-cols-2 gap-3 mb-6">
        <div class="p-3 rounded-xl border border-dashed text-center"
             style="background-color: var(--surface); border-color: var(--border);">
          <div class="text-[10px] uppercase font-bold opacity-50 mb-1">Visits</div>
          <div class="text-lg font-bold text-blue-500 flex items-center justify-center gap-1"><MapPinIcon class="w-4 h-4" /> {{ campsite.visits?.length || 0 }}</div>
        </div>

        <div v-if="campsite.boondockScore !== undefined"
             class="p-3 rounded-xl border border-dashed text-center"
             style="background-color: var(--surface); border-color: var(--border);">
          <div class="text-[10px] uppercase font-bold opacity-50 mb-1">Score</div>
          <div class="text-lg font-bold text-orange-500 flex items-center justify-center gap-1"><StarIcon class="w-4 h-4" /> {{ campsite.boondockScore.toFixed(1) }}</div>
        </div>
      </div>

      <div class="px-6 flex-1 overflow-y-auto">
        <p class="text-sm opacity-70 italic mb-4">
          {{ campsite.description || 'No description provided.' }}
        </p>
        
        <div class="text-[10px] font-mono opacity-50 p-2 rounded bg-black/5">
          {{ campsite.latitude.toFixed(4) }}, {{ campsite.longitude.toFixed(4) }}
        </div>
      </div>

      <div class="p-6 mt-auto border-t" style="border-color: var(--border);">
        <button 
          @click="viewDetails"
          class="w-full py-3 rounded-xl font-bold transition-all text-white"
          style="background-color: var(--accent);"
        >
          View Full Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CampsiteProfile } from '@/api'
import { XMarkIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  isOpen: boolean
  campsite: CampsiteProfile | null
}>()

const emit = defineEmits(['close'])
const router = useRouter()

const viewDetails = () => {
  if (props.campsite) {
    router.push(`/app/campsites/${encodeURIComponent(props.campsite.name)}`)
  }
}
</script>