<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list>
        <v-divider></v-divider>

        <v-list-subheader v-if="places.length === 0"> 
          Bisher wurde keine Stelle angelegt 
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
                    {{ place.ansprache }} 
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
      <v-btn v-on:click="addPlace()" color="primary"> Stelle hinzufügen </v-btn>
    </v-form>
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

      const acID = String(VueCookies.get('currentActivity'))

      const newPlace = {
        id:           String(Date.now()),
        activityID:   acID,
        placeNumber:  '',
        date:         '',
        ansprache:    ''
      }

      if(this.places.length == 0) {
        newPlace.placeNumber = 1
      } else {
        const placeNumbers = await fromOfflineDB.getPropertiesWithID( acID, 'place', 'placeNumber', 'Places', 'places' )
        const newPlaceNumber = Math.max( ...placeNumbers ) + 1;
        newPlace.placeNumber = newPlaceNumber;
      }
      
      await fromOfflineDB.addObject( newPlace, 'Places', 'places' )
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