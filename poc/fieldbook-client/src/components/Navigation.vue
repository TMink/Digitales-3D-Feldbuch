<template>
  <v-tabs 
    flat 
    fixed-tabs 
    bg-color="accent" 
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
        {{$t('activity')}}
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
        placeID: '',
        activityIsSet: false,
        activityID: '',
        positionIsSet: false,
        positionID: '',
        currentActivity: '-',
        currentPlace: '-',
        currentPosition: '-',
      }
    },
    async created () {
      await fromOfflineDB.syncLocalDBs();
      await this.updatePathbar();
      this.active_tab = this.active_tab_prop;
      this.placeID = VueCookies.get('currentPlace')
      if (this.placeID !== null) {
        this.placeIsSet = true
      }
      this.activityID = VueCookies.get('currentActivity')
      if (this.activityID !== null){
        this.activityIsSet = true
      }
      this.positionID = VueCookies.get('currentPosition')
      if( this.positionID !== null)
        this.positionIsSet = true
    },
    methods: {
      changePage: function(routeName) {
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
      if( VueCookies.get('currentActivity') ) {
        await this.getInfo("Activity")
      } 
      if( VueCookies.get('currentPlace') ) {
        await this.getInfo("Place")
      }
      if( VueCookies.get('currentPosition') ) {
        await this.getInfo("Position")
      }
    },
    
    async getInfo(selection) { 
      const id = VueCookies.get('current' + selection);
      
      let db = null;
      let st = null;
      if(selection === "Activity") {
        db = "Activities"
        st = "activities"
      } else {
        db = selection + "s"
        st = selection.toLowerCase() + "s"
      }
      const name = await fromOfflineDB.getObject( id, db, st);
    
      switch(selection) {
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
          console.log( "Error" );
      }
      
    },
    }
  }
</script>

<style scoped>

.v-tabs, .v-tab {
  height: 70px;
}
    
</style>
