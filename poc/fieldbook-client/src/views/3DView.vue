<template>
  <div id="canvas">
    <div id="gui_container"></div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { GUI } from 'dat.gui';
import { MeshBVHVisualizer } from 'three-mesh-bvh';
import {
  SUBTRACTION,
  Brush,
  Evaluator,
  GridMaterial,
  EdgesHelper,
  TriangleSetHelper
} from 'three-bvh-csg';

let needsUpdate = true;

const params = {
  animate: true,

  brush1Shape: 'box',
  brush1Complexity: 1,
  brush1Color: '#ffffff',

  brush2Shape: 'sphere',
  brush2Complexity: 1,
  brush2Color: '#E91E63',

  operation: SUBTRACTION,
  useGroups: true,

  displayControls: true,
  displayBrushes: true,
  enableDebugTelemetry: false,
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
        shadowSide: THREE.DoubleSide,
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
      mesh.material.opacity = 0.0;
      mesh.name = model.result.title;

      /* Add mesh to scene */
      this.scene.add(mesh);

      /* Move camera to mesh position */
      this.updateCameraPosition(model.result.title)

      this.meshInScene.push(model.result.title);

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
      this.camera = new THREE.PerspectiveCamera(75, cameraAspect, 0.1, 50);
      this.camera.position.set(2, 0, 0);
      this.camera.lookAt(this.scene.position);
      this.camera.updateProjectionMatrix();



      // Light
      const ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);



      // Controls
      // this.controls = new ArcballControls(this.camera,
      //  this.renderer.domElement,
      //  this.scene);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
      this.transformControls.setSize(0.75);
      this.transformControls.addEventListener('dragging-changed', e => {
        this.controls.enabled = !e.value;
      });
      this.transformControls.addEventListener('objectChange', () => {
        needsUpdate = true;
      });
      this.scene.add(this.transformControls);



      // Evaluator
      this.csgEvaluator = new Evaluator();
      this.csgEvaluator.attributes = ['position', 'normal'];



      // Brushes
      this.brush1 = new Brush(new THREE.BoxGeometry(), new GridMaterial());
      this.brush2 = new Brush(new THREE.BoxGeometry(), new GridMaterial());
      this.brush2.position.set(- 0.75, 0.75, 0);
      this.brush2.scale.setScalar(0.75);

      this.updateBrush(this.brush1, params.brush1Shape, params.brush1Complexity);
      this.updateBrush(this.brush2, params.brush2Shape, params.brush2Complexity);

      // initialize materials
      this.brush1.material.opacity = 0.15;
      this.brush1.material.transparent = true;
      this.brush1.material.depthWrite = false;
      this.brush1.material.polygonOffset = true;
      this.brush1.material.polygonOffsetFactor = 0.2;
      this.brush1.material.polygonOffsetUnits = 0.2;
      this.brush1.material.side = THREE.DoubleSide;
      this.brush1.material.premultipliedAlpha = true;

      this.brush2.material.opacity = 0.15;
      this.brush2.material.transparent = true;
      this.brush2.material.depthWrite = false;
      this.brush2.material.polygonOffset = true;
      this.brush2.material.polygonOffsetFactor = 0.2;
      this.brush2.material.polygonOffsetUnits = 0.2;
      this.brush2.material.side = THREE.DoubleSide;
      this.brush2.material.premultipliedAlpha = true;
      this.brush2.material.roughness = 0.25;
      this.brush2.material.color.set(0xE91E63).convertSRGBToLinear();

      this.brush1.receiveShadow = true;
      this.brush2.receiveShadow = true;
      this.transformControls.attach(this.brush2);

      this.scene.add(this.brush1, this.brush2);

      // create material map for transparent to opaque variants
      this.materialMap = new Map();
      let mat;
      mat = this.brush1.material.clone();
      mat.side = THREE.FrontSide;
      mat.opacity = 1;
      mat.transparent = false;
      mat.depthWrite = true;
      this.materialMap.set(this.brush1.material, mat);

      mat = this.brush2.material.clone();
      mat.side = THREE.FrontSide;
      mat.opacity = 1;
      mat.transparent = false;
      mat.depthWrite = true;
      this.materialMap.set(this.brush2.material, mat);

      this.materialMap.forEach((m1, m2) => {

        m1.enableGrid = params.gridTexture;
        m2.enableGrid = params.gridTexture;

      });

      // add object displaying the result
      this.resultObject = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({
        flatShading: false,
        polygonOffset: true,
        polygonOffsetUnits: 0.1,
        polygonOffsetFactor: 0.1,
      }));
      this.resultObject.castShadow = true;
      this.resultObject.receiveShadow = true;
      this.originalMaterial = this.resultObject.material;
      this.scene.add(this.resultObject);

      // add wireframe representation
      //this.wireframeResult = new THREE.Mesh(this.resultObject.geometry, new THREE.MeshBasicMaterial({
      //  wireframe: true,
      //  color: 0,
      //  opacity: 0.15,
      //  transparent: true,
      //}));
      //this.scene.add(this.wireframeResult);

      // helpers
      //this.edgesHelper = new EdgesHelper();
      //this.edgesHelper.color.set(0xE91E63).convertSRGBToLinear();
      //this.scene.add(this.edgesHelper);

      //this.trisHelper = new TriangleSetHelper();
      //this.trisHelper.color.set(0x00BCD4).convertSRGBToLinear();
      //this.scene.add(this.trisHelper);

      //this.bvhHelper1 = new MeshBVHVisualizer(this.brush1, 20);
      //this.bvhHelper2 = new MeshBVHVisualizer(this.brush2, 20);
      //this.scene.add(this.bvhHelper1, this.bvhHelper2);


      // GUI
      this.gui = new GUI({ autoPlace: false });
      this.gui.domElement.id = 'gui';
      this.gui.add(params, 'operation', { SUBTRACTION }).onChange(() => {
        needsUpdate = true;
      });
      this.gui.add(params, 'displayBrushes')


      gui_container.appendChild(this.gui.domElement);
    },

    updateBrush: function (brush, type, complexity) {

      brush.geometry.dispose();
      switch (type) {
        case 'sphere':
          brush.geometry = new THREE.SphereGeometry(
            1,
            Math.round(THREE.MathUtils.lerp(5, 32, complexity)),
            Math.round(THREE.MathUtils.lerp(5, 16, complexity))
          )
          break;
        case 'box':
          brush.geometry = new THREE.BoxGeometry(1, 1, 1);
          break;
        default:
          console.log("Error");
      }

      brush.geometry = brush.geometry.toNonIndexed();

      const position = brush.geometry.attributes.position;
      const array = new Float32Array(position.count * 3);
      for (let i = 0, l = array.length; i < l; i += 9) {

        array[i + 0] = 1;
        array[i + 1] = 0;
        array[i + 2] = 0;

        array[i + 3] = 0;
        array[i + 4] = 1;
        array[i + 5] = 0;

        array[i + 6] = 0;
        array[i + 7] = 0;
        array[i + 8] = 1;

      }

      brush.geometry.setAttribute('color', new THREE.BufferAttribute(array, 3));
      needsUpdate = true;

    },

    animate: function () {

      requestAnimationFrame(this.animate);

      this.brush2.scale.x = Math.max(this.brush2.scale.x, 0.01);
      this.brush2.scale.y = Math.max(this.brush2.scale.y, 0.01);
      this.brush2.scale.z = Math.max(this.brush2.scale.z, 0.01);

      const enableDebugTelemetry = params.enableDebugTelemetry;
      if (needsUpdate) {

        needsUpdate = false;

        this.brush1.updateMatrixWorld();
        this.brush2.updateMatrixWorld();

        //this.bvhHelper1.update();
        //this.bvhHelper2.update();

        this.csgEvaluator.debug.enabled = enableDebugTelemetry;
        this.csgEvaluator.useGroups = params.useGroups;
        this.csgEvaluator.evaluate(this.brush1, this.brush2, params.operation, this.resultObject);

        if (params.useGroups) {

          this.resultObject.material = this.resultObject.material.map(m => this.materialMap.get(m));

        } else {

          this.resultObject.material = this.originalMaterial;

        }

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
