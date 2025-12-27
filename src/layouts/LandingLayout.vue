<template>
  <div class="min-h-screen transition-colors duration-300 font-sans" 
       :style="{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }">
    
    <!-- Header -->
    <LandingHeader :active-page="activePage" />

    <!-- Main Content -->
    <main class="pt-20">
      <slot></slot>
    </main>

    <!-- Simple Footer (keep it minimal but elegant) -->
    <footer class="py-12 border-t"
            :style="{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border)'
            }">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm"
           :style="{ color: 'var(--muted)' }">
          © 2026 Boondock. The Mountain Awaits.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import LandingHeader from '@/components/LandingHeader.vue'

const props = defineProps({
  activePage: {
    type: String,
    default: ''
  }
})
</script>