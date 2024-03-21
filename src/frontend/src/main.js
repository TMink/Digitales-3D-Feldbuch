/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 13:45:28
 * Modified By: Julian Hardtung
 * 
 * Description: Vue.js project initialization
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import { createI18n } from "vue-i18n";
import fieldbook_en from './locales/en.mjs';
import fieldbook_de from './locales/de.mjs';
import VueCookies from "vue-cookies";
import { createPinia } from 'pinia';
import { generalDataStore } from './ConnectionToLocalStorage.js';

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as labsComponents from "vuetify/labs/components";

const pinia = createPinia();

axios.defaults.withCredentials = true;
//baseURL to backend server
axios.defaults.baseURL = "http://localhost:3000";

const app = createApp(App)
app.use(pinia);
app.use(router)
app.use(VueCookies, {
  //expires: "7d",
});


const generalStore = generalDataStore();

// setup for i18n and vuetify have to be done at the very end, 
// as the pinia store is required for it
const i18n = createI18n({
  locale: generalStore.getLocale(),
  allowComposition: true,
  messages: {
    de: fieldbook_de,
    en: fieldbook_en,
  },
});

const vuetify = createVuetify({
  components: {
    ...labsComponents,
  },
  theme: {
    defaultTheme: generalStore.getTheme(),
    themes: {
      fieldbook_dark: {
        dark: true,
        colors: {
          background: "#171C23",
          surface: "#27303d", //list-elements
          primary: "#FB9678",
          secondary: "#03C9D6",
          error: "#FC5272", //cancel-buttons
          warning: "#FECB18", //infotext from dialog
          success: "#0FB48C",
          opp_background: "#22282C",
          accent: "#1C2128", //navigation-bar
          accent_dark: "#5C4646", //top-bar ('digital3d-Fieldbook')
          slider: "#FB9678", //slider for navigation bar
        },
      },
      fieldbook_light: {
        dark: false,
        colors: {
          background: "#F6F6F6",
          surface: "#FFFFFF", //list-elements
          primary: "#EF8F70",
          secondary: "#16BCC7",
          error: "#FC5272", //cancel-buttons
          warning: "#FECB18", //infotext from dialog
          success: "#0FB48C",
          opp_background: "#444444",
          accent: "#F6F7FA", //navigation-bar
          accent_dark: "#5C4646", //top-bar ('digital3d-Fieldbook')
          slider: "#EF8F70", //slider for navigation bar
        },
      },
    },
  },
});

app.use(vuetify)
app.use(i18n);

app.config.globalProperties.$generalStore = generalStore;

app.mount('#app')
