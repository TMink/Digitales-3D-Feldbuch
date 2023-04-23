<template>
    <div id="container"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export default {

  name: 'Viewer',

  data() {

    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      gui:null,
      mesh: null
    }

  },

  mounted() {

    this.init();
    this.animate();

  },

  methods: {

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
