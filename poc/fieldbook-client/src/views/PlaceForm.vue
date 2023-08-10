<template>
  <Navigation active_tab_prop="1" />
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-tab class="hideable" value="two" rounded="0"> {{ $t('position') }} </v-tab>
            <v-tab value="three" rounded="0"> {{ $tc('image', 2) }} </v-tab>
            <v-tab class="hideable" value="four" rounded="0"> {{ $tc('model', 2) }} </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="primary">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion(place)">
              {{ $t('delete') }}
            </v-btn>

            <ConfirmDialog ref="confirm" />

            <v-btn rounded="0" v-on:click="cancelPlace" color="secondary">
              {{ $t('cancel') }}
            </v-btn>
          </v-tabs>
        </v-card>
      </v-col>

      <v-col cols="10">
        <v-window v-model="tab">
          <!-- Tab item 'GENERAL' -->
          <v-window-item value="one">
            <ModelViewer
              :object_id="place.id"
              :updateListFirstProp="place.testBool"  
              object_type="Places"
              @dataToPlaceForm="getEmitedData($event)"/>
          </v-window-item>

          <!-- Tab item 'positions' -->
          <v-window-item value="two">
            <v-form>
              <v-card class="pa-3" :min-width="windowWidth * 0.5">
                <v-data-table-virtual
                  :items="positions"
                  fixed-header
                  :height="getTableHeight"
                  :headers="headers"
                  :sort-by="[{ key: 'positionNumber', order: 'asc' }]"
                  max-height>

                  <template v-slot:item="{ item, index }">
                    <tr v-on:click="moveToPosition(item.raw.id)"
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
                    </tr>
                  </template>
                </v-data-table-virtual>
              </v-card>

              <AddPosition 
                :positions_prop="positions" 
                @updatePlace="updatePlace2()" 
                @updatePositions="updatePositions()" />

            </v-form>
          </v-window-item>

          <!-- Tab item 'pictures' -->
          <v-window-item value="three">
            <ImageForm 
              :object_id="place.id"  
              object_type="Places"
              @addImage="addImage($event)"/>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="four">
            <ModelForm 
              :object_id="place.id" 
              object_type="Places"
              @addModel="addModel($event)"/>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
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
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import AddPosition from '../components/AddPosition.vue';
import ImageForm from '../components/ImageForm.vue';
import ModelViewer from '../components/ModelViewer.vue';
import ModelForm from '../components/ModelForm.vue';
import { toRaw } from 'vue';
import { useWindowSize } from 'vue-window-size';
import Navigation from '../components/Navigation.vue';

