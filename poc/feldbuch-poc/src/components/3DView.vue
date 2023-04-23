<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const DB_GEOMETRY = 'Geometry'
const DB_GEOMETRY_VERSION = 1 /* must be incrementet with further adjustment */
const STORE_EXCAVATION_GEO = 'excavation'

const DB_IMAGE = 'Image'
const DB_IMAGE_VERSION = 1 /* must be incrementet with further adjustment */
const STORE_EXCAVATION_IMG = 'excavation'

export default {

  name: 'Viewer',

  data() {

    return {

      camera: null,
      scene: null,
      renderer: null,
      controls: null,

      geometryDB: null,
      imageDB: null,
      geometries: [],
      images: [],

    }

  },

  async mounted() {

    await this.updateLocalDB()
    await this.updateLocalStore()

    this.init();
    this.animate();

  },

  methods: {

    /**
     * IndexdDB:
     *  updateLocalDB       - Update local database variables
     *  updateLocalDB       - Update local object store variables
     *  getDB               - Gets the current state of the database, or creates 
     *                        a new database and objectstore
     *  getObjects          - Gets all objects from object store
     *  addObject           - Add object to object store 
     *  deleteObject        - Delete object from object store
     *  deleteAllObjects    - Delete object store from database
     *  deleteDB            - Delete database
     */

     updateLocalDB: async function() {

      this.geometryDB = await this.getDB( DB_GEOMETRY, DB_GEOMETRY_VERSION, 
                                          STORE_EXCAVATION_GEO );
      this.imageDB = await this.getDB( DB_IMAGE, DB_IMAGE_VERSION, 
                                       STORE_EXCAVATION_IMG );

    },

    updateLocalStore: async function() {

      this.geometries = await this.getObjects( this.geometryDB, 
                                               STORE_EXCAVATION_GEO );
      this.images = await this.getObjects( this.imageDB, 
                                           STORE_EXCAVATION_IMG );

    },

    /**
     * @param {String} dbName    - Database Name 
     * @param {Int} dbVersion    - Database Version
     * @param {String} storeName - Object store which is going compared, 
     *                             created
     */
     getDB: async function( dbName, dbVersion, storeName ) {

      return new Promise( ( resolve, reject ) => {

        const request = window.indexedDB.open( dbName, dbVersion )

        request.onerror = e => {
          console.log( 'Error opening db', e );
          reject( 'Error' );
        }

        request.onsuccess = e => {
          resolve(e.target.result);
        }

        /* Gets current content of object store, or creates new one */
        request.onupgradeneeded = e => {
          console.log( 'onupgradeneeded' );
          const db = e.target.result;
          const objectStore = db.createObjectStore( storeName, 
                                                    { autoIncrement: true, 
                                                    keyPath:'id' } );
        }

      });

    },

    /**
     * @param {any} whichDB   - Database which contains the object store
     * @param {String} storeName - Object store, data is copied from
     */
     getObjects: async function( whichDB, storeName ) {
      
      return new Promise( ( resolve, reject ) => {

        const trans = whichDB.transaction( [ storeName ], 'readonly' );
        trans.oncomplete = e => {
          resolve( data );
        }

        const store = trans.objectStore( storeName );
        let data = [];

        store.openCursor().onsuccess = e => {
          const cursor = e.target.result;
          if ( cursor ) {
            data.push( cursor.value );
            cursor.continue();
          }
        }

      });
    
    },

    /**
     * @param {*} data      - Data to be added
     * @param {*} whichDB   - Database which contains the object store
     * @param {*} storeName - Object store, data is going to be added to
     * @param {*} localArr  - Local array with data (gets updated)
     */
    addObject: async function(data, whichDB, storeName, localArr) {
      
      this.addDisabled = true;

      /* --- DEBUGGING --- */
      console.log( 'about to add ' + JSON.stringify( data ) );

      await new Promise( ( resolve, reject ) => {

        const trans = whichDB.transaction( storeName, 'readwrite' );
        trans.oncomplete = e => {
          resolve();
        }

        const store = trans.objectStore( storeName );
        store.add( data );

      })

      localArr = await this.getObjects( whichDB, storeName );

      this.addDisabled = false;

    },

    /**
     * @param {*} id        - ID of Data to be deleted
     * @param {*} whichDB   - Database which contains the object store
     * @param {*} storeName - Object store, data is going to be deleted from
     * @param {*} localArr  - Local array with data (gets updated)
     */
    deleteObject: async function(id, whichDB, storeName, localArr) {

      /* --- DEBUGGING --- */
      console.log( 'about to delete Object id: ' + id );

      await new Promise( ( resolve, reject ) => {

        const trans = whichDB.transaction( [ storeName ], 'readwrite' );
        trans.oncomplete = e => {
          resolve();
        }

        const store = trans.objectStore( storeName );
        store.delete(id);

      });
      
      localArr = await this.getObjects( whichDB, storeName );

    },

    /**
     * @param {*} whichDB   - Database which contains the object store
     * @param {*} storeName - Object store which is going to be deleted
     * @param {*} localArr  - Local array with data (gets updated)
     */
    deleteAllObjects: async function(whichDB, storeName, localArr) {

      const trans = whichDB.transaction( [ storeName ], 'readwrite' );
      
      const store = trans.objectStore( storeName );

      const storeRequest = store.clear();
      storeRequest.onsuccess = e => {
        console.log( storeName + ' erased' );
      }

      localArr = await this.getObjects( whichDB, storeName );

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
