<template>
  <div class="flex justify-center items-center h-screen bg-gray-100" v-if="!usuario">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700">Correo electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ingrese su correo"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block text-gray-700">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Ingrese su contraseña"
          />
        </div>

        <p v-if="errorMsg" class="text-red-600 text-sm mb-4 text-center">
          {{ errorMsg }}
        </p>

        <div class="flex justify-center">
          <button
            :disabled="isSubmitting"
            class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {{ isSubmitting ? "Iniciando sesión..." : "Iniciar sesión" }}
          </button>
        </div>
      </form>
      <p class="mt-4 text-center">
        ¿No tienes cuenta?
        <router-link to="/registrarse" class="text-blue-500">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { supabase } from "../supabase.js";
import { useRouter } from 'vue-router';

/**
 * Componente para que los usuarios inicien sesión con su correo y contraseña.
 * @component
 */
export default {
  setup() {
    /**
     * Correo electrónico ingresado por el usuario.
     * @type {string}
     */
    const email = ref("");
    /**
     * Contraseña ingresada por el usuario.
     * @type {string}
     */
    const password = ref("");
    /**
     * Indica si se está enviando el formulario de inicio de sesión.
     * @type {boolean}
     */
    const isSubmitting = ref(false);
    /**
     * Información del usuario logueado, si existe.
     * @type {Object|null}
     */
    const usuario = ref(null);
    /**
     * Mensaje de error si algo sale mal al iniciar sesión.
     * @type {string}
     */
    const errorMsg = ref("");
    /**
     * Herramienta para redirigir a otras páginas.
     */
    const router = useRouter();

    /**
     * Verifica si hay un usuario logueado.
     * @async
     */
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      usuario.value = user;
    };

    /**
     * Se ejecuta al cargar el componente.
     * Revisa si hay un usuario logueado y escucha cambios en la sesión.
     */
    onMounted(() => {
      checkUser();
      supabase.auth.onAuthStateChange((_, session) => {
        usuario.value = session?.user ?? null;
        if (usuario.value) {
          router.push('/');
        }
      });
    });

    /**
     * Maneja el inicio de sesión con el correo y la contraseña.
     * Redirige a la página principal si es exitoso.
     * @async
     */
    const handleLogin = async () => {
      if (isSubmitting.value) return;

      isSubmitting.value = true;
      errorMsg.value = "";

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });

        if (error) {
          errorMsg.value = "Correo o contraseña incorrectos.";
          console.error("Error al iniciar sesión:", error.message);
        } else {
          usuario.value = data.user;
          router.push('/');
        }
      } catch (err) {
        errorMsg.value = "Ocurrió un error inesperado. Intentá de nuevo.";
        console.error("Error al pystartar sesión:", err);
      } finally {
        isSubmitting.value = false;
      }
    };

    return {
      email,
      password,
      isSubmitting,
      handleLogin,
      usuario,
      errorMsg,
    };
  },
};
</script>