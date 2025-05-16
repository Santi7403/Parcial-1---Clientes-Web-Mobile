<template>
  <div class="max-w-lg mx-auto py-10">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Editar Perfil</h1>
    <div class="bg-white p-8 rounded-xl shadow-2xl">
      <form @submit.prevent="guardarPerfil" class="space-y-6">
        <div>
          <label for="nombreUsuario" class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
          <input
            id="nombreUsuario"
            v-model="nombreUsuario"
            type="text"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Tu nombre de usuario"
          />
        </div>
        <div>
          <label for="nombreCompleto" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input
            id="nombreCompleto"
            v-model="nombreCompleto"
            type="text"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Tu nombre completo"
          />
        </div>
        <div>
          <label for="avatar" class="block text-sm font-medium text-gray-700">Avatar</label>
          <input
            id="avatar"
            type="file"
            accept="image/jpeg,image/png"
            @change="handleAvatar"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition duration-200"
          />
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="Vista previa del avatar"
            class="w-16 h-16 rounded-full object-cover mt-2"
          />
          <p v-if="avatarError" class="text-red-500 text-sm mt-2">{{ avatarError }}</p>
        </div>
        <div>
          <label for="bio" class="block text-sm font-medium text-gray-700">Biografía</label>
          <textarea
            id="bio"
            v-model="bio"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            rows="5"
            placeholder="Contanos sobre vos"
          ></textarea>
        </div>
        <div>
          <label for="edad" class="block text-sm font-medium text-gray-700">Edad</label>
          <input
            id="edad"
            v-model="edad"
            type="number"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Tu edad"
          />
        </div>
        <div>
          <label for="carrera" class="block text-sm font-medium text-gray-700">Carrera</label>
          <input
            id="carrera"
            v-model="carrera"
            type="text"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Tu carrera"
          />
        </div>
        <div>
          <label for="empleoActual" class="block text-sm font-medium text-gray-700">Empleo Actual</label>
          <input
            id="empleoActual"
            v-model="empleoActual"
            type="text"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Tu empleo actual"
          />
        </div>
        <div>
          <label for="contrasenaActual" class="block text-sm font-medium text-gray-700">Contraseña Actual</label>
          <input
            id="contrasenaActual"
            v-model="contrasenaActual"
            type="password"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Ingresá tu contraseña actual"
          />
        </div>
        <div>
          <label for="contrasenaNueva" class="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
          <input
            id="contrasenaNueva"
            v-model="contrasenaNueva"
            type="password"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
            placeholder="Ingresá tu nueva contraseña"
          />
          <p v-if="contrasenaError" class="text-red-500 text-sm mt-2">{{ contrasenaError }}</p>
        </div>
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase';

/**
 * Componente para que el usuario pueda editar su perfil.
 * @component
 */
