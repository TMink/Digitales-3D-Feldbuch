/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.02.2024 22:35:11
 * Modified By: Julian Hardtung
 * 
 * Description: Vue.js project initialization
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import vuetify from './plugins/vuetify';
import { createI18n } from "vue-i18n";
import fieldbook_en from './locales/en.mjs';
import fieldbook_de from './locales/de.mjs';
import VueCookies from "vue-cookies";
import { createPinia } from 'pinia';
import { generalDataStore } from './ConnectionToLocalStorage.js';

const pinia = createPinia();

axios.defaults.withCredentials = true;
//baseURL to backend server
axios.defaults.baseURL = "http://localhost:3000";

const app = createApp(App)
app.use(pinia);
app.use(router)
app.use(vuetify)
app.use(VueCookies, {
  //expires: "7d",
});

// setup for i18n has to be done at the very end, 
// as the pinia store is required for it
const generalStore = generalDataStore();

const i18n = createI18n({
  locale: generalStore.getLocale(),
  allowComposition: true,
  messages: {
    de: fieldbook_de,
    en: fieldbook_en,
  },
});

app.use(i18n);

app.mount('#app')
