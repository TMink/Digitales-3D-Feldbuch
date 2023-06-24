<template>
  <div id="wrapper">
      <Navigation active_tab_prop="2"/>
      <v-row class="pt-4">
        <v-spacer></v-spacer>
        <v-form class="w-75 pa-2">
          <v-list>
            <v-list-subheader v-if="positions.length === 0"> 
              {{ $t('not_created_yet', {object: $tc('position', 2)})}}
            </v-list-subheader>
            
            <template v-for="(position, i) in positions" :key="position">
              <v-list-item v-on:click="moveToPosition(position.id)">
                <v-row>
        
                  <v-col cols="12" sm="6" md="4">
                    <v-list-item-title class="ma-4"> 
                      {{ position.positionNumber }} 
                    </v-list-item-title>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-list-item-title class="ma-4"> 
                      {{ position.description }} 
                    </v-list-item-title>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="4">
                    <v-list-item-title class="ma-4"> 
                      {{ position.date }} 
                    </v-list-item-title>
                  </v-col>
                  
                </v-row>
              </v-list-item>
              <v-divider v-if="i !== positions.length - 1"></v-divider>
            </template>
        </v-list>
      </v-form>
      <v-spacer></v-spacer>
    </v-row>
      <AddButton v-on:click="addPosition()"/>
    </div>
  </template>

<script>
import Navigation from '../components/Navigation.vue'
import AddButton from '../components/AddButton.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
  name: 'PositionsOverview',
  components: {
    Navigation,
    AddButton
  },
  data() {
    return {
      positions: [],
    };
  },
  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updatePositions();
  },
  methods: {
    /**
     * Update reactive Vue.js position data
     */
    async updatePositions() {
      this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');

    },
    /**
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {
      var curPlaceID = VueCookies.get('currentPlace');
      var curPlace = await fromOfflineDB.getObject(curPlaceID, "Places", "places");
      var newPositionID = String(Date.now())

      curPlace.positions.push(newPositionID)
      curPlace.lastChanged = Date.now()

      const newPosition = {
        id: newPositionID,
        positionNumber: null,
        placeID: curPlaceID,
        texts: [],
        images: [],
        lastChanged: Date.now(),
        lastSync: ''
      };

      if (this.positions.length == 0) {
        newPosition.positionNumber = 1;
      } else {
        this.updatePositions();
        const positionNumber = Math.max(...this.positions.map(o => o.positionNumber));
        const newPositionNumber = positionNumber + 1;
        newPosition.positionNumber = newPositionNumber;
      }

      await fromOfflineDB.updateObject(curPlace, 'Places', 'places')
      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await fromOfflineDB.addObject({ id: newPositionID, object: 'positions' }, 'Changes', 'created');
      await this.updatePositions(newPosition.id);
    },
    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    moveToPosition(positionID) {

      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID)
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
      this.$emit('view', 'Position')
    },
  }
}
</script>

<style scoped>
#wrapper {
  height: 100%;
}

.positionItem {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  background-color: rgb(221, 221, 221);
}
</style>