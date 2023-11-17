import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from "axios";
import vuetify from './plugins/vuetify';
import { createI18n } from "vue-i18n";
import fieldbook_en from './locales/en.mjs';
import fieldbook_de from './locales/de.mjs';
import VueCookies from "vue-cookies";

//baseURL to backend server
axios.defaults.baseURL = "http://127.0.0.1:3000";

const i18n = createI18n({
    locale: 'de',
    allowComposition: true,
    messages: {
        de: fieldbook_de,
        en: fieldbook_en,
    }
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(VueCookies, {
  //expires: "7d",
});

app.mount('#app')
