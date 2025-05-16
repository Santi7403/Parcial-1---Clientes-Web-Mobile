<template>
  <div class="mt-4">
    <h3 class="font-semibold mb-2">Comentarios</h3>
    
    <div v-for="comentario in comentarios" :key="comentario.id" class="mb-2 p-2 bg-gray-100 rounded">
      <p class="text-sm"><strong>{{ comentario.perfiles?.nombre_usuario || 'Anónimo' }}:</strong> {{ comentario.contenido }}</p>
      <p class="text-xs text-gray-500">{{ new Date(comentario.creado_en).toLocaleString() }}</p>
    </div>

    <form @submit.prevent="agregarComentario" class="mt-2">
      <input v-model="nuevoComentario" type="text" placeholder="Escribí un comentario..." class="w-full p-2 border rounded" required />
      <button type="submit" class="bg-blue-600 text-white p-1 mt-2 rounded w-full">Comentar</button>
    </form>
  </div>
</template>

<script>
import { supabase } from '../supabase';

/**
 * Componente para mostrar y gestionar comentarios de una publicación.
 * @component
 */
export default {
  props: {
    /**
     * ID de la publicación asociada a los comentarios.
     * @type {string}
     */
    publicacionId: String,
  },
  data() {
    return {
      /**
       * Lista de comentarios de la publicación.
       * @type {Array<Object>}
       */
      comentarios: [],
      /**
       * Contenido del nuevo comentario a agregar.
       * @type {string}
       */
      nuevoComentario: '',
      /**
       * Información del usuario autenticado.
       * @type {Object|null}
       */
      usuario: null,
      /**
       * Canal de tiempo real para escuchar cambios en comentarios.
       * @type {Object|null}
       */
      canalTiempoReal: null,
    };
  },
  /**
   * Obtiene el usuario autenticado, los comentarios iniciales y configura la suscripción en tiempo real.
   * @async
   */
  async mounted() {
    const { data: { user } } = await supabase.auth.getUser();
    this.usuario = user;
    await this.obtenerComentarios();

    this.canalTiempoReal = supabase
      .channel('comentarios')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comentarios',
        filter: `publicacion_id=eq.${this.publicacionId}`,
      }, payload => {
        this.obtenerComentarios();
      })
      .subscribe();
  },
  /**
   * Cancela la suscripción al canal de tiempo real.
   */
  beforeUnmount() {
    if (this.canalTiempoReal) {
      supabase.removeChannel(this.canalTiempoReal);
    }
  },
  methods: {
    /**
     * Obtiene los comentarios asociados a la publicación desde Supabase.
     * Incluye el nombre de usuario del perfil correspondiente.
     * @async
     */
    async obtenerComentarios() {
      const { data } = await supabase
        .from('comentarios')
        .select('*, perfiles(nombre_usuario)')
        .eq('publicacion_id', this.publicacionId)
        .order('creado_en', { ascending: true });
      this.comentarios = data;
    },
    /**
     * Agrega un nuevo comentario a la publicación.
     * Inserta el comentario en Supabase y limpia el campo de entrada.
     * @async
     */
    async agregarComentario() {
      if (!this.nuevoComentario.trim()) return;

      await supabase.from('comentarios').insert({
        contenido: this.nuevoComentario,
        publicacion_id: this.publicacionId,
        usuario_id: this.usuario.id,
      });

      this.nuevoComentario = '';
    },
  },
};
</script>