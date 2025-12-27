import { createRouter, createWebHistory } from 'vue-router'
import Landing from '@/views/LandingView.vue'
import About from '@/views/AboutView.vue'
import Guidelines from '@/views/GuidelinesView.vue'
import Contact from '@/views/ContactView.vue'
import Login from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: Landing
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/guidelines',
      name: 'Guidelines',
      component: Guidelines
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

export default router