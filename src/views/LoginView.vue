<template>
    <button @click="handleLogin">Login</button>
    <button @click="handleLogout">Logout</button>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';



const userStore = useUserStore();

function handleLogin() {
    userStore.login();
} 

function handleLogout() {
    userStore.logout();
}   

</script>
