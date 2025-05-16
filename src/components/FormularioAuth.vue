<script>
import { supabase } from '../supabase.js';

export default {
  props: {
    /**
     * Indica si el formulario es para iniciar sesión o no.
     */
    esInicioSesion: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      /**
       * Email que escribe el usuario.
       */
      email: '',
      /**
       * Contraseña que pone el usuario.
       */
      password: '',
      /**
       * Nombre completo que ingresa el usuario.
       */
      fullName: ''
    };
  },
  methods: {
    /**
     * Se llama cuando el usuario quiere registrarse.
     * Intenta crear el usuario en Supabase y luego guarda el nombre completo en la tabla perfiles.
     * Muestra errores por consola si algo falla.
     */
    async handleRegister() {
      try {
        const { user, error } = await supabase.auth.signUp({
          email: this.email,
          password: this.password,
        });

        console.log('user:', user);
        console.log('error:', error);

        if (error) {
          throw error; 
        }

        if (user && user.id) {
          const { data, error: profileError } = await supabase
            .from('perfiles')
            .insert([{ id: user.id, nombre_completo: this.fullName }]);

          if (profileError) {
            console.error('Error al agregar perfil:', profileError.message);
          } else {
            console.log('Perfil agregado con éxito:', data);
          }
        } else {
          console.error('Usuario no registrado correctamente. No se puede agregar perfil.');
        }

      } catch (error) {
        console.error('Error al registrar el usuario:', error.message);
      }
    }
  }
};
</script>