export default {
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
       * Archivo de la nueva imagen de avatar seleccionada.
       * @type {File|null}
       */
      avatar: null,
      /**
       * Mensaje de error si hay problemas con el avatar.
       * @type {string}
       */
      avatarError: '',
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
       * Contraseña actual para verificar cambios.
       * @type {string}
       */
      contrasenaActual: '',
      /**
       * Nueva contraseña, si el usuario quiere cambiarla.
       * @type {string}
       */
      contrasenaNueva: '',
      /**
       * Mensaje de error si hay problemas con la contraseña.
       * @type {string}
       */
      contrasenaError: '',
    };
  },
  /**
   * Se ejecuta al crear el componente.
   * Verifica si hay un usuario logueado y carga su perfil.
   * @async
   */
  async created() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error('Error al obtener usuario:', error);
      this.$router.push('/login');
    } else {
      console.log('Usuario autenticado:', user.id);
      await this.cargarPerfil(user.id);
    }
  },
  methods: {
    /**
     * Carga la información del perfil del usuario desde Supabase.
     * @param {string} userId - ID del usuario.
     * @async
     */
    async cargarPerfil(userId) {
      try {
        console.log('Cargando perfil para userId:', userId);
        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select('nombre_usuario, nombre_completo, avatar_url, biografia, edad, carrera, empleo_actual')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error al cargar perfil:', error);
          alert(`Error al cargar perfil: ${error.message}`);
          BODYreturn;
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
        } else {
          console.log('No se encontró perfil para userId:', userId);
        }
      } catch (err) {
        console.error('Error inesperado al cargar perfil:', err);
        alert('Error inesperado al cargar perfil');
      }
    },
    /**
     * Maneja la selección de una nueva imagen de avatar.
     * Verifica que sea una imagen válida y no demasiado grande.
     * @param {Event} event - Evento del input de archivo.
     */
    handleAvatar(event) {
      this.avatarError = '';
      const archivo = event.target.files[0];
      if (!archivo) {
        this.avatar = null;
        return;
      }

      const tiposPermitidos = ['image/jpeg', 'image/png'];
      if (!tiposPermitidos.includes(archivo.type)) {
        this.avatarError = 'Solo se permiten imágenes JPEG o PNG';
        this.avatar = null;
        return;
      }

      const maxTamano = 5 * 1024 * 1024; 
      if (archivo.size > maxTamano) {
        this.avatarError = 'La imagen es demasiado grande (máximo 5MB)';
        this.avatar = null;
        return;
      }

      this.avatar = archivo;
    },
    /**
     * Verifica si la nueva contraseña es válida.
     * @param {string} password - Contraseña a verificar.
     * @returns {string} - Mensaje de error si no es válida, o vacío si está bien.
     */
    validarContrasena(password) {
      if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres';
      }
      if (!/[a-zA-Z]/.test(password)) {
        return 'La contraseña debe contener al menos una letra';
      }
      if (!/[0-9]/.test(password)) {
        return 'La contraseña debe contener al menos un número';
      }
      return '';
    },
    /**
     * Guarda los cambios del perfil y, si se ingresó, la nueva contraseña.
     * Sube el avatar si se seleccionó uno nuevo.
     * @async
     */
    async guardarPerfil() {
      this.contrasenaError = '';
      this.avatarError = '';

      if (this.contrasenaNueva) {
        const validacion = this.validarContrasena(this.contrasenaNueva);
        if (validacion) {
          this.contrasenaError = validacion;
          return;
        }
        if (!this.contrasenaActual) {
          this.contrasenaError = 'Ingresá tu contraseña actual para cambiar la contraseña';
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        try {
          if (this.contrasenaNueva) {
            const { error: signInError } = await supabase.auth.signInWithPassword({
              email: user.email,
              password: this.contrasenaActual,
            });

            if (signInError) {
              console.error('Error al verificar contraseña actual:', signInError);
              this.contrasenaError = 'La contraseña actual es incorrecta';
              return;
            }

            const { error: updateError } = await supabase.auth.updateUser({
              password: this.contrasenaNueva,
            });

            if (updateError) {
              console.error('Error al actualizar contraseña:', updateError);
              this.contrasenaError = `Error al actualizar contraseña: ${updateError.message}`;
              return;
            }
            console.log('Contraseña actualizada correctamente');
          }

          let avatarUrl = this.avatarUrl;
          if (this.avatar) {
            const nombreArchivo = `avatar_${user.id}_${Date.now()}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('post-images')
              .upload(nombreArchivo, this.avatar, {
                cacheControl: '3600',
                upsert: true,
              });

            if (uploadError) {
              console.error('Error al subir avatar:', uploadError);
              this.avatarError = `Error al subir avatar: ${uploadError.message}`;
              return;
            }

            avatarUrl = supabase.storage.from('post-images').getPublicUrl(uploadData.path).data.publicUrl;
            console.log('Avatar subido, URL:', avatarUrl);

            if (this.avatarUrl) {
              const pathAnterior = this.avatarUrl.split('/').pop();
              await supabase.storage.from('post-images').remove([pathAnterior]);
            }
          }

          console.log('Guardando perfil para userId:', user.id, 'con datos:', {
            nombre_usuario: this.nombreUsuario,
            nombre_completo: this.nombreCompleto,
            avatar_url: avatarUrl,
            biografia: this.bio,
            edad: this.edad,
            carrera: this.carrera,
            empleo_actual: this.empleoActual,
          });
          const { data, error } = await supabase
            .from('perfiles')
            .upsert({
              id: user.id,
              nombre_usuario: this.nombreUsuario,
              nombre_completo: this.nombreCompleto,
              avatar_url: avatarUrl,
              biografia: this.bio,
              edad: this.edad,
              carrera: this.carrera,
              empleo_actual: this.empleoActual,
              actualizado_en: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            console.error('Error al guardar perfil:', error);
            alert(`Error al guardar perfil: ${error.message}`);
            return;
          }

          console.log('Perfil guardado correctamente:', data);
          alert('Perfil actualizado correctamente' + (this.contrasenaNueva ? ' y contraseña cambiada' : ''));
          this.contrasenaActual = '';
          this.contrasenaNueva = '';
          this.avatar = null;
          this.avatarUrl = avatarUrl;
          this.$router.push('/perfil');
        } catch (err) {
          console.error('Error inesperado al guardar perfil:', err);
          alert('Error inesperado al guardar perfil');
        }
      }
    },
  },
};
</script>