import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import { supabase } from './supabase'; 

const app = createApp(App);

app.config.globalProperties.$supabase = supabase;

app.use(router);
app.mount('#app');
