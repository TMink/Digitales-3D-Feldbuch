<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 13.02.2024 13:26:02
 * Modified By: Julian Hardtung
 * 
 * Description: `DEPRECATED` pathbar to show what activity, place, position 
 *              the user has currently opened
 -->

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
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePathbar()
      .catch(err => console.error(err));
  },
  methods: {

    async updatePathbar() {
      if( this.$cookies.get('currentActivity') ) {
        await this.getInfo("Activity")
          .catch(err => console.error(err));
      } 
      if( this.$cookies.get('currentPlace') ) {
        await this.getInfo("Place")
          .catch(err => console.error(err));
      }
      if( this.$cookies.get('currentPosition') ) {
        await this.getInfo("Position")
          .catch(err => console.error(err));
      }
    },
    
    async getInfo(selection) { 
      const _id = this.$cookies.get('current' + selection);
      
      let db = null;
      let st = null;
      if(selection === "Activity") {
        db = "Activities"
        st = "activities"
      } else {
        db = selection + "s"
        st = selection.toLowerCase() + "s"
      }
      const name = await fromOfflineDB.getObject( _id, db, st)
        .catch(err => console.error(err));
    
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