// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { AuthenticationService } from '@/api'
import type { user_UserDTO } from '@/api'
import { config } from '@/helpers/config'

export const useAuthStore = defineStore('auth', function() {
  const user = ref<user_UserDTO | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(function() {
    return !!user.value
  })

  const getUser = computed(function() {
    return user.value
  })

  function login() {
    window.location.href = `${config.apiBaseUrl}/authentication/google`
  }

  function handleCallback(state: string, code: string) {
    loading.value = true
    error.value = null
    
    return AuthenticationService.postAuthenticationCallback(state, code)
      .then(function() {
        return checkAuth()
      })
      .catch(function(err: any) {
        error.value = err.message || 'Authentication failed'
        throw err
      })
      .finally(function() {
        loading.value = false
      })
  }

  function logout() {
    window.location.href = `${config.apiBaseUrl}/authentication/logout/google`
  }

  function checkAuth() {
    loading.value = true
    return AuthenticationService.getAuthenticationUser()
      .then(function(userData) {
        user.value = userData
        error.value = null
        return userData
      })
      .catch(function(err: any) {
        user.value = null
        if (err.status !== 404) {
          error.value = err.message || 'Failed to check authentication'
        }
        throw err
      })
      .finally(function() {
        loading.value = false
      })
  }

  function clearError() {
    error.value = null
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    getUser,
    login,
    handleCallback,
    logout,
    checkAuth,
    clearError
  }
})