<template>    
  <v-layout>
    
    <!-- GUI -->
    <v-navigation-drawer expand-on-hover rail width="300">

      <v-list>
        <v-list-item
          prepend-icon="mdi-settings"
          title="Settings">
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" width="300">
        <!-- Arcball Settings -->
        <v-list-group value="Arcball">

          <template v-slot:activator="{props}">
            <v-list-item
              v-bind="props"
              prepend-icon="mdi-folder"
              title="Arcball Settings">
            </v-list-item>
          </template>

          <v-list-item style="left: -26px" value="Gizmo">
            
            <template v-slot:prepend="{ isActive }">
              <v-list-item-action start>
                <v-checkbox-btn 
                  v-model="gismoState"
                  v-on:click="gizmoChange(gismoState)">
                </v-checkbox-btn>
              </v-list-item-action>
            </template>

            <v-list-item-title>
              Gizmo
            </v-list-item-title>
            <v-list-item-subtitle>
              Visible/Non-Visible
            </v-list-item-subtitle>

          </v-list-item>
        </v-list-group>    
        <v-list-group value="Positions">

          <template v-slot:activator="{props}">
            <v-list-item v-bind="props" prepend-icon="mdi-folder"
                         title="Positions">
            </v-list-item>
          </template>

          <v-list>
            <v-list-item v-for="(position) in positions" :key="i">
              <v-list-group>
                <v-list-group-value>
                  {{ i }}
                </v-list-group-value>

                  <template v-slot:activator="{ props }">
                    <v-list-item style="left:22px" v-bind="props" 
                                 prepend-icon="mdi-radar">
                      <v-list-title right>
                        {{ position }}
                      </v-list-title>
                    </v-list-item>
                  </template>

                <v-list-item>

                  <template v-slot:prepend="{ isActive }">
                    <v-list-item-action start>
                      <v-checkbox-btn
                        v-model="gismoState"
                        v-on:click="gizmoChange(gismoState)">
                      </v-checkbox-btn>
                    </v-list-item-action>
                  </template>

                  <v-list-item-title>
                    Gizmo
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Visible/Non-Visible
                  </v-list-item-subtitle>

                </v-list-item>
              </v-list-group>
            </v-list-item>
          </v-list>
        </v-list-group>
      </v-list>
        
      </v-navigation-drawer>

      <!-- Main Scene-->
      <canvas id="mainCanvas" myattr="myattr">
        <div id="gui_container"></div>
      </canvas>

      <!-- Position information-->
      <v-container fluid>
        <v-navigation-drawer v-model="drawer" location="bottom" 
                             temporary width="389">
          <v-navigation-drawer permanent location="right" width="350">

            <v-list-item align="center">
              {{ selectedModelName }}
            </v-list-item>

            <v-divider></v-divider>

            <v-list-item >
              <!-- Sub Scene -->
              <canvas 
                v-show="cardShow" 
                id="subCanvas" 
                width="300" 
                height="300" 
                style="position: absolute; top: 23px; right: 25px; 
                       border: 1px solid rgb(255, 255, 255)">
              </canvas>
            </v-list-item>
            
          </v-navigation-drawer>
          <v-card width="23%" height="100%" variant="outlined" class="pa-4">
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
        </v-navigation-drawer>
      </v-container>
    <v-main style="height: 250px"></v-main>
  </v-layout>
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
import { GUI } from 'dat.gui';

