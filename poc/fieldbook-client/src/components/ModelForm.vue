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
            <v-list-item class="modelItem mt-3">
              
              <v-list-item-title class="text-h6">
                Nr. {{ model.modelNumber }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="text-subtitle-1">
                {{ model.title }}
              </v-list-item-subtitle>
              
            </v-list-item>
            <v-spacer/>
          </v-col>

          <v-btn color="primary" class="ma-4" v-on:click="editModel(model)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          <v-btn color="error" class="ma-4" v-on:click="deleteModel(model)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-row>

        <v-divider v-if="i !== models.length - 1"></v-divider>
      </template>
    </v-list>
  </v-card>

  <AddButton v-on:click="create_dialog = true" />

  <!-- MODEL CREATION DIALOG -->
  <v-dialog v-model="create_dialog" max-width="800" persistent>
    <v-card>
      <v-card-title>
        {{ $t('add', { msg: $t('model') }) }}
      </v-card-title>

        <v-row v-if='object.placeNumber > 0'>
          <v-col cols="2">
            <v-card-title>
              Place
            </v-card-title>
          </v-col>

          <v-col cols="10">
            <v-text-field 
              disabled 
              label="Nr."
              v-model="object.placeNumber">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters v-if="object.positionNumber > 0">
          <v-col cols="2">
            <v-card-title>
              Position
            </v-card-title>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              label="Nr."
              class="pr-2"
              v-model="object.positionNumber">
            </v-text-field>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              v-model="object.subNumber" 
              label="Sub-Nr.">
            </v-text-field>
          </v-col>
        </v-row>

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

      <v-card-actions class="justify-center">
        <v-btn icon color="primary" v-on:click="addModel()">
          <v-icon>mdi-content-save-all</v-icon>
        </v-btn>
        <v-btn icon color="error" @click="create_dialog = false">
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- MODEL EDITING DIALOG -->
    <v-dialog v-model="edit_dialog" max-width="800" persistent>
      <v-card class="pa-2">
        <v-card-title>
          {{ $t('edit', { msg: $t('model') }) }}
        </v-card-title>

          <v-row v-if='object.placeNumber > 0'>
            <v-col cols="2">
              <v-card-title>
                Place
              </v-card-title>
            </v-col>

            <v-col cols="10">
              <v-text-field 
                disabled 
                label="Nr."
                v-model="object.placeNumber">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="object.positionNumber > 0">
            <v-col cols="2">
              <v-card-title>
                Position
              </v-card-title>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                label="Nr."
                class="pr-2"
                v-model="object.positionNumber">
              </v-text-field>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                v-model="object.subNumber" 
                label="Sub-Nr.">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="2">
              <v-card-title>
                Model
              </v-card-title>
            </v-col>
            <v-col cols="3">
              <v-text-field 
                disabled
                class="pr-2"
                :label="$t('number')"
                v-model="model.modelNumber">
              </v-text-field>
            </v-col>
            <v-col cols="7">
              <v-text-field 
                v-model="model.title" 
                :label="$t('title')" 
                :hint="$t('please_input',
                  { msg: $t('title_of', { msg: $t('model') }) })">
              </v-text-field>
            </v-col>
          </v-row>

          <v-file-input
            show-size 
            accept=".glb" 
            v-model="temp_editing_model" 
            :label="$t('input', { msg: $t('model') })">
          </v-file-input>

        <v-card-actions class="justify-center">
          <v-btn icon color="primary" v-on:click="saveModel()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
          <v-btn icon color="error" @click="edit_dialog = false; updateModels()">
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
      temp_editing_model: [],
      backup_model: '',
      models: [],
      create_dialog: false,
      edit_dialog: false,
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
     * Saves an edited model to IndexedDB
     */
    async saveModel() {
      var rawModel = toRaw(this.model);
      if (this.temp_editing_model.length == 0) {
        rawModel.model = this.backup_model;
      } else {
        rawModel.model = await this.modelToArrayBuffer(this.temp_editing_model);
      }

      await fromOfflineDB.updateObject(rawModel, 'Models', this.object_type.toLowerCase());
      await this.updateModels();

      this.clearModelProxy();
      this.edit_dialog = false;
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
      this.create_dialog = false;

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
     * Fill model VueProxy variables with model data that is to be edited 
     * and open edit dialog.
     * @param {*} item 
     */
    editModel(item) {
      this.backup_model = item.model;
      this.model = toRaw(item)

      this.edit_dialog = true;
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
     * Clears relevant model VueProxy data for future model creation/editing
     */
    clearModelProxy() {
      this.model.id = '';
      this.model.positionID = '';
      this.model.placeID = '';
      this.model.title = '';
      this.model.model = [];
      this.temp_editing_model = [];
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