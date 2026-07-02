<script setup lang="ts">
import { watch } from 'vue';
import { useIpCalculator } from '../../composables/useIpCalculator'

const { input, metadata, updateCidr } = useIpCalculator()

// Définition de l'événement pour communiquer avec App.vue
const emit = defineEmits(['update']);

// Fonction pour gérer le changement de curseur du slider
const handleSliderChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  updateCidr(parseInt(target.value))
}

// Watcher : Dès que 'input' ou 'metadata' change, on prévient le parent
watch([input, () => metadata.value], () => {
  if (metadata.value.isValid) {
    emit('update', { 
      ip: input.value, 
      cidr: metadata.value.cidr,
      // On envoie aussi les données de base pour que le parent puisse calculer
      fullMetadata: metadata.value 
    });
  }
}, { deep: true });
</script>

<template>
  <div class="glass-panel p-6 rounded-2xl shadow-2xl border border-zinc-800 transition-all duration-300 hover:border-zinc-700">
    <!-- Header de la zone -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></div>
        <h2 class="text-sm font-semibold tracking-wider uppercase text-zinc-400">Saisie & Configuration</h2>
      </div>
      <span 
        v-if="metadata.isValid" 
        :class="[
          'px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide border',
          metadata.isPrivate ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
        ]"
      >
        {{ metadata.isPrivate ? 'Réseau Privé' : 'Réseau Public' }}
      </span>
    </div>

    <!-- Zone de texte principale -->
    <div class="relative group">
      <input 
        v-model="input"
        type="text" 
        placeholder="Ex: 192.168.1.1/24"
        :class="[
          'w-full bg-zinc-950/60 border text-xl font-mono px-5 py-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 tracking-wide',
          metadata.isValid 
            ? 'border-zinc-800 focus:border-indigo-500 focus:ring-indigo-500/20 text-white' 
            : 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20 text-rose-400'
        ]"
      />
      
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        <span v-if="!metadata.isValid" class="text-xs text-rose-400 font-medium bg-rose-500/10 px-2 py-1 rounded">
          Syntaxe invalide
        </span>
      </div>
    </div>

    <!-- Section Curseur / Masque de sous-réseau (CIDR) -->
    <div v-if="metadata.isValid" class="mt-6 pt-5 border-t border-zinc-800/60">
      <div class="flex items-center justify-between mb-2">
        <label class="text-xs font-medium text-zinc-400 uppercase tracking-wider">Masque (CIDR)</label>
        <span class="text-lg font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
          /{{ metadata.cidr }}
        </span>
      </div>

      <div class="flex items-center space-x-4">
        <span class="text-xs font-mono text-zinc-600">/0</span>
        <input 
          type="range" 
          min="0" 
          max="32" 
          :value="metadata.cidr"
          @input="handleSliderChange"
          class="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-200 focus:outline-none"
        />
        <span class="text-xs font-mono text-zinc-600">/32</span>
      </div>

      <div class="mt-3 flex justify-between items-center text-xs text-zinc-500 font-mono">
        <span>Masque décimal :</span>
        <span class="text-zinc-300">{{ metadata.netmask }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-runnable-track {
  background: transparent;
}
</style>