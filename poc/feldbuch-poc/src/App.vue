<template>
  <v-app id="app">

    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
    </head>

    <v-app-bar dark app flat color="#594743">
      <v-btn icon v-on:click="goback" x-large> <v-icon>mdi-arrow-left</v-icon> </v-btn>
      <v-toolbar-title> {{ toolbar_title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="navdrawer = !navdrawer" x-large> <v-icon>mdi-menu</v-icon></v-btn>
    </v-app-bar>

    <v-navigation-drawer app nav right v-model="navdrawer" color="#e8e4d9" temporary>
      <v-list-item>
        <v-list-item-title class="title">
          Menü
        </v-list-item-title>
      </v-list-item>
      <v-divider></v-divider>
      <v-list-item v-for="item in navbar_items" :key="item.title" link :to="item.link">
        <v-list-item-title>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item link v-on:click="deleteCookies()">
        <v-list-item-title>
          Delete Cookies
        </v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>

    <v-main>
      <Pathbar :key="path_reload" />
      <router-view @view="onViewChange"></router-view>
    </v-main>

    <AppFooter />

  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import Pathbar from './components/Pathbar.vue';
import VueCookies from 'vue-cookies';

export default {
  name: 'App',
  components: {
    AppFooter,
    Pathbar
  },
  data: function () {
    return {
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: 'Digitales 3D-Feldbuch',
      path_reload: 0,
      navbar_items: [
        { link: "/activities", title: "Projektübersicht" },
        { link: "/3dview", title: "3D-Ansicht" },
      ]
    }
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    onViewChange(title) {
      this.toolbar_title = title;
      this.path_reload += 1;
    },
    savepath() {
      setpath(this.path);
    },
    deleteCookies() {
      VueCookies.keys().forEach(cookie => VueCookies.remove(cookie));
      this.$router.go();
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--ion-color-light-contrast);
  margin-top: 0px;
}

body {
  position: static;
  max-height: none;
  height: auto;
  overflow: auto;
}

</style>