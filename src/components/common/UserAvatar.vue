<template>
  <div class="flex items-center gap-3">
    <div class="flex-shrink-0">
      <div v-if="profilePicture" 
           class="w-12 h-12 rounded-full overflow-hidden border-2" 
           :style="{ borderColor: 'var(--border)' }">
        <img :src="formatBase64(profilePicture)" :alt="name" class="w-full h-full object-cover" />
      </div>
      <div v-else 
           class="w-12 h-12 rounded-full flex items-center justify-center text-lg border-2" 
           :style="{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }">
        👤
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="font-medium truncate" :style="{ color: 'var(--text-color)' }">{{ name }}</h3>
      <p v-if="bio" class="text-xs line-clamp-1" :style="{ color: 'var(--muted)' }">{{ bio }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatBase64 } from '@/helpers/base64';
defineProps<{
  name: string
  bio?: string
  profilePicture?: string
}>()
</script>
