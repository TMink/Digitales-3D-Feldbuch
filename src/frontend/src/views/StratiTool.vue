<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 26.09.2024 15:34:26
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
            <v-card class="pl-3 border-lg d-flex align-center " height="100px" width="100%">
              <v-card class="pl-2 pt-2" height="53px" style="border: 1px solid #fff;">
                <v-slide-group multiple style="width: 1200px;" >
                  <v-slide-group-item v-for="n in nodesCache.nodes" :key="n" v-slot="{ toggle }">
                    <v-btn @click="toggle" v-if="n.type == 'deposit'" color="green" :text="n.data.label" ></v-btn>
                  </v-slide-group-item>
                  <v-slide-group-item v-for="n in nodesCache.nodes" :key="n">
                    <v-btn v-if="n.type == 'interface'" color="brown" rounded :text="n.data.label"></v-btn>
                  </v-slide-group-item>
                </v-slide-group>
              </v-card>
              <v-card-title>D&D these inside the canvas => </v-card-title>
              <v-card class="pa-2" style="border: 1px solid #fff;">
                <Sidebar />
              </v-card>
            </v-card>
          </v-row>
          <v-row no-gutters style="height:fit-content;">
            <canvas id="canvas" class="border-lg" :height="windowHeight - 320" style="position:absolute; z-index: 1; opacity: 1;"></canvas>
            <v-card id="graph" class="dnd-flow border-lg" @drop="onDrop" :height="windowHeight - 312" width="100%" style="position:relative; z-index: 2; opacity: 1;">
              <VueFlow @dragover="onDragOver" @dragleave="onDragLeave" :nodeTypes="nodeTypes" deleteKeyCode="Backspace" :zoomOnDoubleClick=false>
                <!-- <SaveRestoreControls/> -->
                <!-- <MiniMap :node-color="nodeColor" maskColor="#171C23" style="background-color:#27303d;"></MiniMap> -->
                <DropzoneBackground :style="{ backgroundColor: isDragOver ? '#1e81b0' : 'transparent', transition: 'background-color 0.2s ease', }">
                  <p v-if="isDragOver">Drop here</p>
                </DropzoneBackground>
              </VueFlow>
            </v-card>
          </v-row>
        </v-col>
        
        <!-- Right -->
        <v-col cols="2">
          <v-row no-gutters style="height:fit-content">
            <v-card id="Hilfe" class="border-lg d-flex align-center justify-center" height="100px" width="100%">
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
  import * as THREE from 'three';
  import { ref, onMounted, watch, reactive, markRaw } from 'vue';
  import { useWindowSize } from 'vue-window-size';
  import { VueFlow, useVueFlow} from '@vue-flow/core';
  import { Background } from '@vue-flow/background';
  import { MiniMap } from '@vue-flow/minimap';
  import '@vue-flow/minimap/dist/style.css'
  import DropzoneBackground from '../components/graph-editor-components/DropzoneBackground.vue';
  import Sidebar from '../components/graph-editor-components/Sidebar.vue';
  import useDragAndDrop from '../components/graph-editor-components/useDnD.js';
  import SaveRestoreControls from '../components/graph-editor-components/Controls.vue'
  import Navigation from '../components/Navigation.vue';
  
  import DepositNode from '../components/graph-editor-components/CustomNodes/DepositNode.vue';
  import DepositNodeClicked from '../components/graph-editor-components/CustomNodes/DepositNodeClicked.vue';
  import InterfaceNode from '../components/graph-editor-components/CustomNodes/InterfaceNode.vue';
  import InterfaceNodeClicked from '../components/graph-editor-components/CustomNodes/InterfaceNodeClicked.vue';

  const nodeTypes = {
    deposit: markRaw(DepositNode),
    deposit_clicked: markRaw(DepositNodeClicked),
    interface: markRaw(InterfaceNode),
    interface_clicked: markRaw(InterfaceNodeClicked)
  }

  const { onConnect, addEdges, onNodeClick, onPaneClick, getNodes, onNodesChange } = useVueFlow()
  const { onDragOver, onDrop, onDragLeave, isDragOver } = useDragAndDrop()
  
  onConnect(addEdges)
  
  /**
   * 
   * Change the node color in minimap according to its class
   * 
   * @param n node in minimap
   */
  function nodeColor(n) {
    if( n.type == "deposit" ) {
      return 'green'
    }
    return 'brown'
  }
  
  // cache for unit-nodes-data
  const nodesCache = reactive({nodes: [] })

  onNodesChange((changes) => {
    if( Object.hasOwn( changes[0], 'item' ) ) {
      if( changes[0].type == 'add' ) {
        console.log("Add new node")
        nodesCache.nodes.push({id: changes[0].item.id, type: changes[0].item.type, data: changes[0].item.data})
        console.log(changes[0].item.data)
      }
    }
  })

  // Retriev data about the window height and width
  const { width, height } = useWindowSize();
  const windowHeight = height;
  const windowWidth = width;

  onNodeClick( (params) => {
    console.log("Hello")
    if( getNodes.value.length != 0 ) {
      for( const[_, value] of Object.entries(getNodes.value) ) {
        if( value.type == "deposit_clicked" ) {
          value.type = "deposit"
        } else if( value.type == "interface_clicked" ) {
          value.type = "interface"
        }
      }
    }
    params.node.type = params.node.data.label + "_clicked"
  } )
  
  onPaneClick( () => {
    if( getNodes.value.length != 0 ) {
      for( const[_, value] of Object.entries(getNodes.value) ) {
        if( value.type == "deposit_clicked" ) {
          value.type = "deposit"
        } else if( value.type == "interface_clicked" ) {
          value.type = "interface"
        }
      }
    }
  })

  /**
   * 
   * Equivalent semantic to to mounted in <script>
   * 
   */
  onMounted(() => {  
    // resize canvas
    window.addEventListener("resize", resizeCanvas);
    document.getElementById("canvas").setAttribute("width", window.innerWidth - (document.getElementById("infobereich").offsetWidth*2+16))
    function resizeCanvas() {
      document.getElementById("canvas").setAttribute("width", window.innerWidth - (document.getElementById("infobereich").offsetWidth*2+16))
      renderer.setPixelRatio(canvas.devicePixelratio)
    }
      
    /**
     * 3D-Editor
     */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 45, canvas.clientWidth / canvas.clientHeight, 0.01, 2000 );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true
    });
    renderer.setPixelRatio( canvas.devicePixelratio )
    renderer.setClearColor( 0x263238, 1);
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;
    function animate() {
	    renderer.render( scene, camera );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    renderer.setAnimationLoop( animate );
  })
</script>

<script>
export default {
  name: 'StratiTool',
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/core@1.41.2/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/controls@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/minimap@latest/dist/style.css';
@import 'https://cdn.jsdelivr.net/npm/@vue-flow/node-resizer@latest/dist/style.css';
@import '../components/graph-editor-components/style.css';
</style>