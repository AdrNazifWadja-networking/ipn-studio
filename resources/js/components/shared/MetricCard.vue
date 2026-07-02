<script setup lang="ts">
defineProps<{
  title: string
  value: string
  type?: 'default' | 'indigo' | 'emerald' | 'amber'
}>()
</script>

<template>
  <div class="glass-panel p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
    <div class="text-xs font-medium text-zinc-500 uppercase tracking-wider">{{ title }}</div>
    <div 
      :class="[
        'text-lg font-bold font-mono mt-1 transition-colors',
        type === 'indigo' ? 'text-indigo-400' :
        type === 'emerald' ? 'text-emerald-400' :
        type === 'amber' ? 'text-amber-400' : 'text-zinc-200'
      ]"
    >
      {{ value }}
    </div>
  </div>
</template>