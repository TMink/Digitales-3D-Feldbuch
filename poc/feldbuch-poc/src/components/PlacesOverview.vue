<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list>
        <v-divider></v-divider>

        <v-subheader v-if="places.length === 0"> 
          Bisher wurde keine Stelle angelegt 
        </v-subheader>

        <template v-for="(place, i) in places">
          <v-list-item v-on:click="moveToPlace(place.id)">
            <v-list-item-content>
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
            </v-list-item-content>
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
import Navigation from './Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {

  name: 'PlacesOverview',

  components: {                                                                 /* -------> components */

    Navigation

  },

  data() {                                                                      /* -------> data() */

    return {
      places: [],
    };

  },

  async created() {                                                             /* -------> created() */

    await fromOfflineDB.syncLocalDBs();                                         /* Syncronise local databases */
    await this.updatePlaces();                                                  /* Update position list */

  },

  methods: {                                                                    /* -------> methods */

    async updatePlaces() {                                                      /* ------>> updatePositions() */

      this.places = await fromOfflineDB.getAllObjects('Places', 'places');      /* Recieve all IDs in store */
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1: -1)       /* Sorts all places by their placeNumber value */

    },

    async addPlace() {                                                          /* ------>> addPlace() */

      const newPlace = {
        id:           String(Date.now()),
        placeNumber:  null,
        date:         null,
        ansprache:    null
      }

      if(this.places.length == 0) {
        newPlace.placeNumber = 1
      } else {
        const placeNumbers = await fromOfflineDB.getProperties                  /* Get all place numbers */
                                   ( 'placeNumber', 'Places', 'places')
        const newPlaceNumber = Math.max(...placeNumbers) + 1;                   /* Get the highest placeNumber of the existing properties and increment this value */
        newPlace.placeNumber = newPlaceNumber;                                  /* Update the current placeNumber */
      }
      
      await fromOfflineDB.addObject(newPlace, 'Places', 'places')               /* Add new data to store */
      await this.updatePlaces(newPlace.id)                                      /* Update position list */

    },

    moveToPlace(placeID) {                                                      /* ------>> moveToPlace() */
      
      if (placeID !== 'new') {
        VueCookies.set('currentPlace', placeID)
      }

      this.$router.push({ name: 'PlaceCreation'})
      this.$emit('view', 'Stelle')

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