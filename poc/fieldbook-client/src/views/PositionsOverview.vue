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
                <v-col cols="1" class="text-left">
                  Nr.
                </v-col>
                <v-col cols="2" class="text-left">
                  Unter-Nr.
                </v-col>
                <v-col cols="6" class="text-left">
                  Titel
                </v-col>
                <v-col cols="2" class="text-left">
                  Datum
                </v-col>
              </v-row></h3>
          </div>
        </v-card-text>

        <!-- POSITIONS LIST -->
        <v-card>
          <v-list-subheader v-if="positions.length === 0">
            {{ $t('not_created_yet', { object: $tc('position', 2) }) }}
          </v-list-subheader>

          <v-card-title>
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>

          <v-data-table-virtual
            :items="filteredPositions"
            class="elevation-1"
            :height="windowHeight - 450">

            <template v-slot:item="{ item }">
              <v-list-item v-on:click="moveToPosition(item.raw.id)">
                <v-row class="justify-center align-center my-2">
                  <v-col cols="1">
                    <v-list-item-title>
                      {{ item.raw.positionNumber }}
                    </v-list-item-title>
                    
                  </v-col>
                  <v-col cols="2">
                    <v-list-item-title>
                      {{ item.raw.subNumber }}
                    </v-list-item-title>
                  </v-col>

                  <v-col cols="6">
                    <v-list-item-title
                      class="text-wrap" 
                      v-if="item.raw.title.length != 0">
                      {{ item.raw.title }}
                    </v-list-item-title>

                    <v-list-item-title 
                      class="text-grey-darken-1" 
                      v-if="item.raw.title.length == 0">
                      {{ $t('title') }}
                    </v-list-item-title>
                  </v-col>

                  <v-col cols="2">
                    <v-list-item-title 
                      v-if="item.raw.date.length != 0">
                      {{ item.raw.date }}
                    </v-list-item-title>

                    <v-list-item-title 
                      class="text-grey-darken-1" 
                      v-if="item.raw.date.length == 0">
                      {{ $t('date') }}
                    </v-list-item-title>
                  </v-col>

                </v-row>
                <v-divider></v-divider>
              </v-list-item>
            </template>
          </v-data-table-virtual>
        </v-card>
      </v-form>
      <v-spacer></v-spacer>
    </v-row>

    <AddPosition :positions_prop="positions" @updatePositions="updatePositions()" />
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
  emits: ['view'],
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
      searchQuery: '',
      headers: [
        {
          title: 'positionNumber',
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        { title: 'title', align: 'start', key: 'title' },
        { title: 'date', align: 'end', key: 'date' },
      ],
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

  computed: {
    /**
     * Returns an array of filtered positions based on the search query.
     *
     * @returns {Array} The filtered array of positions that match the search query.
     * If the search query is empty or invalid, it returns all positions.
     */
    filteredPositions() {
      // split searchQuery to query array and escape special characters
      const queries = this.searchQuery.trim().toLowerCase().split(/\s+/).map(this.escapeRegExp);

      // if no queries are present, return all positions
      if (queries.length === 0 || (queries.length === 1 && queries[0] === '')) {
        return this.positions;
      } else {
        // filter positions by all query filters
        // (positions have to fulfill every query filter)
        return this.positions.filter(item => {
          return queries.every(query => {
            return this.doesItemMatchQuery(item, query);
          });
        });
      }
    },
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
     * Routes to the PositionForm for the chosen positionID
     * 
     * @param {String} positionID 
     */
    moveToPosition(positionID) {

      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
    },

    /**
     * Escapes special characters in a given string to treat 
     * them as literal characters.
     *
     * @param {string} string - The input string to be escaped.
     * @returns {string} The escaped string with special characters replaced 
     *  by their escape sequences.
     */
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Checks if an item matches a given query by performing 
     * a case-insensitive search.
     *
     * @param {Object} item - The item to be matched against the query.
     * @param {string} query - The search query to be used for matching.
     * @returns {boolean} True if the item matches the query; otherwise, false.
     *
     */
    doesItemMatchQuery(item, query) {
      const re = new RegExp(query, 'i');
      return (
        item.positionNumber.toString().match(re) ||
        item.title.match(re) ||
        item.date.match(re)
      );
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