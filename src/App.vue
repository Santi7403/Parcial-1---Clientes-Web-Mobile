<template>
  <div class="min-h-screen bg-gray-100">
    <BarraNavegacion />
    <main class="container mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>

<script>
import BarraNavegacion from './components/BarraNavegacion.vue';

export default {
  components: { BarraNavegacion },
};
</script>

