<template>
  <!-- Hero Section with all original effects -->
  <header class="relative h-[80vh] flex items-center justify-center overflow-hidden"
          :style="{ backgroundColor: 'var(--header-bg)' }">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-orange)' }"></div>
      <div class="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-amber)' }"></div>
    </div>

    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <span class="inline-block py-1 px-3 rounded-full text-sm font-bold mb-6 tracking-wide uppercase border"
            :style="{ 
              backgroundColor: 'var(--badge-bg)',
              borderColor: 'var(--badge-border)',
              color: 'var(--accent)'
            }">
        Beta Access Live
      </span>
      <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
          :style="{ color: 'var(--header-text)' }">
        The Mountain <span :style="{ color: 'var(--accent)' }">Awaits</span>
      </h1>
      <p class="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          :style="{ color: 'var(--header-muted)' }">
        Built for wild camping enthusiasts. Locate remote spots and connect with nature—completely off the grid.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="px-8 py-4 rounded-lg text-lg font-bold transition shadow-lg text-white"
                :style="{ backgroundColor: 'var(--accent)' }">
          Download App (WIP)
        </button>
      </div>
    </div>
  </header>

  <!-- Features Section with all original styling -->
  <section class="py-20 px-4 sm:px-6 lg:px-8"
            :style="{ backgroundColor: 'var(--surface)' }">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4"
            :style="{ color: 'var(--text-color)' }">
          Built for the Wild
        </h2>
        <div class="h-1 w-20 mx-auto rounded"
              :style="{ backgroundColor: 'var(--accent)' }"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="group p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300 border"
          :style="{ 
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border)'
          }"
        >
          <div class="text-4xl mb-6 w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform shadow-sm"
                :style="{ 
                  backgroundColor: isDark ? 'var(--border)' : 'var(--surface)'
                }">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-bold mb-3"
              :style="{ color: 'var(--text-color)' }">
            {{ feature.title }}
          </h3>
          <p class="leading-relaxed"
              :style="{ color: 'var(--muted)' }">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

import { useDarkMode } from '@/composables/useDarkMode'

const { isDark } = useDarkMode()

const features = [
  {
    title: 'Hidden Gems',
    desc: 'Discover secluded wild camping spots verified by the community.',
    icon: '📍'
  },
  {
    title: 'Offline Maps',
    desc: 'Download topographical maps for when the signal fades.',
    icon: '🗺️'
  },
  {
    title: 'Leave No Trace',
    desc: 'Guides on sustainable camping to keep the wild, wild.',
    icon: '🌿'
  }
]
</script>