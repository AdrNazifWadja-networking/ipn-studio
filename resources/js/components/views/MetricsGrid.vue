<script setup lang="ts">
import { useIpCalculator } from '../../composables/useIpCalculator'
import MetricCard from '/resources/js/components/shared/MetricCard.vue'

const { metadata } = useIpCalculator()
</script>

<template>
  <div v-if="metadata.isValid" class="space-y-6">
    <div>
      <h3 class="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3 px-1">Architecture Réseau</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Adresse Réseau" :value="metadata.networkAddress" type="indigo" />
        <MetricCard title="Masque de sous-réseau" :value="metadata.netmask" />
        <MetricCard title="Adresse de Broadcast" :value="metadata.broadcastAddress" type="amber" />
        <MetricCard title="Masque Inversé (Wildcard)" :value="metadata.wildcard" />
      </div>
    </div>

    <div>
      <h3 class="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-3 px-1">Plage d'Adressage</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Première IP Utilisable" :value="metadata.firstUsable" type="emerald" />
        <MetricCard title="Dernière IP Utilisable" :value="metadata.lastUsable" type="emerald" />
        <MetricCard title="Hôtes Totaux" :value="metadata.totalHosts.toLocaleString()" />
        <MetricCard title="Hôtes Utilisables" :value="metadata.usableHosts.toLocaleString()" type="indigo" />
      </div>
    </div>
  </div>
  <div v-else class="glass-panel rounded-2xl p-8 border border-dashed border-zinc-800/80 text-center text-zinc-500">
    En attente d'une adresse IP valide...
  </div>
</template>