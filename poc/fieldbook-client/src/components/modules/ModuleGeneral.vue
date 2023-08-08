<template>
  <v-card class="pa-4">
    <v-card-text>
        <h2 
          class="text-h6 font-weight-medium pb-2">
          {{ $t('generalInformation')}}
        </h2>
      </v-card-text>
  <v-row class="pt-2">
    <v-col lg="4">
      <v-combobox 
        chips 
        multiple 
        hide-selected
        closable-chips
        color="primary"
        :items="titles" 
        persistent-hint
        :label="$tc('title', 2)" 
        :hide-no-data="false" 
        v-model="place.title">

        <template #selection="{ item }">
          <v-chip color="secondary">{{ item }}</v-chip>
        </template>

        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              {{ $t('noResults')}}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-combobox>

      <v-text-field
        class="pt-1"
        no-resize 
        hide-selected
        color="primary"
        :items="titles"
        persistent-hint
        :hide-no-data="false"
        :label="$t('date')"
        v-model="place.date">
      </v-text-field>

      <v-text-field
        class="pt-1"
        rows="2" 
        no-resize
        color="primary"
        :label="$t('editor')"
        :rules="is_required" 
        v-model="place.editor">
      </v-text-field>

    </v-col>

    <v-col lg="8">         
      <v-textarea
        rows="8"
        no-resize
        color="primary"
        v-model="place.description" 
        :label="$t('description')">
      </v-textarea>
    </v-col>
  </v-row>
</v-card>
</template>

<script>
/**
* Methods overview:
*  updatePlace     - Updates existing presentation of the place
*  savePlace       - Saves the current processing status
*  confirmDeletion - Opens the confirmation dialog
*  deletePlace     - Deletes the currently selected place
*  moveToPosition  - Loads the view of the selected position
*  cancelPlace     - Cancels all not already saved actions
*/
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../../ConnectionToOfflineDB';
import { useWindowSize } from 'vue-window-size';

export default {
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
    tab: null,
    place: {
      id: '',
      activityID: '',
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
      planum: '',
      editor: '',
      date: '',

      positions: [],
      images: [],
      models: [],
      lines: [],
      lastChanged: '',
      lastSync: ''
    },
    headers: [
      {
        title: this.$t('posNumber'),
        align: 'start',
        sortable: true,
        key: 'positionNumber',
      },
      {
        title: this.$t('subNumber'),
        align: 'start',
        sortable: true,
        key: 'subNumber',
      },
      { title: this.$tc('title', 2), align: 'start', key: 'title' },
      { title: this.$t('date'), align: 'start', key: 'date' },
    ],
    searchQuery: '',
    hoveredRow: -1,
    positions: null,
    titles: [],
    datings: [],
    is_required: [v => !!v || 'Pflichtfeld'],
    hasUnsavedChanges: false,
    componentHasLoaded: false,
  }

},
/**
 * Check if there are unsaved changes to the position 
 * before leaving the PositionForm
 * @param {*} to 
 * @param {*} from 
 * @param {*} next 
 */
async beforeRouteLeave(to, from, next) {
  var confirmation = false;
  if (this.hasUnsavedChanges) {
    confirmation = await this.confirmRouteChange();
    if (confirmation) {
      next();
    }
  } else {
    next();
  }
},
/**
 * Initialize data from localDB to the reactive Vue.js data
 */
async created() {
  const acID = String(VueCookies.get('currentActivity'))
  var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities')

  const plID = String(VueCookies.get('currentPlace'))
  var place = await fromOfflineDB.getObject(plID, 'Places', 'places')
  
  this.$emit("view", activity.activityNumber + ' ' + place.placeNumber);

  this.titles = JSON.parse(import.meta.env.VITE_TITLES);
  this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

  await fromOfflineDB.syncLocalDBs();
  await this.updatePlace();
  await this.updatePositions();
  this.componentHasLoaded = true;
},
watch: {
  'place': {
    handler: 'handlePlaceChange',
    deep: true,
  },
  /**
   * Ensure that only 5 items are selected
   * @param {*} val 
   */
  'place.title'(val) {
    if (val.length > 5) {
      this.$nextTick(() => this.place.title.pop())
    }
  },
},
};

</script>

<style scoped></style>