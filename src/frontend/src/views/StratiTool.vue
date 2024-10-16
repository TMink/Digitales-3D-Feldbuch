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
                
                <!-- Manuell save -->
                <v-col>
                  <v-card class="px-5 py-0 units__base" variant="text">
                    <v-col class="pa-0" align="center">

                      <!-- Subcomponent title -->
                      <v-card class="pt-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Harris-Matrix Speichern
                        </v-card-title>
                      </v-card>
                      
                      <!-- Save -->
                      <v-card class="pt-1 my-3" height="fit-content" variant="text">
                        <v-btn width="100%" @click="saveGraph()">
                          Speichern
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-card>
                </v-col>
                
                <!-- Switch processing steps -->
                <v-col>
                  <v-card class="px-5 py-0 units__base" variant="text">
                    <v-col class="pa-0" align="center">
                      
                      <!-- Subcomponent title -->
                      <v-card class="pt-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Arbeitsschritte wechseln
                        </v-card-title>
                      </v-card>
                      <v-card class="pt-2 nodes" variant="text" width="100%">
                        <v-row no-gutters class="mb-4 d-flex justify-center">
                            
                          <!-- Back -->
                          <v-col cols="1">
                            <v-card variant="text">
                              <v-card-text class="pa-0" style="text-align: center; line-height: 100%;">
                                zurück
                              </v-card-text>
                            </v-card>
                            <v-btn :disabled="processStepBackButtonDisabled" variant="text" width="25%" height="40%" icon="mdi-arrow-u-left-top" @click="goProcessingStepBack()"></v-btn>
                          </v-col>
                            
                          <!-- Forward -->
                          <v-col cols="1">
                            <v-card variant="text">
                              <v-card-text class="pa-0" style="text-align: center; line-height: 100%;">
                                vor
                              </v-card-text>
                            </v-card>
                            <v-btn :disabled="processStepForwardButtonDisabled" variant="text" width="25%" height="40%" icon="mdi-arrow-u-right-top" @click="goProcessingStepForward()"></v-btn>
                          </v-col>
                            
                        </v-row>
                      </v-card>
                    </v-col>
                                   
                  </v-card>
                </v-col>
                
              </v-row>
            </v-card>   
          </v-row>
  
            </v-card>
          </v-row>
  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Stores the type of last action taken by the user and the current state of 
   * the graph.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {string} changeType - Type of last action taken by the user
   */
  function saveProcessingStep( changeType ) {
    if( changeType == "onSave" ) {
      processingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
      currentProcessingStep.value = currentProcessingStep.value + 1;
    } else {
      // Wenn der aktuell ausgewählte Bearbeitungsschritt nicht der neuste ist, lösche alle die danach kamen und speicher den neuen und deaktiviere den Vor-Button
      if( currentProcessingStep.value != processingSteps.value.length && !alreadyCut ) {
        alreadyCut = true;
        processingSteps.value = processingSteps.value.slice( 0, currentProcessingStep.value )
        processingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
        currentProcessingStep.value = currentProcessingStep.value + 1
      } 
      // Sonst speicher den neuen Bearbeitungsschritt und zähle den aktuellen Bearbeitungsschritt eins hoch
      else {
        alreadyCut = false
        processingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
        currentProcessingStep.value = currentProcessingStep.value + 1;
      }
    }
    // Sollte mehr als nur ein Bearbeitungsschritt vorhanden sein, blende den Button ein
    if( currentProcessingStep.value > 1 ) {
      processStepBackButtonDisabled.value = false;
    }
    processStepForwardButtonDisabled.value = true;
  }


  


  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Loads a previous state of the graph and restores its effects on
   * subcomponents of other components of the system.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ---------->>>> Creates new index for next node to be created <<<<----------
   * 
   */
  function goProcessingStepBack() {
    clearInfoCard()
    nodesInUnitSearch.value = [];

    currentProcessingStep.value = currentProcessingStep.value - 1
    const parsedProcessingStep = JSON.parse( processingSteps.value[currentProcessingStep.value - 1].step )
    
    if( ( currentProcessingStep.value > 1 ) && ( processingSteps.value[ currentProcessingStep.value - 1 ].type == "addNewNode" ) ) {
      const lastNodeID = parsedProcessingStep.nodes[parsedProcessingStep.nodes.length - 1].id
      fromObject(parsedProcessingStep)
      
      updateNode(lastNodeID, (node) => ({
        position: { x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2 }
      }))
    } else {
      fromObject(parsedProcessingStep)
    }
    
    processStepForwardButtonDisabled.value = false
    if( currentProcessingStep.value == 1 ) {
      processStepBackButtonDisabled.value = true
    }

    for( const[_, node] of Object.entries(getNodes.value) ) {
      if( node.data.selected == true ) {
        fillInfoCard(node)
      }

      nodesInUnitSearch.value.push(node.data.label)
    }

    createNewIndexForNextNode()
  }




  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Loads an advanced state of the graph and restores its effects to
   * subcomponents of other components of the system.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ---------->>>> Creates new index for next node to be created <<<<----------
   * 
   */
  function goProcessingStepForward() {
    clearInfoCard()
    nodesInUnitSearch.value = [];

    // Vermerke den neuen aktuellen Bearbeitungsschritt
    currentProcessingStep.value = currentProcessingStep.value + 1
    // Lade den aktuell ausgewählten Bearbeitungsstand
    console.log("Go forward and load: " + processingSteps.value[currentProcessingStep.value - 1].type)
    const parsedProcessingStep = JSON.parse( processingSteps.value[currentProcessingStep.value - 1].step )
    
    if( processingSteps.value[ currentProcessingStep.value - 1 ].type == "addNewNode" ) {
      const lastNodeID = parsedProcessingStep.nodes[ parsedProcessingStep.nodes.length - 1 ].id
      fromObject(parsedProcessingStep)
      
      updateNode(lastNodeID, (node) => ({
        position: { x: node.position.x - 100 / 2, y: node.position.y - 100 / 2 }
      }))
    } else {
      fromObject(parsedProcessingStep)
    }
    
    // Blende den Zurück-Button ein
    processStepBackButtonDisabled.value = false
    // Blende den Vor-Button aus, wenn der aktuelle Bearbeitungsschritt der Letzte ist
    if( currentProcessingStep.value == processingSteps.value.length ) {
      processStepForwardButtonDisabled.value = true
    }

    for( const[_, node] of Object.entries(getNodes.value) ) {
      // Ive a node was selected, open the info card and fill it
      if( node.data.selected == true ) {
        fillInfoCard(node)
      }

      // Fill drop down menu of unit search
      nodesInUnitSearch.value.push(node.data.label)
    }

    createNewIndexForNextNode()
  }
  




  

  

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
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Manually save the graph.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function saveGraph() {
    if( idOfCurrentStratiTool != "" ) {
      await fromOfflineDB.updateIndexedDBObject({ _id: idOfCurrentStratiTool, graph: { processingSteps: JSON.parse(JSON.stringify(processingSteps.value)), currentProcessingStep: currentProcessingStep.value } }, "StratiToolDB", "stratiTool")
    } else {
      await fromOfflineDB.addObject({ _id: String(Date.now()), graph: { processingSteps: JSON.parse(JSON.stringify(processingSteps.value)), currentProcessingStep: currentProcessingStep.value } }, "StratiToolDB", "stratiTool")
    }
  }





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