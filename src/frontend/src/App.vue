<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 24.03.2024 19:12:49
 * Modified By: Julian Hardtung
 * 
 * Description: main entry point for the fieldbook + 
 *              imports globally usable vue-components
 -->

<template>
  <v-app id="app">

    <head>
      <link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css" rel="stylesheet">
      <link href="https://fonts.google.com/specimen/Space+Grotesk" rel ="stylesheet">
    </head>

    <!-- Main Content -->
    <v-main>
      <router-view @view="onViewChange"></router-view>
    </v-main>

    <!-- App Footer -->
    <AppFooter />

    <VToast ref="vtoast" />
  </v-app>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import VToast from './components/VToast.vue';
import LocaleChanger from './components/LocaleChanger.vue';
import DataBackup from './components/DataBackup.vue';
import { fromOfflineDB } from './ConnectionToOfflineDB.js';
import { useUserStore } from './Authentication.js';
import { useI18n } from 'vue-i18n'

export default {
  name: 'App',
  components: {
    AppFooter,
    LocaleChanger,
    DataBackup,
    VToast
  },
  setup() {
    const { t } = useI18n() // use as global scope
    const userStore =  useUserStore();
    return {
      t,
      userStore,
    }
  },
  props: {
    active_tab_prop: String
  },
  data: function () {
    return {
      active_tab: '0',
      placeIsSet: false,
      placeID: '',
      activityIsSet: false,
      activityID: '',
      positionIsSet: false,
      positionID: '',
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: this.$t('fieldbook'),
      path_reload: 0,
      navbar_items: [
        { link: "/", title: this.$t('overview', { msg: this.$tc('activity', 2) }) },
        { link: "/3dview", title: this.$t('threeD_view') },
        /* { link: "/onlineSync", title: this.$t('online_sync') }, */
      ],

    }
  },

  async beforeCreate() {
    await this.userStore.getUser();
  },

  async mounted() {
    this.$root.vtoast = this.$refs.vtoast;
  },

  async created() {
    var isInitDone = this.$generalStore.getInitDone();

    // only initialize Cookies and IndexedDB data once
    if (!isInitDone) {
      await fromOfflineDB.syncLocalDBs()
        .catch(err => console.error(err));
      await this.initIndexedDB()
        .catch(err => console.error(err));
      this.$generalStore.setInitDone(true);
    }

    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    this.active_tab = this.active_tab_prop;
    this.placeID = this.$generalStore.getCurrentObject("place");
    if (this.placeID !== null) {
      this.placeIsSet = true
    }
    this.activityID = this.$generalStore.getCurrentObject("activity");
    if (this.activityID !== null) {
      this.activityIsSet = true
    }
    this.positionID = this.$generalStore.getCurrentObject("position");
    if (this.positionID !== null) {
      this.positionIsSet = true
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

    async clearLocalData() {
      this.deleteCookies();
      await this.clearIndexedDB()
        .catch(err => console.error(err));
    },

    /**
     * Initializes required IndexedDB data
     */
    async initIndexedDB() {

      var technicalPlace = {
        _id: String(Date.now()),
        title: 'Technical Place',

        technical: true,
        general: false,
        coordinates: false,
        dating: false,

        //place specific
        plane: false,
        findTypes: false,
        visibility: false,
        positionslist: false,

        //position specific
        objectDescribers: false,

        //can be edited?
        canEdit: false
      }

      await fromOfflineDB.addObject(technicalPlace, 'ModulePresets', 'places')
        .catch(err => console.error(err));

      var allPlaceModules = {
        _id: String(Date.now()),
        title: 'ALL Place Modules',

        technical: false,
        general: true,
        coordinates: true,
        dating: true,

        //place specific
        plane: true,
        findTypes: true,
        visibility: true,

        //position specific
        objectDescribers: false,

        //can be edited?
        canEdit: false
      }

      var placePresetID =
        await fromOfflineDB.addObject(allPlaceModules, 'ModulePresets', 'places')
        .catch(err => console.error(err));
      this.$generalStore.setModulesPreset(placePresetID, 'place');

      var allPosModules = {
        _id: String(Date.now()),
        title: 'ALL Pos. Modules',

        technical: false,

        general: true,
        coordinates: true,
        dating: true,

        //place specific
        plane: false,
        findTypes: false,
        visibility: false,
        positionslist: false,

        //position specific
        objectDescribers: true,

        //can be edited?
        canEdit: false
      }

      var posPresetID =
        await fromOfflineDB.addObject(allPosModules, 'ModulePresets', 'positions')
        .catch(err => console.error(err));
      this.$generalStore.setModulesPreset(posPresetID, 'position');
    },

    deleteCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
      this.$router.go();
    },

    async clearIndexedDB() {
      const dbs = await window.indexedDB.databases()
        .catch(err => console.error(err));
      dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) })
      this.deleteCookies();
      this.$router.go();
    },

    changePage: function (routeName) {
      this.$router.push({ name: routeName })
        .catch(error => {
          if (
            error.name !== 'NavigationDuplicated' &&
            !error.message.includes('Avoided redundant navigation to current location')
          ) {
            console.log(error)
          }
        })
    },
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

.v-tabs,
.v-tab {
  height: 70px;
}
</style>