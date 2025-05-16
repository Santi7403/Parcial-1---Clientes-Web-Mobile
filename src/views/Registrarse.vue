<template>
  <div class="max-w-md mx-auto py-10">
    <h1 class="text-4xl font-extrabold text-gray-900 mb-8 text-center">Registrarse</h1>
    <form @submit.prevent="registrarse" class="bg-white p-8 rounded-xl shadow-2xl space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>
      <div>
        <label for="nombreUsuario" class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
        <input
          id="nombreUsuario"
          v-model="nombreUsuario"
          type="text"
          required
          class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>
      <div>
        <label for="nombreCompleto" class="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input
          id="nombreCompleto"
          v-model="nombreCompleto"
          type="text"
          required
          class="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </div>
      <button
        type="submit"
        :disabled="cargando"
        class="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50"
      >
        {{ cargando ? "Registrando..." : "Registrarse" }}
      </button>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { supabase } from '../supabase';

/**
 * Componente para que los usuarios puedan crear una nueva cuenta.
 * @component
 */
export default {
  data() {
    return {
      /**
       * Correo electrónico ingresado por el usuario.
       * @type {string}
       */
      email: '',
      /**
       * Contraseña ingresada por el usuario.
       * @type {string}
       */
      password: '',
      /**
       * Nombre de usuario elegido por el usuario.
       * @type {string}
       */
      nombreUsuario: '',
      /**
       * Nombre completo del usuario.
       * @type {string}
       */
      nombreCompleto: '',
      /**
       * Mensaje de error si algo sale mal al registrarse.
       * @type {string}
       */
      error: '',
      /**
       * Indica si se está enviando el formulario de registro.
       * @type {boolean}
       */
      cargando: false,
    };
  },
  methods: {
    /**
     * Maneja el registro del usuario.
     * Crea una cuenta con el correo y contraseña, y guarda el perfil en Supabase.
     * @async
     */
    async registrarse() {
      if (this.cargando) return;

      if (!this.email || !this.password || !this.nombreUsuario || !this.nombreCompleto) {
        this.error = 'Todos los campos son obligatorios.';
        return;
      }

      if (!this.email.includes('@')) {
        this.error = 'El correo electrónico no es válido.';
        return;
      }

      if (this.password.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres.';
        return;
      }

      this.error = '';
      this.cargando = true;

      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });

        if (authError) {
          if (authError.message.includes('Password should be at least 6 characters')) {
            this.error = 'La contraseña debe tener al menos 6 caracteres.';
          } else if (authError.message.includes('Invalid email')) {
            this.error = 'El correo electrónico no es válido.';
          } else if (authError.message.includes('User already registered')) {
            this.error = 'Ya existe una cuenta con este correo.';
          } else {
            this.error = `Error al registrarse: ${authError.message}`;
          }
          return;
        }

        const user = data.user;

        if (user) {
          const { error: perfilError } = await supabase
            .from('perfiles')
            .insert({
              id: user.id,
              nombre_usuario: this.nombreUsuario,
              nombre_completo: this.nombreCompleto,
              actualizado_en: new Date().toISOString(),
            });

          if (perfilError) {
            this.error = `Error al crear perfil: ${perfilError.message}`;
            return;
          }

          this.$router.push('/perfil');
        }
      } catch (err) {
        this.error = 'Error inesperado al registrarse.';
        console.error('Error inesperado:', err);
      } finally {
        this.cargando = false;
      }
    },
  },
};
</script>