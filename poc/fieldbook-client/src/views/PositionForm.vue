<template>
  <v-container fluid>
    <v-row>
      <!-- SIDE TABS -->
      <v-col cols="2">
        <v-card>
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0">
              {{ $t('general') }}
            </v-tab>
            <v-tab value="two" rounded="0">
              {{ $tc('picture', 2) }}
            </v-tab>
            <!-- <v-tab value="three" rounded="0">
              {{ $t('additional', { msg: $t('parameter') }) }}
            </v-tab> -->
            <v-tab value="four" rounded="0">
              {{ $tc('model', 2) }}
            </v-tab>
            <v-btn rounded="0" color="primary" v-on:click="savePosition()">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion()">
              {{ $t('delete') }}
            </v-btn>
            <v-btn rounded="0" color="secondary" v-on:click="goBack">
              {{ $t('cancel') }}
            </v-btn>
            <ConfirmDialog ref="confirm" />
          </v-tabs>
        </v-card>
      </v-col>

      <v-col>
        <v-window v-model="tab">
          <!-- TAB ITEM 'GENERAL' -->
          <v-window-item value="one">
            <v-card class="pa-4">
              <v-row class="pt-2 pb-6">
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" label="Posnr *" :rules="is_required" v-model="position.positionNumber"
                    :hint="$tc('please_input', 2, { msg: 'Posnr' })">
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-text-field color="primary" label="Unternr *" :rules="is_required" v-model="position.subNumber"
                    :hint="$tc('please_input', 2, { msg: 'Unternr' })">
                  </v-text-field>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-combobox color="primary" :items="titles" label="Ansprache" :rules="is_required"
                    v-model="position.title" :hint="$tc('please_input', 2, { msg: 'Ansprache' })">
                  </v-combobox>
                </v-col>
                <v-col cols="12" lg="2">
                  <v-combobox color="primary" label="Material" :items="materials" :rules="is_required"
                    v-model="position.material" :hint="$tc('please_input', 2, { msg: 'Material' })">
                  </v-combobox>
                </v-col>
                <v-col cols="12" lg="4">
                  <v-card class="pa-4" color="accent">
                    <div class="text-h4 text-center" :label="$t('lastEdited')">
                      {{ position.date }}
                    </div>
                    <div class="text-grey text-center">
                      {{ $t('lastEdited') }}
                    </div>
                  </v-card>
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
                <v-col cols="12" lg="3">
                  <v-text-field color="primary" hide-details label="Rechtswert *" :rules="is_required"
                    v-model="position.right" :hint="$tc('please_input', 2, { msg: 'Rechtswert' })">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="3">
                  <v-text-field color="primary" hide-details label="Hochwert *" :rules="is_required" v-model="position.up"
                    :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="3">
                  <v-text-field color="primary" hide-details label="Höhe *" :rules="is_required" v-model="position.height"
                    :hint="$tc('please_input', 2, { msg: 'Höhe' })">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <v-col cols="12" lg="6">
                <v-card height="100%">
                  <v-col cols="12" lg="12">
                    <v-text-field color="primary" label="Anzahl" v-model="position.count"
                      :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
                    </v-text-field>
                  </v-col>
                </v-card>
              </v-col>
              <v-col cols="12" lg="6">
                <v-card>
                  <v-col cols="12" lg="12">
                    <v-text-field color="primary" label="Gewicht" v-model="position.weight"
                      :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
                    </v-text-field>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <v-col cols="12" lg="12">
                <v-card>
                  <v-col cols="12" lg="12">
                    <v-textarea color="primary" counter rows="4" no-resize maxlength="254" :label="$t('description')"
                      v-model="position.description">
                    </v-textarea>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <v-col cols="12" lg="6">
                <v-card height="100%">
                  <v-col cols="12" lg="12">
                    <v-combobox color="primary" counter maxlength="40" :items="datings" :label="$t('dating')"
                      v-model="position.dating">
                    </v-combobox>
                  </v-col>
                </v-card>
              </v-col>
              <v-col cols="12" lg="6">
                <v-card>
                  <v-col cols="12" lg="12">
                    <v-text-field color="primary" label="AnspracheVon" v-model="position.addressOf"
                      :hint="$tc('please_input', 2, { msg: 'AnsrpacheVon' })">
                    </v-text-field>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- TAB ITEM 'IMAGES' -->
          <!-- TAB ITEM 'IMAGES' -->
          <v-window-item value="two">
            <ImageForm :object_id="position.id" object_type="Positions" />
          </v-window-item>

          <!-- TAB ITEM 'TEXTS' -->
          <!-- TAB ITEM 'TEXTS' -->
          <!-- <v-window-item value="three">
            <v-list-subheader v-if="texts.length === 0">
              {{ $t('not_created_yet',
                {
                  object: $t('additional',
                    { msg: $tc('parameter', 1) })
                })
              }}
            </v-list-subheader>
            <template v-for="text in texts" :key="text">
              <v-card>
                <v-list>
                  <v-list-item>
                    <v-row class="align-center no-gutters">
                      <v-col cols="3">
                        <v-combobox hide-details="true" v-model="text.title" :label="$t('title')" :items="['Höhe',
                          'Gewicht',
                          'Material',
                          'Datum',
                          'Datierung',
                          'Kommentar']" @update:modelValue="saveText(text)">
                        </v-combobox>
                      </v-col>

                      <v-col cols="7">
                        <v-text-field hide-details="true" v-model="text.text" :label="$t('content')"
                          @update:modelValue="saveText(text)">
                        </v-text-field>
                      </v-col>

                      <v-col cols="1">
                        <v-btn color="error" class="ma-2" v-on:click="deleteText(text)">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-card>
            </template>
            <AddButton v-on:click="addText()" />
          </v-window-item> -->

          <!-- Tab item 'MODELS' -->
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

                    <v-btn color="error" class="ml-3 mt-2" v-on:click="deleteModel(model)">
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
                <v-card-title>
                  {{ $t('add', { msg: $t('model') }) }}
                </v-card-title>

                <v-card-text>
                  <v-text-field disabled v-model="position.id" :label="$t('position_id')"
                    :hint="$t('please_input', { msg: $t('position_id') })">
                  </v-text-field>

                  <v-text-field v-model="model.title" :label="$t('title')" :hint="$t('please_input',
                    { msg: $t('title_of', { msg: $t('model') }) })">
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
  <v-alert closable type="error" density="compact" variant="outlined" v-model="error_dialog">
    {{ error_message }}
  </v-alert>
