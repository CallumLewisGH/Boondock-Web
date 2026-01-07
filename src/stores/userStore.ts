// stores/authStore.ts (combined version)
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { AuthenticationService } from '@/authentication/AuthenticationService'
import { UsersService, type user_UserDTO } from '@/api'

export const useUserStore = defineStore('userStore', () => {
  const user = ref<user_UserDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function setProvider(provider: string) {
    AuthenticationService.setProvider(provider)
  }

  async function login(provider?: string) {
    error.value = null
    AuthenticationService.login()
  }

  async function logout(provider?: string) {
    error.value = null
    AuthenticationService.logout()
    user.value = null
  }

  async function getCurrentUser() {
    const res = await UsersService.getUsersMe()

    if (!res.id) {
      throw new Error('No authenticated user found')
    }

    return res
  }

  async function checkAuth() {
    loading.value = true
    try {
      user.value = await getCurrentUser();
      error.value = null
      return true
    } catch (err: any) {
      error.value = err.message
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    setProvider
  }
})