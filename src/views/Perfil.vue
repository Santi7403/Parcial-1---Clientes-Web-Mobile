<template>
  <div class="max-w-lg mx-auto py-10">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Tu Perfil</h1>
    <div v-if="perfilCargado" class="bg-white p-8 rounded-xl shadow-2xl">
      <div class="flex items-center mb-8">
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="w-16 h-16 rounded-full object-cover mr-4" />
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">{{ nombreUsuario || 'No especificado' }}</h2>
          <p v-if="nombreCompleto" class="text-gray-600">{{ nombreCompleto }}</p>
          <p v-else class="text-gray-600">Sin nombre completo proporcionado</p>
        </div>
      </div>
      <p class="text-gray-600 mb-4">{{ bio || 'No especificado' }}</p>
      <div class="grid grid-cols-1 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Edad</label>
          <p class="text-gray-900">{{ edad || 'No especificado' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Carrera</label>
          <p class="text-gray-900">{{ carrera || 'No especificado' }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Empleo Actual</label>
          <p class="text-gray-900">{{ empleoActual || 'No especificado' }}</p>
        </div>
      </div>
      <router-link to="/editar-perfil"
        class="inline-block mt-8 text-indigo-600 hover:text-indigo-800 font-medium transition duration-200">Editar Perfil</router-link>
    </div>
    <div v-else class="bg-white p-8 rounded-xl shadow-2xl">
      <p class="text-gray-600 text-center"> No se encontró un perfil.
        <router-link to="/editar-perfil" class="text-indigo-600 hover:text-indigo-800 font-medium">Creá uno ahora</router-link>.
      </p>
    </div>

    <h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6">Tus Publicaciones</h2>
    <div class="bg-white p-8 rounded-xl shadow-2xl mb-8">
      <form @submit.prevent="crearPublicacion" class="space-y-6">
        <div>
          <label for="contenido" class="block text-sm font-medium text-gray-700">Nueva Publicación</label>
          <textarea id="contenido" v-model="nuevaPublicacion"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            rows="4" placeholder="¿Qué querés compartir?" required></textarea>
        </div>
        <div>
          <label for="imagen" class="block text-sm font-medium text-gray-700">Imagen (opcional)</label>
          <input id="imagen" type="file" accept="image/jpeg,image/png" @change="handleImagen"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200" />
          <p v-if="imagenError" class="text-red-500 text-sm mt-2">{{ imagenError }}</p>
        </div>
        <button type="submit"
          class="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200">
          Publicar
        </button>
      </form>
    </div>
    <div class="space-y-6">
      <TarjetaPublicacion v-for="publicacion in publicaciones" :key="publicacion.id"
        :publicacion="{ ...publicacion, perfiles: { nombre_usuario: nombreUsuario } }"
        @publicacion-eliminada="obtenerPublicaciones" class="bg-white p-6 rounded-lg shadow-md" />
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';
import TarjetaPublicacion from '../components/TarjetaPublicacion.vue';

/**
 * Componente que muestra el perfil del usuario y sus publicaciones, con opción para crear nuevas publicaciones.
 * @component
 */
export default {
  components: { TarjetaPublicacion },
  data() {
    return {
      /**
       * Nombre de usuario del perfil.
       * @type {string}
       */
      nombreUsuario: '',
      /**
       * Nombre completo del usuario.
       * @type {string}
       */
      nombreCompleto: '',
      /**
       * URL de la imagen del avatar.
       * @type {string}
       */
      avatarUrl: '',
      /**
       * Biografía o descripción del usuario.
       * @type {string}
       */
      bio: '',
      /**
       * Edad del usuario.
       * @type {number|null}
       */
      edad: null,
      /**
       * Carrera o profesión del usuario.
       * @type {string}
       */
      carrera: '',
      /**
       * Empleo actual del usuario.
       * @type {string}
       */
      empleoActual: '',
      /**
       * Lista de publicaciones del usuario.
       * @type {Array<Object>}
       */
      publicaciones: [],
      /**
       * Indica si el perfil del usuario se cargó correctamente.
       * @type {boolean}
       */
      perfilCargado: false,
      /**
       * Contenido de la nueva publicación.
       * @type {string}
       */
      nuevaPublicacion: '',
      /**
       * Archivo de la imagen seleccionada para la publicación.
       * @type {File|null}
       */
      imagen: null,
      /**
       * Mensaje de error si hay problemas con la imagen.
       * @type {string}
       */
      imagenError: '',
    };
  },
  /**
   * Se ejecuta al crear el componente.
   * Carga la información del perfil del usuario.
   */
  created() {
    this.cargarPerfil();
  },
  watch: {
    /**
     * Observa cambios en la ruta actual.
     * Recarga el perfil si la ruta es '/perfil'.
     * @param {Object} to - Nueva ruta.
     */
    '$route'(to) {
      if (to.path === '/perfil') {
        console.log('Ruta cambiada a /perfil, recargando datos');
        this.cargarPerfil();
      }
    },
  },
  methods: {
    /**
     * Carga la información del perfil del usuario y sus publicaciones desde Supabase.
     * @async
     */
    async cargarPerfil() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No hay usuario autenticado');
          this.$router.push('/login');
          return;
        }
        console.log('Cargando perfil para userId:', user.id);
        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('nombre_usuario, nombre_completo, avatar_url, biografia, edad, carrera, empleo_actual')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error al cargar perfil:', error);
          alert(`Error al cargar perfil: ${error.message}`);
          return;
        }

        if (perfil) {
          console.log('Perfil encontrado:', perfil);
          this.nombreUsuario = perfil.nombre_usuario || '';
          this.nombreCompleto = perfil.nombre_completo || '';
          this.avatarUrl = perfil.avatar_url || '';
          this.bio = perfil.biografia || '';
          this.edad = perfil.edad || null;
          this.carrera = perfil.carrera || '';
          this.empleoActual = perfil.empleo_actual || '';
          this.perfilCargado = true;
        } else {
          console.log('No se encontró perfil para userId:', user.id);
          this.perfilCargado = false;
        }
        await this.obtenerPublicaciones();
      } catch (err) {
        console.error('Error inesperado al cargar perfil:', err);
        alert('Error inesperado al cargar perfil');
      }
    },
    /**
     * Obtiene las publicaciones del usuario desde Supabase.
     * @async
     */
    async obtenerPublicaciones() {
      try {
        const { data } = await supabase
          .from('publicaciones')
          .select('*, perfiles(nombre_usuario)')
          .eq('usuario_id', (await supabase.auth.getUser()).data.user.id)
          .order('creado_en', { ascending: false });
        console.log('Publicaciones cargadas:', data);
        this.publicaciones = data || [];
      } catch (err) {
        console.error('Error al cargar publicaciones:', err);
      }
    },
    /**
     * Maneja la selección de una imagen para la publicación.
     * Verifica que sea válida y no demasiado grande.
     * @param {Event} event - Evento del input de archivo.
     */
    handleImagen(event) {
      this.imagenError = '';
      const archivo = event.target.files[0];
      if (!archivo) {
        this.imagen = null;
        return;
      }

      const tiposPermitidos = ['image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(archivo.type)) {
        this.imagenError = 'Solo se permiten imágenes JPEG o PNG';
        this.imagen = null;
        return;
      }

      const maxTamano = 5 * 1024 * 1024;
      if (archivo.size > maxTamano) {
        this.imagenError = 'La imagen es demasiado grande (máximo 5MB)';
        this.imagen = null;
        return;
      }

      this.imagen = archivo;
    },
    /**
     * Crea una nueva publicación con texto y si se selecciono una imagen.
     * @async
     */
    async crearPublicacion() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.error('No hay usuario autenticado');
          this.$router.push('/login');
          return;
        }

        let imagenUrl = null;
        if (this.imagen) {
          const nombreArchivo = `post_${user.id}_${Date.now()}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('post-images')
            .upload(nombreArchivo, this.imagen, {
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            console.error('Error al subir imagen:', uploadError);
            this.imagenError = `Error al subir imagen: ${uploadError.message}`;
            return;
          }

          imagenUrl = supabase.storage.from('post-images').getPublicUrl(uploadData.path).data.publicUrl;
          console.log('Imagen subida, URL:', imagenUrl);
        }

        const { data, error } = await supabase
          .from('publicaciones')
          .insert({
            usuario_id: user.id,
            contenido: this.nuevaPublicacion,
            imagen_url: imagenUrl,
            creado_en: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) {
          console.error('Error al crear publicación:', error);
          alert(`Error al crear publicación: ${error.message}`);
          return;
        }

        console.log('Publicación creada:', data);
        this.nuevaPublicacion = '';
        this.imagen = null;
        this.imagenError = '';
        await this.obtenerPublicaciones();
      } catch (err) {
        console.error('Error inesperado al crear publicación:', err);
        alert('Error inesperado al crear publicación');
      }
    },
  },
};
</script>