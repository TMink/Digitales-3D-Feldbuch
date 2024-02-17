<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 17.02.2024 19:42:21
 * Modified By: Julian Hardtung
 * 
 * Description: lists all positions
 -->

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
    <v-row no-gutters class="align-center pa-2">
        <v-spacer></v-spacer>
        <v-card class="ma-2 w-50" variant="text">
          <v-row no-gutters class="align-center pa-2">

            <!-- SHOW ALL SWITCH-->
            <div class="d-flex justify-end">
              <v-switch
                class="px-3" 
                v-model="showAllInfo"
                hide-details 
                :label="this.$t('showAll')"
                color="secondary">
              </v-switch>
            </div>
          
            <v-divider vertical class="ml-2 mr-6" />
            <!-- PLACES SEARCH -->
            <v-text-field 
              v-model="searchQuery" 
              append-icon="mdi-magnify" 
              :label="this.$t('search')" 
              single-line 
              hide-details
              color="primary">
            </v-text-field>
          </v-row>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>

    <v-form class="px-6">
      <v-row>
        <v-spacer></v-spacer>

        <!-- POSITIONS LIST -->
        <v-card class="pa-3" :min-width="windowWidth * 0.7">

          <v-data-table-virtual
            v-show="!showAllInfo"
            :items="filteredPositions"
            fixed-header
            :height="getTableHeight"
            :headers="headers"
            :sort-by="[{ key: 'positionNumber', order: 'asc' }]"
            max-height>

            <template v-slot:item="{ item, index }">
              <tr v-on:click="handleRowClick(item.raw._id)"
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

                  <!-- SYNC STATUS -->
                  <td :style="getRowStyle(index)">
                    <v-list-item>
                      <v-btn 
                        icon 
                        variant="text"
                        v-if="item.raw.lastSync > 0">
                          <v-tooltip 
                            activator="parent"
                            location="bottom">
                            {{ this.$t('lastSync') + new Date(item.raw.lastSync).toLocaleString() }}
                          </v-tooltip>
                          <v-icon>mdi-cloud-check</v-icon>
                      </v-btn>
                      <v-btn 
                        icon 
                        variant="text"      
                        v-else>
                          <v-tooltip 
                            activator="parent"
                            location="bottom">
                              {{ $t('onlyLocal') }}
                          </v-tooltip>
                          <v-icon>mdi-cloud-off-outline</v-icon>
                      </v-btn>
                    </v-list-item>
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
              :headers="fullHeaders"
              :sort-by="[{ key: 'positionNumber', order: 'asc' }]">

              <template v-slot:item="{ item, index }">
                <tr v-on:click="handleRowClick(item.raw._id)" 
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
                      v-if="item.raw.editor != ''">
                      {{ item.raw.editor }}
                    </v-list-item-title>
                    <v-list-item-title 
                      v-if="item.raw.editor == ''" style="color:dimgrey;">
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

                  <!-- SYNC STATUS -->
                  <td :style="getRowStyle(index)">
                    <v-list-item>
                      <v-btn 
                        icon 
                        variant="text"
                        v-if="item.raw.lastSync > 0">
                          <v-tooltip 
                            activator="parent"
                            location="bottom">
                            {{ this.$t('lastSync') + new Date(item.raw.lastSync).toLocaleString() }}
                          </v-tooltip>
                          <v-icon>mdi-cloud-check</v-icon>
                      </v-btn>
                      <v-btn 
                        icon 
                        variant="text"      
                        v-else>
                          <v-tooltip 
                            activator="parent"
                            location="bottom">
                              {{ $t('onlyLocal') }}
                          </v-tooltip>
                          <v-icon>mdi-cloud-off-outline</v-icon>
                      </v-btn>
                    </v-list-item>
                  </td>
                  <v-divider></v-divider>
                </tr>
              </template>
            </v-data-table-virtual>
        </v-card>
        <v-spacer></v-spacer>
      </v-row>
      </v-form>

      <v-row class="align-center">
      <v-spacer></v-spacer>
      <AddPosition 
        :positions_prop="positions" 
        @updatePositions="updatePositions()"/>
      <v-btn 
        @click="moduleCreatorOverlay = !moduleCreatorOverlay"
        color="primary">
        <v-icon>mdi-tune-vertical</v-icon>
        <v-row no-gutters>
          <v-col>
            <v-card-subtitle>
              {{  curModulePreset.title }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-btn>

      <!-- DUPLICATE SWITCH -->
      <v-switch
          class="pl-5"
          v-model="toggleDuplicate"
          hide-details
          color="secondary">
          <template v-slot:prepend>
            <v-icon color="warning">mdi-content-duplicate</v-icon> 
          </template>
      </v-switch>

      <!-- Duplicate Snackbar - stays activated as long as switch value is true -->
      <v-snackbar 
        color="warning" 
        timeout="-1" 
        v-model="toggleDuplicate" 
        location="bottom">
        <v-icon start>mdi-content-duplicate</v-icon>
        {{ $t('duplicationMode') }}
      </v-snackbar>
    </v-row>
  </div>
  <ModuleCreator 
    v-model="moduleCreatorOverlay" 
    objectTypeProp="positions"
    @updateModulePresets="updateModulePresets()"/>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import { toRaw } from 'vue';
import ModuleCreator from '../components/ModuleCreator.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { fromBackend } from '../ConnectionToBackend.js'
import AddPosition from '../components/AddPosition.vue';
import { useWindowSize } from 'vue-window-size';
import { useUserStore } from '../Authentication';
import { generalDataStore } from '../ConnectionToLocalStorage.js';

export default {
  name: 'PositionsOverview',
  components: {
    Navigation,
    AddPosition,
    ModuleCreator
  },
  
  emits: ['view'],

  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();
    const generalStore = generalDataStore();
    return {
      windowWidth: width,
      windowHeight: height,
      userStore,
      generalStore
    };
  },

  watch: {
    'curModulePreset': {
      handler: 'saveModulePresetToCookies',
      deep: true,
    },
    'showAllInfo': {
      handler: 'toggleAllInfo',
    },
  },

  data() {
    return {
      positions: [],
      searchQuery: '',
      showAllInfo: false,
      hoveredRow: -1,
      headers: [
        {
          title: this.$tc('posNumber', 2),
          align: 'start',
          sortable: true,
          key: 'positionNumber',
          width: "50px",
        },
        {
          title: this.$tc('subNumber', 2),
          align: 'start',
          sortable: true,
          key: 'subNumber',
          width: "50px",
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "100px"}
      ],
      fullHeaders: [
        {
          title: this.$tc('posNumber', 2),
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        {
          title: this.$tc('subNumber', 2),
          align: 'start',
          sortable: true,
          key: 'subNumber',
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('dating'), align: 'start', key: 'dating' },
        { title: this.$t('right'), align: 'start', key: 'right' },
        { title: this.$t('up'), align: 'start', key: 'up' },
        { title: this.$t('height'), align: 'start', key: 'height' },
        { title: this.$t('count'), align: 'start', key: 'count' },
        { title: this.$t('weight'), align: 'start', key: 'weight' },
        { title: this.$t('material'), align: 'start', key: 'material' },
        { title: this.$t('description'), align: 'start', key: 'description' },
        { title: this.$tc('editor', 1), align: 'start', key: 'editor' },
        { title: this.$t('date'), align: 'start', key: 'date' },
        { title: this.$t('isSeparate'), align: 'start', key: 'isSeparate' },
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "100px"}
      ],
      curModulePreset: {
        title: '-',
      },
      moduleCreatorOverlay: false,
      toggleDuplicate: false,
    };
  },

  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    this.$emit("view", this.$t('overview', { msg: this.$tc('position', 2) }));
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePositions()
      .catch(err => console.error(err));
    await this.updateModulePresets()
      .catch(err => console.error(err));
    this.setShowAllInfoSwitch();
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
      const numberOfRows = this.positions.length > 0 ? this.positions.length : 1;
      const headerHeight = 56;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 390)) {
        return this.windowHeight - 390;
      }

      return totalTableHeight + "px";
    },
  },

  methods: {
    /**
     * Update reactive Vue.js position data
     */
    async updatePositions() {
      var curPlaceID = this.generalStore.getCurrentObject('place');

      this.positions = await fromOfflineDB
        .getAllObjectsWithID(curPlaceID, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));
    },

    /**
     * @deprecated
     */
    async updatePositionsFull() {
      var curPlaceID = this.generalStore.getCurrentObject('place');

      var offlinePositions = await fromOfflineDB
        .getAllObjectsWithID(curPlaceID, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));

      // if user isn't logged in, just show the local stuff
      if (!this.userStore.authenticated) {
        console.log("Not logged in, so only show local positions")
        this.positions = offlinePositions;
        return;
      }

      const onlinePositions = await fromBackend
        .getDataWithParam('positions/place', curPlaceID)
        .catch(err => console.error(err));

      // if there are no offlinePositions, don't check for duplicates
      if (offlinePositions.length == 0) {
        console.log("No local positions, so only show online");
        onlinePositions.forEach(async (onPosition) => {
          await fromOfflineDB.addObject(onPosition, 'Positions', 'positions')
            .catch(err => console.error(err));
        });
        this.places = onlinePositions;
        return;
      }


      // if user is logged in and local + online Places exist, 
      // check for duplicates and which is newer
      // and combine all places to the array for display
      var newPositionsList = [];
      var sameIdFound = false;

      console.log("online and offline positions have to be combined")
      offlinePositions.forEach(async (offPosition) => {
        for (var i = 0; i < onlinePositions.length; i++) {

          if (offPosition._id == onlinePositions[i]._id) {
            sameIdFound = true;

            if (onlinePositions[i].lastChanged >= offPosition.lastChanged) {
              var tempPosition = onlinePositions[i];
              onlinePositions.splice(i, 1)
              newPositionsList.push(tempPosition);
              await fromOfflineDB.addObject(tempPosition, 'Positions', 'positions')
                .catch(err => console.error(err));
            } else {
              newPositionsList.push(offPosition);
            }
          }
        }

        if (!sameIdFound) {
          newPositionsList.push(offPosition);
        } else {
          sameIdFound = false;
        }
      });

      // add remaining online places to the whole list
      newPositionsList.concat(onlinePositions);
      this.positions = newPositionsList;
    },

    async updateModulePresets() {
      let curPresetID = this.$cookies.get('posModulesPreset');

      if (curPresetID) {
        this.curModulePreset = await fromOfflineDB
          .getObject(curPresetID, 'ModulePresets', 'positions')
          .catch(err => console.error(err));
        }
    },

    /**
     * Creates `count` duplicates of the selected Place
     * @param {Object} place 
     * @param {Int} count 
     */
     async duplicatePosition(positionID) {
      var newPositionID = await this.addPosition()
        .catch(err => console.error(err));
      
      var newPosition = await fromOfflineDB
        .getObject(newPositionID, 'Positions', 'positions')
        .catch(err => console.error(err));
      var dupPosition = await fromOfflineDB
        .getObject(positionID, 'Positions', 'positions')
        .catch(err => console.error(err));
      
      dupPosition._id = newPositionID;
      dupPosition.positionNumber = newPosition.positionNumber;
      dupPosition.images = [];
      dupPosition.models = [];
      dupPosition.lastChanged = Date.now();

      await fromOfflineDB.updateObject(dupPosition, 'Positions', 'positions')
        .catch(err => console.error(err));
      this.updatePositions();
    },

    /**
     * Handle a click to a row of the positionsTable.
     * Either moves to a Position or duplicates it, 
     * depending on if the duplicateSwitch is toggled or not.
     * 
     * @param {String} placeID 
     */
    handleRowClick(positionID) {
      if (this.toggleDuplicate) {
        this.duplicatePosition(positionID);
      } else {
        this.moveToPosition(positionID);
      }
    },

    /**
     * Routes to the PositionForm for the chosen positionID
     * 
     * @param {String} positionID 
     */
    moveToPosition(positionID) {
      if (positionID !== 'new') {
        this.generalStore.setCurrentObject(positionID, 'position');
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
    },

    /**
     * DUPLICATE FUNCTION FROM ADDPOSITION.VUE
     * TODO: REMOVE UND JUST USE THE EXISTING FUNCTION
     *       MAYBE OVER PROPS 
     *                --> CAN YOU CALL FUNCTIONS OVER PROPS???
     */
    async addPosition() {
      var curPlaceID = this.generalStore.getCurrentObject('place');
      var curPlace = await fromOfflineDB
        .getObject(curPlaceID, "Places", "places")
        .catch(err => console.error(err));
      var newPositionID = String(Date.now());

      curPlace.positions.push(newPositionID);
      curPlace.lastChanged = Date.now();

      const newPosition = {
        _id: newPositionID,
        placeID: curPlaceID,
        positionNumber: '',
        subNumber: '',
        right: '',
        up: '',
        height: '',
        count: '',
        weight: '',
        material: '',
        title: '',
        description: '',
        dating: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),
        hasSubNumber: false,
        isSeparate: false,

        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: 0
      };

      newPosition.modulePreset = toRaw(this.curModulePreset);

      if (this.positions.length == 0) {
        newPosition.positionNumber = 1;
      } else {
        var lastPosNumber = await fromOfflineDB.getLastAddedPosition()
          .catch(err => console.error(err));
        newPosition.positionNumber = lastPosNumber + 1;
      }
      
      await fromOfflineDB.updateObject(curPlace, 'Places', 'places')
        .catch(err => console.error(err));
      await fromOfflineDB.addObject(newPosition, "Positions", "positions")
        .catch(err => console.error(err));
      //await fromOfflineDB.addObject({ _id: newPositionID, object: 'positions' }, 'Changes', 'created');
      
      return newPositionID;
    },


    /**
     * Set the toggleAllInfo switch state depending on VueCookies
     */
    setShowAllInfoSwitch() {
      this.showAllInfo = this.generalStore.getShowAllPosInfo();
    },

    /**
     * Save the change toogle all info state to cookies
     */
    toggleAllInfo() {
      this.generalStore.toggleShowAllPosInfo(this.showAllInfo);
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
     * Furthermore get the currentTheme from Cookies and decide which colorattribute to use.
     *
     * @param {number} index The index of the row
     * @returns {Object} An object containing row style properties
     */
     getRowStyle(index) {
      var currentTheme = this.generalStore.getTheme();
      if (currentTheme !== 'fieldbook_light') {
        return {
          cursor: 'pointer',
          padding: '8px 16px',
          backgroundColor: this.hoveredRow === index ? '#2f3845' : 'transparent'
        }
      } 
      return {
        cursor: 'pointer',
        padding: '8px 16px',
        backgroundColor: this.hoveredRow === index ? '#F6F6F6' : 'transparent'
      }
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

    saveModulePresetToCookies() {
      this.$cookies.set('posModulesPreset', this.curModulePreset._id);
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

td {
  padding: 6px !important;
}

th {
  padding: 6px !important;
}
</style>