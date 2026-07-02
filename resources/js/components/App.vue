<script setup lang="ts">
import { ref } from 'vue';
import SmartInputZone from './views/SmartInputZone.vue';
import MetricsGrid from './views/MetricsGrid.vue';
import BinaryVisualizer from './views/BinaryVisualizer.vue';
import SubnetTable from './views/SubnetTable.vue';

// Variable réactive qui contiendra les données du tableau
const calculatedSubnets = ref([]);

// Fonction qui sera appelée dès qu'une mise à jour provient de SmartInputZone
const handleNetworkUpdate = (data: any) => {
  // 1. Convertir l'IP en nombre 32 bits
  const ipToLong = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  // 2. Convertir le nombre 32 bits en IP
  const longToIp = (long: number) => {
    return [(long >>> 24) & 0xFF, (long >>> 16) & 0xFF, (long >>> 8) & 0xFF, long & 0xFF].join('.');
  };

  const cidr = data.cidr;
  const ipLong = ipToLong(data.ip);
  const mask = ~((1 << (32 - cidr)) - 1);
  const networkAddress = (ipLong & mask) >>> 0;
  
  // Calcul du nombre de sous-réseaux à afficher (ex: limité à 20 pour ne pas saturer l'écran)
  const step = Math.pow(2, 32 - cidr);
  const subnets = [];

  for (let i = 0; i < 20; i++) {
    const net = (networkAddress + i * step) >>> 0;
    const broadcast = (net + step - 1) >>> 0;
    
    subnets.push({
      network: longToIp(net),
      range: `${longToIp(net + 1)} - ${longToIp(broadcast - 1)}`,
      broadcast: longToIp(broadcast)
    });
  }

  calculatedSubnets.value = subnets;
};
</script> <!-- C'EST CETTE LIGNE QUI MANQUAIT -->

<template>
  <div class="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <header class="pb-6 border-b border-zinc-900">
        <h1 class="text-xl font-bold font-mono text-white">IPN-STUDIO // v1.0.0</h1>
      </header>

      <main class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Colonne gauche : Input + Binaire -->
        <div class="lg:col-span-1 space-y-6">
          <SmartInputZone @update="handleNetworkUpdate" />
          <BinaryVisualizer />
        </div>

        <!-- Colonne droite : Metrics + Tableau des sous-réseaux -->
        <div class="lg:col-span-2 space-y-8">
          <MetricsGrid />
          <!-- Le tableau est maintenant ici, sous les métriques -->
          <SubnetTable :subnets="calculatedSubnets" /> 
        </div>
        
      </main>
      <!-- ... ton contenu main existant ... -->

      <footer class="pt-8 border-t border-zinc-900 text-center">
        <p class="text-xs text-zinc-600 font-mono">
          © 2026 IPN-STUDIO // Développé par 
          <a href="https://naztechonologie.com" target="_blank" class="text-indigo-500 hover:text-indigo-400 transition-colors">
            Naztechonologie.com
          </a>
        </p>
      </footer>
    </div>
    </div>

</template>