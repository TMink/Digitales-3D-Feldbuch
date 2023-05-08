<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {fromOfflineDB} from '../ConnectionToOfflineDB.js';
import {fromBackend} from '../ConnectionToBackend.js';
import axios from 'axios';

export default {

  name: 'Viewer',

  data() {

    return {

      camera: null,
      scene: null,
      renderer: null,
      controls: null,

    }

  },

  async mounted() {

    await fromOfflineDB.syncLocalDBs();

    this.init();
    this.animate();

  },

  methods: {

    /**
     * Function overview: 
     *  getModel        - Get model-Data from backend and transfer it to offline
     *                    DB for furthor useage
     *  getDataFromUrl  - Get model-/texture-Data from given url
     *  loadModel       - Loads a Model from IndexedDB into the scene. This
     *                    version has the standart texture from the object and
     *                    the name of the created mesh is the title of the 
     *                    object.
     *  ------------------------------------------------------------------------
     *  init            - Initialize the scene
     *  animate         - Animate the scene
     */

    /**
     * 
     * @param {String} url 
     * @param {String} dataCategory - Category that is searched for
     * @param {String} identifier   - Term in Category that is searched for
     * @param {String} localDBName  - Database name
     * @param {String} storeName    - Object store name
     */
     getModelFromBackend: async function( url, dataCategory, identifier, 
                                           localDBName, storeName) {

      /* Get Data from backend */
      const modelFromBackend = await fromBackend.getData( url, dataCategory,
                                                          identifier );                                                      

      /* Get model and texture from seperate url */
      const modelData = await this.getDataFromURL( 
        modelFromBackend[0].model );
      const textureData = await this.getDataFromURL( 
        modelFromBackend[0].texture );

      /* Create new Object from backend-Data and model-/texture-Data */
      const newModelData = { id: modelFromBackend[0].id,
                             project_id: modelFromBackend[0].project_id,
                             title: modelFromBackend[0].title,
                             model: modelData.data,
                             texture: textureData.data }

      /* Save Data in offline DB */
      await fromOfflineDB.addObject( newModelData, localDBName, storeName );

    },

    /**
     * @param {String} url 
     * @returns -> Promise(object)  
     */
    getDataFromURL: async function( url ) {

      return new Promise( (resolve, reject ) => {

        try {

          axios
          .get( url )
          .then( res => {

            resolve(res)

          })


        }
        catch( error ) {

          console.log( error )

        }

      })

    },

    /**
     * @param {String} modelID    - Key under which the model is stored in
     *                              Object Store
     * @param {String} dbName     - Name of Database
     * @param {String} storeName  - Name of Object Store
     */
     loadMesh: async function(modelID, dbName, storeName) {

      const mesh = new THREE.Mesh()
      const model = await fromOfflineDB.getObject( modelID, dbName, storeName );

      const object = new OBJLoader().parse( model.result.model )

      var textLoader = new THREE.TextureLoader().load( model.result.texture )

      const material = new THREE.MeshBasicMaterial( {
        map: textLoader,
        shadowSide: THREE.DoubleSide,
        side: THREE.DoubleSide
      } )

      object.traverse( (child) => {
        if( child instanceof THREE.Mesh ) {
          mesh.geometry = child.geometry
        }
      } )

      mesh.material = material
      mesh.name = model.result.title

      this.scene.add(mesh)

    },

    /**
     * @param {String} model  - Name of model in scene
     * @param {String} color  - Name of color
     */
     loadWithColor: function(model, color) {
      this.scene.getObjectByName( model ).material.color = 
        new THREE.Color( color )
    },

    init: function() {

      /* ##### Container ##### */
      let container = document.getElementById( 'container' );



      /* ##### Loader ##### */
      this.texLoader = new THREE.TextureLoader; /* loads '.jpg'-data from 
                                                   local storage */



      /* ##### Scene ##### */
      this.scene = new THREE.Scene();
      this.scene.add( new THREE.AxesHelper( 5 ) ); /* X-axis = red; 
                                                      Y-axis = green; 
                                                      Z-axis = blue */



      /* ##### Camera ##### */
      const cameraAspect = container.clientWidth / container.clientHeight;
      this.camera = new THREE.PerspectiveCamera( 70, cameraAspect, 0.01, 
                                                 20000 );
      this.camera.position.set( 1,0,0 );



      /* ##### Lights ##### */
      this.scene.add( new THREE.AmbientLight( 0xffffff) );



      /* ##### 3D-Mesh Example: Box ##### */
      let boxGeometry = new THREE.BoxGeometry( 1,1,1);
      let boxMaterial = new THREE.MeshBasicMaterial( { color: 0x00f00, 
                                                       wireframe: true } );
      let box = new THREE.Mesh( boxGeometry, boxMaterial );
      this.scene.add( box );



      /* ##### Renderer ##### */
      this.renderer = new THREE.WebGLRenderer( { antialias: true } );
      this.renderer.setSize( container.clientWidth, container.clientHeight );
      this.renderer.setClearColor( 0x263238 );
      container.appendChild( this.renderer.domElement );



      /* ##### Controls ##### */
      this.controls = new OrbitControls( this.camera, 
                                         this.renderer.domElement );
      this.controls.update();

      
      /* ##### FOR DEBUGGING ##### */
      //console.log(this.getData.data.model)
        
    },

    animate: function() {

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

    }

  }

}

</script>

<style scoped>

    #container{height: 100%}

</style>
