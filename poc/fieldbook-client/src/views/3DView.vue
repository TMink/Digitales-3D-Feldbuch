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
    };
  },

  async mounted() {

    window.addEventListener('resize', this.onWindowResize, false)

    await fromOfflineDB.syncLocalDBs();

    this.init();
    /* ++++ Load all available models of selected place ++++
    *  -> Loaded meshes have an opacity value of 0.0
    */
    await this.loadPlaceObjects();

    if(this.meshesInScene.length > 0) {

      /* ++++ Reset camera in according to the position of the last place 
      *       model ++++
      */
      this.updateCameraPosition(this.meshesInScene[this.meshesInScene.length - 1].title)

      this.createGui();

      this.animate();

    } else {
      console.log("No Models")
    }
  },

  unmounted() {
    if(this.meshesInScene.length > 0) {
      this.saveCurrentScene();
    }
    
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  },

  methods: {

    /**
    * Function overview:
    *  loadModel             - Loads a Model from IndexedDB into the scene. 
    *                          This version has the standart texture from the 
    *                          object and the name of the created mesh is the 
    *                          title of the object.
    *  updateCameraPosition  - Moves the Camera to specified model in scene
    *  createGuiElements     - Creates all gui Elements in respective order
    *  loadWithColor         - Change the current color/texture of a model in
    *                          the scene to a new color
    *  changeOpacity         - Changes the opacity of a mesh
    *  onWindowResize        - Resizes the threeJS element
    *  ------------------------------------------------------------------------
    *  init                  - Initialize the scene
    *  animate               - Animate the scene
    */

    saveCurrentScene: async function() {

      for (var i = 0; i < this.meshesInScene.length; i++) {

        const modelName = this.meshesInScene[i].title;
        const modelID = this.meshesInScene[i].id;

        const modelInScene = this.scene.getObjectByName(modelName);
        const modelInDB = await fromOfflineDB.getObject(modelID, 'Models', 'places');

        /* Update Color */
        modelInDB.color = "#" + modelInScene.material.color.getHexString()
        
        /* Update Opacity */
        modelInDB.opacity = modelInScene.material.opacity

        await fromOfflineDB.updateObject(modelInDB, 'Models', 'places')
      
      }

    },

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
              // Set mesh name to position title
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.material.color = new THREE.Color(color)
              child.name = title;
            }
          });
          resolve(glb.scene);
        });
      })

      this.scene.add(mesh)
      this.meshesInScene.push({ title: title, 
                                id:    object.id     })

    },

    /**
    * @param {String} modelName  - Name of model in scene
    */
    updateCameraPosition: function (modelName) {
      const model = this.scene.getObjectByName(modelName);

      const modelGeo = model.geometry;
      modelGeo.computeBoundingBox();
      const center = new THREE.Vector3();
      model.geometry.boundingBox.getCenter(center);
      model.localToWorld(center);

      this.arcballControls.target.set(center.x, center.y, center.z);
      this.camera.position.set(center.x, center.y - 15, center.z);

      this.arcballControls.update();

    },

    createGui: function () {

      this.gui.domElement.id = 'gui';
      gui_container.appendChild(this.gui.domElement);

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

      /* general controls Folder */
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

    },

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
     * @param {String} modelName  - Name of model in scene
     */
    changeOpacity: async function (modelName, modelID) {

      const opacityValue = this.scene.getObjectByName(modelName).material.opacity;

      if (opacityValue == 1.0) {
        this.scene.getObjectByName(modelName).material.opacity = 0.0
      } else {
        this.scene.getObjectByName(modelName).material.opacity = 1.0
      }

    },

    onWindowResize: function () {

      const canvas = document.getElementById("canvas");

      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();

    },

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
      this.arcballControls = new ArcballControls(this.camera, this.renderer.domElement,
        this.scene);

      this.transformControls = new TransformControls
        (this.camera,
          this.renderer.domElement);

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

    animate: function () {

      requestAnimationFrame(this.animate);

      if (params.guiControls.opacity === true) {
        this.arcballControls.setGizmosVisible(true);
      } else {
        this.arcballControls.setGizmosVisible(false);
      }

      if (params.guiControls.state === true) {
        this.arcballControls.enabled = true;
      } else {
        this.arcballControls.enabled = false;
      }

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
