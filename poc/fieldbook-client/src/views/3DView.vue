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
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { GUI } from 'dat.gui';

let needsUpdate = true;

const params = {
  animate: true,

  guiMesh: {
    visibility: false,
    clipping: false
  }
};

export default {

  name: 'Viewer',

  data() {

    return {};

  },

  async mounted() {

    window.addEventListener('resize', this.onWindowResize, false)

    await fromOfflineDB.syncLocalDBs();

    this.init();

    /* ++++ Load all available meshes ++++
    *  -> Loaded meshes have an opacity value of 0.0
    *  -> Camera is fixed on center of last loaded mesh
    */
    const placeID = VueCookies.get('currentPlace')
    const models = await fromOfflineDB.getAllObjectsWithID
                              (placeID, 'Place', 'Models', 'places')
    if( models ) {
      for( var i=0; i < models.length; i++ ) {
        await this.loadMesh(models[i].id, 'Models','places');
      }
    }

    this.createGuiElements();

    this.animate();

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
     *  changeVisibility      - Changes the opacity of a mesh
     *  onWindowResize        - Resizes the threeJS element
     *  ------------------------------------------------------------------------
     *  init                  - Initialize the scene
     *  animate               - Animate the scene
     */

    /**
     * @param {String} modelID    - Key under which the model is stored in
     *                              Object Store
     * @param {String} dbName     - Name of Database
     * @param {String} storeName  - Name of Object Store
     */
    loadMesh: async function (modelID, dbName, storeName) {

      /* Create empty Mesh */
      const mesh = new THREE.Mesh();

      /* Get Model Data from IndexedDB */
      const model = await fromOfflineDB.getObject(modelID, dbName, storeName);

      /* Load object */
      const object = new OBJLoader().parse(model.result.model);

      /* Load texture */
      var textLoader = new THREE.TextureLoader().load(model.result.texture);

      /* Create Material */
      const material = new THREE.MeshBasicMaterial({
        map: textLoader,
        transparent: true,
        side: THREE.DoubleSide
      });

      /* Get geometry from loaded object */
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          /* Add geometry to mesh */
          mesh.geometry = child.geometry
        }
      });

      /* Add material to mesh */
      mesh.material = material;
      mesh.material.alphaTest = 0.5
      mesh.material.opacity = 1;
      mesh.name = model.result.title;

      /* Add mesh to scene */
      this.scene.add(mesh);

      /* Move camera to mesh position */
      this.updateCameraPosition(model.result.title)

    },

    /**
     * @param {String} modelName  - Name of model in scene
     */
    updateCameraPosition: function (modelName) {

      var center = new THREE.Vector3;
      const box = new THREE.Box3().setFromObject(
        this.scene.getObjectByName(modelName));
      box.getCenter(center)

      this.controls.target.set(center.x, center.y, center.z);
      this.camera.position.set(center.x, center.y - 15, center.z);

      this.controls.update();

    },

    

    createGuiElements: function () {

      const dataFolder = this.gui.addFolder('Data')

      //var addButton = dataFolder.add(guiFunctions, 'add')
      // dataFolder.add(guiFunctions, 'delete')

      /* #### Prep Models #### */
      const prepModelsFolder = this.gui.addFolder('Prep Models');

      /*
      for(var i=0; i < this.meshInScene.length; i++) {

        const meshName = this.meshInScene[i];

        const modelFolder = prepModelsFolder.addFolder( meshName );

        modelFolder.add( params.guiMesh, "visibility")
                   .onChange( v => this.changeVisibility(meshName));

        modelFolder.add( params.guiMesh, "clipping")
                   .onChange( v => this.changeClipping(meshName, this.planes) );
      }
      */

    },

    /**
     * @param {String} model  - Name of model in scene
     * @param {String} color  - Name of color
     */
    loadWithColor: function (modelName, color) {
      this.scene.getObjectByName(modelName).material.color =
        new THREE.Color(color)
    },

    /**
     * @param {String} modelName  - Name of model in scene
     */
    changeVisibility: function (modelName) {

      const model = this.scene.getObjectByName(modelName)

      if (model.material.opacity == 1) {
        model.material.opacity = 0;
      } else {
        model.material.opacity = 1;
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
      this.controls = new ArcballControls(this.camera, this.renderer.domElement,
                                          this.scene);   

      // GUI
      this.gui = new GUI();
      this.gui.domElement.id = 'gui';
      gui_container.appendChild(this.gui.domElement);

    },

    animate: function () {

      requestAnimationFrame(this.animate);

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
