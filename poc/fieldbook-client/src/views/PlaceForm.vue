<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card rounded="0">
          <v-tabs v-model="tab" direction="vertical" color="secondary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-tab value="two" rounded="0"> {{ $tc('position', 2) }} </v-tab>
            <v-tab value="three" rounded="0"> {{ $tc('model', 2) }} </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="secondary">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" color="primary" v-on:click="confirmDeletion()">
              {{ $t('delete') }}
            </v-btn>

            <ConfirmDialog ref="confirm" />

            <v-btn rounded="0" v-on:click="cancelPlace" color="primary">
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
                v-model="place.ansprache" 
                label="Ansprache"
                hint="Geben Sie hier eine Ansprache ein">
              </v-text-field>
              <v-text-field 
                v-model="place.date" 
                label="Datierung" 
                hint="Format: dd.mm.yyyy">
              </v-text-field>
            </v-card>
          </v-window-item>

          <!-- Tab item 'positions' -->
          <v-window-item value="two">
            <v-form>
              <v-list>
                <v-list-subheader v-if="positions.length === 0">
                  Bisher wurde keine Positionen angelegt
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

              <v-btn
                color="primary"
                class="mr-16 mt-3" 
                v-on:click="addPosition()">
                {{ $t('add', { msg: $t('position') }) }}
              </v-btn>
            </v-form>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="three">
            <v-list>
              <v-list-subheader v-if="models.length === 0">
                Bisher wurde keine Modelle angelegt
              </v-list-subheader>

              <template v-for="(model, i) in models" :key="model">
                <v-list-item class="modelItem mt-3" v-on:click="moveToModel(model.id)">

                  <v-list-item-title class="text-h6">
                    Nr. {{ model.modelNumber }}
                  </v-list-item-title>

                  <v-list-item-subtitle class="text-subtitle-1">
                    {{ model.title }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider v-if="i !== models.length - 1"></v-divider>
              </template>
            </v-list>

            <v-btn
              color="primary"
              class="mr-16 mt-3"
              @click="models_overlay = true">
              {{ $t('add', { msg: $t('model') }) }}
            </v-btn>

            <!-- Model Creation dialog -->
            <v-dialog v-model="models_overlay" max-width="800" persistent>
              <v-card>
                <v-card-title>{{ $t('add', { msg: $t('model') }) }} </v-card-title>
                <v-card-text>

                  <v-text-field
                    disabled
                    v-model="place.id"
                    :label="$t('place_id')" 
                    :hint="$t('plase_input', { msg: $t('place_id') })">
                  </v-text-field>

                  <v-text-field
                    v-model="model.title" 
                    :label="$t('title')" 
                    :hint="$t('plase_input', { msg: $t('title_of_model') })">
                  </v-text-field>

                  <v-file-input
                    show-size
                    accept=".obj"
                    v-model="model.model"
                    :label="$t('input', { msg: $t('model') })">
                  </v-file-input>

                  <v-file-input
                    show-size
                    v-model="model.texture"
                    prepend-icon="mdi-camera" 
                    accept="image/png, image/jpeg, image/bmp" 
                    :label="$t('input', { msg: $t('texture') })">
                  </v-file-input>
                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn 
                    variant="outlined" 
                    v-on:click="addModel()"> 
                    {{ $t('save') }}
                  </v-btn>
                  <v-btn 
                    @click="models_overlay = false"> 
                    {{ $t('cancel') }} 
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
 *  addModel        - Adds a new model to the list
 *  moveToPosition  - Loads the view of the selected position
 *  cancelPlace     - Cancels all not already saved actions
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { toRaw } from 'vue';

export default {

  name: 'PlaceCreation',
  components: {
    ConfirmDialog
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
        ansprache: '',
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
        model: '',
        texture: '',
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
      await fromOfflineDB.deleteObject(this.place, 'Places', 'places');
      VueCookies.remove('currentPlace');

      this.$router.push({ name: "PlacesOverview" });
      this.$emit('view', 'Stellen');

    },

    /**
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {

      // Add positionID to the place array of all positions
      const placeID = String(VueCookies.get('currentPlace'))
      var newPositionID = String(Date.now())
      var place = await fromOfflineDB.getObject(placeID, 'Places', 'places')

      place.positions.push(newPositionID)
      place.lastChanged = Date.now()

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
        this.updatePositions();
        const positionNumber = Math.max(...this.positions.map(o => o.positionNumber));
        const newPositionNumber = positionNumber + 1;
        newPosition.positionNumber = newPositionNumber;
      }

      await fromOfflineDB.updateObject(place, 'Places', 'places')
      var posID = await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await fromOfflineDB.addObject({ id: posID, object: 'position' }, 'Changes', 'created');
      await this.updatePositions(newPosition.id);

    },

    async textureToBase64(rawData) {

      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          console.log(b64)
          resolve(b64)
        }

        reader.readAsDataURL(f);

      });

      return output;

    },

    async modelToString(rawData) {

      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const modelString = e.target.result
          console.log(modelString)
          resolve(modelString)
        }

        reader.readAsText(f);

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

      var place = await fromOfflineDB.getObject(placeID, 'Places', 'places')

      place.models.push(newModelID)
      place.lastChanged = Date.now()


      const newModel = {
        id: newModelID,
        placeID: this.place.id,
        title: this.model.title,
        model: await this.modelToString(toRaw(this.model.model)),
        texture: await this.textureToBase64(toRaw(this.model.texture)),
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

      await fromOfflineDB.updateObject(place, 'Places', 'places')
      await fromOfflineDB.addObject(newModel, 'Models', 'places');
      await this.updateModels(newModel.id);
    },
    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {*} positionID 
     */
    moveToPosition(positionID) {
      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }
      this.$emit('view', 'Positionsbearbeitung')
      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } });
    },
    /**
     * Cancels the PositionForm and returns to the PositionOverview
     */
    cancelPlace() {
      this.$router.push({ name: "PlacesOverview" });
      this.$emit("view", "Stellen");
    }
  }

};

</script>

<style scoped></style>
