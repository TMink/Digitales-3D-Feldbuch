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
