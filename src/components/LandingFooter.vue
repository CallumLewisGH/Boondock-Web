<template>
  <footer class="py-8 border-t"
          :style="{ 
            backgroundColor: 'var(--bg-color)',
            borderColor: 'var(--border)'
          }">
    <div class="max-w-7xl mx-auto px-4">
      <slot>
        <!-- Default footer -->
        <div class="text-center">
          <p class="text-sm"
             :style="{ color: 'var(--muted)' }">
            © 202 Boondock. The Mountain Awaits.
          </p>
        </div>
      </slot>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Simple footer component
</script>