</template>
  
<script>
/**
 * Methods overview:
 *  updatePosition  - Updates existing presentation of the position
 *  updateImage     - Updates existing presentation of image
 *  updateText      - Updates existing presentation of text
 *  savePosition    - Saves the current processing status
 *  confirmDeletion - Opens the confirmation dialog
 *  deletePosition  - Deletes the currently selected position
 *  addImage        - Adds a new image to the position
 *  deleteImage     - Deletes an image from the position
 *  addText         - Adds a new text to the list
 *  saveText        - Saves changes to a text of the position
 *  deleteText      - Deletes a text from the position
 *  textureToBase64 - Changes texture data to base64
 *  calcSubNumber   - Calculates the subnumber depending on prev position
 *  goBack          - Goes back to PlaceForm
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import AddButton from '../components/AddButton.vue';
import ImageForm from '../components/ImageForm.vue';
import { toRaw } from 'vue';

export default {
  name: 'PositionCreation',
  components: {
    ConfirmDialog,
    AddButton,
    ImageForm
  },
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      position: {
        id: '',
        placeID: '',
        positionNumber: '',
        subNumber: '',
        right: '',
        up: '',
        height: '',
        count: '',
        weight: '',
        material: '',
        title: '',
        description: '',
        dating: '',
        addressOf: '',
        date: '',
        isSeperate: false,

        texts: [],
        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: '',
      },
      image: {
        id: '',
        positionID: '',
        title: '',
        image: [],
      },
      text: {
        id: '',
        positionID: '',
        title: '',
        text: '',
      },
      model: {
        id: '',
        placeID: '',
        positionID: '',
        title: '',
        model: [],
      },
      images: [],
      texts: [],
      materials: [],
      titles: [],
      datings: [],
      image_dialog: false,
      models: [],
      models_overlay: false,
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      tab: null,
    }
  },
  /**
   * Initialize data from localDB and .env to the reactive Vue.js data
   */
  async created() {
    this.$emit("view", this.$t('edit', { msg: this.$tc('position', 1) }));
    this.materials = JSON.parse(import.meta.env.VITE_MATERIALS);
    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

    await fromOfflineDB.syncLocalDBs();
    await this.updatePosition();
    await this.updateImages();
    await this.updateTexts();
    await this.updateModels();
  },
  methods: {
    /**
     * Update reactive Vue.js place data
     */
    async updatePosition() {
      /* Get id of selected place */
      const currentPosition = VueCookies.get("currentPosition")

      /* Get all data of selected place */
      if (this.$route.params.positionID != 'new') {
        const data = await fromOfflineDB.getObject(
          currentPosition, 'Positions', 'positions');
        this.position = data
      }
    },
    /**
     * Update reactive Vue.js positions data
     */
    async updateImages() {
      this.images = await fromOfflineDB.getAllObjectsWithID(
        this.position.id, 'Position', 'Images', 'images');
    },
    /**
     * Update reactive Vue.js models data
     */
    async updateTexts() {
      this.texts = await fromOfflineDB.getAllObjectsWithID(
        this.position.id, 'Position', 'Texts', 'texts');
    },
    /**
     * Save a Position to local storage for the current place
     */
    async savePosition() {
      if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      //convert from vue proxy to JSON object
      const rawPosition = toRaw(this.position);
      rawPosition.lastChanged = Date.now();

      var test = await fromOfflineDB.getObjectBefore(rawPosition.id, 'Positions', 'positions');
      var newSubNumber = this.calcSubNumber(rawPosition, test);
      rawPosition.subNumber = newSubNumber;

      await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions')
      this.$router.push({ name: "PositionsOverview" });
    },
    /**
     * Opens the confirmation dialog
     */
    async confirmDeletion() {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete the position " + this.position.positionNumber + "?"
        )
      ) {
        this.deletePosition();
      }
    },
    /**
     * Removes a position from the local storage and the cookies
     */
    async deletePosition() {

      // Remove the positionID from connected place
      const placeID = String(VueCookies.get('currentPlace'));
      var place = await fromOfflineDB.getObject(placeID, 'Places', 'places');
      var rawPosition = toRaw(this.position);
      var index = place.positions.indexOf(rawPosition.id.toString())

      if (index != -1) {
        place.positions.splice(index, 1);
        place.lastChanged = Date.now();
        await fromOfflineDB.updateObject(place, 'Places', 'places');
      }

      // Delete the position itself
      await fromOfflineDB.deleteObject(rawPosition, 'Positions', 'positions')
      VueCookies.remove('currentPosition');

      this.$router.push({ name: "PositionsOverview" });
    },

    /**
     * Adds a new text-placeholder to the position and IndexedDB
     */
    async addText() {
      // Add textID to the position array of all texts
      var newTextID = String(Date.now());
      var rawPosition = toRaw(this.position);

      // update lastChanged date of position
      rawPosition.texts.push(newTextID)
      rawPosition.lastChanged = Date.now()

      // new text data
      const newText = {
        id: newTextID,
        positionID: rawPosition.id,
        title: '',
        text: '',
        lastChanged: Date.now(),
        lastSync: ''
      };

      // update IndexedDB
      await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions')
      await fromOfflineDB.addObject(newText, "Texts", "texts");
      await fromOfflineDB.addObject({ id: newTextID, object: 'texts' }, 'Changes', 'created');
      await this.updateTexts();
    },

    /**
     * Saves the text changes to IndexedDB
     * @param {ProxyObject} text 
     */
    async saveText(text) {
      //convert from vue proxy to JSON object
      const rawText = toRaw(text);
      rawText.lastChanged = Date.now();

      await fromOfflineDB.updateObject(rawText, 'Texts', 'texts')
    },

    /**
     * Removes a text entry from IndexedDB and the connected position
     * @param {ProxyObject} text 
     */
    async deleteText(text) {
      var rawPosition = toRaw(this.position);
      var rawText = toRaw(text);
      var index = rawPosition.texts.indexOf(rawText.id.toString());

      // Remove the textID from connected position
      if (index != -1) {
        rawPosition.texts.splice(index, 1);
        rawPosition.lastChanged = Date.now();
        await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions');
      }

      // Delete the text itself
      await fromOfflineDB.deleteObject(text, 'Texts', 'texts');
      VueCookies.remove('currentText');
      await this.updateTexts();
    },

    /**
     * Change texture data to base64
     * @param {*} rawData 
     */
    async textureToBase64(rawData) {

      const output = await new Promise((resolve) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          resolve(b64)
        }
        reader.readAsDataURL(f);

      });
      return output;
    },

    /**
     * Calculates the SubNumber of a position
     */
    calcSubNumber(curPos, prevPos) {
      if (prevPos == undefined) {
        return 1;
      }

      var subNumber = prevPos.subNumber;

      if (/* curPos.activity == prevPos.activity && */
        curPos.placeID == prevPos.placeID &&
        curPos.positionNumber == prevPos.positionNumber &&
        curPos.right == prevPos.right &&
        curPos.up == prevPos.up &&
        curPos.height == prevPos.height &&
        curPos.dating == prevPos.dating &&
        curPos.addressOf == prevPos.addressOf &&
        curPos.date == prevPos.date &&
        !curPos.seperate) {
        return parseInt(subNumber);
      }

      return parseInt(subNumber) + 1;
    },

    /**
     * Cancels the PositionForm and returns to the PlaceForm of current place
     */
    goBack: function () {
      this.$router.push({ name: "PositionsOverview" });
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
    async addModel() {
      const newModelID = String(Date.now());
      this.position.models.push(newModelID);
      this.position.lastChanged = Date.now();

      // new model data
      const newModel = {
        id: newModelID,
        placeID: String(VueCookies.get('currentPlace')),
        positionID: String(VueCookies.get('currentPosition')),
        title: this.model.title,
        model: await this.modelToArrayBuffer(toRaw(this.model.model)),
        color: '#ffffff',
        opacity: 1,
        coordinates: null,
        lastChanged: Date.now(),
        lastSync: ''
      }

      // set new modelNumber
      if (this.models.length == 0) {
        newModel.modelNumber = 1;
      } else {
        this.updateModels();
        const modelNumber = Math.max(...this.models.map(o => o.modelNumber))
        const newModelNumber = modelNumber + 1;
        newModel.modelNumber = newModelNumber;
      }

      // hide model creation dialog
      this.models_overlay = false;

      // update IndexedDB
      await fromOfflineDB.updateObject(toRaw(this.position), 'Positions', 'positions');
      await fromOfflineDB.addObject(newModel, 'Models', 'positions');
      await fromOfflineDB.addObject({ id: newModelID, object: 'models' }, 'Changes', 'created');
      await this.updateModels(newModel.id);

    },
    async deleteModel() {

    },
    async updateModels() {
      this.models = await fromOfflineDB.getAllObjectsWithID(this.position.id, 'Position', 'Models', 'positions');
    },
  }
};
</script>
  
<style scoped></style>
  