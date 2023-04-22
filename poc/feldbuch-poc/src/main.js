// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import vuetify from './plugins/vuetify';
import axios from 'axios';

//baseURL to backend server
axios.defaults.baseURL = "http://127.0.0.1:3000";

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify,
  router,
  components: { App },
  template: '<App/>'
})
