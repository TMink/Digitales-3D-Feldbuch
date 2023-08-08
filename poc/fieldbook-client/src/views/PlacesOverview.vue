<template>
  <div id="wrapper">
    <Navigation active_tab_prop="1" />
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
        
        <!-- PLACES TABLE SMALL -->
        <v-card 
          class="pa-3"
          :min-width="windowWidth * 0.7">
          <v-data-table-virtual 
            v-show="!showAllInfo"
            :items="filteredPlaces"
            fixed-header
            :height="getTableHeight"
            :headers="headers">

            <template v-slot:item="{ item, index }">
              <tr 
                v-on:click="moveToPlace(item.raw.id)"
                @mouseenter="setHoveredRow(index, true)"
                @mouseleave="setHoveredRow(index, false)"
                >
                <!-- PLACE NUMBER -->
                <td class="py-6" :style="getRowStyle(index)">
                  <v-list-item-title>
                    {{ item.raw.placeNumber }}
                  </v-list-item-title>
                </td>

                <!-- TITLE -->
                  <td class="py-2" :style="getRowStyle(index)">
                    <v-list-item-title
                      v-if="item.raw.title.length > 0"
                      style="min-width:200px" 
                      class="text-wrap">
                      {{ item.raw.title.join("; ") }}
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
                 
          <!-- PLACES LIST COMPLETE -->
          <v-data-table-virtual
            fixed-header
            v-show="showAllInfo"
            :items="filteredPlaces" 
            :height="getTableHeight"
            :headers="fullHeaders">

            <template v-slot:item="{ item, index }">
              <tr v-on:click="moveToPlace(item.raw.id)" 
                @mouseenter="setHoveredRow(index, true)"
                @mouseleave="setHoveredRow(index, false)">

                <!-- PLACE NUMBER -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title>
                    {{ item.raw.placeNumber }}
                  </v-list-item-title>
                </td>

                <!-- TITLE -->
                <td class="py-2" :style="getRowStyle(index)">
                  <v-list-item-title
                    v-if="item.raw.title.length > 0"
                    style="min-width:200px" 
                    class="text-wrap">
                    {{ item.raw.title.join("; ") }}
                  </v-list-item-title>

                  <v-list-item-title 
                    v-if="item.raw.title.length == 0" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>

                <!-- NO FINDING -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title 
                    v-if="item.raw.noFinding">
                    &cross;
                  </v-list-item-title>

                  <v-list-item-title 
                    v-if="!item.raw.noFinding" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>
                
                <!-- REST FINDING -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title 
                    v-if="item.raw.restFinding">
                    &cross;
                  </v-list-item-title>

                  <v-list-item-title 
                    v-if="!item.raw.restFinding" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>

                <!-- RIGHT VALUES -->
                <td :style="getRowStyle(index)" class="align-right">
                  <v-list-item-title 
                    v-if="item.raw.right">
                    {{ item.raw.right}}
                  </v-list-item-title>

                  <v-list-item-title 
                    v-if="item.raw.rightTo">
                    <span style="color:dimgrey">
                      {{ $t('to') }}
                    </span>
                    {{ item.raw.rightTo}}
                  </v-list-item-title>

                  <v-list-item-title 
                    v-if="!item.raw.right" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                  <v-list-item-title 
                    v-if="!item.raw.rightTo" style="color:dimgrey;">
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

                  <div 
                    v-if="!item.raw.upTo"
                    style="color:dimgrey;">
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
                  <v-list-item-title 
                    v-if="item.raw.depthTop">
                    {{ item.raw.depthTop }}
                    <span style="color:dimgrey">
                      &#x25B2;
                    </span>
                  </v-list-item-title>
                  <v-list-item-title 
                    v-if="item.raw.depthBot">
                    {{ item.raw.depthBot }}
                    <span style="color:dimgrey">
                      &#x25BC;
                    </span>
                  </v-list-item-title>

                  <v-list-item-title 
                  v-if="!item.raw.depthTop" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                  <v-list-item-title 
                  v-if="!item.raw.depthBot" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>

                <!-- PLANE -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title 
                    v-if="item.raw.plane != ''" class="text-wrap">
                    {{ item.raw.plane || '-' }}
                  </v-list-item-title>
                  <v-list-item-title 
                    v-if="item.raw.plane == ''" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>

                <!-- VISIBILITY -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title 
                    v-if="item.raw.visibility != ''">
                    {{ $tc('visibilities', item.raw.visibility) }}
                  </v-list-item-title>
                  <v-list-item-title 
                    v-if="item.raw.visibility == ''" style="color:dimgrey;">
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
                    {{ item.raw.editor || '-' }}
                  </v-list-item-title>
                  <v-list-item-title 
                    v-if="item.raw.editor == ''" style="color:dimgrey;">
                    -
                  </v-list-item-title>
                </td>

                <!-- DATE -->
                <td :style="getRowStyle(index)">
                  <v-list-item-title>
                    {{ item.raw.date || '-' }}
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
    <v-row class="align-center">
      <v-spacer></v-spacer>
      <AddButton v-on:click="addPlace()"/>
      <v-combobox 
        hide-details 
        v-model="curModulePreset"
        label="Module Presets" 
        :items="modulePresets">
      </v-combobox>
      <v-btn @click="moduleCreatorOverlay = !moduleCreatorOverlay">
        new preset
      </v-btn>
      <v-spacer></v-spacer>
    </v-row>
  </div>
  <ModuleCreator 
    v-model="moduleCreatorOverlay" 
    objectTypeProp="places"
    @updateModulePresets="updateModulePresets()"/>
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
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { useWindowSize } from 'vue-window-size';
import { toRaw } from 'vue';

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
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },

  watch: {
    'curModulePreset': {
      handler: 'saveModulePresetToCookies',
      deep: true,
    }
  },

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
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
        { title: this.$t('editor'), align: 'start', key: 'editor', width: "50px" },
        { title: this.$t('date'), align: 'start', key: 'date', width: "100px" },
      ],
      modulePresets: [],
      curModulePreset: null,
      moduleCreatorOverlay: false,
    };
  },
  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    this.$emit("view", this.$t('overview', { msg: this.$tc('place', 2) }));
    await fromOfflineDB.syncLocalDBs();
    await this.updatePlaces();
    await this.updateModulePresets();
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
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 390)) {
        return this.windowHeight - 390;
      }

      return totalTableHeight + "px";
    }
  },

  methods: {
    /**
     * Get all places from IndexedDb
     */
    async updatePlaces() {
      var curActivityID = String(VueCookies.get('currentActivity'));

      this.places = await fromOfflineDB.getAllObjectsWithID(
        curActivityID, 'Activity', 'Places', 'places');
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1);
    },

    async updateModulePresets() {
      this.modulePresets = await fromOfflineDB.getAllObjects('ModulePresets', 'places');
      this.curModulePreset = await fromOfflineDB.getObject(
          String(VueCookies.get('placeModulesPreset')), 'ModulePresets', 'places');
    },

    /**
     * Adds a new place to IndexedDB for the current activity
     */
    async addPlace() {
      const acID = String(VueCookies.get('currentActivity'));
      var newPlaceID = String(Date.now());
      var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities');

      // add placeID to the activity array of all places
      activity.places.push(newPlaceID);

      // update lastChanged date of activity
      activity.lastChanged = Date.now();

      // new place data
      const newPlace = {
        id: newPlaceID,
        activityID: acID,
        placeNumber: '',

        title: [],
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
        visibility: '',
        drawing: '',
        description: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),

        positions: [],
        images: [],
        models: [],
        lines: [],
        modulePreset: {},
        lastChanged: Date.now(),
        lastSync: ''
      }

      newPlace.modulePreset = toRaw(this.curModulePreset);

      // set new placeNumber
      if (this.places.length == 0) {
        newPlace.placeNumber = 1;
      } else {
        const placeNumbers = await fromOfflineDB.getPropertiesWithID(acID, 'place', 'placeNumber', 'Places', 'places')
        const newPlaceNumber = Math.max(...placeNumbers) + 1;
        newPlace.placeNumber = newPlaceNumber;
      }

      // update IndexedDB
      await fromOfflineDB.updateObject(activity, 'Activities', 'activities');
      await fromOfflineDB.addObject(newPlace, 'Places', 'places')
      await fromOfflineDB.addObject({ id: newPlaceID, object: 'places' }, 'Changes', 'created');
      await this.updatePlaces(newPlace.id)
    },

    /**
     * Opens the module presets overlay
     */
    openPresetOverlay() {
      this.moduleCreatorOverlay = true;
    },

    /**
     * Routes to the place form of `placeID`
     * @param {String} placeID 
     */
    moveToPlace(placeID) {
      if (placeID !== 'new') {
        VueCookies.set('currentPlace', placeID)
      }

      this.$router.push({ name: 'PlaceCreation', params: { placeID: placeID } })
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
        item.title.join('; ').match(re) ||
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
      var currentTheme = VueCookies.get('currentTheme')
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
      VueCookies.set('placeModulesPreset', this.curModulePreset.id);
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