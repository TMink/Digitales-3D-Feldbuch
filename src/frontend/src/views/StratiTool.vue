<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 16.10.2024 05:31:32
 Modified By: Tobias Mink
 
 Description: 
 --> This system is being implemented as part of a master's thesis and enables 4D analysis and visualization of the stratigraphy of an excavation

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
    <v-card class="pa-1 background">
      <v-row no-gutters style="width:fit-content;">
          
        <!-- > > > > > > Left < < < < < < -->
        <div>
          <!-- Glossar & Hilfe -->
          <v-row no-gutters style="width: fit-content">
            <v-card class="d-flex align-center justify-center tile" height="100" width="400">
              <v-row no-gutters>
                <v-col class="d-flex align-center justify-center">
                  <v-btn class="button" width="150" height="50" v-on:click="openGlossar">Glossar</v-btn>
                </v-col>
                <v-col class="d-flex align-center justify-center">
                    <v-btn class="button" width="150" height="50" v-on:click="getHelp">Hilfe</v-btn>
                </v-col>
              </v-row>
            </v-card>  
          </v-row>
  
          <!-- Module -->
          <v-row no-gutters style="width: fit-content">
            <v-card class="pa-1 hollow" :height="windowHeight - 220" width="400">
                <v-card height="92" class="pa-2 tile d-flex align-center justify-center">
                  <v-row no-gutters>
                    <v-col cols="3" class="d-flex align-center justify-center">
                      <v-btn variant="text" width="50%" height="100%" icon="mdi-arrow-left-bold" @click="changeModuleLeft()"></v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-card-title width="100%" height="100%" class="d-flex align-center justify-center">{{ aktiveModuleName }}</v-card-title>
                    </v-col>
                    <v-col cols="3" class="d-flex align-center justify-center">
                      <v-btn variant="text" width="50%" height="100%" icon="mdi-arrow-right-bold" @click="changeModuelRight()"></v-btn>
                    </v-col>
                  </v-row>
                </v-card>
                <v-card class="pa-1 hollow" :height="windowHeight - 328">
                  <!-- Screenshot -->
                  <v-card id="screenshot_module" class="pa-2 screenshot_module__base" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 1; opacity: 1;">
                    <v-card variant="text" width="100%">
                      <!-- Image name -->
                      <v-text>Dateiname:</v-text>
                      <v-text-field hide-details class="pa-1 mb-5" v-model="imageFileName"></v-text-field>

                      <!-- Image format -->
                      <v-text>Dateinformat:</v-text>
                      <v-row no-gutters style="height: 50px;">
                        <v-col class="px-1">
                          <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%" @click="takeScreenshot('png')">
                            PNG
                          </v-btn>
                        </v-col>
                        <v-col class="px-1">
                          <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%" @click="takeScreenshot('jpeg')">
                            JPEG
                          </v-btn>
                        </v-col>
                        <v-col class="px-1">
                          <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%" @click="takeScreenshot('svg')">
                            SVG
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-card>
                  
                  <!-- Group -->
                  <v-card id="group_module" class="pa-2 group_module__base d-flex align-center justify-center" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                  </v-card>

                  <!-- View -->
                  <v-card id="view_module" class="pa-2 view_module__base d-flex align-center justify-center" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                  </v-card>

                  <!-- Exp/Imp -->
                  <v-card id="exp/imp_module" class="pa-2 exp-imp_module__base d-flex align-center justify-center" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                  </v-card>

                  <!-- Filter -->
                  <v-card id="filter_module" class="pa-2 filter_module__base d-flex align-center justify-center" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                  </v-card>
                  
                  <!-- Timemodel -->
                  <v-card id="timemodel_module" class="pa-2 timemodel_module__base d-flex align-center justify-center" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                  </v-card>
                </v-card>
            </v-card>
          </v-row>  
        </div>
          
        <!-- > > > > > > Middle < < < < < < -->
        <div>
          
          <!-- Harris-Matrizen -->
          <v-row no-gutters style="width:fit-content">
            <v-card class="tile" height="100px" :width="windowWidth - 816">
              <v-row no-gutters>
                
                
              </v-row>
            </v-card>   
          </v-row>
  
            </v-card>
          </v-row>
  
  

  

  }

  
  
  /**
   * 
   * 
   */
    }
  }
  

      }
    }


    if( getNodes.value.length != 0 ) {
      for( const[_, value] of Object.entries(getNodes.value) ) {
        }
      }
    }
  
    if( getNodes.value.length != 0 ) {
        }
      }
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * TODO
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   */
  function openGlossar() {
    // TODO
  }

  


  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Filter for SVG images.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param { {computePosition: {x: int, y: int, z: int}, connectable: any, data: {description: string, findingID: string, groupIDs: array<string>, label: string, nodeStyle: string, relations: array<{edgeID: string, id: string, relationType: string, sourceID: string, targetID: string}>, selected: boolean, styles: {bottom_middle: string, left_middle: string, right_middle: string, top_middle: string}, validConnections: {bottom_middle: boolean, left_middle: boolean, right_middle: boolean, top_middle: boolean}, volumeID: string}, dimensions: {width: int, height: int}, draggable: any, events: any, focusable: any, handleBounds: {source: array, target: array , id: string, initialized: boolean, isParent: boolean, parentNode: any, position: {x: int, y: int}, resizing: boolean, selectable: any, selected: boolean, type: string}, id: string, initialized: boolean, isParent: boolean, parentNode: any, position: {x: int, y: int}, resizing: boolean, selectable: any, type: string} } node - A node from the graph
   */
  function filter (node) {
    return (node.tagName !== 'i');
  }
  


  

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Creates an image from the graph as PNG, JPEG or SVG.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {string} format - Format in which the image should be created.
   */
  function takeScreenshot(format) {
    switch( format ) {
      case 'png':
        img
          .toPng(document.getElementById('graph'))
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageFileName.value + '.png';
            link.href = dataUrl;
            link.click();
          });
        break;
      case 'jpeg':
        img
          .toJpeg(document.getElementById('graph'), { quality: 1 })
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageFileName.value + '.jpeg';
            link.href = dataUrl;
            link.click();
          });
        break;
      case 'svg':
        img
          .toSvg(document.getElementById('graph'), { filter: filter })
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageFileName.value + '.svg';
            link.href = dataUrl;
            link.click();
          });
        break;
    }
  }



  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Switch to a module further to the left.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeModuleLeft() {
    const index = modulesNames.value.indexOf( aktiveModuleName.value );
    if( index == 0 ) {
      aktiveModuleName.value = modulesNames.value[modulesNames.value.length - 1]
    } else {
      aktiveModuleName.value = modulesNames.value[index - 1]
    }
  }
  


  

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Switch to a module further to the right.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeModuelRight() {
    const index = modulesNames.value.indexOf( aktiveModuleName.value );
    if( index == (modulesNames.value.length - 1) ) {
      aktiveModuleName.value = modulesNames.value[0]
    } else {
      aktiveModuleName.value = modulesNames.value[index + 1]
    }
  }




  /**
   * 
   * 
   */
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
@import '../components/graph-editor-components/style.css';
</style>