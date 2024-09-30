<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 27.09.2024 17:42:37
 * Modified By: Julian Hardtung
 * 
 * Description: lists all places
 -->

<template>
  <div id="wrapper">
    <Navigation ref="navigationRef" active_tab_prop="1" />
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

      <!-- PLACES TABLE SMALL -->
      <v-card class="pt-2" :min-width="windowWidth * 0.65">
        <v-data-table-virtual v-show="!showAllInfo" 
          fixed-header 
          :items="filteredPlaces" 
          :height="getTableHeight"
          :headers="headers"
          :sort-by="[{ key: 'placeNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">
              <!-- PLACE NUMBER -->
              <td v-on:click="handleRowClick(item._id, false)" :style="getRowStyle(index)">
                <v-list-item-title class="pl-4">
                  {{ item.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td v-on:click="handleRowClick(item._id, false)" :style="getRowStyle(index)">
                <div v-if="item.placeNumber > 1">
                  <v-list-item-title v-if="item.title.length > 0" 
                    style="min-width:200px" class="text-wrap">
                    {{ item.title }}
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
              <td v-on:click="handleRowClick(item._id, false)" :style="getRowStyle(index)">
                <v-list-item-title>
                  {{ item.date || '-' }}
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td v-on:click="handleRowClick(item._id, false)" :style="getRowStyle(index)">
                <v-list-item>
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
                </v-list-item>
              </td>

              <td v-on:click="handleRowClick(item._id, true)" 
                style="cursor:default">
                <v-btn 
                  class="ma-2" 
                  color="primary" >
                  <v-icon class="pr-2">mdi-pencil</v-icon>
                  {{ $t('edit') }}
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>

        <!-- PLACES LIST COMPLETE -->
        <v-data-table-virtual fixed-header v-show="showAllInfo" 
          :items="filteredPlaces" :height="getTableHeight"
          :headers="fullHeaders"
          :sort-by="[{ key: 'placeNumber', order: 'desc' }]">

          <template v-slot:item="{ item, index }">
            <tr v-on:click="handleRowClick(item._id, false)" 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">

              <!-- PLACE NUMBER -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4">
                  {{ item.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td class="py-2" :style="getRowStyle(index)">
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
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4" v-if="item.noFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- REST FINDING -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4" v-if="item.restFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- COORDINATES COUNT -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.coordinates != ''">
                  {{ item.coordsCount + " " +  $t('coordinates')}} 
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- PLANE -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.plane != ''" 
                  class="text-wrap pl-3">
                  {{ item.plane || '-' }}
                </v-list-item-title>
                <v-list-item-title class="pl-3" style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- VISIBILITY -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.visibility != null">
                  {{ $tc('visibilities', item.visibility) }}
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- DESCRIPTION -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="text-wrap">
                  {{ item.description }}
                </v-list-item-title>
                <v-list-item-title v-if="item.description == ''" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- EDITOR -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.editor != ''">
                  {{ item.editor || '-' }}
                </v-list-item-title>
                <v-list-item-title style="color:dimgrey;" v-else>
                  -
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td :style="getRowStyle(index)">
                <v-list-item-title>
                  {{ item.date || '-' }}
                </v-list-item-title>
              </td>

              <!-- SYNC STATUS -->
              <td :style="getRowStyle(index)">
                <v-list-item>
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
                </v-list-item>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

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
      generalStore
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
          sortable: true,
          key: 'placeNumber',
          width: "50px"
        },
        { title: this.$tc('title',2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "100px"},
        { title: '', sortable: false, key: 'actions', width: "100px"}
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
        { title: this.$tc('editor', 1), align: 'start', key: 'editor', width: "100px" },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "50px"}
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

  computed: {
    /**
     * Returns an array of filtered places based on the search query.
     *
     * @returns {Array} The filtered array of places that match the search query.
     * If the search query is empty or invalid, it returns all places.
     */
    filteredPlaces() {
      // split searchQuery to query array and escape special characters
      const queries = this.searchQuery.trim().toLowerCase().split(/\s+/).map(this.escapeRegExp);
      
      if (this.places.length == 0) {
        console.log("just return")
        return;
      }
      
      // if no queries are present, return all places
      if (queries.length === 0 || (queries.length === 1 && queries[0] === '')) {
        return this.places;
      } else {
        // filter places by all query filters
        // (places have to fulfill every query filter)
        return this.places.filter(item => {
          return queries.every(query => {
            return this.doesItemMatchQuery(item, query);
          });
        });
      }
    },

    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.places.length > 0 ? this.places.length : 1;
      const headerHeight = 56;
      const rowHeight = 69;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 390)) {
        return this.windowHeight - 390;
      }

      return totalTableHeight + "px";
    }
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
    handleRowClick(placeID, edit) {
      if (edit) {
        this.moveToPlace(placeID);
      } else if (this.toggleDuplicate) {
        this.duplicatePlace(placeID);
      } else {
        this.setPlace(placeID);
      }
    },

    /**
     * Routes to the place form of `placeID`
     * @param {String} placeID 
     */
    moveToPlace(placeID) {
      if (this.generalStore.getCurrentObject('place') !== placeID) {
        this.generalStore.setCurrentObject(null, "position");
      }
      
      this.generalStore.setCurrentObject(placeID, 'place');
      this.$router.push({ name: 'PlaceCreation', params: { placeID: placeID } })
    },

    setPlace(placeID) {
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
        item.placeNumber.toString().match(re) ||
        item.title.match(re) ||
        item.description.match(re) ||
        item.editor.match(re) ||
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
      var currentTheme = this.generalStore.getTheme()
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