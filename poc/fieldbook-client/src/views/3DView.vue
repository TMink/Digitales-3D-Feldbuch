<template>
  <div id="canvas">
    <div id="gui_container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import VueCookies from 'vue-cookies';
import { ArcballControls } from 
  'three/examples/jsm/controls/ArcballControls.js';
import { TransformControls } from 
  'three/examples/jsm/controls/TransformControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { GUI } from 'dat.gui';
import { toRaw } from 'vue';

const params = {
  animate: true,

  guiMesh: {
    opacity: true,
    color: "#ffffff",
    clipping: false
  },

  guiControls: {
    opacity: false,
    state: true,
  },

  positions: {
    inScene: [],
    attach: false,
  },

  attachedPosition: null,
};

export default {
  name: 'Viewer',

  data() {
    return {
      meshesInScene: [],
      arcballAnchor: [],
      cameraData: {
        position: null,
        rotation: null
      },
    };
  },

  async mounted() {
    window.addEventListener('resize', this.onWindowResize, false)

    await fromOfflineDB.syncLocalDBs();

    /* Initialize standart components of threejs (renderer, scene, etc.) */
    this.init();

    /* Load all available models of selected place */
    await this.loadPlaceObjects();

    if(this.meshesInScene.length > 0) {

      /* Reset camera in according to the position of the last place-model */
      this.updateCameraPosition(this.meshesInScene
        [this.meshesInScene.length - 1].title)

      /* Create GUI Folders */
      this.createGUI();

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
          await this.loadModel(objects[i].id, 'Models', 'places');
        }
      }
    },

    /**
     * 
     * @param {*} modelID 
     * @param {*} dbName 
     * @param {*} storeName 
     */
    loadModel: async function (modelID, dbName, storeName) {
      /* Get 3D-Model from IndexedDB */
      const object = await fromOfflineDB.getObject(modelID, dbName, storeName);
      const model = object.model
      const color = object.color
      const opacity = object.opacity
      const title = object.title

      params.guiMesh.opacity = Boolean(opacity)
      params.guiMesh.color = object.color

      /* Load object */
      const mesh = await new Promise((resolve) => {
        this.loader.parse(model, "", (glb) => {
          glb.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color(color)
              child.name = title;
            }
          });
          resolve(glb.scene);
        });
      })

      /* Add mesh to scene */
      this.scene.add(mesh)

      /* Save variables for  */
      this.meshesInScene.push({ title: title, id: object.id })
    },

    /**
     * -------------------------------------------------------------------------
     * ---- GUI
     * -------------------------------------------------------------------------
     */
    createGUI: function () {
      /* Add GUI to DOM */
      this.gui.domElement.id = 'gui';
      gui_container.appendChild(this.gui.domElement);

      /* Controls Folder */
      const controlsFolder = this.gui.addFolder('Controls')
      controlsFolder.add(params.guiControls, 'opacity')
      controlsFolder.add(params.guiControls, 'state')
        .listen().onChange(() => this.changeState('model'))

      /* Models Folder */
      const modelsFolder = this.gui.addFolder('Models')

      for (var i = 0; i < this.meshesInScene.length; i++) {
        const modelName = this.meshesInScene[i].title;
        const modelID = this.meshesInScene[i].id;

        const modelFolder = modelsFolder.addFolder(modelName);

        modelFolder.add(params.guiMesh, "opacity")
          .onChange(v => this.changeOpacity(modelName, modelID));

        modelFolder.addColor(params.guiMesh, "color")
          .onChange(v => this.changeColor(modelName))
      }

      /* Positions Folder */
      const positionsFolder = this.gui.addFolder('Positions');
      for (var i = 0; i < params.positions.inScene.length; i++) {

        const positionTitle = params.positions.inScene[i].number;
        const positionFolder = positionsFolder.addFolder(positionTitle);

        const test = params.positions.inScene.filter(
          obj => { return obj.number === positionTitle }
        )

        positionFolder.add(params.positions.inScene.find
          (x => x.number === test[0].number), "move")
          .listen().onChange(
            () => this.changeState('position', positionTitle))
        //.listen().onChange(() => this.attachPosition
        //  (positionTitle))
      }
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
          for (var i = 0; i < params.positions.inScene.length; i++) {
            params.positions.inScene[i].move = false
          }

          this.transformControls.enabled = false;
          this.transformControls.detach()
          break;

        case 'position':

          params.guiControls.state = false;
          /* Set all move-values to false */
          for (var i = 0; i < params.positions.inScene.length; i++) {
            params.positions.inScene[i].move = false
          }

          /* Get the object of checked checkbox */
          const test = params.positions.inScene.filter(
            obj => { return obj.number === positionTitle }
          )
          params.positions.inScene.find
            (x => x.number === test[0].number).move = true;

          this.arcballControls.enabled = false;
          this.arcballControls.visible = false;
          break;

        default:
          console.log("Error")
      }
    },

    /**
     * 
     * @param {*} modelName 
     */
    changeColor: async function (modelName) {
      var colorObj = new THREE.Color( params.guiMesh.color );
      this.scene.getObjectByName(modelName).material.color = colorObj;
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

    onWindowResize: function () {
      const canvas = document.getElementById("canvas");

      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
    },

    /**
     * -------------------------------------------------------------------------
     * ---- Init
     * -------------------------------------------------------------------------
     */
    init: function () {
      // Canvas Object
      const canvas = document.getElementById("canvas");

      // Loader for .gltf and .glb Data
      this.loader = new GLTFLoader();

      // Renderer
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(canvas.devicePixelRatio);
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      this.renderer.setClearColor(0x263238, 1);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      canvas.appendChild(this.renderer.domElement);

      // Scene
      this.scene = new THREE.Scene();

      // Camera
      const cameraAspect = canvas.clientWidth / canvas.clientHeight;
      this.camera = new THREE.PerspectiveCamera(75, cameraAspect, 0.1, 1000);
      this.camera.position.set(2, 0, 0);
      this.camera.lookAt(this.scene.position);
      this.camera.updateProjectionMatrix();

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
    },

    /**
     * -------------------------------------------------------------------------
     * ---- Animation
     * -------------------------------------------------------------------------
     */
    animate: function () {
      /* Render-Loop */
      requestAnimationFrame(this.animate);

      /* Update ArcballControls-Gizmo: visible <-> invisible */
      if (params.guiControls.opacity === true) {
        this.arcballControls.setGizmosVisible(true);
      } else {
        this.arcballControls.setGizmosVisible(false);
      }

      /* Update ArcballControls State: useable <-> unuseable */
      if (params.guiControls.state === true) {
        this.arcballControls.enabled = true;
      } else {
        this.arcballControls.enabled = false;
      }

      this.arcballControls.setTbRadius(0.67)

      /* Render scene and camera */
      this.renderer.render(this.scene, this.camera);
    },
  }
}

</script>

<style scoped>
#canvas {
  width: 100%;
  height: 100vh;
}

#gui_container {
  position: absolute;
}
</style>
