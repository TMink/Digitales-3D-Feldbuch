<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card rounded="0">
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-tab value="two" rounded="0"> {{ $tc('position', 2) }} </v-tab>
            <v-tab value="three" rounded="0"> {{ $tc('model', 2) }} </v-tab>
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

      <v-col>
        <v-window v-model="tab">
          <!-- Tab item 'general' -->
          <v-window-item value="one">
            <v-card>
              <v-text-field 
                v-model="place.title" 
                :label="$t('title')"
                :hint="$tc('please_input', {msg: $t('title')}, 1)">
              </v-text-field>
              <v-text-field 
                v-model="place.date" 
                :label="$t('dating')" 
                hint="Format: dd.mm.yyyy">
              </v-text-field>
            </v-card>
          </v-window-item>

          <!-- Tab item 'positions' -->
          <v-window-item value="two">
            <v-form>
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

              <AddButton v-on:click="addPosition()"/>

            </v-form>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="three">
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
                    <v-btn 
                      class="ml-3 mt-2" 
                      color="error" 
                      v-on:click="deleteModel(model)"> 
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-container>
                  
                <v-divider v-if="i !== models.length - 1"></v-divider>
              </template>
            </v-list>

            <AddButton v-on:click="models_overlay = true"/>

            <!-- Model Creation dialog -->
            <v-dialog v-model="models_overlay" max-width="800" persistent>
              <v-card>
                <v-card-title>{{ $t('add', { msg: $t('model') }) }} </v-card-title>
                <v-card-text>

                  <v-text-field
                    disabled
                    v-model="place.id"
                    :label="$t('place_id')" 
                    :hint="$t('please_input', { msg: $t('place_id') })">
                  </v-text-field>

                  <v-text-field
                    v-model="model.title" 
                    :label="$t('title')" 
                    :hint="$t('please_input', { msg: $t('title_of', {msg: $t('model')}) })">
                  </v-text-field>

                  <v-file-input
                    show-size
                    accept=".glb"
                    v-model="model.model"
                    :label="$t('input', { msg: $t('model') })">
                  </v-file-input>

                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn
                    icon 
                    color="primary" 
                    v-on:click="addModel()">
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <v-btn 
                    icon 
                    color="error" 
                    @click="models_overlay = false">
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
import AddButton from '../components/AddButton.vue'
import { toRaw } from 'vue';

export default {

  name: 'PlaceCreation',
  components: {
    ConfirmDialog,
    AddButton
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
        title: '',
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
      models_overlay: false,
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false,
    }

  },
  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    this.$emit("view", this.$t('edit', { msg: this.$tc('place', 1) }));
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
      const inputPlace = JSON.parse(JSON.stringify(this.place));
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
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {

      // Add positionID to the place array of all positions
      var newPositionID = String(Date.now())

      this.place.positions.push(newPositionID)
      this.place.lastChanged = Date.now()

      
      const newPosition = {
        id: newPositionID,
        positionNumber: null,
        placeID: this.place.id,
        texts: [],
        images: [],
        lastChanged: Date.now(),
        lastSync: ''
      };

      if (this.positions.length == 0) {
        newPosition.positionNumber = 1;
      } else {
        const positionNumber = Math.max(...this.positions.map(o => o.positionNumber));
        const newPositionNumber = positionNumber + 1;
        newPosition.positionNumber = newPositionNumber;
      }

      await fromOfflineDB.updateObject(toRaw(this.place), 'Places', 'places')
      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await fromOfflineDB.addObject({ id: newPositionID, object: 'positions' }, 'Changes', 'created');
      await this.updatePositions(newPosition.id);
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
