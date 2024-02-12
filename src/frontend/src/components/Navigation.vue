<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 12.02.2024 13:19:03
 * Modified By: Julian Hardtung
 * 
 * Description: Vue component with navigation-bar and extendable side-bar
 -->


<template>
  <!-- App Bar -->
  <v-app-bar 
      style="z-index: 1;" 
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
        v-model="active_tab">

        <v-tab 
          id="activity" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('ActivitiesOverview')">
          <v-window>
            <v-card-subtitle>
              {{ currentActivity }}
            </v-card-subtitle>
            {{ $t('activity') }}
          </v-window>
        </v-tab>

        <v-tab 
          id="place" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('PlacesOverview')"
          :disabled="!activityIsSet">
          <v-window>
            <v-card-subtitle>
              {{ currentPlace }}
            </v-card-subtitle>
            {{ $t('place') }}
          </v-window>
        </v-tab>

        <v-tab 
          id="position" 
          class="text-h6" 
          max-width="250px" 
          @click="changePage('PositionsOverview')"
          :disabled="!placeIsSet">
          <v-window>
            <v-card-subtitle>
              {{ currentPosition }}
            </v-card-subtitle>
            {{ $t('position') }}
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
                  @click="changePage('Registration')">
                  {{ $t('registration') }}
                </v-list-item>
                <v-list-item 
                  @click="changePage('Login')">
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

        <v-row class="d-flex justify-center ma-3">
          <LocaleChanger class="ma-2" />
          <v-btn 
            @click="toggleTheme" 
            color="background" 
            class="ma-2">
            <v-icon>mdi-theme-light-dark</v-icon>
          </v-btn>
        </v-row>

        <v-spacer></v-spacer>

        <DataBackup />

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
            v-on:click="deleteCookies()">
            <v-list-item-title>
              {{ $t('deletePhrase', { msg: 'Cookies' }) }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item 
            link 
            v-on:click="clearIndexedDB()">
            <v-list-item-title>
              {{ $t('deletePhrase', { msg: 'IndexedDB' }) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>

      </v-card>
    </v-navigation-drawer>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { generalDataStore } from '../ConnectionToLocalStorage.js';
import { useTheme } from 'vuetify/lib/framework.mjs';
import LocaleChanger from './LocaleChanger.vue';
import DataBackup from './DataBackup.vue';
import Pathbar from './Pathbar.vue';
import isOnline from 'is-online';
import { ref } from 'vue'
import { useUserStore } from '../Authentication.js';
import { toRaw } from "vue";

export default {
  name: 'Navigation',
  components: {
    Pathbar,
    LocaleChanger,
    DataBackup
  },
  setup() {
    const theme = useTheme()
    const { t } = useI18n() // use as global scope
    const message = ref('');
    const userStore = useUserStore();
    const generalStore = generalDataStore();

    if (userStore.authenticated) {
      message.value = toRaw(userStore.user.username);
    }

    return {
      t,
      theme,
      message,
      userStore,
      toggleTheme() {
        generalStore.toggleTheme()

        theme.global.name.value = generalStore.getTheme();
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
      activityIsSet: false,
      positionIsSet: false,
      currentActivity: '-',
      currentPlace: '-',
      currentPosition: '-',
      backbutton_link: '',
      navdrawer: false,
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
    await fromOfflineDB.syncLocalDBs();

    await this.updatePathbar();
    this.active_tab = this.active_tab_prop; //this.$cookies.get('active_tab_prop') //this.active_tab_prop;

    var activityID = this.$cookies.get('currentActivity')
    if (activityID !== null) {
      this.activityIsSet = true
    }

    var placeID = this.$cookies.get('currentPlace');
    if (placeID !== null) {

      var curPlace = await fromOfflineDB.getObject(placeID, 'Places', 'places');
      //if (curPlace.placeNumber > 1) {
      this.placeIsSet = true
      //}
    }

    var positionID = this.$cookies.get('currentPosition')
    if (positionID !== null) {
      this.positionIsSet = true;
    } else {
      this.positionIsSet = false;
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
      await this.clearIndexedDB();
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

      var test = this.$cookies.get('currentPosition');
      if (test) {
        await this.getInfo("Position")
      } else {
        this.currentPosition = '-';
      }
    },

    async getInfo(selection) {
      const _id = this.$cookies.get('current' + selection);

      let db = null;
      let st = null;
      if (selection === "Activity") {
        db = "Activities"
        st = "activities"
      } else {
        db = selection + "s"
        st = selection.toLowerCase() + "s"
      }
      const name = await fromOfflineDB.getObject(_id, db, st);

      switch (selection) {
        case "Activity":
          this.currentActivity = name.activityNumber;
          break;
        case "Place":
          this.currentPlace = name.placeNumber;
          break;
        case "Position":
          var curPlaceID = this.$cookies.get('currentPlace');
          var curPlace = '';
          if (curPlaceID.length > 0) {
            curPlace = await fromOfflineDB.getObject(curPlaceID, 'Places', 'places');
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
        this.$router.push({ name: "Login" });
      } catch (error) {
        console.log("Logout failed")
      }
    }
  }
}
</script>

<style>
.v-tabs,
.v-tab {
  height: 70px;
}
</style>
