<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 05.11.2024 13:43:46
 * Modified By: Julian Hardtung
 * 
 * Description: `comment` input module for places
 -->

<template>
  <v-card class="pa-4 pt-2">
      <v-card-title>
        {{ $t('model') }}
      </v-card-title>

      <v-row no-gutters>
        <v-col>

          <v-row no-gutters>
            <v-col cols="4">

              <v-text-field 
              color="primary" 
              :label="$tc('posNumber', 2) + ' *'" 
              maxlength="5" 
              hide-details 
              v-model="object.positionNumber" 
              @keypress="filterAllNonNumeric(event)">
            </v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-text-field 
            color="primary"
            maxlength="10"
            :label="$t('date')  + ' *'" 
            v-model="object.date">
          </v-text-field>
        </v-col>
          </v-row>
            <v-combobox
              class="pt-4"
              color="primary" 
              :items="editorItemsSecondProp" 
              :label="$tc('editor', 1)  + ' *'" 
              :hide-no-data="false" 
              v-model="object.editor">

              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('noResults') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-combobox>

            <v-textarea 
              rows="3"
              no-resize
              counter 
              maxlength="254"
              color="primary" 
              v-model="object.comment"
              :label="$t('comment')  + ' *'">
            </v-textarea>

            <v-file-input 
              show-size 
              accept=".glb"
              @change="onFileSelected"  
              :label="$t('input', { msg: $t('model') })">
            </v-file-input>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-spacer/>
              <canvas id="canvas" v-show="true" width="360" height="355"
                style="display: inline; border: 1px solid rgb(255, 255, 255)">
              </canvas>
              <v-spacer/>
            </v-row>
            <v-row>
              <v-spacer/>
              <v-btn class="mb-2" variant="outlined" 
                @click="routeTo3D()">
                {{ $t('openIn3D')}}
                <v-icon class="pl-2">
                  mdi-open-in-new
                </v-icon>
                <v-tooltip activator="parent" location="bottom"
                v-if="$generalStore.getShowTooltips()"    
                :text="$t('openPhrase', {msg: $tc('model', 1) + ' ' + model.title})">
              </v-tooltip>
            </v-btn>
            <v-spacer/>
          </v-row>
          </v-col>
      </v-row>
    </v-card>
</template>

<script>

import { useWindowSize } from 'vue-window-size';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from
  'three/examples/jsm/controls/OrbitControls.js';
import { Box3 } from 'three';
import { exParams } from '../3dFunctions/Parameter';
import { fromOfflineDB } from '../../ConnectionToOfflineDB';
import { toRaw } from 'vue';

/**
 * Methods overview:
 */
