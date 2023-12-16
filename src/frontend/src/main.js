/*
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 14.12.2023 13:04:11
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

axios.defaults.withCredentials = true;
//baseURL to backend server
axios.defaults.baseURL = "http://localhost:3000";

const i18n = createI18n({
    locale: 'de',
    allowComposition: true,
    messages: {
        de: fieldbook_de,
        en: fieldbook_en,
    }
})

const pinia = createPinia();

const app = createApp(App)

app.use(pinia);
app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(VueCookies, {
  //expires: "7d",
});

app.mount('#app')
