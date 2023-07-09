<template>
  <!-- GUI -->
  <v-navigation-drawer id="navDrawer" permanent expand-on-hover 
      rail width="300" @transitionend="collapseDrawer">
    <v-list>

      <!-- Settings -->
      <v-list-item prepend-icon="mdi-settings" title="Settings">
      </v-list-item>

      <v-divider></v-divider>

      <!-- Controls -->
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item 
            v-bind="props" prepend-icon="mdi-folder" title="Controls">
          </v-list-item>
        </template>

        <!-- Gizmo visible/non-visible -->
        <v-checkbox-btn
          label="Gizmo"
          class="pl-16"
          v-bind="props"
          v-model="gizmoState" 
          v-show="showDrawerContent"
          v-on:click="gizmoChange(gizmoState)">
        </v-checkbox-btn>
     </v-list-group>

      <!-- Places -->
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item 
            v-bind="props" 
            title="Stellen"
            prepend-icon="mdi-folder">
          </v-list-item>
        </template>

        <div v-if="showDrawerContent">
          <!-- Attach Controls -->
          <v-checkbox-btn
            class="pl-16"
            label="Attach controls"
            v-on:click="detachtransformControls()">
          </v-checkbox-btn>

          <!-- All places in scene -->
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" prepend-icon="mdi-radar" title="Hey">
              </v-list-item>
            </template>

            <!-- Gizmo visible/non-visible -->
            <template v-for="(place, i) in placeModelsInScene" :key="i">
              <v-checkbox-btn
                class="pl-16 ml-6"
                label="Color picker"
                v-model="gizmoState" 
                v-on:click="gizmoChange(gizmoState)">
              </v-checkbox-btn>
            </template>
          </v-list-group>
        </div>
      </v-list-group>

      <!-- Positions -->
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item 
            v-bind="props" 
            title="Positionen"
            prepend-icon="mdi-folder">
          </v-list-item>
        </template>

        <!-- All positions in scene -->
          <v-list-group>
            <template v-slot:activator="{ props }">
              <v-list-item 
                title="Hey"
                v-bind="props" 
                prepend-icon="mdi-radar">
              </v-list-item>
            </template>

            <div v-if="showDrawerContent">
              <!-- Gizmo visible/non-visible -->
              <template v-for="(position, i) in positionModelsInScene" :key="i">
                <v-checkbox-btn 
                  class="pl-16 ml-6"
                  v-model="gizmoState" 
                  label="Attach controls"
                  v-on:click="attachTransformControls(i)">
                </v-checkbox-btn>
              </template>

              <!-- Gizmo visible/non-visible -->
              <v-list-group value="Gizmo">
                <template v-slot:activator>
                  <v-checkbox 
                    class="pl-16 ml-6"
                    v-model="gizmoState" 
                    label="Color picker"
                    v-on:click="gizmoChange(gizmoState)">
                  </v-checkbox>
                </template>
              </v-list-group>
            </div>
          </v-list-group>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <!-- Main Scene-->
  <canvas id="mainCanvas" myattr="myattr">
    <div id="gui_container"></div>
  </canvas>

  <!-- Position information-->
  <v-navigation-drawer v-model="drawer" location="bottom" temporary width="389">
    <v-navigation-drawer permanent location="right" width="350">

      <v-list-item align="center">
        {{ selectedModelName }}
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item>
        <canvas v-show="cardShow" id="subCanvas" width="300" height="300" style="position: absolute; top: 23px; right: 25px; 
                      border: 1px solid rgb(255, 255, 255)">
        </canvas>
      </v-list-item>

    </v-navigation-drawer>
    <v-row>
      <v-col cols="9" lg="3">
        <v-card height="100%" variant="outlined" class="pa-4">
          <v-row>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.positionNumber }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Positionsnummber
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.subNumber }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Unternummer
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.title }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Ansprache
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title style="color:white" class="text-h6">
                  {{ positionInfo.material }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Material
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="12">
              <v-card class="pa-4" color="accent">
                <div class="text-h4 text-center" :label="$t('lastEdited')">
                  {{ positionInfo.date }}
                </div>
                <div class="text-grey text-center">
                  {{ $t('lastEdited') }}
                </div>
              </v-card>
            </v-col>

          </v-row>
        </v-card>

      </v-col>
      <v-col cols="9" lg="3">
        <v-card height="100%" variant="outlined" class="pa-4">
          <v-row>

            <v-col cols="12" lg="4">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.right }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Rechtswert
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="4">
              <v-list-item variant="tonal">
                <v-list-item-title style="color:white" class="text-h6">
                  {{ positionInfo.up }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Hochwert
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="4">
              <v-list-item variant="tonal">
                <v-list-item-title style="color:white" class="text-h6">
                  {{ positionInfo.height }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Höhe
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

          </v-row>
        </v-card>
      </v-col>
      <v-col cols="10" lg="3">
        <v-card height="100%" variant="outlined" class="pa-4">
          <v-row>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.count }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Anzahl
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.weight }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Gewicht
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title class="text-h6">
                  {{ positionInfo.dating }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Datierung
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="6">
              <v-list-item variant="tonal">
                <v-list-item-title style="color:white" class="text-h6">
                  {{ positionInfo.adressOf }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  AnspracheVon
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

            <v-col cols="12" lg="16">
              <v-list-item variant="tonal">
                <v-list-item-title style="color:white" class="text-h6">
                  {{ positionInfo.description }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item style="top: -10px; left: -10px">
                <v-list-item-subtitle>
                  Beschreibung
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>

          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>


<script>
import * as THREE from 'three';
import VueCookies from 'vue-cookies';
import { ArcballControls } from 
  'three/examples/jsm/controls/ArcballControls.js';
import { TransformControls } from 
  'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 
  'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';

export default {
  name: 'Viewer',

  data() {
    return {
      /* Position Info */
      positionInfo: {
        positionNumber: null,
        subNumber: null,
        date: null,
        title: null,
        material: null,
        right: null,
        up: null,
        height: null,
        count: null,
        weight: null,
        description: null,
        dating: null,
        adressOf: null
      },
      transformCheck: false,

      showDrawerContent: false,
      drawer: false,
      cardShow: true,

      /* Meshes in Scene */
      placeModelsInScene: [], // {placeID, modelID}
      positionModelsInScene: [], // {positionID, modelID}

      positionsInScene: [],

      selectedModelName: "",
      selectedPositionID: "",

      arcballAnchor: [],
      cameraData: {
        position: null,
        rotation: null
      },

      gizmoState: false
    };
  },




  async mounted() {
    window.addEventListener('resize', this.onWindowResize, false)

    const canvas = document.getElementById('mainCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 170;

    /* Sync IndexedDB */
    await fromOfflineDB.syncLocalDBs();

    /* Loader for .gltf and .glb Data */
    this.glbLoader = new GLTFLoader();

    /* Canvases */
    this.canvasMain = document.getElementById("mainCanvas");
    this.canvasSub = document.getElementById("subCanvas");

    /* Initialize basic components of threejs (renderer, scene, etc.) */
    this.mainInit();
    this.subInit();

    /* Load place models */
    await this.loadPlaceModels();

    if ( this.placeModelsInScene.length > 0 ) {
      /* Reset camera in according to the position of the last place-model */
      this.updateCamera( this.placeModelsInScene[ 
        this.placeModelsInScene.length - 1 ].modelID )

      /* Load position models */
      await this.loadPositionModels();

      /* Start Animation-Loop */
      this.animate();
    } else {
      console.log("No Models found")
    }
  },




  async unmounted() {
    if(this.placeModelsInScene.length > 0) {
      await this.updateModelsInDB();
      await this.updateCameraInDB();
      await this.updateGuiInDB();
    }

    this.clearScene()
  },




  methods: {

    /**
    * Function overview:
    *  -------------------------------------------------------------------------
    *  loadPlaceObjects      -
    *  loadModel             - Loads a Model from IndexedDB into the scene. 
    *                          This version has the standart texture from the 
    *                          object and the name of the created mesh is the 
    *                          title of the object.
    *  -------------------------------------------------------------------------
    *  changeState
    *  changeColor           - Change the current color/texture of a model in
    *                          the scene to a new color
    *  changeOpacity         - Changes the opacity of a mesh
    *  ------------------------------------------------------------------------- 
    *  saveCurrentScene      -
    *  updateCameraPosition  - Moves the Camera to specified model in scene
    *  onWindowResize        - Resizes the threeJS element
    *  collapseDrawer        - Closes drawer and hides opened list items
    *  ------------------------------------------------------------------------
    *  init                  - Initialize the scene
    *  animate               - Animate the scene
    */




    /**
     * -------------------------------------------------------------------------
     * - Update/Clean up functions (Database update/Clear scene)
     * ----> updateCameraInDB
     * ----> updateGuiInDB
     * ----> updateModelsInDB
     * ----> clearScene
     * -------------------------------------------------------------------------
     */
    updateCameraInDB: async function() {
      /* Save Camera */
      const cameraData = [
        this.cameraMain.position.x,
        this.cameraMain.position.y,
        this.cameraMain.position.z,
        this.cameraMain.rotation.x,
        this.cameraMain.rotation.y,
        this.cameraMain.rotation.z
      ]

      const placeID = VueCookies.get( 'currentPlace' )
      const savedCamera = await fromOfflineDB.getProperties( 'id', 'Cameras',
        'cameras')
      const anchor = []

      if ( !savedCamera.includes( placeID ) ) {
        anchor.push( this.arcballAnchor[ 0 ] );
        anchor.push( this.arcballAnchor[ 1 ] );
        anchor.push( this.arcballAnchor[ 2 ] );
      } else {
        const camera = await fromOfflineDB.getObject( placeID, 'Cameras',
          'cameras')
        anchor.push( camera.arcballAnchor[ 0 ] );
        anchor.push( camera.arcballAnchor[ 1 ] );
        anchor.push( camera.arcballAnchor[ 2 ] );
      }

      const cameraObject = {
          id:             placeID,
          cameraPosition: cameraData,
          arcballAnchor:  anchor
      }

      await fromOfflineDB.updateObject( cameraObject, 'Cameras', 'cameras' );

    },

    updateGuiInDB: async function() {
      /* TODO: Save GUI */
      const newGUI = {

        gizmoState: this.gismoState,

      }
    },

    updateModelsInDB: async function() {
      /* Update place models */
      for ( var i = 0; i < this.placeModelsInScene.length; i++ ) {

        const modelID = this.placeModelsInScene[ i ].modelID;
        const modelInScene = this.sceneMain.getObjectByName( modelID );
        const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
          'places' );

        modelInDB.color = "#" + modelInScene.material.color.getHexString();
        modelInDB.opacity = modelInScene.material.opacity;

        await fromOfflineDB.updateObject( modelInDB, 'Models', 'places' );

      }

      /* Update position models */
      for ( var u = 0; u < this.positionModelsInScene.length; u++ ) {

        const modelID = this.positionModelsInScene[ u ].modelID;
        const modelInScene = this.sceneMain.getObjectByName( modelID );
        const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
          'positions' );

        var groupObject = modelInScene;
        while ( !( groupObject instanceof THREE.Group ) ) {
          groupObject = groupObject.parent;
        }

        const worldPosition = new THREE.Vector3();
        groupObject.getWorldPosition( worldPosition );
        const newCoordinates = [ worldPosition.x, worldPosition.y,
                                 worldPosition.z ];

        modelInDB.color = "#" + modelInScene.material.color.getHexString();
        modelInDB.opacity = modelInScene.material.opacity;
        modelInDB.coordinates = newCoordinates;

        await fromOfflineDB.updateObject( modelInDB, 'Models', 'positions' );

      }
    },

    clearScene: function() {
      /* Dispose models in sceneMain */
      for ( let i = 0; i < this.meshesInMain.length; i++ ) {

        const childrenToBeRemoved = [];
        const nameTo = this.meshesInMain[ i ].name;
        this.sceneMain.traverse( ( child ) => {
          if ( child.name == nameTo ) {
            childrenToBeRemoved.push( child )
          }
          
        });
        
        childrenToBeRemoved.forEach( ( child ) => {
          this.sceneMain.remove( child )
        });
      }

      /* Dispose rendererMain/rendererSub */
      this.rendererMain.dispose();
      this.rendererMain.forceContextLoss();
      this.rendererMain.renderLists.dispose();
      this.rendererSub.dispose();
      this.rendererSub.forceContextLoss();
      this.rendererSub.renderLists.dispose();

      /* Remove EventListener */
      this.canvasMain.removeEventListener( 'click', this.updateArcball );
      this.canvasMain.removeEventListener( 'click', this.onMouseDown );
      window.removeEventListener( 'resize', this.onWindowResize, false );
    },

    


    /**
     * -------------------------------------------------------------------------
     * - Loader
     * ----> loadPlaceModels
     * ----> loadPositionModels
     * ----> loadMeshInSceneMain
     * ----> loadMeshInSceneSub
     * -------------------------------------------------------------------------
     */
    loadPlaceModels: async function() {
      const placeID = VueCookies.get( 'currentPlace' );
      const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
        'Models', 'places' );

      if ( objects ) {
        for ( var i = 0; i < objects.length; i++ ) {
          await this.loadMeshInMain( objects[ i ].id, 'Place', 'Models', 
            'places' );
        }
      }
    },

    loadPositionModels: async function() {
      const placeID = VueCookies.get( 'currentPlace' );
      const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
        'Models', 'positions' );

      if ( objects ) {
        for ( var i = 0; i < objects.length; i++ ) {
          await this.loadMeshInMain( objects[ i ].id, 'Position', 'Models', 
            'positions' );
        }
      }
    },

    /**
     * 
     * @param {*} modelID 
     * @param {*} dbName 
     * @param {*} storeName 
     */
    loadMeshInMain: async function( modelID, type, dbName, storeName ) {
      /* Get 3D-Model from IndexedDB */
      const object = await fromOfflineDB.getObject( modelID, dbName, 
        storeName );
      const model = object.model;
      const color = object.color;
      const opacity = object.opacity;
      const id = object.id;

      /* Load object */
      const mesh = await new Promise( ( resolve ) => {
        this.glbLoader.parse( model, '', ( glb ) => {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color( color );
              child.name = id;
            }
          });
          resolve( glb.scene );
        });
      })

      /* Save variables for  */
      switch( type ) {
        case 'Place':
          this.placeModelsInScene.push( { placeID: object.placeID, 
            modelID: object.id } );
          break;

        case 'Position':
          this.positionModelsInScene.push( { positionID: object.positionID, 
            modelID: object.id, move: false } );
          this.positionsInScene.push( object.title );
          if ( object.coordinates != null ) {
            const coordinates = object.coordinates;
            mesh.position.set( coordinates[ 0 ], coordinates[ 1 ], 
              coordinates[ 2 ] );
          }
          break;

        default:
          console.log( "error" );
      }

      this.meshesInMain.push( mesh )
      
      /* Add mesh to main scene */
      this.sceneMain.add( mesh );
    },

    loadMeshInSub: async function( modelname ) {
      const object = await fromOfflineDB.getObject( modelname, 'Models', 
        'positions' );
      const model = object.model;
      const color = object.color;
      const opacity = object.opacity;
      const id = object.id;

      /* Load object */
      const mesh = await new Promise( ( resolve ) => {
        this.glbLoader.parse( model, '', ( glb ) => {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color( color );
              child.name = id;
            }
          });
          resolve(glb.scene);
        });
      })

      this.meshInSub = mesh;

      this.selectedModelName = "Model name: " + object.title;

      const bbox = new THREE.Box3().setFromObject( this.meshInSub );
      const height = bbox.max.y - bbox.min.y;
      this.cameraSub.position.z = height + 60;
        
      /* Add mesh to sub scene */
      this.sceneSub.add( this.meshInSub );
    },




    /**
     * -------------------------------------------------------------------------
     * - Mesh interaction
     * ----> changeColor
     * ----> changeOpacity
     * -------------------------------------------------------------------------
     */

    /**
     * 
     * @param {*} modelName 
     */
    changeColor: async function( modelName ) {
      // TODO:
    },

    /**
     * 
     * @param {*} modelName 
     * @param {*} modelID 
     */
    changeOpacity: async function( i ) {
      const modelID = this.positionModelsInScene[ i ].modelID;
      const model = this.sceneMain.getObjectByName( modelID );
      const opacityValue = model.material.opacity;

      if ( opacityValue == 1.0 ) {
        this.sceneMain.getObjectByName( modelID ).material.opacity = 0.0;
      } else {
        this.sceneMain.getObjectByName( modelID ).material.opacity = 1.0;
      }
    },

    /**
     * -------------------------------------------------------------------------
     * - Controls
     * ----> attachTransformationControls
     * ----> detachTransformationControls
     * ----> updateArcballControls
     * ----> restoreArcballAnchor
     * ----> updateCamera
     * -------------------------------------------------------------------------
     */

    /**
      * 
      * @param {*} i 
      */
    attachTransformControls: function( i ) {
      const modelName = this.positionModelsInScene[ i ];
      const model = this.sceneMain.getObjectByName( modelName.modelID );

      var groupObject = model;
      while ( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent;
      }

      this.tControlsMain.detach();
      this.tControlsMain.attach( groupObject );
    },

    detachtransformControls: function() {
      this.tControlsMain.detach();
    },

    /**
     * 
     * @param {*} event 
     */
    updateArcball: async function( event ) {
      if ( event.ctrlKey ) {
        const placeID = VueCookies.get( 'currentPlace' );
        
        this.getCamera( this.cameraMain, this.cameraData );
        const cameraIDsFromDB = await fromOfflineDB.getProperties( 'id', 
          'Cameras', 'cameras' );

        if ( cameraIDsFromDB.includes( placeID ) ) {
          const newCamera = await fromOfflineDB.getObject(
            VueCookies.get( 'currentPlace' ), 'Cameras', 'cameras');

          this.abControlsMain.target.set( newCamera.arcballAnchor[0],
            newCamera.arcballAnchor[1], newCamera.arcballAnchor[2]);

          this.abControlsMain.reset();
          this.abControlsMain.update();
        } else {
          this.abControlsMain.target.set( this.arcballAnchor[0], 
            this.arcballAnchor[1], this.arcballAnchor[2] );

          this.abControlsMain.reset();
          this.abControlsMain.update();
        }

        this.setCamera( this.cameraMain, this.cameraData );
      }
    },

    /**
     * 
     * @param {*} arcballAnchor 
     * @param {*} arcballControls 
     */
     restoreArcballAnchor: function( arcballAnchor, arcballControls ) {
      /* Restore saved anchor position for the arcball target */
      arcballControls.target.set( arcballAnchor[0], arcballAnchor[1],
                                  arcballAnchor[2] );
      
      /* Save changes made to the arcball control settings */
      arcballControls.update();
    },
    
    /**
     * 
     * @param {*} modelName 
     */
    updateCamera: async function( modelName ) {
      const placeID = VueCookies.get( 'currentPlace' );
      const cameraIDsFromDB = await fromOfflineDB.getProperties( 'id', 
        'Cameras', 'cameras' );

      if ( cameraIDsFromDB.includes( placeID ) ) {
        /* Get camera data from IndexedDB */
        const cameraFromDB = await fromOfflineDB.getObject(
          VueCookies.get( 'currentPlace' ), 'Cameras', 'cameras' );
        
        /* Update current camera state with camera data from IndexedDB */
        const cameraPosition = cameraFromDB.cameraPosition;
        this.cameraData.position = [ cameraPosition[ 0 ], cameraPosition[ 1 ], 
          cameraPosition[ 2 ] ];
        this.cameraData.rotation = [ cameraPosition[ 3 ], cameraPosition[ 4 ], 
          cameraPosition[ 5 ] ];

        /* Restore saved anchor position for the arcball target */
        this.restoreArcballAnchor( cameraFromDB.arcballAnchor, 
          this.abControlsMain );

        /* Set new camera state */
        this.setCamera( this.cameraMain, this.cameraData );
      } else {
        /* Get center of place model as Vec3 */
        const model = this.sceneMain.getObjectByName( modelName );
        const center = this.getModelCenter( model );

        /* Define an anchor point for the arcball */
        this.arcballAnchor.push( center.x );
        this.arcballAnchor.push( center.y );
        this.arcballAnchor.push( center.z );

        /* Set center as the new arcball target */
        this.abControlsMain.target.set( center.x, center.y, center.z );

        /* Move camera to the object */
        this.cameraMain.position.set( center.x, center.y - 15, center.z );
        this.getCamera( this.cameraMain, this.cameraData );

        /* Save changes made to the arcball control settings */
        this.abControlsMain.update();
      }
    },

    /**
     * -------------------------------------------------------------------------
     * - Utility
     * -------------------------------------------------------------------------
     */

    /**
     * 
     * @param {*} model 
     */
    getModelCenter: function( model ) {
      var groupObject = model;
      while( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent
      }

      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject( groupObject );
      const center = new THREE.Vector3();
      boundingBox.getCenter( center );

      return center;
    },

    /**
     * 
     * @param {*} camera 
     * @param {*} cameraData 
     */
     getCamera: function( camera, cameraData ) {
      cameraData.position = [ camera.position.x, camera.position.y, 
                              camera.position.z ];
      cameraData.rotation = [ camera.rotation.x, camera.rotation.y, 
                              camera.rotation.z ];
    },

    /**
     * 
     * @param {*} camera 
     * @param {*} cameraData 
     */
     setCamera: function( camera, cameraData ) {
      camera.position.set( cameraData.position[ 0 ], cameraData.position[ 1 ],
                           cameraData.position[ 2 ] );
      camera.rotation.set( cameraData.rotation[ 0 ], cameraData.rotation[ 1 ],
                           cameraData.rotation[ 2 ] );
    },

    makePerspectiveCamera: function () {
      const fov = 45;
      const aspect = this.canvasMain.clientWidth / this.canvasMain.clientHeight;
      const near = 0.01;
      const far = 2000;
      const newCamera = new THREE.PerspectiveCamera( fov, aspect, near, far );
      return newCamera;
    },

    onWindowResize: function () {
      this.rendererMain.setSize( this.canvasMain.clientWidth, 
        this.canvasMain.clientHeight);

      this.cameraMain.aspect = this.canvasMain.clientWidth / 
        this.canvasMain.clientHeight;

      this.cameraMain.updateProjectionMatrix();
    },
    /**
     * Closes the left side drawer and hides all opened list items
     */
    collapseDrawer() {
      var navDrawerWidth = document.getElementById('navDrawer').offsetWidth;

      if (navDrawerWidth > 100) {
        this.showDrawerContent = true;
      } else {
        this.showDrawerContent = false;
      }
    },

    /**
     * -------------------------------------------------------------------------
     * - Init
     * ----> mainInit
     * ----> subInit
     * -------------------------------------------------------------------------
     */
    mainInit: function () {

      /* All loaded meshes in main scene */
      this.meshesInMain = [];

      /* Renderer */
      this.rendererMain = new THREE.WebGLRenderer( { canvas: this.canvasMain, 
        antialias: true } );
      this.rendererMain.setSize( this.canvasMain.clientWidth, 
        this.canvasMain.clientHeight );
      this.rendererMain.setClearColor( 0x263238, 1 );
      this.rendererMain.shadowMap.enabled = true;
      this.rendererMain.shadowMap.type = THREE.PCFSoftShadowMap;

      // Scene
      this.sceneMain = new THREE.Scene();

      // Camera
      this.cameraMain = this.makePerspectiveCamera();

      // Light
      const ambientLight = new THREE.AmbientLight( 0xffffff );
      this.sceneMain.add( ambientLight );

      // Controls
      this.abControlsMain = new ArcballControls( this.cameraMain,
        this.rendererMain.domElement, this.sceneMain );

      this.tControlsMain = new TransformControls( this.cameraMain,
        this.rendererMain.domElement );

      this.tControlsMain.addEventListener( 'dragging-changed', e => {
        this.abControlsMain.enabled = !e.value;
      } );

      this.sceneMain.add(this.tControlsMain );

      // GUI
      window.addEventListener( 'keydown', e => {
        switch ( e.code ) {
          case 'KeyW':
            this.tControlsMain.mode = 'translate';
            break;
          case 'KeyE':
            this.tControlsMain.mode = 'rotate';
            break;
          case 'KeyR':
            this.tControlsMain.mode = 'scale';
            break;
        }
      } );

      // Raycaster
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      
      // Eventlistener
      this.canvasMain.addEventListener( 'click', this.updateArcball );
      this.canvasMain.addEventListener( 'click', this.onMouseDown );
    },

    subInit: function() {
      /* mesh in sub scene */
      this.meshInSub = null;

      /* Renderer */
      this.rendererSub = new THREE.WebGLRenderer( { canvas: this.canvasSub } );
      this.rendererSub.setPixelRatio( this.canvasSub.devicePixelRatio );
      this.rendererSub.setSize( this.canvasSub.clientWidth,
        this.canvasSub.clientHeight );
      this.rendererSub.setClearColor( 'black', 1 );
      this.rendererSub.shadowMap.enabled = true;
      this.rendererSub.shadowMap.type = THREE.PCFSoftShadowMap;

      /* Scene */
      this.sceneSub = new THREE.Scene();

      /* Camera */
      const aspect = this.canvasSub.clientWidth / this.canvasSub.clientHeight;
      this.cameraSub = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );

      /* Light */
      const ambientLight = new THREE.AmbientLight( 0xffffff );
      this.sceneSub.add( ambientLight );

      /* Controls */
      this.controlsSub = new OrbitControls( this.cameraSub,
        this.rendererSub.domElement );

      /* Event listener */
      this.canvasSub.addEventListener( 'mousemove', () => {
        console.log( "Mouse moved" );
      })
    },

    onMouseDown: async function( event ) {
      event.preventDefault();

      const rect = this.rendererMain.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.pointer.x = ( x / this.canvasMain.clientWidth ) *  2 - 1;
      this.pointer.y = ( y / this.canvasMain.clientHeight) * - 2 + 1;

      this.raycaster.setFromCamera( this.pointer, this.cameraMain );
      const intersects = this.raycaster.intersectObjects( this.meshesInMain, 
        true );

      if( intersects.length > 0 && event.altKey ) {
        const objectName = intersects[0].object.name;
        /* Check if clicked model is a position model */
        for ( let i=0; i < this.positionModelsInScene.length; i++ ) {
          if ( this.positionModelsInScene[ i ].modelID === objectName ) {
            this.cardShow = true;
            this.drawer = true;
            this.loadMeshInSub( intersects[0].object.name );

            /* Fill the drawer with position info */
            const positionID = this.positionModelsInScene[ i ].positionID;
            const model = await fromOfflineDB.getObject( positionID,
              'Positions', 'positions' );
            
            this.positionInfo.positionNumber = model.positionNumber;
            this.positionInfo.subNumber = model.subNumber;
            this.positionInfo.date = model.date;
            this.positionInfo.title = model.title;
            this.positionInfo.material = model.material;
            this.positionInfo.right = model.right;
            this.positionInfo.up = model.up;
            this.positionInfo.height = model.height;
            this.positionInfo.count = model.count;
            this.positionInfo.weight = model.weight;
            this.positionInfo.description = model.description;
            this.positionInfo.dating = model.dating;
            this.positionInfo.adressOf = model.adressOf;
          }
        }
      }
    },

    gizmoChange: function( p ) {
      if(p) {
        this.abControlsMain.setGizmosVisible( false );
        this.gismoCB = false;
      } else {
        this.abControlsMain.setGizmosVisible( true );
        this.gismoCB = true;
      }
    },

    /**
     * -------------------------------------------------------------------------
     * - Animation
     * ----> animate
     * ----> render
     * -------------------------------------------------------------------------
     */
    animate: function () {
      /* Render-Loop */
      requestAnimationFrame( this.animate );

      this.render();

      if ( this.meshInSub ) {
        this.meshInSub.rotation.y += 0.01;
      }

      /* Render scene and camera */
      this.rendererMain.render( this.sceneMain, this.cameraMain );
      this.rendererSub.render( this.sceneSub, this.cameraSub );
    },

    render: function() {
      for ( var i = 0; i < this.positionModelsInScene.length; i++ ) {
        if ( this.positionModelsInScene[ i ].move === true ) {
          this.tControlsMain.enabled = true;
          this.tControlsMain.attach( this.sceneMain.getObjectByName(
            this.positionModelsInScene[ i ].modelID ) );
        }
      }

      /* Delete Model from sceneSub */
      if ( !this.drawer && this.sceneSub.children.length > 1 ) {
        /* Dispose Scenes */
        const childrenToBeRemoved = [];
        const nameTo = this.meshInSub.name;
        this.sceneSub.traverse( child => {
          if( child.name == nameTo ) {
            childrenToBeRemoved.push( child );
          }
        });

        childrenToBeRemoved.forEach( child => {
          this.sceneSub.remove( child );
        });

        this.controlsSub.reset();
      }

      this.abControlsMain.setTbRadius( 0.67 );
    }
  }
}
</script>

<style scoped>
</style>