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

  attachedPosition: null,
};

export default {
  name: 'Viewer',

  data() {
    return {
      meshesInScene: [],
      positionInScene: [],
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

      await this.loadPositionObjects();

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
      for (var i = 0; i < this.positionInScene.length; i++) {

        const positionTitle = this.positionInScene[i].title;
        const positionFolder = positionsFolder.addFolder(positionTitle);

        const test = this.positionInScene.filter(
          obj => { return obj.title === positionTitle }
        )

        positionFolder.add(this.positionInScene.find
          (x => x.title === test[0].title), "move")
          .listen().onChange(() => this.changeState('position', positionTitle))
      }
    },

    /**
     * 
     * @param {*} element
     * @param {*} positionTitle
     */
    changeState: function (element, positionTitle) {
      console.log("changeState")
      switch (element) {
        case "model":

          /* Set all move-values to false */
          for (var i = 0; i < this.positionInScene.length; i++) {
            this.positionInScene[i].move = false
          }

          this.transformControls.enabled = false;
          this.transformControls.detach()
          break;

        case 'position':

          params.guiControls.state = false;
          /* Set all move-values to false */
          for (var i = 0; i < this.positionInScene.length; i++) {
            this.positionInScene[i].move = false
          }

          /* Get the object of checked checkbox */
          const test = this.positionInScene.filter(
            obj => { return obj.title === positionTitle }
          )
          this.positionInScene.find
            (x => x.title === test[0].title).move = true;

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

    },

    onMouseDown: function(event) {

      event.preventDefault()
      this.pointer.x = ((event.clientX - this.renderer.domElement.offsetLeft ) 
                          / this.renderer.domElement.width ) * 2 - 1;
      this.pointer.y = - ((event.clientY - this.renderer.domElement.offsetTop ) 
                            / this.renderer.domElement.height ) * 2 + 1;

      const deltaX = event.clientX - this.pointerX;
      const deltaY = event.clientY - this.pointerY;

      console.log("x : " + this.pointer.x + " y : " + this.pointer.y);

      this.raycaster.setFromCamera(this.pointer, this.camera);
      console.log(this.scene.children)
      const intersects = this.raycaster.intersectObjects(this.groupsInScene, true)
      

      if(intersects.length > 0) {
        //intersects[0].object.material.color.setHex( Math.random() * 0xffffff)
        console.log(intersects[0].object.name)
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

      for (var i = 0; i < this.positionInScene.length; i++) {
        if (this.positionInScene[i].move === true) {
          this.transformControls.enabled = true;
          this.transformControls.attach(this.scene.getObjectByName(this.positionInScene[i].title))
        }
      }

      this.arcballControls.setTbRadius(0.67)

    }
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
