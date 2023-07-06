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
            <v-card class="pa-4">
              <v-row class="pt-2">
                <v-col cols="12" lg="8">

                  <v-combobox v-model="place.title" :hide-no-data="false" :items="titles" hide-selected
                    hint="Add tags which describe the place" label="Title" multiple persistent-hint chips closable-chips
                    color="primary">
                    <template #selection="{ item }">
                      <v-chip color="secondary">{{ item }}</v-chip>
                    </template>
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-combobox>
                  <v-combobox counter color="primary" maxlength="40" v-model="place.dating" :items="datings"
                    :label="$t('dating')">
                  </v-combobox>

                </v-col>
                <v-col cols="12" lg="4">
                  <v-card class="pa-4" color="accent">
                    <div class="text-h4 text-center" :label="$t('lastEdited')"> {{ place.date }}</div>
                    <div class="text-grey text-center"> {{ $t('lastEdited') }}</div>
                  </v-card>
                  <v-spacer class="pa-1"></v-spacer>
                  <v-row class="pl-4 pb-4 justify-center">
                    <v-col cols="4">
                      <v-tooltip
                        text="Falls die Stelle kein Befund ist (Arbeitsbereich, Störung, natürliche Verfärbung etc.)"
                        location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-checkbox v-bind="props" color="primary" persistent-hint label="Kein Befund"
                            v-model="place.noFinding">
                          </v-checkbox>
                        </template>
                      </v-tooltip>
                    </v-col>
                    <v-col cols="4">
                      <v-tooltip
                        text="Falls bei einem Bodeneingriff der Befund noch unterhalb der Eingriffstiefe erhalten ist."
                        location="bottom">
                        <template v-slot:activator="{ props }">
                          <v-checkbox v-bind="props" color="secondary" persistent-hint label="Rest Befund"
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
            <v-card>
              <v-card-text>
                <div>
                  <h2 class="text-h6 font-weight-medium pb-3">Gauss-Krüger-Koordinaten</h2>
                </div>
              </v-card-text>
              <v-row class="pb-4" justify="center">
                <v-col cols="12" lg="1">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.right" :label="$t('right')">
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.rightTo" :label="$t('rightTo')">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-n1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="1">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.up" :label="$t('up')">
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.upTo" :label="$t('upTo')">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-n1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.depthTop" :label="$t('depthTop')">
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" hide-details density="compact" v-model="place.depthBot" :label="$t('depthBot')">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-card>
              <v-card-text>
                <div>
                  <h2 class="title text-h6 font-weight-medium pb-3">{{ $t('visibility') }}</h2>
                </div>
              </v-card-text>
              <v-slider class="pa-4" :ticks="tickLabels" :max="3" step="1" show-ticks="always" tick-size="4"
                track-color="primary" thumb-color="secondary" v-model="place.visibility" color="warning"></v-slider>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-card>
              <v-row class="pa-4">
                <v-col cols="12" lg="6">
                  <v-textarea color="primary" counter maxlength="254" no-resize rows="5" v-model="place.description"
                    :label="$t('description')">
                  </v-textarea>
                </v-col>
                <v-col cols="12" lg="6">
                  <v-textarea color="primary" counter maxlength="254" no-resize rows="5" v-model="place.editor"
                    :label="$t('editor')">
                  </v-textarea>
                </v-col>
              </v-row>
            </v-card>
          </v-window-item>

          <v-window-item value="two">
            TODO
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

              <AddPosition 
                  :positions_prop="positions" 
                  @closeDiag="updatePositions()" />

            </v-form>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="four">
            <v-card>
              <v-list>
                <v-list-subheader v-if="models.length === 0">
                  {{ $t('not_created_yet', { object: $tc('model', 1) }) }}
                </v-list-subheader>

                <template v-for="(model, i) in models" :key="model">
                  <v-container class="d-flex align-center">

                    <v-container class="pa-0">
                      <v-list-item class="modelItem mt-3" v-on:click="moveToModel(model.id)">
                        <v-list-item-title class="text-h6">
                          Nr. {{ model.modelNumber }}
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-subtitle-1">
                          {{ model.title }}
                        </v-list-item-subtitle>

                      </v-list-item>
                    </v-container>
                    <v-btn class="ml-3 mt-2" color="error" v-on:click="deleteModel(model)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-container>

                  <v-divider v-if="i !== models.length - 1"></v-divider>
                </template>
              </v-list>
            </v-card>

            <AddButton v-on:click="models_overlay = true" />

            <!-- Model Creation dialog -->
            <v-dialog v-model="models_overlay" max-width="800" persistent>
              <v-card>
                <v-card-title>{{ $t('add', { msg: $t('model') }) }} </v-card-title>
                <v-card-text>

                  <v-text-field disabled v-model="place.id" :label="$t('place_id')"
                    :hint="$t('please_input', { msg: $t('place_id') })">
                  </v-text-field>

                  <v-text-field v-model="model.title" :label="$t('title')"
                    :hint="$t('please_input', { msg: $t('title_of', { msg: $t('model') }) })">
                  </v-text-field>

                  <v-file-input show-size accept=".glb" v-model="model.model" :label="$t('input', { msg: $t('model') })">
                  </v-file-input>

                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn icon color="primary" v-on:click="addModel()">
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <v-btn icon color="error" @click="models_overlay = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
 *  updatePositions - Updates existing presentation of positions
 *  updateModels    - Updates existing presentation of models
 *  savePlace       - Saves the current processing status
 *  confirmDeletion - Opens the confirmation dialog
 *  deletePlace     - Deletes the currently selected place
 *  addPosition     - Adds a new position to the list
 *  textureToBase64 - Change texture data to base64
 *  modelToString   - Change obj-Model data to String
 *  addModel        - Adds a new model to the list
 *  moveToPosition  - Loads the view of the selected position
 *  cancelPlace     - Cancels all not already saved actions
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import AddButton from '../components/AddButton.vue';
import AddPosition from '../components/AddPosition.vue';
import { toRaw } from 'vue';