export default {

  props: {
    objectProp: {
      type: Object,
      default: () => ({}),
    },
    editorItemsSecondProp: Array,
    showModuleProp: Boolean,
	},

  emits: ['dataToModuleViewer'],

  setup() {

    const {width, height } = useWindowSize();

    return {
      windowWidth: width,
      windowHeight: height,
    }
  },

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      object: {
        editor: '',
        date: '',
        comment: '',
        image: ''
      },
      editorItems: [],
      automaticNaming: '',
      uploadImages: '',
      showModule: null,

      canvas: null,
      context: null,
      scene: null,
      camera: null,
      rendererToken: false,
      modelToken: 0,
      renderer: null,
      thanksBob: true,
      stopAnimation: true,
      glbLoader: null,
      temp_editing_model: [],
      backup_model: '',
      model: null,
      exParams: exParams,
    }
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

  watch: {
    showModuleProp: function(showModuleBool) {
      this.showModule = showModuleBool;
    },
    objectProp: function(objectPropData) {
        this.object = objectPropData;
    },
    'object.comment': {
      handler: function() {
        if (this.object.comment != null) {
          this.$emit("dataToModuleViewer", [ 'comment', this.object.comment ]);
        } else if ( this.object.comment == null ) {
          this.$emit("dataToModuleViewer", ['comment', '']);
        }
      }
    },
    "object.editor": {
      handler: async function () {
        if ( this.object.editor != null ) {
          this.$emit("dataToModuleViewer", ['editor', this.object.editor]);
        } else if ( this.object.editor == null ) {
          this.$emit("dataToModuleViewer", ['editor', '']);
        }
      }
    },
    "object.model": {
      handler: async function () {

        console.log(this.object)
        console.log(this.thanksBob)
        if ( this.thanksBob && this.object.model != '') {
          if ( (this.modelToken == 0)) {
            console.log("--- Load models ---")
            this.modelToken = 1
            await new Promise((resolve) => {
              resolve(this.beatTheDevilOutOfIt());
            })
            await new Promise((resolve) => {
              resolve(this.doTheBobRoss());
            })
          }
          this.thanksBob = false
        }
        
        if ( this.object.model != null ) {
          this.$emit("dataToModuleViewer", ['model', this.object.model]);
        } else if ( this.object.model == null ) {
          this.$emit("dataToModuleViewer", ['model', '']);
        }
      }
    },
    "object.date": {
      handler: function () {
        if ( this.object.date != null ) {
          this.$emit("dataToModuleViewer", ['date', this.object.date]);
        } else {
          this.$emit("dataToModuleViewer", ['date', '']);
        }
      }
    },
    'showModule': {
      handler: function() {
        if (this.showModule != null) {
          this.$emit("dataToModuleViewer", [ 'modulePreset.comment', this.showModule ]);
        }
      }
    },

  },

  async created() {
    this.object = this.objectProp;

    this.showModule = this.showModuleProp;
  },

  methods: {

    /**
     * Garbeage collection
     */
     beatTheDevilOutOfIt: async function() {
      if ( this.rendererToken ) {
        console.log("--- Garbage Collection ---")

        /* Cancel animation */

        /* Remove loaded meshes */
        this.scene.children[1].traverse( ( child ) => {
          if ( child instanceof THREE.Mesh ) {
          child.geometry.dispose();
          child.material.dispose();
          }
        });
        this.scene.remove(scene.children[0])
        this.scene.remove(scene.children[1])
        
        /* Dispose renderer */
        this.renderer.dispose(),
        this.renderer.forceContextLoss()

        /* Reset arrays */
        this.scene = null;
        this.camera = null;
        this.canvas = null;
        this.context = null;

        this.rendererToken = false
      }
    },

    /**
     * Bob does wonders on the canvas
     */
    async doTheBobRoss() {
      this.canvas = document.getElementById('canvas');      
      await new Promise( (resolve) => {
        resolve( this.init() );
      })

      if ( this.stopAnimation && this.scene != null ) {
        this.stopAnimation = false;
        console.log("--- Animation start ---")
        this.animate();
      }
    },

    /**
     * Initialize renderer and fill canvases with content
     */
    async init() {

      this.glbLoader = new GLTFLoader();

      /* Renderer */
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio( this.canvas.devicePixelRatio);
      this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setClearColor( 0x263238, 1 );
      this.rendererToken = true;

      await this.createScene( this.object.model )
      
      this.context = this.canvas.getContext( '2d' );
    },

    /**
     * Create scene ... yeah ...
     */
    async createScene(model) {
      /* Scene */
      const scene = new THREE.Scene();

      /* Camera */
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      const camera = new THREE.PerspectiveCamera( 50, aspect, 1, 1000 );
      
      /* Light */
      const light = new THREE.AmbientLight( 0xffffff );
      scene.add( light );

      /* Control */
      const control = new OrbitControls( camera, this.renderer.domElement );

      /* Model */
      const loadedModel = await this.loadModels( model, camera )
      scene.add( loadedModel );
      
      this.scene = scene;
      this.camera = camera;
    },

    loadModels: async function(model, camera) {
      /* Load model */
      const meshGroup = await new Promise( ( resolve ) => {
        this.glbLoader.parse( model, '', ( glb ) => {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.name = model._id;
            }
          } );
          resolve(glb.scene);
        } );
      } );

      /* Reposition camera according to model */
      const bbox = new THREE.Box3().setFromObject( meshGroup );
      const vec3 = new THREE.Vector3();
      bbox.getCenter( vec3 );
      meshGroup.position.set( -vec3.x, -vec3.y, -vec3.z );
      const height = bbox.max.y - bbox.min.y;
      const width = bbox.max.x - bbox.min.x;
      const length = bbox.max.z - bbox.max.z;
      const largest = Math.max(height, width, length);
      camera.position.z = largest * 2;

      return meshGroup
    },

    /**
     * Make things move, but beware! It's just an illusion!
     */
    animate: function() {
      if (!this.stopAnimation) {
        /* console.log("--- Animation runnning ---") */

        requestAnimationFrame( this.animate );

        const rawScene = toRaw(this.scene);
        const rawCamera = toRaw(this.camera);
        this.renderer.render( rawScene, rawCamera );
        this.context.drawImage(this.renderer.domElement, 0, 0);
  
        let rotationSpeed = 0.005
        this.scene.children[1].rotation.y += rotationSpeed;
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
     * Updates the displayed image after an image file was chosen
     * @param event 
     */
    async onFileSelected(event) {
      console.log("selected")

      console.log(this.object.model)
      this.object.model = await this.modelToArrayBuffer(event.target.files[0]).catch(err => console.log(err))
      console.log("____________________________")
      console.log(this.object.model)
      this.object.loaderType = event.target.files[0].name.split('.')[1]
    },
    
    /**
     * Change model data to ArrayBuffer
     * @param {Object} rawData
     * @return {ArrayBuffer} modelBuffer
     */
    async modelToArrayBuffer(rawData) {
      console.log(rawData)
      const output = await new Promise((resolve) => {
        let reader = new FileReader();

        reader.onload = e => {
          const modelString = e.target.result
          resolve(modelString)
        }

        reader.readAsArrayBuffer(rawData);
      });
      return output;
    },


    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    routeTo3D() {
      this.$router.push({ name: "3D-Ansicht" })
    },
  },

};

</script>

<style scoped></style>