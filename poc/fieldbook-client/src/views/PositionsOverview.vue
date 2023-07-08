<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-2">

        <!-- LIST TITLE -->
        <v-card-text v-if="positions.length !== 0">
          <div>
            <h3><v-row class="justify-center">
                <v-col cols="1" class="text-left pl-6">
                  Nr.
                </v-col>
                <v-col cols="6" class="text-left pl-6">
                  Titel
                </v-col>
                <v-col cols="2" class="text-left pl-6">
                  Datum
                </v-col>
              </v-row></h3>
          </div>
        </v-card-text>

        <!-- POSITIONS LIST -->
        <v-card>
          <v-list>
            <v-list-subheader v-if="positions.length === 0">
              {{ $t('not_created_yet', { object: $tc('position', 2) }) }}
            </v-list-subheader>

            <v-virtual-scroll :items="positions" :max-height="windowHeight - 360">
              <template v-slot="{ item }" :key="item">
                <v-list-item v-on:click="moveToPosition(position.id)">
                  <v-row class="justify-center">

                    <v-col cols="1">
                      <v-list-item-title class="ma-4">
                        {{ item.positionNumber }}
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="6">
                      <v-list-item-title class="ma-4 text-wrap">
                        {{ item.title }}
                      </v-list-item-title>

                      <v-list-item-title class="ma-4 text-grey-darken-1" v-if="item.title.length == 0">
                        {{ $t('title') }}
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="2">
                      <v-list-item-title class="ma-4">
                        {{ item.date }}
                      </v-list-item-title>
                      <v-list-item-title class="ma-4 text-grey-darken-1" v-if="item.date.length == 0">
                        {{ $t('date') }}
                      </v-list-item-title>
                    </v-col>

                  </v-row>
                </v-list-item>
                <v-divider v-if="i !== item.length - 1"></v-divider>
              </template>
            </v-virtual-scroll>
          </v-list>
        </v-card>
      </v-form>
      <v-spacer></v-spacer>
    </v-row>

    <AddPosition :positions_prop="positions" @closeDiag="updatePositions()" />
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import AddPosition from '../components/AddPosition.vue';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'PositionsOverview',
  components: {
    Navigation,
    AddPosition
  },
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
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
    this.$emit("view", this.$t('overview', { msg: this.$tc('position', 2) }));
    await fromOfflineDB.syncLocalDBs();
    await this.updatePositions();
  },
  methods: {
    /**
     * Update reactive Vue.js position data
     */
    async updatePositions() {
      var curPlaceID = String(VueCookies.get('currentPlace'));

      this.positions = await fromOfflineDB.getAllObjectsWithID(
        curPlaceID, 'Place', 'Positions', 'positions');
    },
    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    moveToPosition(positionID) {

      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
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