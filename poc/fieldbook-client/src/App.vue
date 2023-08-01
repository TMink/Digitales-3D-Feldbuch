<template>
  <v-app id="app">

    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
    </head>

    <!-- App Bar -->
    <v-app-bar color="accent_dark">
      <v-btn icon v-on:click="goback">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title> {{ toolbar_title }} </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="navdrawer = !navdrawer"> 
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer color="surface" v-model="navdrawer" location="right">
      <v-card height="100%" class="d-flex flex-column">

        <v-list-item>
          <v-list-item-title class="text-h6">
            {{ $t('menu') }}
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item 
          v-for="item in navbar_items" 
          :key="item.title" 
          link :to="item.link">
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-row class="d-flex justify-center ma-3">
          <LocaleChanger class="ma-2" />
          <v-btn @click="toggleTheme" color="background" class="ma-2">
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </v-row>

        <v-spacer></v-spacer>

        <DataBackup/>

        <!-- ADMIN MENU -->
        <!-- <v-card variant="outlined" class="ma-3 mb-15">
          <v-card-title>
            {{ $t('adminArea') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-list-item link v-on:click="deleteCookies()">
            <v-list-item-title>
              {{ $t('delete', { msg: 'Cookies' }) }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item link v-on:click="clearIndexedDB()">
            <v-list-item-title>
              {{ $t('delete', { msg: 'IndexedDB' }) }}
            </v-list-item-title>
          </v-list-item>
        </v-card> -->

      </v-card>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <Pathbar color="accent" :key="path_reload" />
      <router-view @view="onViewChange"></router-view>
    </v-main>

    <!-- App Footer -->
    <AppFooter />

    <VToast ref="vtoast" />
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import Pathbar from './components/Pathbar.vue';
import VToast from './components/VToast.vue';
import VueCookies from 'vue-cookies';
import { useTheme } from 'vuetify/lib/framework.mjs';
import LocaleChanger from './components/LocaleChanger.vue'
import DataBackup from './components/DataBackup.vue'

export default {
  name: 'App',
  components: {
    AppFooter,
    Pathbar,
    LocaleChanger,
    DataBackup,
    VToast
  },
  setup() {
    const theme = useTheme()

    return {
      theme,
      toggleTheme() {
        theme.global.name.value = theme.global.current.value.dark ? 'fieldbook_light' : 'fieldbook_dark'
        VueCookies.set('currentTheme', theme.global.name.value)
      }
    }
  },
  data: function () {
    return {
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: this.$t('fieldbook'),
      path_reload: 0,
      navbar_items: [
        { link: "/", title: this.$t('overview',  {msg: this.$tc('activity', 2)}) },
        { link: "/3dview", title: this.$t('threeD_view') },
        /* { link: "/onlineSync", title: this.$t('online_sync') }, */
      ]
    }
  },
  mounted() {
    this.$root.vtoast = this.$refs.vtoast;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    onViewChange(title) {
      this.toolbar_title = title;
      this.path_reload += 1;
    },
    async clearLocalData() {
      this.deleteCookies();
      await this.clearIndexedDB();
    },
    deleteCookies() {
      VueCookies.keys().forEach(cookie => VueCookies.remove(cookie));
      this.$router.go();
    },
    async clearIndexedDB() {
      const dbs = await window.indexedDB.databases()
      dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) })
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
  /* text-align: center; */
  color: var(--ion-color-light-contrast);
}

/* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 15px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

</style>