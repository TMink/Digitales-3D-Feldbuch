<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />

    <v-row no-gutters class="align-center pa-2">
        <v-spacer></v-spacer>
        <v-card class="ma-2 w-50" variant="text">
          <v-row no-gutters class="align-center pa-2">

            <!-- SHOW ALL SWITCH-->
            <v-col cols="3">
              <v-switch
                class="pl-3" 
                v-model="showAllInfo"
                hide-details 
                label="Show all info">
              </v-switch>
            </v-col>
          
            <v-divider vertical class="ml-2 mr-6" />
            <!-- PLACES SEARCH -->
            <v-col cols="8">
              <v-text-field 
                v-model="searchQuery" 
                append-icon="mdi-magnify" 
                label="Search" 
                single-line 
                hide-details>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>

    <v-form class="px-6">
      <v-row>
        <v-spacer></v-spacer>

        <!-- POSITIONS LIST -->
        <v-card class="pa-3"
          :min-width="windowWidth * 0.5">

          <v-data-table-virtual
            v-show="!showAllInfo"
            :items="filteredPositions"
            fixed-header
            :height="getTableHeight"
            :headers="headers"
            max-height>

            <template v-slot:item="{ item, index }">
              <tr v-on:click="moveToPosition(item.raw.id)"
                  @mouseenter="setHoveredRow(index, true)"
                  @mouseleave="setHoveredRow(index, false)">

                  <!-- POSITION NUMBER -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.positionNumber }}
                    </v-list-item-title>
                  </td>

                  <!-- SUB NUMBER -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.subNumber }}
                    </v-list-item-title>
                  </td>

                  <!-- TITLE -->
                  <td class="py-6" :style="getRowStyle(index)">
                    <v-list-item-title
                      v-if="item.raw.title.length > 0"
                      style="min-width:200px" 
                      class="text-wrap">
                      {{ item.raw.title }}
                    </v-list-item-title>

                    <v-list-item-title 
                      v-if="item.raw.title.length == 0" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- DATE -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.date || '-' }}
                    </v-list-item-title>
                  </td>
              </tr>
            </template>
          </v-data-table-virtual>

          <!-- POSITIONS LIST COMPLETE -->
            <v-data-table-virtual
              fixed-header
              v-show="showAllInfo"
              :items="filteredPositions" 
              :height="getTableHeight"
              :headers="fullHeaders">

              <template v-slot:item="{ item, index }">
                <tr v-on:click="moveToPosition(item.raw.id)" 
                  @mouseenter="setHoveredRow(index, true)"
                  @mouseleave="setHoveredRow(index, false)">

                  <!-- PLACE NUMBER -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.positionNumber }}
                    </v-list-item-title>
                  </td>

                  <!-- SUB NUMBER -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.subNumber }}
                    </v-list-item-title>
                  </td>

                  <!-- TITLE -->
                  <td class="py-2" :style="getRowStyle(index)">
                    <v-list-item-title
                      v-if="item.raw.title.length > 0"
                      style="min-width:200px" 
                      class="text-wrap">
                      {{ item.raw.title }}
                    </v-list-item-title>

                    <v-list-item-title 
                      v-if="item.raw.title.length == 0" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- DATING -->
                    <td :style="getRowStyle(index)">
                      <v-list-item-title 
                        v-if="item.raw.dating">
                        {{ item.raw.dating }}
                      </v-list-item-title>

                      <v-list-item-title 
                        v-if="!item.raw.dating" style="color:dimgrey;">
                        -
                      </v-list-item-title>
                    </td>

                  <!-- RIGHT VALUES -->
                  <td :style="getRowStyle(index)" class="align-right">
                    <v-list-item-title 
                      v-if="item.raw.right">
                      {{ item.raw.right }}
                    </v-list-item-title>

                    <v-list-item-title 
                      v-if="!item.raw.right" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- UP VALUES -->
                  <td :style="getRowStyle(index)" class="align-right">
                    <v-list-item-title v-if="item.raw.up">
                      {{ item.raw.up }}
                    </v-list-item-title>

                    <v-list-item-title 
                      v-if="!item.raw.up" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- HEIGHT -->
                    <td :style="getRowStyle(index)" class="align-right">
                      <v-list-item-title v-if="item.raw.height">
                        {{ item.raw.up }}
                      </v-list-item-title>

                      <v-list-item-title 
                        v-if="!item.raw.height" style="color:dimgrey;">
                        -
                      </v-list-item-title>
                    </td>

                  <!-- PLANE -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title 
                      v-if="item.raw.count != ''" class="text-wrap">
                      {{ item.raw.count || '-' }}
                    </v-list-item-title>
                    <v-list-item-title 
                      v-if="item.raw.count == ''" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- WEIGHT -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title 
                      v-if="item.raw.weight != ''" class="text-wrap">
                      {{ item.raw.weight || '-' }}
                    </v-list-item-title>
                    <v-list-item-title 
                      v-if="item.raw.weight == ''" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- WEIGHT -->
                    <td :style="getRowStyle(index)">
                      <v-list-item-title 
                        v-if="item.raw.material != ''" class="text-wrap">
                        {{ item.raw.material || '-' }}
                      </v-list-item-title>
                      <v-list-item-title 
                        v-if="item.raw.material == ''" style="color:dimgrey;">
                        -
                      </v-list-item-title>
                    </td>

                  <!-- DESCRIPTION -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title class="text-wrap">
                      {{ item.raw.description }}
                    </v-list-item-title>
                    <v-list-item-title 
                      v-if="item.raw.description == ''" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- EDITOR -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title
                      v-if="item.raw.addressOf != ''">
                      {{ item.raw.addressOf }}
                    </v-list-item-title>
                    <v-list-item-title 
                      v-if="item.raw.addressOf == ''" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>

                  <!-- DATE -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title>
                      {{ item.raw.date}}
                    </v-list-item-title>
                  </td>

                  <!-- IS SEPARATE -->
                  <td :style="getRowStyle(index)">
                    <v-list-item-title 
                      v-if="item.raw.isSeparate">
                      &cross;
                    </v-list-item-title>

                    <v-list-item-title 
                      v-if="!item.raw.isSeparate" style="color:dimgrey;">
                      -
                    </v-list-item-title>
                  </td>
                  <v-divider></v-divider>
                </tr>
              </template>
            </v-data-table-virtual>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>
      </v-form>

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
      showAllInfo: false,
      hoveredRow: -1,
      headers: [
        {
          title: 'Pos. Number',
          align: 'start',
          sortable: true,
          key: 'positionNumber',
          width: "50px",
        },
        {
          title: 'Sub-\nNr.',
          align: 'start',
          sortable: true,
          key: 'subNumber',
          width: "50px",
        },
        { title: 'Title', align: 'start', key: 'title' },
        { title: 'Date', align: 'start', key: 'date', width: "100px" },
      ],
      fullHeaders: [
        {
          title: 'Nr.',
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        {
          title: 'Sub-\nNr.',
          align: 'start',
          sortable: true,
          key: 'subNumber',
        },
        { title: 'Title', align: 'start', key: 'title' },
        { title: 'Dating', align: 'start', key: 'dating' },
        { title: 'Right', align: 'start', key: 'right' },
        { title: 'Up', align: 'start', key: 'up' },
        { title: 'Height', align: 'start', key: 'height' },
        { title: 'Count', align: 'start', key: 'count' },
        { title: 'Weight', align: 'start', key: 'weight' },
        { title: 'Material', align: 'start', key: 'material' },
        { title: 'Description', align: 'start', key: 'description' },
        { title: 'Editor', align: 'start', key: 'editor' },
        { title: 'Date', align: 'start', key: 'date' },
        { title: 'isSeparate', align: 'start', key: 'isSeparate' },
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
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.positions.length;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight;

      if (totalTableHeight > (this.windowHeight - 450)) {
        return this.windowHeight - 450;
      }

      return totalTableHeight + "px";
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

    /**
     * Get the style for the row at the specified index.
     *
     * @param {number} index The index of the row
     * @returns {Object} An object containing row style properties
     */
    getRowStyle(index) {
      return {
        backgroundColor: this.hoveredRow === index ? '#2f3845' : 'transparent',
        cursor: 'pointer',
        padding: '8px 16px'
      };
    },
    /**
     * Update the hoveredRow based on the isHovered flag.
     *
     * @param {number} index - The index of the row being hovered.
     * @param {boolean} isHovered - Indicates if the row is being hovered 
     *                              (true) or not (false).
     */
    setHoveredRow(index, isHovered) {
      if (isHovered) {
        this.hoveredRow = index;
      } else if (this.hoveredRow === index) {
        this.hoveredRow = -1;
      }
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