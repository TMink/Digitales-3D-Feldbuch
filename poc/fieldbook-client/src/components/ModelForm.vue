<template>
  <v-card>
    <v-list>
      <v-list-subheader v-if="models.length === 0">
        {{ $t('not_created_yet', { object: $tc('model', 1) }) }}
      </v-list-subheader>

      <!-- MODEL LIST -->
      <template v-for="(model, i) in models" :key="model">
        <v-row no-gutters class="align-center">
          <v-col>
            <v-list-item class="modelItem mt-3" v-on:click="moveToModel(model.id)">
              
              <v-list-item-title class="text-h6">
                Nr. {{ model.modelNumber }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="text-subtitle-1">
                {{ model.title }}
              </v-list-item-subtitle>
              
            </v-list-item>
            <v-spacer/>
          </v-col>

          <v-btn color="error" class="ma-4" v-on:click="deleteModel(model)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>

        <v-divider v-if="i !== models.length - 1"></v-divider>
      </template>
    </v-list>
  </v-card>

  <AddButton v-on:click="models_overlay = true" />

  <!-- MODEL CREATION DIALOG -->
  <v-dialog v-model="models_overlay" max-width="800" persistent>
    <v-card>
      <v-card-title>
        {{ $t('add', { msg: $t('model') }) }}
      </v-card-title>

      <v-card-text>
        <v-text-field 
          disabled 
          v-model="object.id" 
          :label="$t('position_id')"
          :hint="$t('please_input', { msg: $t('position_id') })">
        </v-text-field>

        <v-text-field 
          v-model="model.title" 
          :label="$t('title')" 
          :hint="$t('please_input',
          { msg: $t('title_of', { msg: $t('model') }) })">
        </v-text-field>

        <v-file-input 
          show-size 
          accept=".glb" 
          v-model="model.model" 
          :label="$t('input', { msg: $t('model') })">
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
</template>

<script>
import AddButton from '../components/AddButton.vue';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';

export default {
  name: "ModelForm",
  components: {
    AddButton
  },
  /**
   * Props from PlaceForm/PositionForm
   */
  props: {
    object_id: String,
    object_type: String,
  },
  emits: ['addModel'],
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      object: '',
      model: {
        id: '',
        positionID: '',
        placeID: '',
        title: '',
        model: [],
      },
      models: [],
      models_overlay: false,
      model_dialog: false,
      is_required: [v => !!v || 'Pflichtfeld'],
    }
  },
  /**
   * Initialize data from IndexedDB to the reactive Vue.js data
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateObject();
    await this.updateModels();
  },
  methods: {
    /**
     * Update reactive Vue.js object data
     */
    async updateObject() {
      this.object = await fromOfflineDB.getObject(this.object_id,
        this.object_type, this.object_type.toLowerCase());
    },
    
    /**
     * Update reactive Vue.js model data
     */
    async updateModels() {
      var objectType = this.object_type.substring(0, this.object_type.length - 1);
      this.models = await fromOfflineDB.getAllObjectsWithID(
        this.object_id, objectType, 'Models', this.object_type.toLowerCase());
        
    },

    /**
     * Adds a new model to the models-array
     */
    async addModel() {
      var ctx = this;
      // add modelID to the object array of all models
      const newModelID = String(Date.now());
      this.object.models.push(newModelID);
      this.object.lastChanged = Date.now();

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
        scale: null,
        rotation: null,
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
      await fromOfflineDB.updateObject(
        toRaw(this.object), this.object_type, this.object_type.toLowerCase());
      await fromOfflineDB.addObject(
        newModel, 'Models', this.object_type.toLowerCase());
      await fromOfflineDB.addObject(
        {id: newModelID, object: 'models' }, 'Changes', 'created');
      await this.updateModels(newModel.id);

      ctx.$emit('addModel', newModel.id);
    },
    /**
     * Deletes a model from IndexedDB and the connected place
     * @param {Object} model 
     */
    async deleteModel(model) {

      // remove the modelID from connected place
      var index = this.object.models.indexOf(model.id);
      if (index != -1) {
        this.object.models.splice(index, 1)
        this.object.lastChanged = Date.now();
        await fromOfflineDB.updateObject(
          toRaw(this.object), this.object_type, this.object_type.toLowerCase());
      }

      // delete the model itself
      await fromOfflineDB.deleteObject(
        model, 'Models', this.object_type.toLowerCase());
      VueCookies.remove('currentModel');
      await this.updateModels();
    },

    /**
     * Change model data to ArrayBuffer
     * @param {Object} rawData
     * @return {ArrayBuffer} modelBuffer
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
  }
}
</script>

<style scoped>
  #imgContainer {
    align-items: center;
    justify-content: center;
    margin: auto;
    box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  img {
    transform-origin: center;
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
</style>