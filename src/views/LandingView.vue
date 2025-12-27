<script setup lang="ts">
import router from '@/router';
import { ref, onMounted } from 'vue';

const isMenuOpen = ref(false);
const isDark = ref(localStorage.getItem('darkMode') !== 'false');

const updateDOM = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', isDark.value.toString());
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  updateDOM();
};

onMounted(() => {
  if (!localStorage.getItem('darkMode')) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = prefersDark;
  }
  updateDOM();
});

const handleAuth = () => {
  router.push('/login');
};

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
];
</script>

<template>
 <div class="min-h-screen transition-colors duration-300 font-sans" 
       :style="{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }">
    
    <nav class="absolute w-full z-20 top-0 left-0 border-b backdrop-blur-md"
         :style="{ 
           borderColor: 'var(--border)',
           backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'
         }">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span class="font-bold text-2xl tracking-wider uppercase text-white">Boondock</span>
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <!-- Changed: Always white text for nav links -->
            <a href="#" class="text-white hover:text-orange-200 transition-colors">About</a>
            <a href="#" class="text-white hover:text-orange-200 transition-colors">Guidelines</a>

            <button 
              @click="toggleDarkMode" 
              class="p-2 rounded-full transition text-white hover:text-orange-200"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              {{ isDark ? '☀️' : '🌙' }}
            </button>

            <button 
              @click="handleAuth"
              class="px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-white"
              :style="{ backgroundColor: 'var(--accent)' }"
            >
              Sign In / Join
            </button>
          </div>

          <div class="md:hidden flex items-center gap-4">
            <button 
              @click="toggleDarkMode" 
              class="p-2 text-white"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            >
              {{ isDark ? '☀️' : '🌙' }}
            </button>
            <button @click="isMenuOpen = !isMenuOpen" class="focus:outline-none">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" 
                   :style="{ color: 'var(--accent)' }">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <header class="relative h-[80vh] flex items-center justify-center overflow-hidden"
        :style="{ 
          background: isDark ? 'var(--header-bg)' : 'var(--header-bg)',
          color: 'var(--header-text)'
        }">
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
          Beta Access
        </span>
        <h1 class="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            :style="{ color: 'var(--header-text)' }">
          Find Your <span :style="{ color: 'var(--accent)' }">Solitude</span>.
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
          <button class="border-2 px-8 py-4 rounded-lg text-lg font-bold hover:scale-105 transition"
                  :style="{ 
                    borderColor: 'var(--muted)',
                    color: 'var(--header-muted)'
                  }">
            View Map
          </button>
        </div>
      </div>
    </header>

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

    <footer class="py-12 border-t"
            :style="{ 
              backgroundColor: 'var(--bg-color)',
              borderColor: 'var(--border)'
            }">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <p class="text-sm"
           :style="{ color: 'var(--muted)' }">
          © 2024 Boondock. The mountain awaits.
        </p>
      </div>
    </footer>
  </div>
</template>