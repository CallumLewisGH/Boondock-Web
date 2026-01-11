<template>
  <!-- Hero Section -->
  <header class="relative pt-32 pb-20 px-4 overflow-hidden"
          :style="{ backgroundColor: 'var(--header-bg)' }">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute -top-[10%] left-1/4 w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-orange)' }"></div>
      <div class="absolute -bottom-[10%] right-1/4 w-[40%] h-[40%] rounded-full blur-[120px]"
            :style="{ backgroundColor: 'var(--glow-amber)' }"></div>
    </div>

    <div class="relative z-10 text-center max-w-4xl mx-auto">
      <span class="inline-block py-1 px-3 rounded-full text-sm font-bold mb-6 tracking-wide uppercase border"
            :style="{ 
              backgroundColor: 'var(--badge-bg)',
              borderColor: 'var(--badge-border)',
              color: 'var(--accent)'
            }">
        Responsible Camping
      </span>
      <h1 class="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          :style="{ color: 'var(--header-text)' }">
        Leave <span :style="{ color: 'var(--accent)' }">No</span> Trace<br>
      </h1>
      <p class="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          :style="{ color: 'var(--header-muted)' }">
        Guidelines for responsible wilderness camping to protect the places we love.
      </p>
    </div>
  </header>

  <!-- Main Content -->
  <main class="py-20 px-4 sm:px-6 lg:px-8"
        :style="{ backgroundColor: 'var(--surface)' }">
    <div class="max-w-5xl mx-auto">
      
      <!-- Leave No Trace Principles -->
      <section class="mb-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4"
              :style="{ color: 'var(--text-color)' }">
            Leave No Trace Principles
          </h2>
          <div class="h-1 w-20 mx-auto rounded"
                :style="{ backgroundColor: 'var(--accent)' }"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div 
            v-for="(principle, index) in principles" 
            :key="index"
            class="group p-8 rounded-2xl hover:-translate-y-2 transition-all duration-300 border"
            :style="{ 
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border)'
            }"
          >
            <div class="text-4xl mb-6 w-16 h-16 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform"
                  :style="{ 
                    backgroundColor: isDark ? 'var(--border)' : 'var(--surface)'
                  }">
              {{ principle.icon }}
            </div>
            <h3 class="text-xl font-bold mb-3"
                :style="{ color: 'var(--text-color)' }">
              {{ principle.title }}
            </h3>
            <p class="leading-relaxed text-sm"
                :style="{ color: 'var(--muted)' }">
              {{ principle.desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- Safety Guidelines -->
      <section class="mb-20">
        <h2 class="text-3xl md:text-4xl font-bold mb-8 text-center"
            :style="{ color: 'var(--text-color)' }">
          Safety First
        </h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 class="text-2xl font-bold mb-6"
                :style="{ color: 'var(--text-color)' }">
              Before You Go
            </h3>
            <ul class="space-y-4"
                :style="{ color: 'var(--muted)' }">
              <li class="flex items-start gap-3">
                <span class="text-orange-500 mt-1">•</span>
                <span>Check weather forecasts and fire restrictions</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 mt-1">•</span>
                <span>Tell someone your plans and expected return time</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 mt-1">•</span>
                <span>Research local regulations and land management rules</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="text-orange-500 mt-1">•</span>
                <span>Pack appropriate gear for the conditions</span>
              </li>
            </ul>
          </div>

          <div class="relative">
            <div class="aspect-[4/3] rounded-2xl overflow-hidden border-2 shadow-xl"
                  :style="{ borderColor: 'var(--border)' }">
              <div class="w-full h-full flex items-center justify-center"
                    :style="{ 
                      backgroundColor: isDark ? 'var(--card-bg)' : 'var(--border)'
                    }">
                <span class="text-6xl">🧭</span>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">

import { useDarkMode } from '@/composables/useDarkMode'

const { isDark } = useDarkMode()

const principles = [
  {
    title: 'Plan Ahead',
    desc: 'Know the regulations and concerns for the area you\'ll visit. Prepare for extreme weather, hazards, and emergencies.',
    icon: '📋'
  },
  {
    title: 'Travel on Trail',
    desc: 'Stick to established trails and campsites. But don\'t let that stop you from exploring new areas responsibly!',
    icon: '👣'
  },
  {
    title: 'Dispose of Waste Properly',
    desc: 'Pack it in, pack it out. Inspect your campsite and rest areas for trash or spilled foods. Pack out all trash.',
    icon: '🗑️'
  },
  {
    title: 'Leave What You Find',
    desc: 'Preserve the past: examine, but do not touch cultural or historic structures and artifacts.',
    icon: '🏛️'
  },
  {
    title: 'Minimize Campfire Impacts',
    desc: 'Use a camp stove for cooking and enjoy a candle lantern for light. Where fires are permitted, use established fire rings.',
    icon: '🔥'
  },
  {
    title: 'Respect Wildlife',
    desc: 'Observe wildlife from a distance. Do not follow or approach them. Never feed animals.',
    icon: '🦌'
  }
]
</script>