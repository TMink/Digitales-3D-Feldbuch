<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.10.2024 13:34:57
 * Modified By: Julian Hardtung
 * 
 * Description: lists all places
 -->

<template>
  <div id="wrapper">
    <Navigation ref="navigationRef" active_tab_prop="1" />

    <!--------------- TOOLBAR --------------->
    <v-row class="pt-2">
      <v-spacer></v-spacer>
      <v-card class="pa-4" :min-width="windowWidth * 0.55" variant="text">
        <v-row no-gutters class="align-center pa-2">

          <!-- SHOW ALL SWITCH-->
          <div class="d-flex justify-end">
            <v-switch class="px-3" v-model="showAllInfo" hide-details 
              :label="this.$t('showAll')" color="secondary">
            </v-switch>
          </div>

          <v-divider vertical class="ml-2 mr-6" />
          <!-- PLACES SEARCH -->
          <v-text-field v-model="searchQuery" append-icon="mdi-magnify" 
            :label="this.$t('search')" single-line
            hide-details color="primary">
          </v-text-field>
        </v-row>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

    <v-row>
      <v-spacer></v-spacer>
      <!--------------- PLACES TABLE SMALL --------------->
      <v-card class="pt-2" :min-width="windowWidth * 0.55">
        <v-data-table-virtual v-show="!showAllInfo" 
          fixed-header :headers="headers"
          :items="utils.filteredObjects(places, searchQuery, 'place')" 
          :height="utils.getTableHeight(places, windowHeight)"
          :sort-by="[{ key: 'placeNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">
              <!-- TOOLTIP -->
              <v-tooltip 
                activator="parent"
                location="bottom"
                v-if="generalStore.getShowTooltips()">
                {{ $t('editPhrase', {msg: $t('place')}) }}
              </v-tooltip>

              <!-- PLACE NUMBER -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-3">
                  {{ item.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <div v-if="item.placeNumber > 1">
                  <v-list-item-title v-if="item.title.length > 0" 
                    style="min-width:200px" class="text-wrap">
                    {{ item.title.join('; ') }}
                  </v-list-item-title>

                  <v-list-item-title v-if="item.title.length == 0" 
                    style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </div>

                <v-list-item-title v-if="item.placeNumber == 1" 
                  style="color:#C4A484;">
                  {{ $t('technical') }}
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title>
                  {{ item.date }}
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td>
                <v-btn icon variant="text" v-if="item.lastSync > 0">
                  <v-tooltip activator="parent" location="bottom">
                    {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon variant="text" v-else>
                  <v-tooltip activator="parent" location="bottom">
                    {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>

                <v-btn 
                  v-on:click="handleRowClick(item._id, false)"
                  style="margin-left: 3px;margin-top: 10px;margin-bottom: 10px;"  
                  color="secondary" variant="outlined">
                  <v-icon class="pr-2">mdi-arrow-right-bold</v-icon>
                  {{ $tc('position', 2) }}
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>

        <!--------------- PLACES LIST COMPLETE --------------->
        <v-data-table-virtual v-show="showAllInfo" 
          fixed-header :headers="fullHeaders"
          :items="utils.filteredObjects(places, searchQuery)" 
          :height="utils.getTableHeight(places, windowHeight)"
          :sort-by="[{ key: 'placeNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">

              <!-- PLACE NUMBER -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-3">
                  {{ item.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td v-on:click="handleRowClick(item._id, true)"
              :style="utils.getRowStyle(index, hoveredRow)">
                <div v-if="item.placeNumber > 1">
                  <v-list-item-title v-if="item.title.length > 0" class="text-wrap">
                    {{ item.title }}
                  </v-list-item-title>

                  <v-list-item-title style="color:dimgrey;" v-else>
                    -
                  </v-list-item-title>
                </div>
                <v-list-item-title v-if="item.placeNumber == 1" 
                  style="color:#C4A484;">
                  {{ $t('technical') }}
                </v-list-item-title>
              </td>

              <!-- NO FINDING -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-4" v-if="item.noFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- REST FINDING -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-4" v-if="item.restFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- COORDINATES COUNT -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.coordinates != ''">
                  {{ item.coordsCount + " " +  $t('coordinates')}} 
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- PLANE -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.plane != ''" 
                  class="text-wrap pl-3">
                  {{ item.plane || '-' }}
                </v-list-item-title>
                <v-list-item-title class="pl-3" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- VISIBILITY -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.visibility != null">
                  {{ $tc('visibilities', item.visibility) }}
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- DESCRIPTION -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="text-wrap">
                  {{ item.description }}
                </v-list-item-title>
                <v-list-item-title v-if="item.description == ''" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DATING -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title>
                  {{ item.dating || '-' }}
                </v-list-item-title>
              </td>

              <!-- EDITOR -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title v-if="item.editor != ''">
                  {{ item.editor || '-' }}
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td v-on:click="handleRowClick(item._id, true)"
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title>
                  {{ item.date || '-' }}
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td>
                <v-btn icon variant="text" v-if="item.lastSync > 0">
                  <v-tooltip activator="parent" location="bottom">
                    {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon variant="text" v-else>
                  <v-tooltip activator="parent" location="bottom">
                    {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>

                <v-btn 
                  v-on:click="handleRowClick(item._id, false)"
                  style="margin-left: 3px;margin-top: 10px;margin-bottom: 10px;" 
                  color="secondary"
                  variant="outlined">
                  <v-icon class="pr-2">mdi-arrow-right-bold</v-icon>
                  {{ $tc('position', 2) }}
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

    <!--------------- ADD BUTTON + DUPLICATE SWITCH --------------->
    <v-row class="align-center">
      <v-spacer></v-spacer>
      <AddButton v-on:click="addPlace()" prop_object="place" />

      <!-- DUPLICATE SWITCH -->
      <v-switch class="pl-5" v-model="toggleDuplicate" 
        hide-details color="secondary">
        <template v-slot:prepend>
          <v-icon color="warning">mdi-content-duplicate</v-icon>
        </template>
      </v-switch>

      <!-- Duplicate Snackbar - stays activated as long as switch value is true -->
      <v-snackbar color="warning" timeout="-1" 
        v-model="toggleDuplicate" 
        location="bottom">
        <v-row no-gutters>
          <v-icon start>mdi-content-duplicate</v-icon>
          <v-col>
            {{ $t('duplicationMode') }}
            <v-card-subtitle class="px-0">
              {{ $t('duplicationDescription', {msg: $t('place')}) }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-snackbar>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
/**
 * Methods overview:
 *  updatePlaces    - Updates existing presentation of places
 *  addPlace        - Adds a new place to the list
 *  moveToPlace     - Loads the view of the selected place
 */
import Navigation from '../components/Navigation.vue';
import AddButton from '../components/AddButton.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { fromBackend } from '../ConnectionToBackend.js'
import { useWindowSize } from 'vue-window-size';
import { useUserStore } from '../Authentication';
import { generalDataStore } from '../ConnectionToLocalStorage.js'
import { utils } from '../utils.js';


export default {
  name: 'PlacesOverview',
  components: {
    Navigation,
    AddButton,
  },
  
  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();
    const generalStore = generalDataStore();

    return {
      windowWidth: width,
      windowHeight: height,
      userStore,
      generalStore,
      utils
    };
  },

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      toggleDuplicate: false,
      places: [],
      searchQuery: '',
      showAllInfo: false,
      hoveredRow: -1,
      headers: [
        {
          title: this.$t('placeNumber'),
          align: 'start',
          key: 'placeNumber',
          width: "50px"
        },
        { title: this.$tc('title',2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), sortable: false, align: 'start', key: 'status', width: "220px"},
      ],
      fullHeaders: [
        {
          title: this.$t('placeNumber'),
          align: 'start',
          sortable: true,
          key: 'placeNumber',
          width: "25px"
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title', width: "250px" },
        { title: this.$t('noFind'), align: 'start', key: 'noFinding', width: "50px" },
        { title: this.$t('restFind'), align: 'start', key: 'restFinding', width: "50px" },
        { title: this.$t('coordinates'), align: 'start', key: 'coordinates', width: "50px" },
        { title: this.$t('plane'), align: 'start', key: 'plane', width: "150px" },
        { title: this.$t('visibility'), align: 'start', key: 'visibility', width: "100px" },
        { title: this.$t('description'), align: 'start', key: 'description', width: "150px" },
        { title: this.$tc('dating', 1), align: 'start', key: 'dating', width: "100px" },
        { title: this.$tc('editor', 1), align: 'start', key: 'editor', width: "100px" },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), sortable: false, align: 'start', key: 'status', width: "220px"},
      ],
    };
  },

  watch: {
    'showAllInfo': {
      handler: 'toggleAllInfo',
    }
  },

  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePlaces()
      .catch(err => console.error(err));
    this.setShowAllInfoSwitch();
    
    // Init first place as technical place
    if (this.places.length == 0) {
      this.addPlace();
    }
  },

  mounted() {
    this.$refs.navigationRef.onViewChange(this.$t('overview', { msg: this.$tc('place', 2) }))
  },

  methods: {

    /**
     * Get all places from IndexedDB
     */
    async updatePlaces() {
      var curActivityID = this.generalStore.getCurrentObject('activity');

      this.places = await fromOfflineDB
        .getAllObjectsWithID(curActivityID, 'Activity', 'Places', 'places')
        .catch(err => console.error(err));

        if (this.places.length > 0) {
          for (var i=0; i<this.places.length; i++) {
            if (this.places[i].coordinates != '') {
              var coordinates = await fromOfflineDB.getObject(this.places[i].coordinates, 'Coordinates', 'coordinates');
              
              this.places[i].coordsCount = coordinates.coords.length;
          }
        }
      }
    
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1);
    },

    /**
    * @deprecated
    */
    async updatePlacesFull() {
      var curActivityID = this.generalStore.get('activity');

      var offlinePlaces = await fromOfflineDB
        .getAllObjectsWithID(curActivityID, 'Activity', 'Places', 'places')
        .catch(err => console.error(err));
      offlinePlaces.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1);

      // if user isn't logged in, just show the local stuff
      if (!this.userStore.authenticated) {
        console.log("Not logged in, so only show local places")
        this.places = offlinePlaces;
        return;
      }

      const onlinePlaces = await fromBackend
        .getDataWithParam('places/activity', curActivityID)
        .catch(err => console.error(err));

      // if there are no offlinePlaces, don't check for duplicates
      if (offlinePlaces.length == 0) {
        console.log("No local places, so only show online");
        onlinePlaces.forEach(async (onPlace) => {
          await fromOfflineDB.addObject(onPlace, 'Places', 'places')
          .catch(err => console.error(err));
        });
        this.places = onlinePlaces;
        return;
      }


      // if user is logged in and local + online Places exist, 
      // check for duplicates and which is newer
      // and combine all places to the array for display
      var newPlacesList = [];
      var sameIdFound = false;

      console.log("online and offline places have to be combined")
      offlinePlaces.forEach(async (offPlace) => {
        for (var i = 0; i < onlinePlaces.length; i++) {

          if (offPlace._id == onlinePlaces[i]._id) {
            sameIdFound = true;

            if (onlinePlaces[i].lastChanged >= offPlace.lastChanged) {
              var tempPlace = onlinePlaces[i];
              onlinePlaces.splice(i, 1)
              newPlacesList.push(tempPlace);
              await fromOfflineDB.addObject(tempPlace, 'Places', 'places')
                .catch(err => console.error(err));
            } else {
              newPlacesList.push(offPlace);
            }
          }
        }

        if (!sameIdFound) {
          newPlacesList.push(offPlace);
        } else {
          sameIdFound = false;
        }
      });

      // add remaining online places to the whole list
      newPlacesList.concat(onlinePlaces);
      this.places = newPlacesList;
    },

    /**
     * Adds a new place to IndexedDB for the current activity
     */
    async addPlace() {
      const acID = this.generalStore.getCurrentObject('activity');
      var newPlaceID = String(Date.now());
      var activity = await fromOfflineDB
        .getObject(acID, 'Activities', 'activities')
        .catch(err => console.error(err));

      // add placeID to the activity array of all places
      activity.places.push(newPlaceID);

      // update lastChanged date of activity
      activity.lastChanged = Date.now();

      // new place data
      const newPlace = {
        _id: newPlaceID,
        activityID: acID,
        placeNumber: '',

        title: '',
        datCode: '',
        dating: '',
        noFinding: false,
        restFinding: false,
        plane: '',
        profile: '',
        visibility: null,
        drawing: '',
        description: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),
        technical: '',
        coordinates: '',

        positions: [],
        images: [],
        models: [],
        lines: [],
        annotations: [],
        modulePreset: {
          coordinates: true,
          dating: true,
          findTypes: true,
          plane: true,
          visibility: true,
          technical: false,
        },
        lastChanged: Date.now(),
        lastSync: 0
      }

      // set new placeNumber
      if (this.places.length == 0) {
        newPlace.placeNumber = 1;

        //set place to technical place if it is the 1. place
      } else {
        const placeNumbers = await fromOfflineDB
          .getPropertiesWithID(acID, 'place', 'placeNumber', 'Places', 'places')
          .catch(err => console.error(err));
        const newPlaceNumber = Math.max(...placeNumbers) + 1;
        newPlace.placeNumber = newPlaceNumber;
      }

      // update IndexedDB
      await fromOfflineDB.updateObject(activity, 'Activities', 'activities')
        .catch(err => console.error(err));
      await fromOfflineDB.addObject(newPlace, 'Places', 'places')
        .catch(err => console.error(err));
      //await fromOfflineDB.addObject({ _id: newPlaceID, object: 'places' }, 'Changes', 'created');
      await this.updatePlaces(newPlace._id)
        .catch(err => console.error(err));
      return newPlaceID;
    },

    /**
     * Creates `count` duplicates of the selected Place
     * @param {Object} place 
     * @param {Int} count 
     */
    async duplicatePlace(placeID) {
      var newPlaceID = await this.addPlace()
        .catch(err => console.error(err));
      var newPlace = await fromOfflineDB.getObject(newPlaceID, 'Places', 'places')
        .catch(err => console.error(err));
      var dupPlace = await fromOfflineDB.getObject(placeID, 'Places', 'places')
        .catch(err => console.error(err));
      
      dupPlace._id = newPlaceID;
      dupPlace.placeNumber = newPlace.placeNumber;
      dupPlace.positions = [];
      dupPlace.lastChanged = Date.now();

      await fromOfflineDB.updateObject(dupPlace, 'Places', 'places')
        .catch(err => console.error(err));
      this.updatePlaces();
    },

    /**
     * Handle a click to a row of the placesTable.
     * Either moves to a Place or duplicates it, 
     * depending on if the duplicateSwitch is toggled or not.
     * 
     * @param {String} placeID 
     */
    handleRowClick(placeID, isEdit) {
      if (isEdit) {
        this.openPlace(placeID);
      } else if (this.toggleDuplicate) {
        this.duplicatePlace(placeID);
      } else {
        this.openPositionsOverview(placeID);
      }
    },

    /**
     * Opens the place so all it's data fields can be filled
     * @param {String} placeID 
     */
    openPlace(placeID) {
      if (this.generalStore.getCurrentObject('place') !== placeID) {
        this.generalStore.setCurrentObject(null, "position");
      }
      
      this.generalStore.setCurrentObject(placeID, 'place');
      this.$router.push({ name: 'PlaceCreation', params: { placeID: placeID } })
    },

    /**
     * Opens the positionsOverview of the clicked place
     * @param placeID 
     */
    openPositionsOverview(placeID) {
      if (this.generalStore.getCurrentObject('place') !== placeID) {
        this.generalStore.setCurrentObject(null, "position");
      }
      
      this.generalStore.setCurrentObject(placeID, 'place');
      this.$router.push({ name: 'PositionsOverview'})
    },

    /**
     * Set the toggleAllInfo switch state depending on localStorage
     */
    async setShowAllInfoSwitch() {
      this.showAllInfo = this.generalStore.getShowAllPlaceInfo();
    },

    /**
     * Save the change toggle all info state to localStorage
     */
    toggleAllInfo() {
      this.generalStore.toggleShowAllPlaceInfo(this.showAllInfo);
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

.align-right {
  text-align: right;
}

td {
  padding: 6px !important;
}

th {
  padding: 6px !important;
}
</style>