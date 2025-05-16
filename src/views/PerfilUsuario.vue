<template>
  <div class="max-w-lg mx-auto py-10">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">
      Perfil de {{ perfil.nombre_usuario || 'Usuario' }}
    </h1>
    <TarjetaPerfil :perfil="perfil" />
    <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Publicaciones</h2>
    <div class="space-y-6">
      <TarjetaPublicacion
        v-for="publicacion in publicaciones"
        :key="publicacion.id"
        :publicacion="publicacion"
        class="bg-white p-6 rounded-lg shadow-md"
      />
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import TarjetaPerfil from '../components/TarjetaPerfil.vue';
import TarjetaPublicacion from '../components/TarjetaPublicacion.vue';

export default {
  components: { TarjetaPerfil, TarjetaPublicacion },
  data() {
    return {
      perfil: {},
      publicaciones: [],
    };
  },
  async created() {
    await this.cargarPerfil();
    await this.cargarPublicaciones();
  },
  methods: {
    async cargarPerfil() {
      try {
        const userId = this.$route.params.userId;
        const { data, error } = await supabase
          .from('perfiles')
          .select('id, nombre_usuario, nombre_completo, biografia, edad, carrera, empleo_actual, avatar_url')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error al cargar perfil:', error);
          alert(`Error al cargar perfil: ${error.message}`);
          return;
        }

        this.perfil = data || {};
      } catch (err) {
        console.error('Error inesperado al cargar perfil:', err);
        alert('Error inesperado al cargar perfil');
      }
    },
    async cargarPublicaciones() {
      try {
        const userId = this.$route.params.userId;
        const { data, error } = await supabase
          .from('publicaciones')
          .select('*, perfiles(nombre_usuario)')
          .eq('usuario_id', userId)
          .order('creado_en', { ascending: false });

        if (error) {
          console.error('Error al cargar publicaciones:', error);
          return;
        }

        this.publicaciones = data || [];
      } catch (err) {
        console.error('Error inesperado al cargar publicaciones:', err);
      }
    },
  },
};
</script>

