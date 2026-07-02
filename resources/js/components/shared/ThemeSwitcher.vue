<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark', isDark.value);
  localStorage.theme = isDark.value ? 'dark' : 'light';
};

onMounted(() => {
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  } else {
    isDark.value = false;
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <button 
    @click="toggleTheme" 
    class="px-3 py-1 text-sm rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:opacity-80 transition-all"
  >
    {{ isDark ? '☀️ Clair' : '🌙 Sombre' }}
  </button>
</template>