<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8">Settings</h1>
    
    <div class="space-y-6">
      <!-- Account Settings -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Account</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              v-model="settings.email"
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Change Password</label>
            <input 
              type="password" 
              placeholder="New password"
              class="w-full px-3 py-2 border rounded-lg mb-2"
            >
            <input 
              type="password" 
              placeholder="Confirm new password"
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
        </div>
      </div>
      
      <!-- Privacy -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Privacy</h2>
        <div class="space-y-3">
          <label class="flex items-center">
            <input type="checkbox" v-model="settings.privacy.showOnMap" class="mr-2">
            <span>Show my location on public map</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="settings.privacy.showProfile" class="mr-2">
            <span>Make profile public</span>
          </label>
        </div>
      </div>
      
      <!-- Notifications -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4">Notifications</h2>
        <div class="space-y-3">
          <label class="flex items-center">
            <input type="checkbox" v-model="settings.notifications.newCampsites" class="mr-2">
            <span>New campsites near me</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="settings.notifications.messages" class="mr-2">
            <span>Messages</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" v-model="settings.notifications.updates" class="mr-2">
            <span>App updates</span>
          </label>
        </div>
      </div>
      
      <!-- Danger Zone -->
      <div class="bg-red-50 border border-red-200 rounded-lg shadow p-6">
        <h2 class="text-xl font-bold mb-4 text-red-700">Danger Zone</h2>
        <p class="text-red-600 mb-4">These actions are irreversible</p>
        <div class="space-y-2">
          <button 
            @click="exportData"
            class="px-4 py-2 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
          >
            Export My Data
          </button>
          <button 
            @click="deleteAccount"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete Account
          </button>
        </div>
      </div>
      
      <!-- Save Button -->
      <div class="flex justify-end">
        <button 
          @click="saveSettings"
          class="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const settings = reactive({
  email: 'user@example.com',
  privacy: {
    showOnMap: true,
    showProfile: true
  },
  notifications: {
    newCampsites: true,
    messages: true,
    updates: false
  }
})

const saveSettings = () => {
  alert('Settings saved!')
}

const exportData = () => {
  alert('Data export started (this would download your data)')
}

const deleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
    alert('Account deletion requested')
  }
}
</script>