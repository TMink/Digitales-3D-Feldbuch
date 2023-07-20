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
import { toRaw } from 'vue';

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
    filteredPlaces() {
      // Filter the places based on the search query
      const query = this.searchQuery.trim().toLowerCase();
      if (query === '') {
        return this.places;
      } else {
        return this.places.filter(item => {
          return (
            item.placeNumber.toString().includes(query) ||
            item.title.join('; ').toLowerCase().includes(query) ||
            item.date.toLowerCase().includes(query)
          );
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
      console.log(placeID)
      if (placeID !== 'new') {
        VueCookies.set('currentPlace', placeID)
      }

      this.$router.push({ name: 'PlaceCreation', params: { placeID: placeID } })
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