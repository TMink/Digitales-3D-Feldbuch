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
                <v-col cols="1" class="text-left pl-6">
                  Nr.
                </v-col>
                <v-col cols="6" class="text-left pl-6">
                  Titel
                </v-col>
                <v-col cols="2" class="text-left pl-6">
                  Datum
                </v-col>
              </v-row></h3>
          </div>
        </v-card-text>

        <!-- PLACES LIST -->
        <v-card>
          <v-list>
            <v-list-subheader v-if="places.length === 0">
              {{ $t('not_created_yet', { object: $tc('place', 1) }) }}
            </v-list-subheader>

            <v-virtual-scroll :items="places" :max-height="windowHeight - 360">
              <template v-slot="{ item }" :key="item">
                <v-list-item v-on:click="moveToPlace(item.id)">
                  <v-row class="justify-center">

                    <v-col cols="1">
                      <v-list-item-title class="ma-4">
                        {{ item.placeNumber }}
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="6">
                      <v-list-item-title class="ma-4 text-wrap" v-if="item.title.length != 0">
                        {{ item.title.join("; ") }}
                      </v-list-item-title>

                      <v-list-item-title class="ma-4 text-grey-darken-1" v-if="item.title.length == 0">
                        {{ $t('title') }}
                      </v-list-item-title>
                    </v-col>

                    <v-col cols="2">
                      <v-list-item-title class="ma-4" v-if="item.date.length != 0">
                        {{ item.date }}
                      </v-list-item-title>
                      <v-list-item-title class="ma-4 text-grey-darken-1" v-if="item.date.length == 0">
                        {{ $t('date') }}
                      </v-list-item-title>
                    </v-col>

                  </v-row>
                </v-list-item>
                <v-divider v-if="i !== places.length - 1"></v-divider>
              </template>
            </v-virtual-scroll>
          </v-list>
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
import Navigation from '../components/Navigation.vue'
import AddButton from '../components/AddButton.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'PlacesOverview',
  components: {
    Navigation,
    AddButton
  },
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
      h: window.innerHeight
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