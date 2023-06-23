<template>
  <div id="wrapper">
    <Navigation />
    <v-row class="pt-4">
      <v-spacer></v-spacer>
    <v-form class="w-75 pa-2">
      <v-list>
        <v-list-subheader v-if="places.length === 0"> 
          {{ $t('not_created_yet', { object: $tc('place', 2) }) }}
        </v-list-subheader>

        <template v-for="(place, i) in places" :key="place">
          <v-list-item v-on:click="moveToPlace(place.id)">
              <v-row>
                
                <v-col cols="12" sm="6" md="4">
                  <v-list-item-title class="ma-4"> 
                    {{ place.placeNumber }} 
                  </v-list-item-title>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-list-item-title class="ma-4"> 
                    {{ place.title }} 
                  </v-list-item-title>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-list-item-title class="ma-4"> 
                    {{ place.date }} 
                  </v-list-item-title>
                </v-col>

              </v-row>
          </v-list-item>
          <v-divider v-if="i !== places.length - 1"></v-divider>
        </template>

      </v-list>
    </v-form>
    <v-spacer></v-spacer>
    </v-row>

    <div class="text-center pa-2">
      <v-btn
        color="add"
        v-on:click="addPlace()"> 
        <v-icon>mdi-plus-box-multiple</v-icon> 
      </v-btn>
    </div>
  </div>
</template>

<script>
/**
 * Methods overview:
 *  updatePlaces    - Updates existing presentation of places
 *  moveToPlace     - Loads the view of the selected place
 *  addPlace        - Adds a new place to the list
 */
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {

  name: 'PlacesOverview',

  components: {
    Navigation
  },

  data() {
    return {
      places: [],
    };
  },

  async created() {

    await fromOfflineDB.syncLocalDBs();
    await this.updatePlaces();

  },

  methods: {

    async updatePlaces() {

      this.places = await fromOfflineDB.getAllObjectsWithID(
                            String(VueCookies.get('currentActivity')),
                            'Activity', 'Places', 'places' ); 
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1: -1)

    },

    async addPlace() {

      const acID = String(VueCookies.get('currentActivity'));
      var newPlaceID = String(Date.now());

      var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities');
      activity.places.push(newPlaceID);
      activity.lastChanged = Date.now();

      const newPlace = {
        id:           newPlaceID,
        activityID:   acID,
        placeNumber:  '',
        date:         '',
        title:    '',
        positions:    [],
        models:       [],
        lastChanged: Date.now(),
        lastSync: ''
      }
      
      if(this.places.length == 0) {
        newPlace.placeNumber = 1
      } else {
        const placeNumbers = await fromOfflineDB.getPropertiesWithID( acID, 'place', 'placeNumber', 'Places', 'places' )
        const newPlaceNumber = Math.max( ...placeNumbers ) + 1;
        newPlace.placeNumber = newPlaceNumber;
      }

      await fromOfflineDB.updateObject(activity, 'Activities', 'activities');
      var placeID = await fromOfflineDB.addObject( newPlace, 'Places', 'places')
      await fromOfflineDB.addObject({ id: placeID, object: 'places' }, 'Changes', 'created');
      await this.updatePlaces( newPlace.id )

    },

    moveToPlace(placeID) {
      
      if ( placeID !== 'new' ) {
        VueCookies.set( 'currentPlace', placeID )
      }

      this.$router.push( { name: 'PlaceCreation', params: { placeID: placeID } } )
      this.$emit( 'view', 'Stelle' )
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