<template>
  <div v-if="userProfile" class="max-w-4xl mx-auto p-6 min-h-screen" style="color: var(--text-color);">
    <div class="flex items-center gap-6 mb-8">
      <div class="relative">
        <div v-if="userProfile.profilePicture" 
             class="w-24 h-24 rounded-full overflow-hidden border-2" 
             style="border-color: var(--border);">
          <img 
            :src="formatBase64(userProfile.profilePicture)" 
            alt="Profile Picture" 
            class="w-full h-full object-cover" 
          />
        </div>
        <div v-else 
             class="w-24 h-24 rounded-full flex items-center justify-center text-3xl border-2" 
             style="background-color: var(--surface); border-color: var(--border);">
          👤
        </div>
        <button 
          @click="fileInput?.click()"
          class="absolute bottom-0 right-0 p-2 rounded-full shadow-lg hover:opacity-90 transition-opacity"
          style="background-color: var(--accent); color: var(--header-text);"
        >
          ✏️
        </button>
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="image/*" 
          @change="handleFileChange"
        />
      </div>
      <div class="flex-1">
        <h1 class="text-3xl font-bold">{{ userProfile.username }}</h1>
        <p v-if="!userProfile.bio" style="color: var(--muted);">{{ userProfile.email }}</p>
        <p v-if="userProfile.bio" class="text-sm mt-1 italic" style="color: var(--muted);">
          "{{ userProfile.bio }}"
        </p>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="p-4 rounded-xl shadow-sm text-center border" 
           style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">0</div>
        <div class="text-sm" style="color: var(--muted);">Campsites Found</div>
      </div>
      <div class="p-4 rounded-xl shadow-sm text-center border" 
           style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="text-2xl font-bold" style="color: var(--accent);">0</div>
        <div class="text-sm" style="color: var(--muted);">Reviews Made</div>
      </div>
    </div>

    <div class="border-b mb-6" style="border-color: var(--border);">
      <div class="flex space-x-4">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          :class="['px-4 py-2 font-medium transition-all border-b-2']"
          :style="{
            borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)'
          }"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div v-if="activeTab === 'campsites'" 
         class="space-y-4 text-center py-10 rounded-lg border-2 border-dashed"
         style="color: var(--muted); border-color: var(--border); background-color: var(--surface);">
      No campsites found yet.
    </div>

    <div v-else-if="activeTab === 'reviews'" 
         class="space-y-4 text-center py-10 rounded-lg border-2 border-dashed"
         style="color: var(--muted); border-color: var(--border); background-color: var(--surface);">
      No reviews yet.
    </div>
    
    <div v-else-if="activeTab === 'edit'" class="space-y-4">
      <div class="p-6 rounded-xl shadow-md border" 
           style="background-color: var(--card-bg); border-color: var(--border);">
        <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold mb-4 text-lg">Edit Profile</h3>
        <button @click="handleUserDelete" 
                  class="text-xs font-bold uppercase text-red-500 hover:opacity-70 transition-opacity"
                  :disabled="deleting">
            {{ deleting ? 'Deleting...' : 'Delete User' }}
          </button>
        </div>
        <form @submit.prevent="handleSaveProfile" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              v-model="editRequest.username"
              class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
              style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              v-model="editRequest.email"
              class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
              style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
            >
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Bio</label>
            <textarea 
              v-model="editRequest.bio"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2"
              style="background-color: var(--surface); border-color: var(--border); color: var(--text-color); --tw-ring-color: var(--accent);"
            ></textarea>
          </div>
          
          <div class="pt-2">
            <button 
              type="submit"
              :disabled="isSaving || !hasChanges"
              class="px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style="background-color: var(--accent); color: var(--header-text);"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: var(--accent);"></div>
  </div>
</template>

<script setup lang="ts">
import type { UpdateUserRequest, UserPrivateProfile } from '@/api';
import { formatBase64 } from '@/helpers/base64';
import { getDirtyFields, hasChanged, syncRequest } from '@/helpers/diff';
import router from '@/router';
import { AuthenticationService } from '@/services/AuthenticationService';
import { UsersService } from '@/services/UsersService';
import { ref, reactive, onMounted, computed } from 'vue'

const tabs = [
  { id: 'campsites', label: 'My Campsites' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'edit', label: 'Edit Profile' }
]

const deleting = ref<boolean>(false);
const activeTab = ref('campsites');
const userProfile = ref<UserPrivateProfile | null>(null);
const isSaving = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const editRequest = reactive<UpdateUserRequest>({
  username: undefined,
  bio: undefined,
  email: undefined,
  profilePicture: undefined,
  timezone: undefined
});

const hasChanges = computed(function() {
  if (!userProfile.value) return false;
  return hasChanged(userProfile.value, editRequest);
});

onMounted(async function() {
  const result = await UsersService.getCurrentUser();
  if (result.data) {
    userProfile.value = result.data;
    syncRequest(editRequest, result.data);
  }
});

async function handleUserDelete() {
  const result = await UsersService.deleteCurrentUser();
  AuthenticationService.logout();
}


function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = function() {
    const base64String = (reader.result as string).split(',')[1];
    editRequest.profilePicture = base64String;
    handleSaveProfile(); 
  };
  reader.readAsDataURL(file);
}

async function handleSaveProfile() {
  if (!userProfile.value || !hasChanges.value) return;
  isSaving.value = true;
  
  const payload = getDirtyFields(userProfile.value, editRequest);
  const result = await UsersService.updateCurrentUser(payload);

  if (result.error || result.data === null) {
    alert(`Update failed: ${result?.error?.errors?.map(e => e.message).join('\n') || 'Unknown error'}`);
    isSaving.value = false;
    return;
  }

  userProfile.value = result.data;
  syncRequest(editRequest, result.data);
  isSaving.value = false;
}
</script>