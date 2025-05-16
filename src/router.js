import { createRouter, createWebHistory } from 'vue-router';
import Inicio from './views/Inicio.vue';
import IniciarSesion from './views/IniciarSesion.vue';
import Registrarse from './views/Registrarse.vue';
import Perfil from './views/Perfil.vue';
import PerfilUsuario from './views/PerfilUsuario.vue';
import EditarPerfil from './views/EditarPerfil.vue';
import { supabase } from './supabase';

/**
 * Lista de rutas de la aplicación, cada una conecta una dirección con una página.
 * @type {Array<Object>}
 */
const routes = [
  /**
   * Página principal de la aplicación.
   */
  { path: '/', component: Inicio },
  /**
   * Página para iniciar sesión.
   */
  { path: '/login', component: IniciarSesion },
  /**
   * Página para registrarse.
   */
  { path: '/registrarse', component: Registrarse },
  /**
   * Página del perfil del usuario logueado.
   * Requiere estar logueado.
   */
  {
    path: '/perfil',
    component: Perfil,
    meta: { requiresAuth: true },
  },
  /**
   * Página del perfil de un usuario específico, identificado por su userId.
   * Requiere estar logueado.
   */
  {
    path: '/perfil/:userId',
    component: PerfilUsuario,
    meta: { requiresAuth: true },
  },
  /**
   * Página para editar el perfil del usuario logueado.
   * Requiere estar logueado.
   */
  {
    path: '/editar-perfil',
    component: EditarPerfil,
    meta: { requiresAuth: true },
  },
];

/**
 * Configura el enrutador de la aplicación para manejar las rutas.
 * Usa el historial del navegador para navegar.
 * @type {Object}
 */
const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * Verifica antes de cada cambio de ruta si el usuario está logueado.
 * Si la ruta requiere autenticación y no hay usuario, redirige a la página de inicio de sesión.
 * @param {Object} to - Ruta a la que se quiere ir.
 * @param {Object} from - Ruta desde la que se viene.
 * @param {Function} next - Función para continuar o redirigir.
 * @async
 */
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else {
    next();
  }
});

/**
 * Exporta el enrutador para usarlo en la aplicación.
 */
export default router;