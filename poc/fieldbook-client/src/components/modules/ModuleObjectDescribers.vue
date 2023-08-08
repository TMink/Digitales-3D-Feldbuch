<template>
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
                    :items="materials" class="ma-1 px-2 pt-2"
                    v-model="position.material" 
                    :hint="$tc('please_input', 2, { msg: 'Material' })">
                </v-combobox>
            </v-card>
        </v-col>
    </v-row>
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
        hasSubNumber: false,
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
      hasUnsavedChanges: false,
      componentHasLoaded: false,
    }
  },
  watch: {
    'position': {
      handler: 'handlePositionChange',
      deep: true,
    },
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
   * Initialize data from localDB and .env to the reactive Vue.js data
   */
  async created() {
    const acID = String(VueCookies.get('currentActivity'))
    var activity = await fromOfflineDB.getObject(acID, 'Activities', 'activities')
    
    const plID = String(VueCookies.get('currentPlace'))
    var place = await fromOfflineDB.getObject(plID, 'Places', 'places')
    
    const poID = String(VueCookies.get('currentPosition'))
    var position = await fromOfflineDB.getObject(poID, 'Positions', 'positions')
    
    this.$emit("view", activity.activityNumber + ' ' + place.placeNumber + ' ' + position.positionNumber);
    

    this.materials = JSON.parse(import.meta.env.VITE_MATERIALS);
    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

    await fromOfflineDB.syncLocalDBs();
    await this.updatePosition();
    this.componentHasLoaded = true;
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
      
      if (rawPosition.hasSubNumber) {
        var newSubNumber = this.calcSubNumber(rawPosition, test);
        rawPosition.subNumber = newSubNumber;
      }

      await fromOfflineDB.updateObject(rawPosition, 'Positions', 'positions');
      this.hasUnsavedChanges = false;
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
      this.hasUnsavedChanges = false;
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
     * Gets called every time some info of the current position changes.
     * Once a change has happend, the flag `hasUnsavedChanges` gets set to `true`
     */
    handlePositionChange() {
      if (this.hasUnsavedChanges) {
        return
      }

      if (this.componentHasLoaded) {
        this.hasUnsavedChanges = true;
      }
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
  
<style scoped>
</style>
  