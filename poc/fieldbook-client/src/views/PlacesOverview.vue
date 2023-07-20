<template>
  <div id="wrapper">
    <Navigation active_tab_prop="1" />
    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-2">

        <!-- LIST TITLE -->
        <v-card-text v-if="places.length !== 0">
          <div>
            <h3><v-row class="justify-center">
                <v-col cols="1" class="text-left">
                  Nr.
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

        <!-- PLACES LIST -->
        <v-card>
            <v-list-subheader v-if="places.length === 0">
              {{ $t('not_created_yet', { object: $tc('place', 1) }) }}
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
                :items="filteredPlaces"
                class="elevation-1"
                :height="windowHeight - 450"
              >
              <template v-slot:item="{ item }">
                <v-list-item v-on:click="moveToPlace(item.raw.id)">
                    <v-row class="justify-center align-center my-2">
                      <v-col cols="1">
                        <v-list-item-title>
                          {{ item.raw.placeNumber }}
                        </v-list-item-title>
                      </v-col>

                      <v-col cols="6">
                        <v-list-item-title 
                          class="text-wrap" 
                          v-if="item.raw.title.length != 0">
                          {{ item.raw.title.join("; ") }}
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

    <AddButton v-on:click="addPlace()" />
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
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'PlacesOverview',
  components: {
    Navigation,
    AddButton
  },
  emits: ['view'],
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      places: [],
      searchQuery: '',
      headers: [
        {
          title: 'placeNumber',
          align: 'start',
          sortable: true,
          key: 'placeNumber',
        },
        { title: 'title', align: 'start', key: 'title' },
        { title: 'date', align: 'end', key: 'date' },
      ],
    };
  },
  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    this.$emit("view", this.$t('overview', { msg: this.$tc('place', 2) }));
    await fromOfflineDB.syncLocalDBs();
    await this.updatePlaces();
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
  },

  methods: {
    /**
     * Get all places from IndexedDb
     */
    async updatePlaces() {
      var curActivityID = String(VueCookies.get('currentActivity'));

      this.places = await fromOfflineDB.getAllObjectsWithID(
        curActivityID, 'Activity', 'Places', 'places');
      this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1)
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
        lastChanged: Date.now(),
        lastSync: ''
      }

      // set new placeNumber
      if (this.places.length == 0) {
        newPlace.placeNumber = 1
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