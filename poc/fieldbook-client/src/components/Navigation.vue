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
      <v-btn 
        icon 
        @click.stop="navdrawer = !navdrawer">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer 
      color="surface" 
      style="z-index: 1;" 
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
              {{ $t('delete', { msg: 'Cookies' }) }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item 
            link 
            v-on:click="clearIndexedDB()">
            <v-list-item-title>
              {{ $t('delete', { msg: 'IndexedDB' }) }}
            </v-list-item-title>
          </v-list-item>
        </v-card>

      </v-card>
    </v-navigation-drawer>

</template>

<script>
 import VueCookies from 'vue-cookies'
 import { useI18n } from 'vue-i18n'
 import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
 
  export default {
    setup () {
      const { t } = useI18n() // use as global scope
      return { t }
    },
    props: {
      active_tab_prop: String
    },
    data: function (){
      return {
        active_tab: '0',
        placeIsSet: false,
        activityIsSet: false,
        positionIsSet: false,
        currentActivity: '-',
        currentPlace: '-',
        currentPosition: '-',
      }
    },
    async created () {
      await fromOfflineDB.syncLocalDBs();
      await this.updatePathbar();
      this.active_tab = this.active_tab_prop;
      
      var activityID = VueCookies.get('currentActivity')
      if (activityID !== null){
        this.activityIsSet = true
      }

      var placeID = VueCookies.get('currentPlace');
      if (placeID !== null ) {
        var curPlace = await fromOfflineDB.getObject(placeID, 'Places', 'places');
        if (curPlace.placeNumber > 1) {
          this.placeIsSet = true
        }
      }


      var positionID = VueCookies.get('currentPosition')
      if ( positionID !== null)
        this.positionIsSet = true
    },

  methods: {

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
      if (VueCookies.get('currentActivity')) {
        await this.getInfo("Activity")
      }
      if (VueCookies.get('currentPlace')) {
        await this.getInfo("Place")
      }
      if (VueCookies.get('currentPosition')) {
        await this.getInfo("Position")
      }
    },

    async getInfo(selection) {
      const id = VueCookies.get('current' + selection);

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