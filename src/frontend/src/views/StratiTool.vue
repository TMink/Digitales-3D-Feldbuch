<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 24.09.2024 13:29:16
 Modified By: Tobias Mink
 
 Description: 
 --> This system is being implemented as part of a master's thesis and enables 4D analysis and visualization of the stratigraphy of an excavation

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
      
      <v-row no-gutters>
        
        <!-- Left -->
        <v-col cols="2">
          <v-row no-gutters style="height:fit-content">
            <v-card class="border-lg d-flex align-center justify-center" height="100px" width="100%">
              Glossar
            </v-card>  
          </v-row>
          <v-row no-gutters style="height:fit-content">
            <!-- <div class="border-lg d-flex justify-end"></div> -->
            <v-card class="border-lg d-flex align-center justify-center" :height="windowHeight - 212" width="100%">
              Module
            </v-card>
          </v-row>
        </v-col>
        
        <!-- Middle -->
        <v-col cols="8">
          <v-row no-gutters style="height:fit-content">
            <v-card class="border-lg d-flex align-center justify-center" height="100px" width="100%">
              Harris-Matrizen
            </v-card>   
          </v-row>
          <v-row no-gutters style="height:fit-content">
            <v-card class="border-lg d-flex align-center justify-center" height="100px" width="100%">
              Units
            </v-card>
          </v-row>
          <v-row no-gutters style="height:fit-content;">
            <canvas id="canvas" class="border-lg" :height="windowHeight - 320" style="position:absolute; z-index: 1"></canvas>
            <v-card id="graph" class="border-lg d-flex align-center justify-center" :height="windowHeight - 312" width="100%" style="position:relative; z-index: 0; opacity: 1;">
              <VueFlow :nodes="nodes" :edges="edges">
                <Background />
              </VueFlow>
            </v-card>
          </v-row>
        </v-col>
        
        <!-- Right -->
        <v-col cols="2">
          <v-row no-gutters style="height:fit-content">
            <v-card class="border-lg d-flex align-center justify-center" height="100px" width="100%">
              Hilfe
            </v-card>   
          </v-row>
          <v-row no-gutters style="height:fit-content">
            <v-card class="border-lg d-flex align-center justify-center" height="100px" width="100%">
              Modus wechseln
            </v-card>
          </v-row>
          <v-row no-gutters style="height:fit-content">
            <v-card id="infobereich" class="border-lg d-flex align-center justify-center" :height="windowHeight - 312" width="100%">
              Infobereich
            </v-card>
          </v-row>
        </v-col>
      </v-row>
      
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useWindowSize } from 'vue-window-size';
  import { VueFlow, useVueFlow } from '@vue-flow/core'
  import { Background } from '@vue-flow/background'


  import Navigation from '../components/Navigation.vue';

  // get data for resizing
  const { width, height } = useWindowSize();
  const windowHeight = height;
  const windowWidth = width;

  const nodes = ref([
    {
      id: '1',
      type: 'input',
      position: { x: 250, y: 5 },
      data: { label: 'Node 1' },
    },
    { 
      id: '2', 
      position: { x: 100, y: 100 },
      data: { label: 'Node 2' }
    },
    { 
      id: '3', 
      type: 'output', 
      position: { x: 400, y: 200 },
      data: { label: 'Node 3' },
    },
    {
      id: '4',
      position: { x: 400, y: 200 },
      data: { label: 'Node 4', },
      class: "custom",
    },
  ])

  const edges = ref([
    { 
      id: 'e1->2',
      source: '1', 
      target: '2',
    },
    { 
      id: 'e2->3',
      source: '2', 
      target: '3', 
      animated: true,
    },
  ])

  const { onNodeDragStop } = useVueFlow()
  onNodeDragStop(({ event, nodes, node }) => {
    console.log('Node Drag Stop', { event, nodes, node })
  })

  // Everything after mounted
  onMounted(() => {  
    // resize canvas
    window.addEventListener("resize", resizeCanvas);
    document.getElementById("canvas").setAttribute("width", window.innerWidth - (document.getElementById("infobereich").offsetWidth*2+16))
    function resizeCanvas() {
      document.getElementById("canvas").setAttribute("width", window.innerWidth - (document.getElementById("infobereich").offsetWidth*2+16))
    }
  })
</script>

<script>
export default {
  name: 'StratiTool',
}
</script>

<style>
/* these are necessary styles for vue flow */
@import '@vue-flow/core/dist/style.css';

/* Custom node example */
.custom {
    background: rgb(201, 184, 201);
    color: white;
    border: 1px solid purple;
    border-radius: 4px;
    box-shadow: 0 0 0 1px purple;
    padding: 8px;
}
</style>