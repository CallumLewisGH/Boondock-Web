import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import Landing from '@/views/LandingView.vue'
import About from '@/views/AboutView.vue'
import Guidelines from '@/views/GuidelinesView.vue'
import Contact from '@/views/ContactView.vue'
import Login from '@/views/LoginView.vue'

// App pages - we'll create these
import AppLayout from '@/layouts/AppLayout.vue'
import MapView from '@/views/MapView.vue'  // Changed from app/MapView.vue
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import SearchView from '@/views/SearchView.vue'  // Simplified name
import CampsiteView from '@/views/CampsiteView.vue'  // Simplified name
import UserView from '@/views/UserView.vue'  // Simplified name

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Landing pages (public)
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
      component: Login,
      meta: { guestOnly: true }
    },
    
    // App pages (protected)
    {
      path: '/app',
      name: 'App',
      component: AppLayout,
      meta: { requiresAuth: true },
      redirect: '/app/map',
      children: [
        {
          path: 'map',
          name: 'Map',
          component: MapView,
          meta: { title: 'Map' }
        },
        {
          path: 'search',
          name: 'Search',
          component: SearchView,
          meta: { title: 'Search' }
        },
        {
          path: 'campsites/:id',
          name: 'Campsite',
          component: CampsiteView,
          meta: { title: 'Campsite Details' },
          props: true
        },
        {
          path: 'profile',
          name: 'Profile',
          component: ProfileView,
          meta: { title: 'Profile' }
        },
        {
          path: 'users/:id',
          name: 'User',
          component: UserView,
          meta: { title: 'User Profile' },
          props: true
        },
        {
          path: 'settings',
          name: 'Settings',
          component: SettingsView,
          meta: { title: 'Settings' }
        }
      ]
    },
    
    // Redirects and fallbacks
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/'
    }
  ]
})

// Navigation guards for authentication
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = await userStore.checkAuth()

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } 
  // Check if route is guest-only (like login page)
  else if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuthenticated) {
      // Redirect to app if already logged in
      next({ name: 'Map' })
    } else {
      next()
    }
  } 
  else {
    next()
  }
})
export default router