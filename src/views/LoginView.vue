<template>
    <button @click="handleLogin">Login</button>
</template>

<script setup lang="ts">

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore();

function handleLogin() {
    authStore.login();
} 

</script>
