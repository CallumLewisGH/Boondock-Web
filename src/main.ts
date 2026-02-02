import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/index.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import App from './App.vue'
import router from './router'
import { OpenAPI } from './api'

const app = createApp(App)

app.use(createPinia())
app.use(router)
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

app.mount('#app')
