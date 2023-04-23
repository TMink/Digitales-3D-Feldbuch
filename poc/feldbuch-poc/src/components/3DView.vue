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

  mounted() {

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
