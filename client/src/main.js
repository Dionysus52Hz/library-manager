import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const myCustomLightTheme = {
   dark: false,
   colors: {
      background: '#F5F9FC',
      surface: '#FFFFFF',
      primary: '#3742A6',
      danger: '#B00020',
   },
};

const vuetify = createVuetify({
   ssr: true,
   components,
   directives,
   icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
         mdi,
      },
   },
   theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: {
         myCustomLightTheme,
      },
   },
});

const pinia = createPinia();

createApp(App).use(pinia).use(router).use(vuetify).mount('#app');