export default {

  name: 'PlaceCreation',
  components: {
    Navigation,
    ConfirmDialog,
    AddPosition,
    ImageForm,
    ModelViewer,
    ModelForm
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
      tab: null,
      place: {
        id: '',
        activityID: '',
        placeNumber: '',
        code: '',         //can maybe be removed
        datingCode: '',   //can maybe be removed
        profile: '',
        drawing: '',
        positions: [],
        images: [],
        models: [],
        lines: [],    
        lastChanged: '',
        lastSync: '',
        
        /* Coordinates */
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        depthTop: '',
        depthBot: '',
        
        /* Dating */
        dating: '',
        
        /* FindTypes */
        noFinding: false,
        restFinding: false,
        
        /* General */
        description: '',
        editor: '',
        date: '',
        title: [],

        /* Plane */
        plane: '',

        /* PositionsList */
        testBool: false,
        
        /* Technical */
        technical: '',
        
        /* Visibility */
        visibility: '',
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
      tickLabels: {
        3: this.$t('veryGood'),
        2: this.$t('good'),
        1: this.$t('moderate'),
        0: this.$t('bad'),
      },
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
    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
    
    await fromOfflineDB.syncLocalDBs();
    await this.updatePlace();
    await this.updatePositions();
    await this.setAppBarTitle();
    this.hideNonTechnicalTabs();
    this.componentHasLoaded = true;
    this.hasUnsavedChanges = false;
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

  computed: {
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.positions.length > 0 ? this.positions.length : 1;
      const headerHeight = 56;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 350)) {
        return this.windowHeight - 350;
      }

      return totalTableHeight + "px";
    },
  },

  methods: {

    getEmitedData(data) {
      switch (data[0]) {
        /* Module: Coordinates */
        case 'right':
          this.place.right = data[1];
          break;
        case 'rightTo':
          this.place.rightTo = data[1];
          break;
        case 'up':
          this.place.up = data[1];
          break;
        case 'upTo':
          this.place.upTo = data[1];
          break;
        case 'depthTop':
          this.place.depthTop = data[1];
          break;
        case 'depthBot':
          this.place.depthBot = data[1];
          break;

        /* Module: Dating */
        case 'dating':
          this.place.dating = data[1];
          break;

        /* Module: FindTypes */
        case 'noFinding':
          this.place.noFinding = data[1];
          break;
        case 'restFinding':
          this.place.restFinding = data[1];
          break;

        /* Module: General */
        case 'description':
          this.place.description = data[1];
          break;
        case 'editor':
          this.place.editor = data[1];
          break;
        case 'date':
          this.place.date = data[1];
          break;
        case 'title':
          this.place.title = data[1];
          break;

        /* Module: Plane */
        case 'plane':
          this.place.plane = data[1];

        /* Module: PositionList */
        case 'resetBool':
          this.place.testBool = data[1];
          break;

        /* Module: Technical */
        case 'technical':
          this.place.technical = data[1]
          break;

        /* Module: Visibility */
        case 'visibility':
          this.place.visibility = data[1];
          break;
        
        default:
          console.log( error )
      }
    },

    /**
     * Update reactive Vue.js place data
     */
    async updatePlace() {
      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data;
    },

    async updatePlace2() {
      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      const rawPositions = toRaw(this.positions);
      data = this.place
      data.positions = rawPositions;
      await fromOfflineDB.updateObject( data, 'Places', 'places' );
      this.hasUnsavedChanges = false;
    },

    /**
     * Update reactive Vue.js positions data
     */
    async updatePositions() {
      this.place.testBool = true;
      this.positions = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Positions', 'positions');
    },

    /**
     * Save a place to local storage for the current activity
     */
    async savePlace() {
      //convert from vue proxy to JSON object
      const inputPlace = toRaw(this.place);
      //inputPlace.date = new Date().toLocaleDateString("de-DE");
      inputPlace.lastChanged = Date.now();

      await fromOfflineDB.updateObject(inputPlace, 'Places', 'places');
      this.hasUnsavedChanges = false;
      this.$root.vtoast.show({ message: this.$t('saveSuccess')});
    },

    /**
     * Opens the confirmation dialog for deletion#
     * @param {Object} place 
     */
    async confirmDeletion(place) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          this.$t('confirm_del', {
            object: this.$tc('place', 1),
            object_nr: place.placeNumber
          })
        )
      ) {
        this.deletePlace();
      }
    },

    /**
     * Opens the confirmation dialog for leaving the form
     */
     async confirmRouteChange() {
      if (await this.$refs.confirm.open(this.$t('confirm'),
          this.$t('wantToLeave'))) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Removes a place from the IndexedDB and the Cookies
     */
    async deletePlace() {

      // Remove the placeID from connected activity
      const acID = String(VueCookies.get('currentActivity'))
      var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities')
      var index = activity.places.indexOf(this.place.id.toString())

      activity.places.splice(index, 1)
      await fromOfflineDB.updateObject(activity, 'Activities', 'activities');

      // Delete all data that is dependent on the place
      await fromOfflineDB.deleteCascade(this.place.id, 'position', 'Positions', 'positions');
      VueCookies.remove('currentPosition');

      // Delete the place itself
      await fromOfflineDB.deleteObject(toRaw(this.place), 'Places', 'places');
      VueCookies.remove('currentPlace');
      this.hasUnsavedChanges = false;
      this.$router.push({ name: "PlacesOverview" });
    },

    /**
     * Adds a new `image_id` to the `images`-array of this place
     * @param {String} image_id 
     */
    addImage(image_id) {
      if (this.place.images == undefined) {
        this.place.images = [image_id];
      } else {
        this.place.images.push(image_id);
      }
    },

    /**
     * Adds a new `model_id` to the `models`-array of this place
     * @param {String} model_id 
     */
    addModel(model_id) {
      if (this.place.models == undefined) {
        this.place.models = [model_id];
      } else {
        this.place.models.push(model_id);
      }
    },

    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    moveToPosition(positionID) {
      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }
      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } });
    },

    /**
     * Cancels the PositionForm and returns to the PositionOverview
     */
    cancelPlace() {
      this.$router.push({ name: "PlacesOverview" });
    },

    /**
     * Hide the side tabs that are not required for a technical place
     */
    hideNonTechnicalTabs() {
      if (this.place.placeNumber == 1) {
        // Get all elements with the class "hideable"
        const hideableElements = document.querySelectorAll('.hideable');
        
        // Hide all hideable elements
        hideableElements.forEach(element => {
          element.style.display = 'none';
        });
      }
    },

    /**
     * Sets the AppBarTitle to the current ActivityNumber + PlaceNumber
     */
    async setAppBarTitle() {
      const acID = String(VueCookies.get('currentActivity'));
      var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities');

      const plID = String(VueCookies.get('currentPlace'))
      var place = await fromOfflineDB.getObject(plID, 'Places', 'places')
    
      this.$emit("view", activity.activityNumber + ' ' + place.placeNumber);
    },

    /**
     * Gets called every time some info of the current position changes.
     * Once a change has happend, the flag `hasUnsavedChanges` gets set to `true`
     */
    handlePlaceChange() {
      if (this.hasUnsavedChanges) {
        return;
      }

      if (this.componentHasLoaded) {
        this.hasUnsavedChanges = true;
      }
    },

    /**
     * Prevents the input of non numeric values 
     * (allows one single `,` or `.` for float values)
     * @param {*} evt 
     */
    filterNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    /**
     * Get the style for the row at the specified index.
     *
     * @param {number} index The index of the row
     * @returns {Object} An object containing row style properties
     */
    getRowStyle(index) {
      return {
        backgroundColor: this.hoveredRow === index ? '#2f3845' : 'transparent',
        cursor: 'pointer',
        padding: '8px 16px'
      };
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
};

</script>

<style scoped></style>