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
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion(position)">
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
              <v-row class="pt-2">

                <v-col lg="2">
                  <v-text-field 
                    color="primary" 
                    :label="$t('posNumber') +' *'"
                    :rules="is_required" 
                    v-model="position.positionNumber"
                    @keypress="filterAllNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: $t('posNumber') })">
                  </v-text-field>
                </v-col>

                <v-col lg="2">
                  <v-text-field 
                    color="primary" 
                    :label="$t('subNumber') +' *'"
                    :rules="is_required" 
                    v-model="position.subNumber"
                    :hint="$tc('please_input', 2, { msg: $t('subNumber') })">
                  </v-text-field>
                </v-col>

                <v-col lg="4">
                  <v-checkbox
                    class="pl-4"
                    hide-details
                    v-model="position.isSeparate"
                    color="primary"
                    :label="$t('isSeparate')">
                  </v-checkbox>
                  <!-- maybe as tooltip -->
                  <!-- <div class="text-caption">
                    Check, if the position should be saved with a separate
                    sub-number, even though the information is similar to the 
                    previous position.
                  </div> -->
                </v-col>
              
                <v-col lg="4">
                  <v-card class="pa-4" color="accent">
                    <div 
                      class="text-h4 text-center" 
                      :label="$t('lastEdited')">
                      {{ position.date }}
                    </div>
                    <div class="text-grey text-center">
                      {{ $t('lastEdited') }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col lg="6">
                  <v-combobox
                    color="primary" 
                    :items="titles" 
                    :label="$tc('title', 2)" 
                    :rules="is_required"
                    v-model="position.title">
                  </v-combobox>
                </v-col>

                <v-col lg="6">
                  <v-combobox 
                    counter
                    color="primary" 
                    :items="datings" 
                    :label="$t('dating') + ' *'"
                    v-model="position.dating">
                  </v-combobox>
                </v-col> 
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <!-- CARD 2 GAUSS-KRÜGER -->
            <v-card>
              <v-card-text>
                <h2 class="text-h6 font-weight-medium pb-3">
                  {{ $t('gaussKrueger') }}
                </h2>
              </v-card-text>
              <v-row class="pa-4 pt-0" justify="center">
                <v-col lg="3">
                  <v-text-field
                    color="primary" 
                    hide-details 
                    :label="$t('right') + ' *'" 
                    :rules="is_required"
                    v-model="position.right" 
                    @keypress="filterNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: 'Rechtswert' })">
                  </v-text-field>
                </v-col>

                <v-divider class="mt-1 mb-n2" vertical></v-divider>

                <v-col lg="3">
                  <v-text-field 
                    hide-details 
                    color="primary" 
                    :label="$t('up') + ' *'" 
                    :rules="is_required" 
                    v-model="position.up"
                    @keypress="filterNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
                  </v-text-field>
                </v-col>

                <v-divider class="mt-1 mb-n2" vertical></v-divider>

                <v-col lg="3">
                  <v-text-field
                    hide-details 
                    :label="$t('height') + ' *'" 
                    color="primary" 
                    :rules="is_required" 
                    v-model="position.height"
                    @keypress="filterNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: 'Höhe' })">
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card>

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <!-- CARD 3 COUNT -->
              <v-col lg="3">
                <v-card height="100%">
                  <v-text-field
                    color="primary" 
                    :label="$t('count')" 
                    class="ma-1 px-2 pt-2"
                    v-model="position.count"
                    @keypress="filterAllNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
                  </v-text-field>
                </v-card>
              </v-col>

              <!-- CARD 4 WEIGHT -->
              <v-col lg="3">
                <v-card>
                  <v-text-field 
                    color="primary" 
                    :label="$t('weight')" 
                    class="ma-1 px-2 pt-2" 
                    v-model="position.weight"
                    @keypress="filterNonNumeric(event)"
                    :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
                  </v-text-field>
                </v-card>
              </v-col>

              <!-- CARD 5 MATERIAL -->
              <v-col lg="6">
                <v-card>
                  <v-combobox
                    color="primary" 
                    :label="$t('material')"  
                    :items="materials"
                    :rules="is_required"
                    class="ma-1 px-2 pt-2"  
                    v-model="position.material" 
                    :hint="$tc('please_input', 2, { msg: 'Material' })">
                  </v-combobox>
                </v-card>
              </v-col>
            </v-row>           

            <v-spacer class="pa-3"></v-spacer>

            <v-row>
              <!-- CARD 6 DESCRIPTION -->
              <v-col lg="6">
                <v-card class="pa-3" height="100%">
                  <v-textarea 
                    counter 
                    rows="4" 
                    no-resize 
                    color="primary" 
                    :label="$t('description')"
                    v-model="position.description">
                  </v-textarea>
                </v-card>
              </v-col>
              
              <!-- CARD 7 EDITOR -->
              <v-col lg="6">
                <v-card class="pa-3" height="100%">
                  <v-textarea
                    color="primary"
                    rows="4" 
                    :label="$t('editor')" 
                    v-model="position.addressOf"
                    no-resize
                    :hint="$tc('please_input', 2, { msg: 'Ansprache von' })">
                  </v-textarea>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- TAB ITEM 'IMAGES' -->
          <v-window-item value="two">
            <ImageForm 
              object_type="Positions" 
              :object_id="position.id" 
              @addImage="addImage($event)"/>
          </v-window-item>

          <!-- Tab item 'MODELS' -->
          <v-window-item value="four">
            <ModelForm 
              object_type="Positions" 
              :object_id="position.id" 
              @addModel="addModel($event)"/>
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
  emits: ['view'],
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
        isSeparate: false,

        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: '',
      },
      materials: [],
      titles: [],
      datings: [],
      error_dialog: false,
      error_message: '',
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
      rawPosition.positionNumber = Number(rawPosition.positionNumber);
      rawPosition.lastChanged = Date.now();
      
      var test = await fromOfflineDB.getObjectBefore(rawPosition.id, 'Positions', 'positions');
      var newSubNumber = this.calcSubNumber(rawPosition, test);
      rawPosition.subNumber = newSubNumber;

      await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions')
      this.$router.push({ name: "PositionsOverview" });
    },
    /**
     * Opens the confirmation dialog
     * @param {Object} position
     */
    async confirmDeletion(position) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          this.$t('confirm_del', {
            object: this.$tc('position', 1),
            object_nr: position.positionNumber
          })
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
     * Adds a new `image_id` to the `images`-array of this position
     * @param {String} image_id 
     */
    addImage(image_id) {
      if (this.position.images == undefined) {
        this.position.images = [image_id];
      } else {
        this.position.images.push(image_id);
      }
    },

    /**
     * Adds a new `model_id` to the `models`-array of this position
     * @param {String} model_id 
     */
    addModel(model_id) {
      if (this.position.models == undefined) {
        this.position.models = [model_id];
      } else {
        this.position.models.push(model_id);
      }
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
        curPos.title == prevPos.title &&
        curPos.date == prevPos.date &&
        !curPos.isSeparate) {
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
     * Prevents the input of non numeric values 
     * @param {*} evt 
     */
    filterAllNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
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
  
  }
};
</script>
  
<style scoped></style>
  