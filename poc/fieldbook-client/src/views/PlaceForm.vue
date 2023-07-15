<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-tab value="two" rounded="0"> Zeichnungen<!-- {{ $tc('model', 2) }} --> </v-tab>
            <v-tab value="three" rounded="0"> {{ $tc('position', 2) }} </v-tab>
            <v-tab value="four" rounded="0"> {{ $tc('model', 2) }} </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="primary">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion()">
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
          <!-- TAB ITEM 'GENERAL' -->
          <v-window-item value="one">

            <!-- CARD 1 GENERAL-->
            <v-card class="pa-4">
              <v-row class="pt-2">
                <v-col lg="8">

                  <v-combobox 
                    chips 
                    multiple 
                    hide-selected
                    closable-chips
                    color="primary"
                    :items="titles" 
                    persistent-hint
                    label="Ansprache" 
                    :hide-no-data="false" 
                    v-model="place.title/* place.title */" 
                    hint="Add max. 5 tags which describe the place">

                    <template #selection="{ item }">
                      <v-chip color="secondary">{{ item }}</v-chip>
                    </template>

                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          No results matching 
                          "<strong>{{ search }}</strong>".
                           Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-combobox>

                  <v-combobox 
                    counter 
                    class="pt-4" 
                    maxlength="45" 
                    color="primary" 
                    :items="datings"
                    :label="$t('dating')"
                    v-model="place.dating">
                  </v-combobox>
                </v-col>

                <v-col lg="4">
                  <v-card class="pa-4" color="accent">
                    <div 
                      class="text-h4 text-center" 
                      :label="$t('lastEdited')"> 
                      {{ place.date }}
                    </div>
                    <div 
                      class="text-grey text-center"> 
                      {{ $t('lastEdited') }}
                    </div>
                  </v-card>

                  <v-spacer class="pa-1"></v-spacer>

                  <v-row class="pl-4 pb-4 justify-center">
                    <v-col cols="6">
                      <v-tooltip
                        text="Falls die Stelle kein Befund ist (Arbeitsbereich, Störung, natürliche Verfärbung etc.)"
                        location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-checkbox 
                            v-bind="props" 
                            color="primary" 
                            persistent-hint 
                            label="Kein Befund"
                            v-model="place.noFinding">
                          </v-checkbox>
                        </template>
                      </v-tooltip>
                    </v-col>

                    <v-col cols="6">
                      <v-tooltip
                        text="Falls bei einem Bodeneingriff der Befund noch unterhalb der Eingriffstiefe erhalten ist."
                        location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-checkbox 
                            v-bind="props" 
                            persistent-hint 
                            color="secondary" 
                            label="Rest Befund"
                            v-model="place.restFinding">
                          </v-checkbox>
                        </template>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <!-- CARD 2 GAUSS-KRÜGER -->
            <v-card>
              <v-card-text>
                <h2 class="text-h6 font-weight-medium pb-2">
                  Gauss-Krüger-Koordinaten
                </h2>
              </v-card-text>
              <v-row no-gutters justify="center">
                <v-text-field 
                  hide-details 
                  maxlength="6"
                  color="primary" 
                  class="px-4 pb-4" 
                  density="compact"
                  v-model="place.right"
                  :label="$t('right')"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>

                <v-text-field 
                  hide-details
                  maxlength="6"
                  color="primary" 
                  class="pr-4 pb-4" 
                  density="compact" 
                  :label="$t('rightTo')"
                  v-model="place.rightTo"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>

                <v-divider class="mt-n1 mb-n2" vertical/>

                <v-text-field 
                  hide-details
                  maxlength="7"
                  color="primary" 
                  class="px-4 pb-4" 
                  density="compact" 
                  :label="$t('up')"
                  v-model="place.up"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>

                <v-text-field 
                  hide-details
                  maxlength="7"
                  color="primary" 
                  class="pr-4 pb-4" 
                  density="compact" 
                  :label="$t('upTo')"
                  v-model="place.upTo"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>

                <v-divider class="mt-n1 mb-n2" vertical/>

                <v-text-field 
                  hide-details
                  maxlength="7"
                  color="primary" 
                  class="px-4 pb-4" 
                  density="compact" 
                  :label="$t('depthTop')"
                  v-model="place.depthTop"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>

                <v-text-field 
                  hide-details 
                  maxlength="7"
                  color="primary" 
                  class="pr-4 pb-4" 
                  density="compact" 
                  :label="$t('depthBot')"
                  v-model="place.depthBot"
                  @keypress="filterNonNumeric(event)">
                </v-text-field>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <v-col lg="6">
                <!-- CARD 3 VISIBILITY -->
                <v-card height="100%">
                  <v-card-text>
                    <h2 
                      class="text-h6 font-weight-medium pb-2">
                      {{ $t('visibility') }}
                    </h2>
                  </v-card-text>
                  <v-slider 
                    :max="3" 
                    step="1" 
                    class="pa-4" 
                    tick-size="4"
                    :ticks="tickLabels" 
                    show-ticks="always" 
                    track-color="primary" 
                    thumb-color="secondary" 
                    v-model="place.visibility" 
                    color="warning">
                  </v-slider>
                </v-card>
              </v-col>

              <!-- CARD 4 DESCRIPTION -->
              <v-col lg="6">
                <v-card>
                  <v-textarea 
                    counter 
                    rows="4"
                    no-resize 
                    color="primary" 
                    maxlength="254" 
                    class="ma-1 px-2 pt-2" 
                    v-model="place.description" 
                    :label="$t('description')">
                  </v-textarea>
                </v-card>
              </v-col>
            </v-row>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <v-col lg="6">
                <!-- CARD 5 PLANE -->
                <v-card height="100%">
                  <v-textarea 
                    rows="2" 
                    counter 
                    maxlength="254"
                    no-resize 
                    color="primary" 
                    class="ma-1 px-2 pt-2"
                    v-model="place.plane" 
                    :label="$t('plane')">
                  </v-textarea>
                </v-card>
              </v-col>
              <v-col lg="6">
                <!-- CARD 3 EDITOR -->
                <v-card>
                  <v-textarea 
                    counter 
                    rows="2" 
                    no-resize 
                    maxlength="50"
                    color="primary"
                    :label="$t('editor')"
                    class="ma-1 px-2 pt-2" 
                    v-model="place.editor">
                  </v-textarea>
                </v-card>
              </v-col>
            </v-row>

          </v-window-item>

          <v-window-item value="two">
            <ImageForm :object_id="place.id" object_type="Places" />
          </v-window-item>

          <!-- Tab item 'positions' -->
          <v-window-item value="three">
            <v-form>
              <v-card>
                <v-list>
                  <v-list-subheader v-if="positions.length === 0">
                    {{ $t('not_created_yet', { object: $tc('position', 1) }) }}
                  </v-list-subheader>

                  <template v-for="(position, i) in positions" :key="position">
                    <v-list-item class="positionItem mt-3" v-on:click="moveToPosition(position.id)">

                      <v-list-item-title class="text-h6">
                        Nr. {{ position.positionNumber }} - {{ position.date }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="text-subtitle-1">
                        {{ position.description }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider v-if="i !== positions.length - 1"></v-divider>
                  </template>
                </v-list>
              </v-card>

              <AddPosition :positions_prop="positions" 
                    @updatePlace="updatePlace()" 
                    @updatePositions="updatePositions()" />

            </v-form>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="four">
            <ModelForm :object_id="place.id" object_type="Places" />
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
import ModelForm from '../components/ModelForm.vue';
import { toRaw } from 'vue';

export default {

  name: 'PlaceCreation',
  components: {
    ConfirmDialog,
    AddPosition,
    ImageForm,
    ModelForm
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
        title: [],
        datingCode: '',   //can maybe be removed
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
        models: [],
        lastChanged: '',
        lastSync: ''
      },
      positions: null,
      titles: [],
      datings: [],
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false,
      tickLabels: {
        3: this.$t('veryGood'),
        2: this.$t('good'),
        1: this.$t('moderate'),
        0: this.$t('bad'),
      }
    }

  },
  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    this.$emit("view", this.$t('edit', { msg: this.$tc('place', 1) }));

    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

    await fromOfflineDB.syncLocalDBs();
    await this.updatePlace();
    await this.updatePositions();
  },
  watch: {
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

  methods: {
    /**
     * Update reactive Vue.js place data
     */
    async updatePlace() {
      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data;
    },

    /**
     * Update reactive Vue.js positions data
     */
    async updatePositions() {
      this.positions = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Positions', 'positions');
    },

    /**
     * Save a place to local storage for the current activity
     */
    async savePlace() {
      //convert from vue proxy to JSON object
      const inputPlace = toRaw(this.place);
      inputPlace.date = new Date().toLocaleDateString("de-DE");
      inputPlace.lastChanged = Date.now();

      await fromOfflineDB.updateObject(inputPlace, 'Places', 'places');
      this.$router.push({ name: "PlacesOverview" });
    },

    /**
     * Opens the confirmation dialog
     */
    async confirmDeletion() {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete the place " + this.place.placeNumber + "?"
        )
      ) {
        this.deletePlace();
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

      this.$router.push({ name: "PlacesOverview" });
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
     * Prevents the input of non numeric values 
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
    }
  }
};

</script>

<style scoped></style>