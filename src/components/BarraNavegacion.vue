<template>
  <nav class="bg-green-600 p-4 text-white">
    <div class="container mx-auto flex justify-between">
      <router-link to="/" class="text-xl font-bold">Manzanita App</router-link>
      <div>
        <template v-if="usuario">
          <router-link to="/perfil" class="mr-4">Perfil</router-link>
          <button @click="cerrarSesion" class="mr-4">Cerrar Sesión</button>
        </template>
        <template v-else>
          <router-link to="/login" class="mr-4">Iniciar Sesión</router-link>
          <router-link to="/registrarse">Registrarse</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import { supabase } from '../supabase';

export default {
  data() {
    return {
      usuario: null,
    };
  },
  async created() {
    const { data: { user } } = await supabase.auth.getUser();
    this.usuario = user;

    supabase.auth.onAuthStateChange((_, session) => {
      this.usuario = session?.user ?? null;
    });
  },
  methods: {
    async cerrarSesion() {
      await supabase.auth.signOut();
    this.$router.push('/login');
    },
  },
};
</script>
