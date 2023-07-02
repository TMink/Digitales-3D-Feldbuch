<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card rounded="0">
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

      <v-col>
        <v-window v-model="tab">
          <!-- Tab item 'general' -->
          <v-window-item value="one">
            <v-card class="pa-4">
              <v-row class="pt-2 pb-10">

                <!-- Can PROBABLY be removed
                  <v-col cols="1"> 
                  <v-text-field v-model="place.code" :label="$t('code')">
                </v-text-field>  Can maybe be removed
                </v-col> -->
                <v-col cols="5">
                  <v-combobox v-model="place.title" :hide-no-data="false" :items="titles" hide-selected
                    hint="Add tags which describe the place" label="Title" multiple persistent-hint chips closable-chips>
                    <template v-slot:no-data>
                      <v-list-item>
                        <v-list-item-title>
                          No results matching "<strong>{{ search }}</strong>". Press <kbd>enter</kbd> to create a new one
                        </v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-combobox>
                </v-col>
                <v-col cols="4">
                  <v-combobox counter maxlength="40" v-model="place.dating" :items="datings" :label="$t('dating')">
                  </v-combobox>
                </v-col>
                <!-- <v-spacer></v-spacer> -->
                <v-col>
                  <div class="text-h4 text-center" :label="$t('lastEdited')"> {{ place.date }}</div>
                  <div class="text-grey text-center"> {{ $t('lastEdited') }}</div>
                </v-col>
              </v-row>

              <!-- <v-row>
                   Can PROBABLY be removed
                  <v-col cols="2">
                    <v-text-field v-model="place.datingCode" :label="$t('dating') + 's ' + $t('code')">
                  </v-text-field>
                  </v-col> 
                  <v-col cols="5">
                    <v-combobox counter maxlength="40" v-model="place.dating" :items="datings" :label="$t('dating')">
                  </v-combobox>
                  </v-col>
              </v-row>-->

              <v-divider></v-divider>

              <v-row class="pl-4 pb-4 justify-center">
                <v-col cols="4">
                  <v-checkbox persistent-hint label="Kein Befund" v-model="place.noFinding"
                    hint="Falls die Stelle kein Befund ist (Arbeitsbereich, Störung, natürliche Verfärbung etc.)">
                  </v-checkbox>
                </v-col>
                <v-col cols="4">
                  <v-checkbox persistent-hint label="Rest Befund" v-model="place.restFinding"
                    hint="Falls bei einem Bodeneingriff der Befund noch unterhalb der Eingriffstiefe erhalten ist.">
                  </v-checkbox>
                </v-col>
              </v-row>

              <v-divider class="pa-2"></v-divider>
              <div class="text-h6 px-3 pb-3">Gauss-Krüger-Koordinaten<!-- {{ $t('visibility') }} --></div>
              <v-row class="pb-3">
                <v-col cols="2">
                  <v-text-field hide-details density="compact" v-model="place.right" :label="$t('right')">
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field hide-details density="compact" v-model="place.rightTo" :label="$t('rightTo')">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-n1 mb-n2" vertical></v-divider>
                <v-col>
                  <v-text-field hide-details density="compact" v-model="place.up" :label="$t('up')">
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field hide-details density="compact" v-model="place.upTo" :label="$t('upTo')">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-n1 mb-n2" vertical></v-divider>
                <v-col>
                  <v-text-field hide-details density="compact" v-model="place.depthTop" :label="$t('depthTop')">
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field hide-details density="compact" v-model="place.depthBot" :label="$t('depthBot')">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-divider class="mt-2 pa-2"></v-divider>

              <v-row no-gutters>

                <v-textarea counter maxlength="254" auto-grow rows="1" v-model="place.plane" :label="$t('plane')">
                </v-textarea>
              </v-row>
              <v-row no-gutters>

                <v-textarea counter maxlength="254" auto-grow rows="1" v-model="place.profile" :label="$t('profile')">
                </v-textarea>
              </v-row>

              <v-divider class="mt-2 pa-2"></v-divider>

              <v-row no-gutters class=" text-begin">

                <v-col cols="6" class="pt-4 pl-4">

                  <div class="text-h6 pl-3">{{ $t('visibility') }}</div>
                  <v-radio-group v-model="place.visibility" inline>
                    <v-radio :label="this.$t('veryGood')" value="1"></v-radio>
                    <v-radio :label="this.$t('good')" value="2"></v-radio>
                    <v-radio :label="this.$t('moderate')" value="3"></v-radio>
                    <v-radio :label="this.$t('bad')" value="4"></v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

              <v-divider class="mt-2 pa-2"></v-divider>
              <v-text-field counter maxlength="254" v-model="place.drawing" :label="$t('drawing')">
                LINK zu Zeichnungen (vlt. Fotos)
              </v-text-field>
              <v-text-field counter maxlength="254" v-model="place.description" :label="$t('description')">

              </v-text-field>
              <v-text-field counter maxlength="50" v-model="place.editor" :label="$t('editor')">
              </v-text-field>

            </v-card>
          </v-window-item>


          <!-- Tab item 'images' -->
          <v-window-item value="two">
            <v-card>
              <v-list>
                <v-list-subheader v-if="images.length === 0">
                  {{ $t('not_created_yet', { object: $tc('drawing', 1) }) }}
                </v-list-subheader>


                <template v-for="(image, i) in images" :key="image">
                  <v-card class="imageItem mt-3 d-flex align-center">
                    <v-card-title>Nr. {{ image.imageNumber }}</v-card-title>
                    <v-card-subtitle>{{ image.title }}</v-card-subtitle>
                    <v-img height="150" :src=image.image></v-img>
                    <v-btn color="error" class="ml-2" v-on:click="deleteImage(image)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-card>

                  <v-divider v-if="i !== image.length - 1"></v-divider>
                </template>
              </v-list>
            </v-card>

            <AddButton v-on:click="images_overlay = true" />

            <!-- Image Creation dialog -->
            <v-dialog v-model="images_overlay" max-width="800" persistent>
              <v-card>
                <v-card-title>{{ $t('add', { msg: $t('image') }) }} </v-card-title>
                <v-card-text>

                  <v-text-field disabled v-model="place.id" :label="$t('place_id')">
                  </v-text-field>

                  <v-text-field v-model="image.title" :label="$t('title')"
                    :hint="$t('please_input', { msg: $t('title_of', { msg: $t('image') }) })">
                  </v-text-field>

                  <v-file-input show-size v-model="image.image" prepend-icon="mdi-camera"
                    accept="image/png, image/jpeg, image/bmp">
                  </v-file-input>
                </v-card-text>

                <v-card-actions class="justify-center">
                  <v-btn icon color="primary" v-on:click="addImage()">
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <v-btn icon color="error" @click="images_overlay = false">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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

              <AddButton v-on:click="addPosition()" />

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
        lastSync: '',
        images: []
      },
      image: {
        id: '',
        positionID: '',
        title: '',
        image: [],
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
      images: [],
      images_overlay: false
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
    await this.updateImages();
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
    async updateImages() {
      this.images = await fromOfflineDB.getAllObjectsWithID(
        this.Place.id, 'Place', 'Images', 'images');
    },
    /**
         * Adds a new image-placeholder to the images-array
         */
    async addImage() {
      // Add imageID to the place array of all images
      var newImageID = String(Date.now());
      var rawPlace = toRaw(this.place);
      var rawImage = toRaw(this.image);

      rawPlace.images.push(newImageID);
      rawPlace.lastChanged = Date.now();

      const newImage = {
        id: newImageID,
        imageNumber: null,
        placeID: rawPlace.id,
        title: rawImage.title,
        image: await this.textureToBase64(toRaw(rawImage.image)),
        lastChanged: Date.now(),
        lastSync: ''
      };

      if (this.images.length == 0) {
        newImage.imageNumber = 1;
      } else {
        this.updateImages();
        const imageNumber = Math.max(...this.images.map(o => o.imageNumber));
        const newImageNumber = imageNumber + 1;
        newImage.imageNumber = newImageNumber;
      }

      this.images_overlay = false;
      await fromOfflineDB.updateObject(rawPlace, 'Places', 'places')
      var posID = await fromOfflineDB.addObject(newImage, "Images", "images");
      await fromOfflineDB.addObject({ id: posID, object: 'images' }, 'Changes', 'created');
      await this.updateImages(newImage.id);
    },
    /**
     * Removes an image from IndexedDB and the connected place
     * @param {ProxyObject} image 
     */
    async deleteImage(image) {

      var rawImage = toRaw(image);
      var rawPlace = toRaw(this.place);
      var index = rawPlace.images.indexOf(rawImage.id.toString())

      // Remove the imageID from connected place
      if (index != -1) {
        rawPlace.images.splice(index, 1);
        rawPlace.lastChanged = Date.now();
        await fromOfflineDB.updateObject(rawPlace, 'Places', 'places');
      }

      // Delete the image itself
      await fromOfflineDB.deleteObject(image, 'Images', 'images');
      VueCookies.remove('currentImage');

      await this.updateImages();
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
        models: [],
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