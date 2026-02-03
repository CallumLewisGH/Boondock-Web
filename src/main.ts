import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/index.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import App from './App.vue'
import router from './router'
import { client } from './api/client.gen'

const app = createApp(App)

app.use(createPinia())
app.use(router)

client.interceptors.request.use((request) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
});
    
client.setConfig({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
});

app.mount('#app')