export default {

  name: 'PlaceCreation',
  components: {
    ConfirmDialog,
    AddButton,
    AddPosition
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
        editor: '',
        date: '',

        positions: [],
        models: [],
        lastChanged: '',
        lastSync: ''
      },
      model: {
        id: '',
        placeID: '',
        title: '',
        model: [],
      },
      positions: null,
      models: null,
      titles: [],
      datings: [],
      models_overlay: false,
      error_dialog: false,
      error_message: '',
      is_new: true,
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
    await this.updateModels();
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
     * Update reactive Vue.js models data
     */
    async updateModels() {
      this.models = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Models', 'places');
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
     * 
     * @param {*} rawData 
     */
    async modelToArrayBuffer(rawData) {

      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const modelString = e.target.result
          resolve(modelString)
        }

        reader.readAsArrayBuffer(f);

      });

      return output;

    },

    /**
     * Adds a new model to the local storage for the current place
     */
    async addModel() {
      // add model id to place array of all models
      const placeID = String(VueCookies.get('currentPlace'))
      var newModelID = String(Date.now())

      this.place.models.push(newModelID)
      this.place.lastChanged = Date.now()

      const newModel = {
        id: newModelID,
        placeID: this.place.id,
        title: this.model.title,
        model: await this.modelToArrayBuffer(toRaw(this.model.model)),
        color: "#ffffff",
        opacity: 1,
        lastChanged: Date.now(),
        lastSync: ''
      };

      if (this.models.length == 0) {
        newModel.modelNumber = 1;
      } else {
        this.updateModels();
        const modelNumber = Math.max(...this.models.map(o => o.modelNumber))
        const newModelNumber = modelNumber + 1;
        newModel.modelNumber = newModelNumber;
      }

      this.models_overlay = false;
      await fromOfflineDB.updateObject(toRaw(this.place), 'Places', 'places')
      var modelID = await fromOfflineDB.addObject(newModel, 'Models', 'places');
      await fromOfflineDB.addObject({ id: modelID, object: 'models' }, 'Changes', 'created');
      await this.updateModels(newModel.id);
    },
    async deleteModel(model) {

      // Remove the modelID from connected place
      var index = this.place.models.indexOf(model.id);
      if (index != -1) {
        this.place.models.splice(index, 1)
        this.place.lastChanged = Date.now();
        await fromOfflineDB.updateObject(toRaw(this.place), 'Places', 'places');
      }

      // Delete the model itself
      await fromOfflineDB.deleteObject(model, 'Models', 'places');
      VueCookies.remove('currentModel');

      await this.updateModels();

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
    }
  }

};

</script>

<style scoped></style>