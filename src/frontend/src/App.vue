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
import Pathbar from './components/Pathbar.vue';
import VToast from './components/VToast.vue';
import { useTheme } from 'vuetify/lib/framework.mjs';
import LocaleChanger from './components/LocaleChanger.vue';
import DataBackup from './components/DataBackup.vue';
import { fromOfflineDB } from './ConnectionToOfflineDB.js';
import { useI18n } from 'vue-i18n'

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
    const { t } = useI18n() // use as global scope

    return {
      t,
      theme,
      toggleTheme() {
        theme.global.name.value = theme.global.current.value.dark ? 'fieldbook_light' : 'fieldbook_dark'
        this.$cookies.set('currentTheme', theme.global.name.value)
      }
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
      currentActivity: '-',
      currentPlace: '-',
      currentPosition: '-',
      backbutton_link: '',
      navdrawer: false,
      toolbar_title: this.$t('fieldbook'),
      path_reload: 0,
      navbar_items: [
        { link: "/", title: this.$t('overview', { msg: this.$tc('activity', 2) }) },
        { link: "/3dview", title: this.$t('threeD_view') },
        /* { link: "/onlineSync", title: this.$t('online_sync') }, */
      ],
      initDone: false,

    }
  },

  async mounted() {
    this.$root.vtoast = this.$refs.vtoast;
  },

  async created() {
    var isInitDone = this.$cookies.get('initDone');

    // only initialize Cookies and IndexedDB data once
    if (!isInitDone) {
      await fromOfflineDB.syncLocalDBs();
      this.initCookies();
      await this.initIndexedDB();
      this.$cookies.set('initDone', true);
    }

    await fromOfflineDB.syncLocalDBs();
    await this.updatePathbar();
    this.active_tab = this.active_tab_prop; //this.$cookies.get('active_tab_prop') //this.active_tab_prop;
    this.placeID = this.$cookies.get('currentPlace')
    if (this.placeID !== null) {
      this.placeIsSet = true
    }
    this.activityID = this.$cookies.get('currentActivity')
    if (this.activityID !== null) {
      this.activityIsSet = true
    }
    this.positionID = this.$cookies.get('currentPosition')
    if (this.positionID !== null)
      this.positionIsSet = true
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

    /**
     * Initializes required cookie entries
     */
    initCookies() {
      this.$cookies.set('showAllPlaceInfo', false);
      this.$cookies.set('showAllPosInfo', false);
    },

    /**
     * Initializes required IndexedDB data
     */
    async initIndexedDB() {

      var technicalPlace = {
        id: String(Date.now()),
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

      await fromOfflineDB.addObject(technicalPlace, 'ModulePresets', 'places');

      var allPlaceModules = {
        id: String(Date.now()),
        title: 'ALL Place Modules',

        technical: false,
        general: true,
        coordinates: true,
        dating: true,

        //place specific
        plane: true,
        findTypes: true,
        visibility: true,
        positionslist: true,

        //position specific
        objectDescribers: false,

        //can be edited?
        canEdit: false
      }

      var placePresetID =
        await fromOfflineDB.addObject(allPlaceModules, 'ModulePresets', 'places');
      this.$cookies.set('placeModulesPreset', placePresetID);

      var allPosModules = {
        id: String(Date.now()),
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
        await fromOfflineDB.addObject(allPosModules, 'ModulePresets', 'positions');
      this.$cookies.set('posModulesPreset', posPresetID);
    },

    deleteCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
      this.$router.go();
    },

    async clearIndexedDB() {
      const dbs = await window.indexedDB.databases()
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
    async updatePathbar() {
      if (this.$cookies.get('currentActivity')) {
        await this.getInfo("Activity")
      }
      if (this.$cookies.get('currentPlace')) {
        await this.getInfo("Place")
      }
      if (this.$cookies.get('currentPosition')) {
        await this.getInfo("Position")
      }
    },

    async getInfo(selection) {
      const id = this.$cookies.get('current' + selection);

      let db = null;
      let st = null;
      if (selection === "Activity") {
        db = "Activities"
        st = "activities"
      } else {
        db = selection + "s"
        st = selection.toLowerCase() + "s"
      }
      const name = await fromOfflineDB.getObject(id, db, st);

      switch (selection) {
        case "Activity":
          this.currentActivity = name.activityNumber;
          break;
        case "Place":
          this.currentPlace = name.placeNumber;
          break;
        case "Position":
          this.currentPosition = name.positionNumber;
          break;
        default:
          console.log("Error");
      }

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

.v-tabs,
.v-tab {
  height: 70px;
}
</style>