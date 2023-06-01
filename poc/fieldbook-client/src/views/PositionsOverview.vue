<template>
  <!--TODO: Add Fields for the PositionsOverview-->


  <div id="wrapper">
      <Navigation />
      <v-form>
        <v-list>
          <v-divider></v-divider>

          <v-list-subheader v-if="positions.length === 0"> 
            Bisher wurde keine Position angelegt 
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
        <v-btn v-on:click="addPosition()" color="primary"> Position hinzufügen </v-btn>
      </v-form>
    </div>
</template>

<script>
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
  name: 'PositionsOverview',
  components: {
    Navigation
  },
  data() {
    return {
      positions: [],
      /* DEBUGGING: This exampleData is used a an example of data, 
                    requested from the Position page */
      exampleData: {
        id: "ahsgfuhgaweufgawfu87auzgfu",
        positionNumber: 1234,
        date: new Date('1999-04-25').toLocaleDateString("de-DE"),
        description: "Gordon Ramsey ist der geilste TV-Koch den es auf der Welt gibt. Change my mind!",
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
  },
  methods: {
    /* Retrieve all positions */
    async updatePositions(newPosition) {
      var context = this;
      /* Recieve all IDs in store */
      context.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');

    },
    modifyPosition(exampleDataID) {
      if (exampleDataID !== 'new') {
        VueCookies.set('currentPosition', exampleDataID)
      }
    },
    async addPosition(exampleData) {

      const newPosition = exampleData

      /* Add new data to store */
      await fromOfflineDB.addObject(newPosition, "Positions", "positions")

      /* Update position list */
      await this.updatePositions(newPosition.id)

    },
    moveToPosition(positionID) {

      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID)
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
      this.$emit('view', 'Position')
    },
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    /* Update position list */
    await this.updatePositions();
  },
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