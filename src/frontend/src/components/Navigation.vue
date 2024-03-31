<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 15:00:01
 * Modified By: Julian Hardtung
 * 
 * Description: Vue component with navigation-bar and extendable side-bar
 -->


<template>
  <!-- App Bar -->
  <v-app-bar 
      style="z-index: 2;" 
      color="accent_dark">
      <v-btn icon v-on:click="goback">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title> {{ toolbar_title }} </v-toolbar-title>

      <!-- Navigation-Tabs -->
      <v-tabs 
        flat 
        grow 
        bg-color="accent_dark" 
        align-tabs="center" 
        slider-color="slider"
        v-model="active_tab"
        v-if="active_tab>=0">

        <v-tab 
          id="activity" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('ActivitiesOverview')">
          <v-window>
            <v-card-subtitle class="mb-n2">
              {{ $t('activity') }}
            </v-card-subtitle>
            {{ currentActivity }}
          </v-window>
        </v-tab>

        <v-tab 
          id="place" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('PlacesOverview')"
          :disabled="!activityIsSet">
          <v-window>
            <v-card-subtitle class="mb-n2">
              {{ $t('place') }}
            </v-card-subtitle>
            {{ currentPlace }}
          </v-window>
        </v-tab>

        <v-tab 
          id="position" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('PositionsOverview')"
          :disabled="!placeIsSet">
          <v-window>
            <v-card-subtitle class="mb-n2">
              {{ $t('position') }}
            </v-card-subtitle>
            {{ currentPosition }}
          </v-window>
        </v-tab>

      </v-tabs>
      <v-spacer></v-spacer>

      <div class="AccountButton">
        <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn 
                icon 
                variant="text"
                v-bind="props"
                v-if="userStore.authenticated">
                <v-icon>mdi-account-circle</v-icon>
              </v-btn>
              <v-btn 
                icon 
                variant="text"
                v-bind="props"
                v-else>
                <v-icon>mdi-account-off-outline</v-icon>
              </v-btn>
          </template>
            <v-list v-if="userStore.authenticated">
                <v-list-item 
                  @click="logout()">
                  {{ $t('logout') }}
                </v-list-item>
            </v-list>
            <v-list v-else>
                <v-list-item 
                  @click="changePage('RegistrationPage')">
                  {{ $t('registration') }}
                </v-list-item>
                <v-list-item 
                  @click="changePage('LoginPage')">
                  {{ $t('login') }}
                </v-list-item>
            </v-list>
        </v-menu>
        {{ message }}
    </div>
      <v-btn 
        icon 
        @click.stop="navdrawer = !navdrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      color="surface" 
      v-model="navdrawer" 
      location="right">
      <v-card 
        height="100%"
        class="d-flex flex-column">

        <v-list-item>
          <v-list-item-title class="text-h6">
            {{ $t('menu') }}
          </v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item 
          v-for="item in navbar_items" 
          :key="item.title" 
          link 
          :to="item.link">
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>

        <v-spacer></v-spacer>
        
        <!-- SETTINGS -->
        <v-card 
          variant="outlined" 
          class="ma-3">
          <v-card-title>
            {{ $t('settings')}}
          </v-card-title>
          <v-divider></v-divider>
          <v-row class="d-flex justify-center ma-3">
            <LocaleChanger class="ma-2" />
            <v-btn 
              @click="toggleTheme" 
              color="background" 
              class="ma-2">
              <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
          </v-row>
          <v-divider></v-divider>
          <v-row no-gutters class="pa-2">
            <v-checkbox :label="$t('toggleTooltips')"
              class="ml-3"
              v-model="tooltipsToggle"
              density="compact"
              hide-details
              color="secondary"
              @click="toggleTooltips()">
            </v-checkbox>
          </v-row>
        </v-card>

        <!-- DATA BACKUP -->
        <DataBackup />
        
        <v-spacer></v-spacer>
        
        <!-- ADMIN MENU -->
        <v-card 
          variant="outlined" 
          class="ma-3 mb-15">
          <v-card-title>
            {{ $t('adminArea') }}
          </v-card-title>
          <v-divider></v-divider>
          <v-list-item 
            link 
            v-on:click="clearLocalData()">
            <v-list-item-title>
              {{ $t('deletePhrase', { msg: 'All local data' }) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>

      </v-card>
    </v-navigation-drawer>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { useTheme } from 'vuetify/lib/framework.mjs';
import LocaleChanger from './LocaleChanger.vue';
import DataBackup from './DataBackup.vue';
import { ref } from 'vue'
import { useUserStore } from '../Authentication.js';
import { toRaw } from "vue";

export default {
  name: 'Navigation',
  components: {
    LocaleChanger,
    DataBackup
  },
  setup() {
    const theme = useTheme()
    const { t } = useI18n() // use as global scope
    const message = ref('');
    const userStore = useUserStore();

    if (userStore.authenticated) {
      message.value = toRaw(userStore.user.username);
    }

    return {
      t,
      theme,
      message,
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
      activityIsSet: false,
      positionIsSet: false,
      currentActivity: '-',
      currentPlace: '-',
      currentPosition: '-',
      backbutton_link: '',
      navdrawer: false,
      tooltipsToggle: true,
      toolbar_title: this.$t('fieldbook'),
      path_reload: 0,
      navbar_items: [
        { link: "/", title: this.$t('home') },
        { link: "/3dview", title: this.$t('threeD_view') },
        /* { link: "/onlineSync", title: this.$t('online_sync') }, */
      ],
      initDone: false,

    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));

    await this.updatePathbar()
      .catch(err => console.error(err));
    this.active_tab = this.active_tab_prop;

    var activityID = this.$generalStore.getCurrentObject('activity');
    if (activityID !== null) {
      this.activityIsSet = true
    }

    var placeID = this.$generalStore.getCurrentObject('place');
    if (placeID !== null) {
      this.placeIsSet = true
    }

    var positionID = this.$generalStore.getCurrentObject('position');
    if (positionID !== null) {
      this.positionIsSet = true;
    } else {
      this.positionIsSet = false;
    }

    this.tooltipsToggle = this.$generalStore.getShowTooltips();

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
      this.clearLocalStorage();
      await this.clearIndexedDB()
        .catch(err => console.error(err));
      this.$router.go();
    },

    deleteCookies() {
      this.$cookies.keys().forEach(cookie => this.$cookies.remove(cookie));
    },

    async clearIndexedDB() {
      const dbs = await window.indexedDB.databases()
        .catch(err => console.error(err));
      dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name) });
    },

    /**
     * Deletes all data in localStorage
     */
    async clearLocalStorage() {
      this.$generalStore.clearLocalStorage();
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
        await this.getInfo("activity").catch(err => console.error(err));

        await this.getInfo("place").catch(err => console.error(err));

        await this.getInfo("position").catch(err => console.error(err));
    },

    async getInfo(selection) {
      const _id = this.$generalStore.getCurrentObject(selection);

      if (_id == null || _id == 'null') {
        return;
      }

      let db = null;
      let st = null;
      let name = null;
      if (selection == "activity") {
        db = "Activities"
        st = "activities"
      } else if (selection == "place") {
        db = "Places"
        st = "places"
      } else {
        db = "Positions"
        st = "positions"
      }
      
      name = await fromOfflineDB.getObject(_id, db, st)
        .catch(err => console.error(err));
      

      switch (selection) {
        case "activity":
          this.currentActivity = name.activityNumber;
          break;
        case "place":
          this.currentPlace = name.placeNumber;
          break;
        case "position":
          var curPlaceID = this.$generalStore.getCurrentObject('place');
          var curPlace = '';
          if (curPlaceID.length > 0) {
            curPlace = await fromOfflineDB
              .getObject(curPlaceID, 'Places', 'places')
              .catch(err => console.error(err));
          }
          if (curPlace.placeNumber != '1' && name != undefined) {
            this.currentPosition = name.positionNumber;
          } else {
            this.currentPosition = '-';
          }
          break;
        default:
          console.log("Error");
      }
    },

    /**
     * Logging out the current user
     */
    async logout() {
      
      try {
        await this.userStore.logout();
        this.message = "You are not logged in!"
        this.$router.push({ name: "LoginPage" });
      } catch (error) {
        console.log("Logout failed")
      }
    },

    /**
     * Toggles the tooltips in the system
     */
    toggleTooltips() {
      this.tooltipsToggle = this.tooltipsToggle == true ? false : true;
      this.$generalStore.toggleTooltips(this.tooltipsToggle);
      location.reload();
    },
    toggleTheme() {
      this.$generalStore.toggleTheme();

      this.theme.global.name.value = this.$generalStore.getTheme();
    },
  }
}
</script>

<style>
.v-tabs,
.v-tab {
  height: 70px;
}
</style>
