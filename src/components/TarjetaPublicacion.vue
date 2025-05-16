<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center mb-4">
      <router-link
        :to="`/perfil/${publicacion.usuario_id}`"
        class="text-indigo-600 hover:text-indigo-800 font-medium"
      >
        {{ publicacion.perfiles.nombre_usuario || 'Usuario' }}
      </router-link>
      <span class="text-gray-500 text-sm ml-2">{{ formatoFecha(publicacion.creado_en) }}</span>
    </div>
    <p class="text-gray-900 mb-4">{{ publicacion.contenido }}</p>
    <img
      v-if="publicacion.imagen_url"
      :src="publicacion.imagen_url"
      alt="Imagen de publicación"
      class="w-full h-auto rounded-lg mb-4 object-cover"
    />
    <div v-if="esPropiaPublicacion" class="mb-4">
      <button
        @click="eliminarPublicacion"
        class="text-red-600 hover:text-red-800 font-medium transition duration-200"
      >
        Eliminar
      </button>
    </div>
    <SeccionComentarios :publicacion-id="publicacion.id" />
  </div>
</template>

<script>
import { supabase } from '../supabase';
import SeccionComentarios from './SeccionComentarios.vue';

export default {
  components: { SeccionComentarios },
  props: {
    /**
     * Objeto que representa una publicación.
     * @property {string} id - ID único de la publicación.
     * @property {string} usuario_id - ID del usuario que hizo la publicación.
     * @property {Object} perfiles - Información del perfil del usuario que publicó.
     * @property {string} perfiles.nombre_usuario - Nombre de usuario del autor.
     * @property {string} creado_en - Fecha y hora de creación de la publicación.
     * @property {string} contenido - Texto de la publicación.
     * @property {string} [imagen_url] - URL de la imagen asociada a la publicación (opcional).
     */
    publicacion: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      /** 
       * ID del usuario autenticado actualmente.
       * @type {string|null} 
       */
      userId: null,
    };
  },
  async created() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id;
  },
  computed: {
    /**
     * Indica si la publicación pertenece al usuario autenticado.
     * @returns {boolean}
     */
    esPropiaPublicacion() {
      return this.publicacion.usuario_id === this.userId;
    },
  },
  methods: {
    /**
     * Formatea una fecha a un string legible en español (Argentina).
     * @param {string|Date} fecha - Fecha a formatear.
     * @returns {string} Fecha formateada.
     */
    formatoFecha(fecha) {
      return new Date(fecha).toLocaleString('es-AR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    /**
     * Elimina la publicación y su imagen asociada (si existe) de la base de datos y almacenamiento.
     * Emite el evento 'publicacion-eliminada' tras eliminar correctamente.
     */
    async eliminarPublicacion() {
      try {
        // Eliminar la imagen si existe
        if (this.publicacion.imagen_url) {
          const path = this.publicacion.imagen_url.split('/').pop();
          const { error: storageError } = await supabase.storage
            .from('post-images')
            .remove([path]);

          if (storageError) {
            console.error('Error al eliminar imagen:', storageError);
          }
        }

        const { error } = await supabase
          .from('publicaciones')
          .delete()
          .eq('id', this.publicacion.id);

        if (error) {
          console.error('Error al eliminar publicación:', error);
          alert(`Error al eliminar publicación: ${error.message}`);
          return;
        }

        console.log('Publicación eliminada:', this.publicacion.id);
        this.$emit('publicacion-eliminada');
      } catch (err) {
        console.error('Error inesperado al eliminar publicación:', err);
        alert('Error inesperado al eliminar publicación');
      }
    },
  },
};
</script>
