// stores/userStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { AuthenticationService } from '@/authentication/AuthenticationService' // Ensure path matches your structure
import type { UserPrivateProfile } from '@/api'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<UserPrivateProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function checkAuth() {
    loading.value = true;
    
    // Check for token in URL and save it if found
    AuthenticationService.handleCallback();
    
    // Ensure headers are set
    AuthenticationService.initializeGlobalAuth();

    try {
      // Only fetch user if we actually have a token to use
      if (localStorage.getItem('jwt_token')) {
        user.value = await AuthenticationService.getCurrentUser();
      }
      error.value = null;
      return true;
    } catch (err: any) {
      // If the fetch fails (invalid token), log out clean
      if (localStorage.getItem('jwt_token')) {
          console.error("Token verification failed", err);
          AuthenticationService.logout(); 
      }
      user.value = null;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function login(provider?: string) {
    if (provider) AuthenticationService.setProvider(provider)
    AuthenticationService.login()
  }

  async function logout() {
    AuthenticationService.logout()
    user.value = null
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  }
})