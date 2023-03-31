<template>
  <v-app id="app">
    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
    </head>
    <v-app-bar dark app flat color="#594743">
      <v-btn icon v-on:click="goback" x-large> <v-icon>mdi-arrow-left</v-icon> </v-btn>
      <v-toolbar-title> {{toolbar_title}} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="navdrawer = !navdrawer" x-large> <v-icon>mdi-menu</v-icon></v-btn>
    </v-app-bar>
    
    <v-main>
      <Sidebar :drawer="navdrawer"/>
      <router-view @view="onViewChange"></router-view>
    </v-main>
    <AppFooter/>
  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  created() {
    
  },
  data: function () {
    return {
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: 'Digitales 3D-Feldbuch'
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    onViewChange(title) {
      this.toolbar_title = title
    }
  },
  components: {
    Sidebar, 
    AppFooter
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
