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

              <canvas :id="'canvas' + i"></canvas>
              
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
    <v-card class="pa-4">
      <v-card-title>
        {{ $t('add', { msg: $t('model') }) }}
      </v-card-title>

        <v-row v-if='object.placeNumber > 0'>
          <v-col cols="2">
            <v-card-title>
              {{ $t('place') }}
            </v-card-title>
          </v-col>

          <v-col cols="10">
            <v-text-field 
              disabled 
              :label="$tc('number', 2)"
              v-model="object.placeNumber">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters v-if="object.positionNumber > 0">
          <v-col cols="2">
            <v-card-title>
              {{ $t('position') }}
            </v-card-title>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              :label="$tc('number', 2)"
              class="pr-2"
              v-model="object.positionNumber">
            </v-text-field>
          </v-col>

          <v-col cols="5">
            <v-text-field 
              disabled 
              v-model="object.subNumber" 
              :label="$t('subNumber')">
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
                {{ $t('place')}}
              </v-card-title>
            </v-col>

            <v-col cols="10">
              <v-text-field 
                disabled 
                :label="$tc('number', 2)"
                v-model="object.placeNumber">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="object.positionNumber > 0">
            <v-col cols="2">
              <v-card-title>
                {{ $t('position') }}
              </v-card-title>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                :label="$tc('number', 2)" 
                class="pr-2"
                v-model="object.positionNumber">
              </v-text-field>
            </v-col>

            <v-col cols="5">
              <v-text-field 
                disabled 
                v-model="object.subNumber" 
               :label="$t('subNumber')">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="2">
              <v-card-title>
                {{ $t('model') }}
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
import * as THREE from 'three';

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
      canvases: [],
      contexts: [],
      scenes: [],
      cameras: [],
      rendererToken: false,
      modelsToken: 0,
      renderer: null,
      thanksBob: true,
      deleteToken: false,
      addToken: false,
      stopAnimation: true,
    }
  },

  watch: {
    'models': {
      handler: async function(event) {

        if ( this.thanksBob ) {
          if ( this.models.length > this.modelsToken ) {
            console.log("--- Load models ---")
            this.modelsToken = this.models.length
            await new Promise((resolve) => {
              resolve(this.beatTheDevilOutOfIt());
            })
            await new Promise((resolve) => {
              resolve(this.doTheBobRoss());
            })
          }
          this.thanksBob = false
        }

      }
    },

    'deleteToken': {
      handler: async function(event) {
        if ( this.models.length < this.modelsToken ) {
          console.log("--- Delete model ---")
          this.modelsToken = this.models.length
          await new Promise( (resolve) => {
            resolve(this.beatTheDevilOutOfIt());
          })
          await new Promise( (resolve) => {
            resolve(this.doTheBobRoss());
          })
          if( this.modelsToken == 0 ) {
            this.stopAnimation = true;
          }
        }
        this.deleteToken = false
      }
    },

    'addToken': {
      handler: async function(event) {
        if ( this.models.length > this.modelsToken) {
          console.log("--- Add model ---")
          this.modelsToken = this.models.length
          await new Promise( (resolve) => {
            resolve(this.beatTheDevilOutOfIt());
          })
          await new Promise( (resolve) => {
            resolve(this.doTheBobRoss());
          })
        }
        this.addToken = false;
      }
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

  /**
   * Stop animation loop, if present + garbage collection
   */
   unmounted() {
    if ( this.modelsToken > 0 ) {
      console.log("--- Animation stop ---")
      this.beatTheDevilOutOfIt();
      this.stopAnimation = true;
    }
  },

  methods: {

    /**
     * Garbeage collection
     */
     beatTheDevilOutOfIt: function() {
      if ( this.rendererToken ) {
        console.log("--- Garbage Collection ---")

        /* Cancel animation */
        cancelAnimationFrame( this.animate );

        /* Remove loaded meshes */
        this.scenes.forEach( scene => {
          scene.children[1].geometry.dispose()
          scene.children[1].material.dispose()
          scene.remove(scene.children[0])
          scene.remove(scene.children[1])
        } )

        /* Dispose renderer */
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        
        /* Reset arrays */
        this.scenes = []
        this.cameras = []
        this.canvases = []
        this.contexts = []

        this.rendererToken = false
      }
    },

    /**
     * Bob does wonders on the canvas
     */
    doTheBobRoss: async function() {
      for ( const [i, model] of this.models.entries() ) {
        this.canvases.push( await this.waitForElm('canvas' + i) );
      }
      console.log(this.canvases)
          
      this.init()
      if ( this.stopAnimation ) {
        this.stopAnimation = false;
        console.log("--- Animation start ---")
        this.animate();
      }
    },

    /**
     * Initialize renderer and fill canvases with content
     */
    init: async function() {

      const w = 300, h = 200;

      /* Renderer */
      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( 300, 200 );
      this.rendererToken = true;

      this.models.forEach( model => {
        this.createScene();
      })
      
      for ( const [i, model] of this.models.entries() ) {
        this.canvases[i].width = w * window.devicePixelRatio;
        this.canvases[i].height = h * window.devicePixelRatio;
        this.contexts.push( this.canvases[i].getContext( '2d' ) )
      }

      console.log( this.contexts );
    },

    /**
     * Create scene ... yeah ...
     */
    createScene: function() {
      /* Scene */
      const scene = new THREE.Scene();

      /* Camera */
      const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
      camera.position.z = 2;
      
      /* Light */
      const light = new THREE.AmbientLight( 0xffffff );
      scene.add( light );

      const geometry = new THREE.BoxGeometry( 1, 1, 1 );
      const material = new THREE.MeshStandardMaterial( {
        color: new THREE.Color().setHSL( Math.random(), 1, 0.75, THREE.SRGBColorSpace ),
        roughness: 0.5,
        metalness: 0,
        flatShading: true
      } );
      const mesh = new THREE.Mesh( geometry, material );

      scene.add( mesh )

      this.scenes.push(scene)
      this.cameras.push(camera)
    },

    /**
     * Make things move, but beware! It's just an illusion!
     */
    animate: function() {
        if(!this.stopAnimation) {

          console.log("--- Animation runnning ---")

          for ( const [i, context ] of this.contexts.entries() ) {
            const rawScene = toRaw(this.scenes[i])
            const rawCamera = toRaw(this.cameras[i])
            this.renderer.render( rawScene, rawCamera )
            context.drawImage(this.renderer.domElement, 0, 0);
          }
    
          let rotationSpeed = 0.01
    
          this.scenes.forEach( scene => {
            scene.children[1].rotation.y += rotationSpeed
            rotationSpeed += 0.01
          })
    
          requestAnimationFrame( this.animate );
        }
    },

    /**
     * 
     * @param {*} selector 
     */
    waitForElm(selector) {
      return new Promise(resolve => {
        // if it already exists, return it
        if (document.getElementById(selector)) {
          return resolve(document.getElementById(selector));
        }

        // otherwise create a MutationObserver and wait for it
        const observer = new MutationObserver(mutations => {
          if (document.getElementById(selector)) {
            resolve(document.getElementById(selector));
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    },

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

      /* Bob Ross */
      this.addToken = true
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

      // remove the modelID from connected place/position
      var index = this.object.models.indexOf(model.id);
      if (index != -1) {
        this.object.models.splice(index, 1);
        this.object.lastChanged = Date.now();
        if ( this.object_type === 'Places') {
          if ( this.object.lines.length > 0 ) {
            for ( const line of this.object.lines ) {
              const lineToBeDeleted = await fromOfflineDB.getObject(line, 
                'Lines', 'lines');
              await fromOfflineDB.deleteObject(lineToBeDeleted, 'Lines', 
                'lines')
            }
            this.object.lines = []
          }
        }
        await fromOfflineDB.updateObject(
          toRaw(this.object), this.object_type, this.object_type.toLowerCase());
      }

      // delete the model itself
      await fromOfflineDB.deleteObject(
        model, 'Models', this.object_type.toLowerCase());
      VueCookies.remove('currentModel');
      await this.updateModels();

      /* Bob Ross */
      this.deleteToken = true
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