// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import LandingLayout from '@/layouts/LandingLayout.vue'
import Home from '@/views/Landing/HomeView.vue'
import About from '@/views/Landing/AboutView.vue'
import Guidelines from '@/views/Landing/GuidelinesView.vue'
import Contact from '@/views/Landing/ContactView.vue'
import Login from '@/views/Landing/LoginView.vue'
import AppLayout from '@/layouts/AppLayout.vue'
import MapView from '@/views/App/MapView.vue'
import ProfileView from '@/views/App/ProfileView.vue'
import CampsiteView from '@/views/App/CampsiteView.vue'
import UserView from '@/views/App/UserView.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', 
      name: 'Landing', 
      component: LandingLayout,
      redirect: '/home',
      children: [
        { path: '/home', name: 'Home', component: Home},
        { path: '/about', name: 'About', component: About },
        { path: '/guidelines', name: 'Guidelines', component: Guidelines },
        { path: '/contact', name: 'Contact', component: Contact },
        { path: '/login', name: 'Login', component: Login, meta: { guestOnly: true } },
      ] 
    },
    
    {
      path: '/app',
      name: 'App',
      component: AppLayout,
      meta: { requiresAuth: true },
      redirect: '/app/map',
      children: [
        { path: 'map', name: 'Map', component: MapView, meta: { title: 'Map' } },
        { path: 'campsites/:name', name: 'Campsite', component: CampsiteView, meta: { title: 'Campsite Details' }, props: true },
        { path: 'profile', name: 'Profile', component: ProfileView, meta: { title: 'Profile' } },
        { path: 'users/:name', name: 'User', component: UserView, meta: { title: 'User Profile' } },
      ]
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();

  // 1. Token Cleanup Strategy
  // If the URL contains a token (e.g. from OAuth callback), we process it,
  // then force a router-level redirect to the "clean" URL.
  if (to.query.token) {
    // Extract and store the token
    await userStore.checkAuth();

    // Create a copy of the query params without 'token' or 'redirect'
    const newQuery = { ...to.query };
    delete newQuery.token;
    delete newQuery.redirect;

    // Redirect immediately to the clean version
    return next({ 
      path: to.path, 
      query: newQuery, 
      replace: true // 'replace' prevents the dirty URL from staying in history
    });
  }

  // 2. Standard Auth Check
  // If no user is loaded, try to fetch them
  if (!userStore.user) {
    await userStore.checkAuth();
  }

  // 3. Navigation Guards
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !userStore.user) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (to.name === 'Login' && userStore.user) {
    next({ name: 'Map' });
  } else {
    next();
  }
});

export default router