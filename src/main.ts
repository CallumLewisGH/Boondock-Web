import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/index.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import App from './App.vue'
import router from './router'
import { useClient } from './composables/useClient'
import { Capacitor } from '@capacitor/core'
import { App as CapacitorApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'

const app = createApp(App)

app.use(createPinia())
app.use(router)

useClient();

if (Capacitor.isNativePlatform()) {
  // OAuth login opens the system browser (AuthenticationService.login); the backend
  // redirects back into the app via this custom-scheme deep link with the JWT attached.
  CapacitorApp.addListener('appUrlOpen', ({ url }) => {
    const token = new URL(url).searchParams.get('token')
    if (token) {
      localStorage.setItem('jwt_token', token)
      Browser.close()
      router.push('/app/map')
    }
  })

  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      router.go(-1)
    } else {
      CapacitorApp.exitApp()
    }
  })
}

app.mount('#app')
