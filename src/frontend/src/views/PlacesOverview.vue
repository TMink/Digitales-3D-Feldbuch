<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 24.03.2024 19:42:48
 * Modified By: Julian Hardtung
 * 
 * Description: lists all places
 -->

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="1" />
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
          :sort-by="[{ key: 'placeNumber', order: 'asc' }]">

          <template v-slot:item="{ item, index }">
            <tr v-on:click="handleRowClick(item.raw._id)" 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">
              <!-- PLACE NUMBER -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4">
                  {{ item.raw.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td :style="getRowStyle(index)">
                <div v-if="item.raw.placeNumber > 1">
                  <v-list-item-title v-if="item.raw.title.length > 0" 
                    style="min-width:200px" class="text-wrap">
                    {{ item.raw.title }}
                  </v-list-item-title>

                  <v-list-item-title v-if="item.raw.title.length == 0" 
                    style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </div>

                <v-list-item-title v-if="item.raw.placeNumber == 1" 
                  style="color:#C4A484;">
                  {{ $t('technical') }}
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
                  <v-btn icon variant="text" v-if="item.raw.lastSync > 0">
                    <v-tooltip activator="parent" location="bottom">
                      {{ this.$t('lastSync') + new Date(item.raw.lastSync).toLocaleString() }}
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

        <!-- PLACES LIST COMPLETE -->
        <v-data-table-virtual fixed-header v-show="showAllInfo" 
          :items="filteredPlaces" :height="getTableHeight"
          :headers="fullHeaders">

          <template v-slot:item="{ item, index }">
            <tr v-on:click="handleRowClick(item.raw._id)" 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">

              <!-- PLACE NUMBER -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4">
                  {{ item.raw.placeNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td class="py-2" :style="getRowStyle(index)">
                <div v-if="item.raw.placeNumber > 1">
                  <v-list-item-title v-if="item.raw.title.length > 0" 
                    style="min-width:200px" class="text-wrap">
                    {{ item.raw.title }}
                  </v-list-item-title>

                  <v-list-item-title v-if="item.raw.title.length == 0" 
                    style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </div>
                <v-list-item-title v-if="item.raw.placeNumber == 1" 
                  style="color:#C4A484;">
                  {{ $t('technical') }}
                </v-list-item-title>
              </td>

              <!-- NO FINDING -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4" v-if="item.raw.noFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" v-if="!item.raw.noFinding" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- REST FINDING -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="pl-4" v-if="item.raw.restFinding">
                  &cross;
                </v-list-item-title>

                <v-list-item-title class="pl-4" v-if="!item.raw.restFinding" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- RIGHT VALUES -->
              <td :style="getRowStyle(index)" class="align-right">
                <v-list-item-title v-if="item.raw.right">
                  {{ item.raw.right}}
                </v-list-item-title>

                <v-list-item-title v-if="item.raw.rightTo">
                  <span style="color:dimgrey">
                    {{ $t('to') }}
                  </span>
                  {{ item.raw.rightTo}}
                </v-list-item-title>

                <v-list-item-title v-if="!item.raw.right" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
                <v-list-item-title v-if="!item.raw.rightTo" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- UP VALUES -->
              <td :style="getRowStyle(index)" class="align-right">
                <div v-if="item.raw.up">
                  <v-list-item-title>
                    {{ item.raw.up}}
                  </v-list-item-title>
                  <v-list-item-title>
                    <span style="color:dimgrey; text-align: left;">
                      {{ $t('to') }}
                    </span>
                    {{ item.raw.upTo || '-' }}
                  </v-list-item-title>
                </div>

                <div v-if="!item.raw.upTo" style="color:dimgrey;">
                  <v-list-item-title>
                    -
                  </v-list-item-title>
                  <v-list-item-title>
                    -
                  </v-list-item-title>
                </div>
              </td>

              <!-- DEPTH -->
              <td :style="getRowStyle(index)" class="align-right">
                <v-list-item-title v-if="item.raw.depthTop">
                  {{ item.raw.depthTop }}
                  <span style="color:dimgrey">
                    &#x25B2;
                  </span>
                </v-list-item-title>
                <v-list-item-title v-if="item.raw.depthBot">
                  {{ item.raw.depthBot }}
                  <span style="color:dimgrey">
                    &#x25BC;
                  </span>
                </v-list-item-title>

                <v-list-item-title v-if="!item.raw.depthTop" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
                <v-list-item-title v-if="!item.raw.depthBot" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- PLANE -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.raw.plane != ''" 
                  class="text-wrap pl-3">
                  {{ item.raw.plane || '-' }}
                </v-list-item-title>
                <v-list-item-title class="pl-3" v-if="item.raw.plane == ''" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- VISIBILITY -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.raw.visibility != null">
                  {{ $tc('visibilities', item.raw.visibility) }}
                </v-list-item-title>
                <v-list-item-title v-if="item.raw.visibility == null" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DESCRIPTION -->
              <td :style="getRowStyle(index)">
                <v-list-item-title class="text-wrap" style="min-width:200px">
                  {{ item.raw.description }}
                </v-list-item-title>
                <v-list-item-title v-if="item.raw.description == ''" 
                  style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- EDITOR -->
              <td :style="getRowStyle(index)">
                <v-list-item-title v-if="item.raw.editor != ''">
                  {{ item.raw.editor || '-' }}
                </v-list-item-title>
                <v-list-item-title v-if="item.raw.editor == ''" 
                  style="color:dimgrey;">
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
                  <v-btn icon variant="text" v-if="item.raw.lastSync > 0">
                    <v-tooltip activator="parent" location="bottom">
                      {{ this.$t('lastSync') + new Date(item.raw.lastSync).toLocaleString() }}
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
        <v-icon start>mdi-content-duplicate</v-icon>
        {{ $t('duplicationMode') }}
      </v-snackbar>
    </v-row>
  </div>
  <!-- <ModuleCreator v-model="moduleCreatorOverlay" objectTypeProp="places" 
    @updateModulePresets="updateModulePresets()" /> -->
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
import ModuleCreator from '../components/ModuleCreator.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { fromBackend } from '../ConnectionToBackend.js'
import { useWindowSize } from 'vue-window-size';
import { toRaw } from 'vue';
import { useUserStore } from '../Authentication';


export default {
  name: 'PlacesOverview',
  components: {
    Navigation,
    AddButton,
    ModuleCreator
  },
  emits: ['view'],
  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();

    return {
      windowWidth: width,
      windowHeight: height,
      userStore,
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
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "100px"}
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
        { title: this.$t('right'), align: 'end', key: 'right', width: "50px" },
        { title: this.$t('up'), align: 'end', key: 'up', width: "50px" },
        { title: this.$t('depth'), align: 'end', key: 'depthBot', width: "50px" },
        { title: this.$t('plane'), align: 'start', key: 'plane', width: "150px" },
        { title: this.$t('visibility'), align: 'start', key: 'visibility', width: "50px" },
        { title: this.$t('description'), align: 'start', key: 'description', width: "150px" },
        { title: this.$tc('editor', 1), align: 'start', key: 'editor', width: "50px" },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
        { title: this.$t('syncStatus'), align: 'start', key: 'status', width: "100px"}
      ],
      /* curModulePreset: {
        title: '-',
      },
      moduleCreatorOverlay: false, */
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
    this.$emit("view", this.$t('overview', { msg: this.$tc('place', 2) }));
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePlaces()
      .catch(err => console.error(err));
    await this.updateModulePresets()
      .catch(err => console.error(err));
    this.setShowAllInfoSwitch();
    
    // Init first place as technical place
    if (this.places.length == 0) {
      this.addPlace();
    }
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
      var curActivityID = this.$generalStore.getCurrentObject('activity');

      this.places = await fromOfflineDB
        .getAllObjectsWithID(curActivityID, 'Activity', 'Places', 'places')
        .catch(err => console.error(err));
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1);
    },

    /**
    * @deprecated
    */
    async updatePlacesFull() {
      var curActivityID = this.$generalStore.get('activity');

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
     * Get all ModulePresets from IndexedDB
     */
    async updateModulePresets() {
      let presetID = this.$generalStore.getModulesPreset('place');

      if (presetID.length > 0) {
        this.curModulePreset = await fromOfflineDB
          .getObject(presetID, 'ModulePresets', 'places')
          .catch(err => console.error(err));
        }
    },

    /**
     * Adds a new place to IndexedDB for the current activity
     */
    async addPlace() {
      const acID = this.$generalStore.getCurrentObject('activity');
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
        dating: '',
        noFinding: false,
        restFinding: false,
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        depthTop: '',
        depthBot: '',
        plane: '',
        profile: '',
        visibility: null,
        drawing: '',
        description: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),
        technical: '',

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
        /* newPlace.modulePreset = await fromOfflineDB
          .getFirstEntry('ModulePresets', 'places')
          .catch(err => console.error(err)); */
      } else {
        const placeNumbers = await fromOfflineDB
          .getPropertiesWithID(acID, 'place', 'placeNumber', 'Places', 'places')
          .catch(err => console.error(err));
        const newPlaceNumber = Math.max(...placeNumbers) + 1;
        newPlace.placeNumber = newPlaceNumber;
        /* newPlace.modulePreset = toRaw(this.curModulePreset); */
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
    handleRowClick(placeID) {
      if (this.toggleDuplicate) {
        this.duplicatePlace(placeID);
      } else {
        this.moveToPlace(placeID);
      }
    },

    /**
     * Opens the module presets overlay
     */
    /* openPresetOverlay() {
      this.moduleCreatorOverlay = true;
    }, */

    /**
     * Routes to the place form of `placeID`
     * @param {String} placeID 
     */
    moveToPlace(placeID) {
      if (placeID !== 'new') {
        this.$generalStore.setCurrentObject(placeID, 'place');
      }
      this.$router.push({ name: 'PlaceCreation', params: { placeID: placeID } })
    },

    /**
     * Set the toggleAllInfo switch state depending on localStorage
     */
    async setShowAllInfoSwitch() {
      this.showAllInfo = this.$generalStore.getShowAllPlaceInfo();
    },

    /**
     * Save the change toggle all info state to localStorage
     */
    toggleAllInfo() {
      this.$generalStore.toggleShowAllPlaceInfo(this.showAllInfo);
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
        item.right.toString().match(re) ||
        item.rightTo.toString().match(re) ||
        item.up.match(re) ||
        item.upTo.match(re) ||
        item.depthBot.match(re) ||
        item.depthTop.match(re) ||
/*         item.visibility.match(re) ||*/
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
      var currentTheme = this.$generalStore.getTheme()
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