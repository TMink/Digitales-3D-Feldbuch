<template>
  <!--TODO: Add Fields for the PositionsOverview-->

  <div id="wrapper">
    <Navigation />

    <v-form>
      <v-list>
        <v-divider></v-divider>
        <v-subheader v-if="places.length === 0"> Bisher wurde keine Stelle angelegt</v-subheader>
        <template v-for="(place, i) in places">
          <v-list-item v-on:click="modifyPlace(place.id)">
            <v-list-item-content>
              <v-row>
                <v-col cols="12" sm="6" md="7">
                  <v-list-item-title class="ma-4"> {{ place.id }} </v-list-item-title>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i !== places.length - 1"></v-divider>
        </template>
      </v-list>
      <v-btn v-on:click="addPosition(exampleData)" color="primary"> Stelle hinzufügen </v-btn>
    </v-form>
  </div>
</template>

<script>
import Navigation from './Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
  name: 'PlacesOverview',
  components: {
    Navigation
  },
  methods: {
    /* Retrieve all positions */
    async updatePositions(newPlace) {
      var context = this;

      /* Recieve all IDs in store */
      context.places = await fromOfflineDB.getAllObjects('Places', 'places');

    },
    modifyPlace(exampleDataID) {
      if (exampleDataID !== 'new') {
        VueCookies.set('currentPlace', exampleDataID)
      }

      this.$router.push({ name: 'PlaceCreation'})

    },
    async addPosition(exampleData) {

      const newPlace = exampleData
      const positionCounter = await fromOfflineDB.getIDs('Places', 'places')

      /* Add new data to store */
      await fromOfflineDB.addObject(newPlace, 'Places', 'places')

      /* Update position list */
      await this.updatePositions(newPlace.id)

    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    /* Update position list */
    await this.updatePositions();
  },
  data() {
    return {
      places: [],
      /* DEBUGGING: This exampleData is used a an example of data, 
                    requested from the Position page */
      exampleData: {
        id: "ahsgfuhgaweufgawfu87auzgfu",
        positionNumber: 1234,
        date: new Date('1999-04-25').toLocaleDateString("de-DE"),
        description: "Gordon Ramsey ist der geilste TV-Koch den es auf der Welt gibt. Change my mind!",
        ansprache: "Die hübsche Julia",
        texts: {
          firstText: "Hello"
        },
        images: {
          firstImage: "Im an image"
        },
        models: {
          firstModel: "im a model"
        }
      }
    };
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