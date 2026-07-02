<script setup lang="ts">
import { useIpCalculator } from '../../composables/useIpCalculator'

const { metadata, toggleBit } = useIpCalculator()
</script>

<template>
  <div v-if="metadata.isValid" class="glass-panel p-6 rounded-2xl border border-zinc-800/80">
    <div class="space-y-4 font-mono">
      <div>
        <div class="text-xs font-medium text-zinc-500 uppercase mb-2">Adresse IP (Binaire interactive)</div>
        <div class="flex flex-wrap gap-2">
          <div v-for="(octet, octetIdx) in metadata.binary.ip" :key="octetIdx" class="flex gap-0.5 bg-zinc-900 p-1.5 rounded-lg">
            <button
              v-for="(bit, bitIdx) in octet.split('')"
              :key="bitIdx"
              @click="toggleBit(octetIdx, bitIdx)"
              :class="[
                'w-5 h-7 text-xs font-bold rounded flex items-center justify-center transition-colors',
                bit === '1' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-zinc-950 text-zinc-600'
              ]"
            >
              {{ bit }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="text-xs font-medium text-zinc-500 uppercase mb-2">Masque (Binaire)</div>
        <div class="flex flex-wrap gap-2">
          <div v-for="(octet, octetIdx) in metadata.binary.mask" :key="octetIdx" class="flex gap-0.5 bg-zinc-900/40 p-1.5 rounded-lg">
            <div
              v-for="(bit, bitIdx) in octet.split('')"
              :key="bitIdx"
              :class="[
                'w-5 h-7 text-xs rounded flex items-center justify-center border',
                bit === '1' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' : 'bg-zinc-950 text-zinc-800 border-zinc-900'
              ]"
            >
              {{ bit }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>