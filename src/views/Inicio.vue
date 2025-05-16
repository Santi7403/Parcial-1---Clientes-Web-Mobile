<template>
  <div class="max-w-2xl mx-auto py-10">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Publicaciones</h1>
    <div v-if="publicaciones.length > 0" class="space-y-6">
      <TarjetaPublicacion
        v-for="publicacion in publicaciones"
        :key="publicacion.id"
        :publicacion="publicacion"
        class="bg-white p-6 rounded-lg shadow-md"
      />
    </div>
    <div v-else class="bg-white p-8 rounded-xl shadow-2xl text-center">
      <p class="text-gray-600">No hay publicaciones todavía. Publica algo!</p>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import TarjetaPublicacion from '../components/TarjetaPublicacion.vue';

export default {
  components: { TarjetaPublicacion },
  data() {
    return {
      publicaciones: [],
    };
  },
  async created() {
    await this.cargarPublicaciones();
  },
  methods: {
    async cargarPublicaciones() {
      try {
        const { data, error } = await supabase
          .from('publicaciones')
          .select('*, perfiles(nombre_usuario)')
          .order('creado_en', { ascending: false });

        if (error) {
          console.error('Error al cargar publicaciones:', error);
          alert(`Error al cargar publicaciones: ${error.message}`);
          return;
        }

        console.log('Publicaciones cargadas:', data);
        this.publicaciones = data || [];
      } catch (err) {
        console.error('Error inesperado al cargar publicaciones:', err);
        alert('Error inesperado al cargar publicaciones');
      }
    },
  },
};
</script>

