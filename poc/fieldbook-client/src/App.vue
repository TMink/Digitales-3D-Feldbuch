<template>
  <v-app id="app">

    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
    </head>

    <v-app-bar color="accent_dark">
      <v-btn icon v-on:click="goback" > <v-icon>mdi-arrow-left</v-icon> </v-btn>
      <v-toolbar-title> {{ toolbar_title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="navdrawer = !navdrawer"> <v-icon>mdi-menu</v-icon></v-btn>
    </v-app-bar>

    

    <v-navigation-drawer
    color="surface"
    v-model="navdrawer"
    location="right">
      <v-list-item>
        <v-list-item-title class="text-h6">
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
      <v-row class="d-flex justify-center ma-3">
        <LocaleChanger class="ma-2"/>
        <v-btn @click="toggleTheme" color="background" class="ma-2">
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>
      </v-row>
      
      
    </v-navigation-drawer>

    <v-main>
      <Pathbar color="accent" :key="path_reload" />
        <router-view @view="onViewChange"></router-view>
    </v-main>
  
    
    <AppFooter />

  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import Pathbar from './components/Pathbar.vue';
import VueCookies from 'vue-cookies';
import { useTheme } from 'vuetify/lib/framework.mjs';
import LocaleChanger from './components/LocaleChanger.vue'

export default {
  name: 'App',
  components: {
    AppFooter,
    Pathbar,
    LocaleChanger
  },
  setup() {
    const theme = useTheme()

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'fieldbook_light' : 'fieldbook_dark'
    }
  },
  data: function () {
    return {
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: 'Digitales 3D-Feldbuch',
      path_reload: 0,
      navbar_items: [
        { link: "/", title: "Projektübersicht" },
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
}

</style>