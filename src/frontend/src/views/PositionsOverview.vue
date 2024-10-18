<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 18.10.2024 14:35:28
 * Modified By: Julian Hardtung
 * 
 * Description: lists all positions
 -->

<template>
  <div id="wrapper">
    <Navigation ref="navigationRef" active_tab_prop="2" />

    <!--------------- TOOLBAR --------------->
    <v-row class="pt-2">
      <v-spacer></v-spacer>
      <v-card class="pa-4" :min-width="windowWidth * 0.55" variant="text">
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

    <v-row>
      <v-spacer></v-spacer>

      <!-- POSITIONS LIST -->
      <v-card class="pt-2" :min-width="windowWidth * 0.6">
        <v-data-table-virtual
          v-show="!showAllInfo"
          :items="utils.filteredObjects(positions, searchQuery, 'position')"
          fixed-header
          :height="utils.getTableHeight(positions, windowHeight)"
          :headers="headers"
          :sort-by="[{ key: 'positionNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr v-on:click="handleRowClick(item._id)"
                @mouseenter="setHoveredRow(index, true)"
                @mouseleave="setHoveredRow(index, false)">

              <!-- POSITION NUMBER -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-4">
                  {{ item.positionNumber }}
                </v-list-item-title>
              </td>

              <!-- SUB NUMBER -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.subNumber.length != 0">
                  {{ item.subNumber }}
                </v-list-item-title>
                <v-list-item-title v-if="item.subNumber.length == 0" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.title.length > 0"
                  style="min-width:200px" class="text-wrap">
                  {{ item.title.join('; ') }}
                </v-list-item-title>
                <v-list-item-title v-if="item.title.length == 0" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title>
                  {{ item.date }}
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td>
                <v-btn icon variant="text" v-if="item.lastSync > 0"
                  class="my-1">
                    <v-tooltip 
                      activator="parent"
                      location="bottom">
                      {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
                    </v-tooltip>
                    <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon variant="text" class="my-1" v-else>
                  <v-tooltip 
                    activator="parent"
                    location="bottom">
                      {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>

                <!-- BODEON CONFORM -->
                <v-btn icon color="success" variant="text" v-if="isBodeonValid(item)">
                  <v-tooltip activator="parent" location="bottom">
                     {{ $t('fulfillsBodeonRequirements') }}
                  </v-tooltip>
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
                <v-btn color="primary" icon variant="text" v-else>
                  <v-tooltip activator="parent" location="bottom">
                     {{ $t('mandatoryFieldNotFilled') }}
                  </v-tooltip>
                  <v-icon>mdi-alert-circle</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>

        <!-- POSITIONS LIST COMPLETE -->
        <v-data-table-virtual
          fixed-header
          v-show="showAllInfo"
          :items="utils.filteredObjects(positions, searchQuery, 'position')" 
          :height="utils.getTableHeight(positions, windowHeight)"
          :headers="fullHeaders"
          :sort-by="[{ key: 'positionNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr v-on:click="handleRowClick(item._id)" 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">

              <!-- PLACE NUMBER -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-4">
                  {{ item.positionNumber }}
                </v-list-item-title>
              </td>

              <!-- SUB NUMBER -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.subNumber.length != 0">
                  {{ item.subNumber }}
                </v-list-item-title>
                <v-list-item-title v-if="item.subNumber.length == 0" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td class="py-2" :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title
                  v-if="item.title.length > 0"
                  style="min-width:200px" 
                  class="text-wrap">
                  {{ item.title.join('; ') }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.title.length == 0" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DATING -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.dating">
                  {{ item.dating }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="!item.dating" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- COORDINATES COUNT -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.coordinates != ''">
                  {{ item.coordsCount + " " +  $t('coordinates') }} 
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- PLANE -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.count != ''" class="text-wrap">
                  {{ item.count || '-' }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.count == ''" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- WEIGHT -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.weight != ''" class="text-wrap">
                  {{ item.weight || '-' }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.weight == ''" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- MATERIAL -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.material != ''" class="text-wrap">
                  {{ item.material || '-' }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.material == ''" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- COMMENT -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="text-wrap" style="max-width:200px">
                  {{ item.comment }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.comment == ''" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- EDITOR -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title
                  v-if="item.editor != ''">
                  {{ item.editor }}
                </v-list-item-title>
                <v-list-item-title 
                  v-if="item.editor == ''" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title>
                  {{ item.date}}
                </v-list-item-title>
              </td>

              <!-- IS SEPARATE -->
              <td :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title 
                  v-if="item.isSeparate">
                  &cross;
                </v-list-item-title>
                <v-list-item-title 
                  v-if="!item.isSeparate" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td>
                <v-btn icon variant="text" v-if="item.lastSync > 0" class="my-1">
                  <v-tooltip activator="parent" location="bottom">
                    {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon variant="text" v-else class="my-1">
                  <v-tooltip 
                    activator="parent"
                    location="bottom">
                      {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>

                <!-- BODEON CONFORM -->
                <v-btn icon color="success" variant="text" v-if="isBodeonValid(item)">
                  <v-tooltip activator="parent" location="bottom">
                     {{ $t('fulfillsBodeonRequirements') }}
                  </v-tooltip>
                  <v-icon>mdi-check-circle</v-icon>
                </v-btn>
                <v-btn color="primary" icon variant="text" v-else>
                  <v-tooltip activator="parent" location="bottom">
                     {{ $t('mandatoryFieldNotFilled') }}
                  </v-tooltip>
                  <v-icon>mdi-alert-circle</v-icon>
                </v-btn>
              </td>
              <v-divider></v-divider>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

    <!--------------- ADD BUTTON + DUPLICATE SWITCH --------------->
    <v-row class="align-center">
      <v-spacer></v-spacer>
      <AddButton @click="addPosition()"/>

      <!-- DUPLICATE SWITCH -->
      <v-switch class="pl-5" hide-details 
        v-model="toggleDuplicate" color="secondary">
        <template v-slot:prepend>
          <v-icon color="warning">mdi-content-duplicate</v-icon>
        </template>
      </v-switch>

      <!-- Duplicate Snackbar - stays activated as long as switch value is true -->
      <v-snackbar color="warning" timeout="-1" 
        v-model="toggleDuplicate" location="bottom">
        <v-row no-gutters>
          <v-icon start>mdi-content-duplicate</v-icon>
          <v-col>
            {{ $t('duplicationMode') }}
            <v-card-subtitle class="px-0">
              {{ $t('duplicationDescription', {msg: $t('position')}) }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-snackbar>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import Navigation from '../components/Navigation.vue';
import AddButton from '../components/AddButton.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { fromBackend } from '../ConnectionToBackend.js'
import { useWindowSize } from 'vue-window-size';
import { useUserStore } from '../Authentication';
import { utils } from '../utils.js';

export default {
  name: 'PositionsOverview',
  components: {
    Navigation,
    AddButton,
  },
  
  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();
    return {
      windowWidth: width,
      windowHeight: height,
      userStore,
      utils
    };
  },

  watch: {
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
        { title: this.$t('syncStatus'), sortable: false, align: 'start', key: 'status', width: "110px"}
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
        { title: this.$t('coordinates'), align: 'start', key: 'coordinates' },
        { title: this.$t('count'), align: 'start', key: 'count' },
        { title: this.$t('weight'), align: 'start', key: 'weight' },
        { title: this.$t('material'), align: 'start', key: 'material' },
        { title: this.$t('comment'), align: 'start', key: 'comment' },
        { title: this.$tc('editor', 1), align: 'start', key: 'editor' },
        { title: this.$t('date'), align: 'start', key: 'date' },
        { title: this.$t('isSeparate'), align: 'start', key: 'isSeparate' },
        { title: this.$t('syncStatus'), sortable: false, align: 'start', key: 'status'}
      ],
      toggleDuplicate: false,
    };
  },

  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePositions()
      .catch(err => console.error(err));
    this.setShowAllInfoSwitch();
  },

  mounted() {
    this.$refs.navigationRef.onViewChange(this.$tc('overview',1, { msg: this.$tc('position', 2)}))
  },

  methods: {
    /**
     * Update reactive Vue.js position data
     */
    async updatePositions() {
      var curPlaceID = this.$generalStore.getCurrentObject('place');

      this.positions = await fromOfflineDB
        .getAllObjectsWithID(curPlaceID, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));

      if (this.positions.length > 0) {
        for (var i=0; i<this.positions.length; i++) {
          if (this.positions[i].coordinates != '') {
            var coordinates = await fromOfflineDB.getObject(this.positions[i].coordinates, 'Coordinates', 'coordinates');
              
            this.positions[i].coordsCount = coordinates.coords.length;
          }
        }
      }


    },

    /**
     * Fully upgrades the position with online + offline data
     */
    async updatePositionsFull() {
      var curPlaceID = this.$generalStore.getCurrentObject('place');

      var offlinePositions = await fromOfflineDB
        .getAllObjectsWithID(curPlaceID, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));

      // if user isn't logged in, just show the local stuff
      if (!this.userStore.authenticated) {
        this.positions = offlinePositions;
        return;
      }

      const onlinePositions = await fromBackend
        .getDataWithParam('positions/place', curPlaceID)
        .catch(err => console.error(err));

      // if there are no offlinePositions, don't check for duplicates
      if (offlinePositions.length == 0) {
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
        this.openPosition(positionID);
      }
    },

    /**
     * Routes to the PositionForm for the chosen positionID
     * 
     * @param {String} positionID 
     */
    openPosition(positionID) {
      if (positionID !== 'new') {
        this.$generalStore.setCurrentObject(positionID, 'position');
      }

      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } })
    },

    /**
     * Adds a new position with default data to the system
     */
    async addPosition() {
      var curPlaceID = this.$generalStore.getCurrentObject('place');
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
        coordinates: '',
        count: 0,
        weight: 0,
        material: '',
        title: [],
        comment: '',
        datCode: '',
        dating: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),
        hasSubNumber: false,
        isSeparate: false,
        
        images: [],
        models: [],
        modulePreset: {
          coordinates: true,
          dating: true,
          comment: true,
          objectDescribers: true,
          technical: false,
        },
        lastChanged: Date.now(),
        lastSync: 0
      };

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
    
      this.updatePositions();
    },

    /**
     * Set the toggleAllInfo switch state depending on VueCookies
     */
    setShowAllInfoSwitch() {
      this.showAllInfo = this.$generalStore.getShowAllPosInfo();
    },

    /**
     * Save the change toogle all info state to cookies
     */
    toggleAllInfo() {
      this.$generalStore.toggleShowAllPosInfo(this.showAllInfo);
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

    /**
     * Checks if data of a position is valid for potential BODEON import
     * (are all mandatory fields properly filled?)
     * @param position 
     */
    isBodeonValid(position) {
      if (position.title.length != 0 && position.dating != '') {
        return true;
      }
      return false;
    },
  }
}
</script>

<style scoped>
td {
  padding: 6px !important;
}

th {
  padding: 6px !important;
}
</style>