export default {
  name: 'Viewer',

  data() {
    return {
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

      positions: ['Position1', 'Position2', 'Position3', 'Position4'],

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

      gismoState: false
    };
  },

  created: async function() {
    

  },

  async mounted() {
    window.addEventListener('resize', this.onWindowResize, false)

    await fromOfflineDB.syncLocalDBs();

    /* Initialize standart components of threejs (renderer, scene, etc.) */
    this.init();
    this.subInit();

    /* Load all available models of selected place */
    await this.loadPlaceObjects();

    if(this.meshesInScene.length > 0) {

      /* Reset camera in according to the position of the last place-model */
      this.updateCameraPosition(this.meshesInScene
      [this.meshesInScene.length - 1].title)

      await this.loadPositionObjects();

      /* Start Animation-Loop */
      this.animate();
    } else {
      console.log("No Models")
    }
  },

  async unmounted() {
    if(this.meshesInScene.length > 0) {
      this.saveCurrentScene();

      // get the current Camera position
      const cameraData = [
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z,
        this.camera.rotation.x,
        this.camera.rotation.y,
        this.camera.rotation.z
      ]

      const placeID = VueCookies.get('currentPlace')
      const savedCamera = await fromOfflineDB.getProperties("id", "Cameras", "cameras")
      const anchor = []

      if(!savedCamera.includes(placeID)) {
        anchor.push(this.arcballAnchor[0])
        anchor.push(this.arcballAnchor[1])
        anchor.push(this.arcballAnchor[2])
      } else {
        const camera = await fromOfflineDB.getObject(placeID, "Cameras", "cameras")
        anchor.push(camera.arcballAnchor[0])
        anchor.push(camera.arcballAnchor[1])
        anchor.push(camera.arcballAnchor[2])
      }

      // Camera Object
      const cameraObject = {
          id: placeID,
          cameraPosition: cameraData,
          arcballAnchor: anchor
      }

      await fromOfflineDB.updateObject(cameraObject, "Cameras", "cameras")
    }
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    document.removeEventListener("click", this.updateArcball)
    document.removeEventListener("click", this.onMouseDown)
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
    *  createGUI             - Creates all gui Elements in respective order
    *  changeState
    *  changeColor           - Change the current color/texture of a model in
    *                          the scene to a new color
    *  changeOpacity         - Changes the opacity of a mesh
    *  ------------------------------------------------------------------------- 
    *  saveCurrentScene      -
    *  updateCameraPosition  - Moves the Camera to specified model in scene
    *  onWindowResize        - Resizes the threeJS element
    *  ------------------------------------------------------------------------
    *  init                  - Initialize the scene
    *  animate               - Animate the scene
    */

    /**
     * -------------------------------------------------------------------------
     * ---- Loading
     * -------------------------------------------------------------------------
     */
    loadPlaceObjects: async function () {
      const placeID = VueCookies.get('currentPlace')
      const objects = await fromOfflineDB.getAllObjectsWithID
        (placeID, 'Place', 'Models', 'places')

      if (objects) {
        for (var i = 0; i < objects.length; i++) {
          await this.loadModel(objects[i].id, 'Place', 'Models', 'places');
        }
      }
    },

    loadPositionObjects: async function () {
      const positionsID = VueCookies.get('currentPosition')
      const objects = await fromOfflineDB.getAllObjectsWithID
        (positionsID, 'Position', 'Models', 'positions')

      if (objects) {
        for (var i = 0; i < objects.length; i++) {
          await this.loadModel(objects[i].id, 'Position', 'Models', 'positions');
        }
      }
    },

    /**
     * 
     * @param {*} modelID 
     * @param {*} dbName 
     * @param {*} storeName 
     */
    loadModel: async function (modelID, type, dbName, storeName) {
      /* Get 3D-Model from IndexedDB */
      const object = await fromOfflineDB.getObject(modelID, dbName, storeName);
      const model = object.model
      const color = object.color
      const opacity = object.opacity
      let id = null

      if(type === 'Place') {
        id = object.placeID
      } else {
        id = object.positionID
      }


      /* Load object */
      const mesh = await new Promise((resolve) => {
        this.loader.parse(model, "", (glb) => {
          glb.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color(color)
              child.name = id
            }
          });
          resolve(glb.scene);
        });
      })

      /* Save variables for  */
      switch(type) {
        case 'Place':
          this.meshesInScene.push({ title: id, id: object.id });
          break;
        case 'Position':
          this.positionInScene.push({ title: id, id: object.id, move: false });
          if(object.coordinates != null) {
            const coordinates = object.coordinates
            mesh.position.set(coordinates[0], coordinates[1], coordinates[2])
          }
          break;
        default:
          console.log( "error" );
      }

      this.groupsInScene.push(mesh)
      
      /* Add mesh to scene */
      this.scene.add(mesh)

    },

    loadMeshInSub: async function(modelname) {
      const object = await fromOfflineDB.getObject(modelname, 'Models', 'positions');
      const model = object.model
      const color = object.color
      const opacity = object.opacity
      const id = object.id

      /* Load object */
      const mesh = await new Promise((resolve) => {
        this.loaderMain.parse(model, "", (glb) => {
          glb.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color(color)
              child.name = id
            }
          });
          resolve(glb.scene);
        });
      })

      this.meshInSub = mesh

      this.selectedModelName = "Model name: " + object.title

      const bbox = new THREE.Box3().setFromObject(this.meshInSub)
      const height = bbox.max.y - bbox.min.y

      this.cameraSub.position.z = height + 60
        
      /* Add mesh to sub scene */
      this.sceneSub.add(this.meshInSub)
    },

    /**
     * 
     * @param {*} element
     * @param {*} positionTitle
     */
    changeState: function (element, positionTitle) {
      switch (element) {
        case "model":

          /* Set all move-values to false */
          }

          break;

        case 'position':

          /* Set all move-values to false */
          }

          /* Get the object of checked checkbox */
            obj => { return obj.title === positionTitle }
          )
            (x => x.title === test[0].title).move = true;

          break;

        default:
          console.log("Error")
      }
    },

    changeState2: function(element, meshName) {

      switch(element) {
        case 'model':
          this.tControlsMain.enabled = false;
          this.tControlsMain.detach()
          break;
        case 'position':
          const model = this.sceneMain.getObjectByName(meshName);
          console.log(meshName)
          var groupObject = model
          while(!(groupObject instanceof THREE.Group)) {
            groupObject = groupObject.parent
          }
          break;
      }

    },

    /**
     * 
     * @param {*} modelName 
     */
    changeColor: async function (modelName) {
    },

    /**
     * 
     * @param {*} modelName 
     * @param {*} modelID 
     */
    changeOpacity: async function (modelName, modelID) {
      const opacityValue = this.scene.getObjectByName(modelName).material.opacity;

      if (opacityValue == 1.0) {
        this.scene.getObjectByName(modelName).material.opacity = 0.0
      } else {
        this.scene.getObjectByName(modelName).material.opacity = 1.0
      }
    },

    /**
     * -------------------------------------------------------------------------
     * ---- 
     * -------------------------------------------------------------------------
     */
    saveCurrentScene: async function () {
      /* Save place models settings */
      for (var i = 0; i < this.meshesInScene.length; i++) {
        const modelName = this.meshesInScene[i].title;
        const modelID = this.meshesInScene[i].id;

        const modelInScene = this.scene.getObjectByName(modelName);
        const modelInDB = await fromOfflineDB.getObject(modelID, 
          'Models', 'places');

        /* Update Color */
        modelInDB.color = "#" + modelInScene.material.color.getHexString()

        /* Update Opacity */
        modelInDB.opacity = modelInScene.material.opacity

        await fromOfflineDB.updateObject(modelInDB, 'Models', 'places')
      }

      /* Save position model settings */
      for (var i = 0; i < this.positionInScene.length; i++) {
        const modelName = this.positionInScene[i].title;
        const modelID = this.positionInScene[i].id;

        const modelInScene = this.scene.getObjectByName(modelName);
        const modelInDB = await fromOfflineDB.getObject(modelID, 
          'Models', 'positions');

        /* Update Color */
        modelInDB.color = "#" + modelInScene.material.color.getHexString()

        /* Update Opacity */
        modelInDB.opacity = modelInScene.material.opacity

        /* Update Coordinates */
        const modelCenter = this.getModelCenter(modelInScene)
        const newCoordinates = [modelCenter.x, modelCenter.y, modelCenter.z]
        modelInDB.coordinates = newCoordinates

        await fromOfflineDB.updateObject(modelInDB, 'Models', 'positions')

      }

    },

    /**
     * 
     * @param {*} modelName 
     */
    updateCameraPosition: async function (modelName) {
      const placeID = VueCookies.get( 'currentPlace' )
      const cameraIDsFromDB = await fromOfflineDB.getProperties
        ( 'id', 'Cameras', 'cameras' )

      if(cameraIDsFromDB.includes(placeID)) {

        /* Get camera data from IndexedDB */
        const cameraFromDB = await fromOfflineDB.getObject
          ( VueCookies.get('currentPlace'), "Cameras", "cameras" );
        
        /* Update current camera state with camera data from IndexedDB */
        const cameraPosition = cameraFromDB.cameraPosition;
        this.cameraData
          .position = [cameraPosition[0], cameraPosition[1], cameraPosition[2]];
        this.cameraData
          .rotation = [cameraPosition[3], cameraPosition[4], cameraPosition[5]];

        /* Restore saved anchor position for the arcball target */
        this.restoreArcballAnchor( cameraFromDB.arcballAnchor, 
                                   this.arcballControls );

        /* Set new camera state */
        this.setCamera( this.camera, this.cameraData );

      } else {

        /* Get center of place model as Vec3 */
        const model = this.scene.getObjectByName(modelName);
        const center = this.getModelCenter(model);

        /* Define an anchor point for the arcball */
        this.arcballAnchor.push(center.x);
        this.arcballAnchor.push(center.y);
        this.arcballAnchor.push(center.z);

        /* Set center as the new arcball target */
        this.arcballControls.target.set(center.x, center.y, center.z);

        /* Move camera to the object */
        this.camera.position.set(center.x, center.y - 15, center.z);
        this.getCamera(this.camera, this.cameraData)

        /* Save changes made to the arcball control settings */
        this.arcballControls.update();

      }
    },

    getGroupCenter: function(model) {
      var groupObject = model
      while(!(groupObject instanceof THREE.Group)) {
        groupObject = groupObject.parent
      }
      const aabb = new THREE.Box3()
      aabb.setFromObject(groupObject)
      const center = new THREE.Vector3()
      aabb.getCenter(center)
      return center
    },

    /**
     * 
     * @param {*} event 
     */
     updateArcball: async function(event) {
      if(event.ctrlKey) {

      this.getCamera(this.camera, this.cameraData)

      const placeID = VueCookies.get( 'currentPlace' )
      const cameraIDsFromDB = await fromOfflineDB.getProperties
        ( 'id', 'Cameras', 'cameras' )

      if(cameraIDsFromDB.includes(placeID)) {

        const newCamera = await fromOfflineDB.getObject(
          VueCookies.get('currentPlace'), "Cameras", "cameras")

        this.arcballControls.target.set(
          newCamera.arcballAnchor[0], newCamera.arcballAnchor[1],
          newCamera.arcballAnchor[2]);

        this.arcballControls.reset()
        this.arcballControls.update()

      } else {

        this.arcballControls.target.set(
          this.arcballAnchor[0], this.arcballAnchor[1],
          this.arcballAnchor[2] );

        this.arcballControls.reset()
        this.arcballControls.update()

      }

      this.setCamera(this.camera, this.cameraData)

      }
    },

    /**
     * 
     * @param {*} model 
     */
     getModelCenter: function(model) {
      const modelGeo = model.geometry;
      modelGeo.computeBoundingBox();
      const center = new THREE.Vector3();
      model.geometry.boundingBox.getCenter(center);
      model.localToWorld(center);
      return center
    },

    /**
     * 
     * @param {*} camera 
     * @param {*} cameraData 
     */
     getCamera: function(camera, cameraData) {
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
     setCamera: function(camera, cameraData) {
      camera.position.set( cameraData.position[0], cameraData.position[1],
                           cameraData.position[2] );
      camera.rotation.set( cameraData.rotation[0], cameraData.rotation[1],
                           cameraData.rotation[2] );
    },

    /**
     * 
     * @param {*} arcballAnchor 
     * @param {*} arcballControls 
     */
     restoreArcballAnchor: function(arcballAnchor, arcballControls) {
      /* Restore saved anchor position for the arcball target */
      arcballControls.target.set( arcballAnchor[0], arcballAnchor[1],
                                  arcballAnchor[2] );
      
      /* Save changes made to the arcball control settings */
      arcballControls.update();
    },

    makePerspectiveCamera: function () {
      const fov = 45;
      const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      const near = 0.01;
      const far = 2000;
      const newCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      return newCamera;
    },

    onWindowResize: function () {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    },

    /**
     * -------------------------------------------------------------------------
     * ---- Init
     * -------------------------------------------------------------------------
     */
    init: function () {

      this.groupsInScene = []
      // Canvas Object
      this.canvas = document.getElementById("canvas");

      // Loader for .gltf and .glb Data
      this.loader = new GLTFLoader();

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(this.canvas.devicePixelRatio);
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setClearColor(0x263238, 1);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.canvas.appendChild(this.renderer.domElement);

      // Scene
      this.scene = new THREE.Scene();

      // Camera
      this.camera = this.makePerspectiveCamera()

      // Light
      const ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);

      // Controls
      this.arcballControls = new ArcballControls
        (this.camera, this.renderer.domElement, this.scene);

      this.transformControls = new TransformControls
        (this.camera, this.renderer.domElement);

      this.transformControls.addEventListener('dragging-changed', e => {
        this.arcballControls.enabled = !e.value;
      });

      this.scene.add(this.transformControls);

      // GUI
      this.gui = new GUI();
      window.addEventListener('keydown', e => {
        switch (e.code) {
          case 'KeyW':
            this.transformControls.mode = 'translate';
            break;
          case 'KeyE':
            this.transformControls.mode = 'rotate';
            break;
          case 'KeyR':
            this.transformControls.mode = 'scale';
            break;
        }
      });

      // Raycaster
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2()
      
      // Eventlistener
      document.addEventListener("click", this.updateArcball)
      document.addEventListener('click', this.onMouseDown)
    subInit: function() {
      /* mesh in sub scene */
      this.meshInSub = null
      
      /* Canvas obj */
      this.canvasSub = document.getElementById("subCanvas");

      /* Renderer */
      this.rendererSub = new THREE.WebGLRenderer({ canvas: subCanvas });
      this.rendererSub.setPixelRatio(this.canvasSub.devicePixelRatio);
      this.rendererSub.setSize(this.canvasSub.clientWidth, 
                               this.canvasSub.clientHeight);
      this.rendererSub.setClearColor("black", 1);
      this.rendererSub.shadowMap.enabled = true;
      this.rendererSub.shadowMap.type = THREE.PCFSoftShadowMap;

      /* Scene */
      this.sceneSub = new THREE.Scene()

      /* Camera */
      const aspect = this.canvasSub.clientWidth / this.canvasSub.clientHeight;
      this.cameraSub = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );

      /* Light */
      const ambientLight = new THREE.AmbientLight(0xffffff);
      this.sceneSub.add(ambientLight);

      /* Controls */
      this.controlsSub = new OrbitControls(this.cameraSub, this.rendererSub.domElement)

      /* Event listener */
      this.canvasSub.addEventListener('mousemove', () => {
        console.log("Mouse moved")
      })

    },

    onMouseDown: async function(event) {

      event.preventDefault()

      const rect = this.rendererMain.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.pointer.x = ( x / this.canvasMain.clientWidth ) *  2 - 1;
      this.pointer.y = ( y / this.canvasMain.clientHeight) * - 2 + 1

      this.raycaster.setFromCamera(this.pointer, this.cameraMain);
      const intersects = this.raycaster.intersectObjects(this.meshesInMain, true)

      if(intersects.length > 0 && event.altKey) {
        const objectName = intersects[0].object.name
        /* Check if clicked model is a position model */
        for(let i=0; i < this.positionModelsInScene.length; i++) {

          if(this.positionModelsInScene[i].modelID === objectName) {
            this.cardShow = true
            this.drawer = true
            this.loadMeshInSub(intersects[0].object.name)

            /* Fill the drawer with position info */
            const positionID = this.positionModelsInScene[i].positionID
            const model = await fromOfflineDB.getObject(positionID, 'Positions',
                                                        'positions')
            
            this.positionInfo.positionNumber = model.positionNumber
            this.positionInfo.subNumber = model.subNumber
            this.positionInfo.date = model.date
            this.positionInfo.title = model.title
            this.positionInfo.material = model.material
            this.positionInfo.right = model.right
            this.positionInfo.up = model.up
            this.positionInfo.height = model.height
            this.positionInfo.count = model.count
            this.positionInfo.weight = model.weight
            this.positionInfo.description = model.description
            this.positionInfo.dating = model.dating
            this.positionInfo.adressOf = model.adressOf

          }
        }
      }
    },

    gizmoChange: function(p) {
      if(p) {
        this.abControlsMain.setGizmosVisible(false);
        this.gismoCB = false
      } else {
        this.abControlsMain.setGizmosVisible(true);
        this.gismoCB = true
      }
    },

    /**
     * -------------------------------------------------------------------------
     * ---- Animation
     * -------------------------------------------------------------------------
     */
    animate: function () {
      /* Render-Loop */
      requestAnimationFrame(this.animate);

      this.render();

      /* Render scene and camera */
      this.renderer.render(this.scene, this.camera);
    },

    render: function() {
      }



      this.arcballControls.setTbRadius(0.67)

    }
  }
}

</script>

<style scoped>
#mainCanvas {
  width: 100%;
  height: 100vh;
}
</style>