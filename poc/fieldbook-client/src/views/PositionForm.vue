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
            <!-- CARD 1 GENERAL -->
            <v-card class="pa-4">
              <v-row class="pt-2 pb-6">

                <v-col lg="2">
                  <v-text-field 
                    color="primary" 
                    label="Posnr *" 
                    :rules="is_required" 
                    v-model="position.positionNumber"
                    :hint="$tc('please_input', 2, { msg: 'Posnr' })">
                  </v-text-field>
                </v-col>

                <v-col lg="2">
                  <v-text-field 
                    color="primary" 
                    label="Unternr *" 
                    :rules="is_required" 
                    v-model="position.subNumber"
                    :hint="$tc('please_input', 2, { msg: 'Unternr' })">
                  </v-text-field>
                </v-col>

                <v-col lg="2">
                  <v-combobox 
                    color="primary" 
                    :items="titles" 
                    label="Ansprache" 
                    :rules="is_required"
                    v-model="position.title" 
                    :hint="$tc('please_input', 2, { msg: 'Ansprache' })">
                  </v-combobox>
                </v-col>

                <v-col lg="2">
                  <v-combobox 
                    color="primary" 
                    label="Material" 
                    :items="materials" 
                    :rules="is_required"
                    v-model="position.material" 
                    :hint="$tc('please_input', 2, { msg: 'Material' })">
                  </v-combobox>
                </v-col>

                <v-col lg="4">
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

            <!-- CARD 2 GAUSS-KRÜGER -->
            <v-card>
              <v-card-text>
                <div>
                  <h2 class="text-h6 font-weight-medium pb-3">Gauss-Krüger-Koordinaten</h2>
                </div>
              </v-card-text>
              <v-row class="pb-4" justify="center">
                <v-col cols="12" lg="3">
                  <v-text-field 
                    color="primary" 
                    hide-details 
                    label="Rechtswert *" 
                    :rules="is_required"
                    v-model="position.right" 
                    :hint="$tc('please_input', 2, { msg: 'Rechtswert' })">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="3">
                  <v-text-field 
                    hide-details 
                    color="primary" 
                    label="Hochwert *" 
                    :rules="is_required" 
                    v-model="position.up"
                    :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
                  </v-text-field>
                </v-col>
                <v-divider class="mt-1 mb-n2" vertical></v-divider>
                <v-col cols="12" lg="3">
                  <v-text-field 
                    hide-details 
                    label="Höhe *" 
                    color="primary" 
                    :rules="is_required" 
                    v-model="position.height"
                    :hint="$tc('please_input', 2, { msg: 'Höhe' })">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>


            <v-row>
              <v-col cols="12" lg="6">
                <!-- CARD 3 COUNT -->
                <v-card height="100%">
                  <v-col cols="12" lg="12">
                    <v-text-field 
                      color="primary" 
                      label="Anzahl" 
                      v-model="position.count"
                      :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
                    </v-text-field>
                  </v-col>
                </v-card>
              </v-col>

              <v-col cols="12" lg="6">
                <!-- CARD 4 WEIGHT -->
                <v-card>
                  <v-col cols="12" lg="12">
                    <v-text-field 
                      color="primary" 
                      label="Gewicht" 
                      v-model="position.weight"
                      :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
                    </v-text-field>
                  </v-col>
                </v-card>
              </v-col>
            </v-row>

            <v-spacer class="pa-3"></v-spacer>

            <!-- CARD 5 DESCRIPTIOPN -->
            <v-card class="pa-3">
              <v-textarea 
                counter 
                rows="4" 
                no-resize 
                color="primary" 
                maxlength="254" 
                :label="$t('description')"
                v-model="position.description">
              </v-textarea>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <!-- CARD 6 DATING -->
              <v-col lg="6">
                <v-card class="pa-3">
                    <v-combobox 
                      counter 
                      maxlength="40" 
                      color="primary" 
                      :items="datings" 
                      :label="$t('dating')"
                      v-model="position.dating">
                    </v-combobox>
                </v-card>
              </v-col>

              <!-- CARD 7 EDITOR -->
              <v-col lg="6">
                <v-card class="pa-3">
                  <v-text-field 
                    color="primary" 
                    label="Ansprache Von" 
                    v-model="position.addressOf"
                    :hint="$tc('please_input', 2, { msg: 'Ansprache Von' })">
                  </v-text-field>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- TAB ITEM 'IMAGES' -->
          <v-window-item value="two">
            <ImageForm :object_id="position.id" object_type="Positions" />
          </v-window-item>

          <!-- Tab item 'MODELS' -->
          <v-window-item value="four">
            <ModelForm :object_id="position.id" object_type="Positions" />
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
  <v-alert 
    closable 
    type="error" 
    density="compact" 
    variant="outlined" 
    v-model="error_dialog">
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
 *  calcSubNumber   - Calculates the subnumber depending on prev position
 *  goBack          - Goes back to PlaceForm
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import ImageForm from '../components/ImageForm.vue';
import ModelForm from '../components/ModelForm.vue';
import { toRaw } from 'vue';

export default {
  name: 'PositionCreation',
  components: {
    ConfirmDialog,
    ImageForm,
    ModelForm
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
      images: [],
      texts: [],
      materials: [],
      titles: [],
      datings: [],
      models: [],
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
     * Update reactive Vue.js model data
     */
    async updateModels() {
      this.models = await fromOfflineDB.getAllObjectsWithID(
        this.position.id, 'Position', 'Models', 'positions');
    },
    /**
     * Save a Position to local storage for the current place
     */
    async savePosition() {
      /* if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      } */

      //convert from vue proxy to JSON object
      const rawPosition = toRaw(this.position);
      console.log(rawPosition)
      rawPosition.positionNumber = Number(rawPosition.positionNumber);
      rawPosition.lastChanged = Date.now();
      
      console.log(rawPosition)
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
     * Calculates the SubNumber of a position
     */
    calcSubNumber(curPos, prevPos) {
      if (prevPos == undefined) {
        return 1;
      }

      if (prevPos.positionNumber < curPos.positionNumber) {
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
  
  }
};
</script>
  
<style scoped></style>
  