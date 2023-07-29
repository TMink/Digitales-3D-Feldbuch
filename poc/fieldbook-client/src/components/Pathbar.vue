<template>
  <v-card flat rounded="0">
    <v-card-title class="py-1 text-center"> 
      <b> {{  $t('current_selection') }}: </b> 
      <v-chip label>
        {{ currentActivity }}
      </v-chip>
      <v-icon size="small">mdi-arrow-right</v-icon>
      <v-chip label>
        {{ currentPlace }}
      </v-chip>
      <v-icon size="small">mdi-arrow-right</v-icon>
      <v-chip label>
        {{ currentPosition }}
      </v-chip>
    </v-card-title>
  </v-card>
</template>

<script>
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
  data: function () {
    return {

      currentActivity: null,
      currentPlace: null,
      currentPosition: null,

    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updatePathbar();
  },
  methods: {

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

<style>
</style>