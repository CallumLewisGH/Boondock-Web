import { ref, onMounted } from 'vue'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

export function useDarkMode() {
  const isDark = ref(localStorage.getItem('darkMode') !== 'false')

  const updateDOM = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDark.value.toString())

    // The app header is always a dark near-black in both themes (see --header-bg in
    // index.css), so the status bar should always show light content over it.
    if (Capacitor.isNativePlatform()) {
      const headerBg = getComputedStyle(document.documentElement).getPropertyValue('--header-bg').trim()
      StatusBar.setBackgroundColor({ color: headerBg })
      StatusBar.setStyle({ style: Style.Dark })
    }
  }

  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    updateDOM()
  }

  onMounted(() => {
    if (!localStorage.getItem('darkMode')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    updateDOM()
  })

  return {
    isDark,
    toggleDarkMode
  }
}