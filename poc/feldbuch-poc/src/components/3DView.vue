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

  methods: {

    init: function() {

        let container = document.getElementById('container');

        this.camera = new THREE.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 1;

        console.log(container)
        this.scene = new THREE.Scene();

        let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        let material = new THREE.MeshNormalMaterial();

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setClearColor( 0x263238 );
        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.update();
        
    },

    animate: function() {

        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);

    }

  },

  mounted() {

      this.init();
      this.animate();

  }

}

</script>

<style scoped>

    #container{height: 100%}

</style>
