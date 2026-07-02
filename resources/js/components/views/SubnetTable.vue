<script setup lang="ts">
defineProps<{ subnets: Array<any> }>();
</script>

<template>
  <div class="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 overflow-hidden">
    <h2 class="text-sm font-bold text-zinc-400 mb-4 uppercase tracking-wider">Liste des sous-réseaux</h2>
    <div class="max-h-[500px] overflow-y-auto">
      <table class="w-full text-left text-sm text-zinc-300">
        <thead class="bg-zinc-950/50 sticky top-0">
          <tr>
            <th class="p-2">Sous-réseau</th>
            <th class="p-2">Plage IP</th>
            <th class="p-2">Broadcast</th>
          </tr>
        </thead>
        <tbody class="font-mono text-xs">
          <tr v-for="(item, index) in subnets" :key="index" class="border-b border-zinc-800 hover:bg-zinc-800/30">
            <td class="p-2 text-indigo-400">{{ item.network }}</td>
            <td class="p-2">{{ item.range }}</td>
            <td class="p-2 text-amber-400">{{ item.broadcast }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>