<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center mb-4">
      <img
        v-if="perfil.avatar_url"
        :src="perfil.avatar_url"
        alt="Avatar"
        class="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div>
        <h2 class="text-xl font-semibold text-gray-900">{{ perfil.nombre_usuario || 'Usuario' }}</h2>
        <p v-if="perfil.nombre_completo" class="text-gray-600">{{ perfil.nombre_completo }}</p>
        <p v-else class="text-gray-600">Sin nombre completo proporcionado</p>
      </div>
    </div>
    <p class="text-gray-600 mb-4">{{ perfil.biografia || 'No especificado' }}</p>
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Edad</label>
        <p class="text-gray-900">{{ perfil.edad || 'No especificado' }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Carrera</label>
        <p class="text-gray-900">{{ perfil.carrera || 'No especificado' }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Empleo Actual</label>
        <p class="text-gray-900">{{ perfil.empleo_actual || 'No especificado' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * Datos del perfil del usuario para mostrar en la tarjeta.
     * @property {string} avatar_url - URL de la imagen de avatar.
     * @property {string} nombre_usuario - Nombre de usuario.
     * @property {string} [nombre_completo] - Nombre completo (Si quiere el usuario).
     * @property {string} [biografia] - Breve biografía (Si quiere el usuario).
     * @property {number|string} [edad] - Edad del usuario (Si quiere el usuario).
     * @property {string} [carrera] - Carrera o área de estudio (Si quiere el usuario).
     * @property {string} [empleo_actual] - Trabajo o puesto actual (Si quiere el usuario).
     */
    perfil: {
      type: Object,
      required: true,
    },
  },
};
</script>
