<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 16.10.2024 06:11:09
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
  
          <!-- Units -->
          <v-row no-gutters style="width:fit-content">
            <v-card class="tile" height="100px" :width="windowWidth - 816">
              <v-row no-gutters>
                
                <!-- Unit creation -->
                <v-col>
                  <v-card class="px-5 py-0 units__base" variant="text">
                    <v-col class="pa-0" align="center">
                      <v-card class="pt-1 mb-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Neue Unit erstellen
                        </v-card-title>
                      </v-card>
                      <Sidebar :highestDefaultCount="highestDefaultCount"/>
                    </v-col>
                  </v-card>
                </v-col>
                
                <!-- Unit Search -->
                <v-col>
                  <v-card class="px-5 units__base" variant="text">
                    <v-col class="pa-0" align="center">
                      <v-card class="pt-1 mb-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Unit suchen
                        </v-card-title>
                      </v-card>
                      <v-combobox class="mb-2" style="height: 52px; width: 250px" hide-selected :items="nodesInUnitSearch" persistent-hint :hide-no-data="true" v-model="nodeSearchedFor"></v-combobox>
                    </v-col>
                  </v-card>
                </v-col>
                
              </v-row>
            </v-card>
          </v-row>
  
          <!-- Editoren -->
          <v-row no-gutters style="width:fit-content;">
            <canvas id="canvas" class="tile" :height="windowHeight - 328" :width="windowWidth - 825" style="position:absolute; z-index: 1; opacity: 1;"></canvas>
            <v-card id="graph" class="dnd-flow plato" @drop="onDrop" :height="windowHeight - 320" :width="windowWidth - 817" style="position:relative; z-index: 1; opacity: 1;" >
              <VueFlow :maxZoom="1" :minZoom="0.2" :connectOnClick=false @dragover="onDragOver" @dragleave="onDragLeave" :nodeTypes="nodeTypes" deleteKeyCode="Backspace" :zoomOnDoubleClick=false>
                <template #edge-custom="customEdgeProps">
                  <CustomEdge
                    :id="customEdgeProps.id"
                    :source-x="customEdgeProps.sourceX"
                    :source-y="customEdgeProps.sourceY"
                    :target-x="customEdgeProps.targetX"
                    :target-y="customEdgeProps.targetY"
                    :source-position="customEdgeProps.sourcePosition"
                    :target-position="customEdgeProps.targetPosition"
                    :data="customEdgeProps.data"
                    :marker-end="customEdgeProps.markerEnd"
                    :style="customEdgeProps.style"
                  />
                </template>
                <DropzoneBackground :style="{ backgroundColor: isDragOver ? '#1e81b0' : 'transparent', transition: 'background-color 0.2s ease', }">
                  <p v-if="isDragOver">Drop here</p>
                </DropzoneBackground>
              </VueFlow>
            </v-card>
          </v-row>
        </div>
  
        <!-- > > > > > > Right < < < < < < -->
        <div>
          <!-- Modus Wechseln -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="d-flex align-center justify-center tile" height="100" width="400">
              <v-btn class="pa-7 px-14 button" v-on:click="changeEditor">Modus wechsel</v-btn>
            </v-card>
          </v-row>
  
          <!-- Placeholder -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="d-flex align-center justify-center tile" height="100" width="400">
              
            </v-card>
          </v-row>
            
          <!-- Infobereich -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="pa-1 hollow" :height="windowHeight - 320" width="400">
              <v-card :disabled="infoCardDisabled" id="infoCard" class="pa-2 infobereich__base" height="100%" width="100%">
                <v-col class="pa-0">
                    
                  <!-- Unit Titel -->
                  <v-row no-gutters class="pb-2" align-content="center">
                    <v-card class="infobereich__titel_default" width="100%" height="50">
                      <v-card-title class="justify-center">{{ nodeTitle }}</v-card-title>
                    </v-card>
                  </v-row>
                    
                  <!-- Unit Bild -->
                  <v-row no-gutters class="pb-3">
                    <v-card class="pa-2 infobereich__image_outside" width="100%" height="300">
                      <v-card class="infobereich__image_inside" width="100%" height="272">{{  }}</v-card>
                    </v-card>
                  </v-row>
                    
                  <!-- Unit Attribute -->
                  <v-row no-gutters class="pb-3">
                    <v-card class="py-0 infobreich__attributes_base_default" :max-height="windowHeight - 795" width="100%">
                      <v-list class="py-1 pa-1 infobereich__attributes_list" max-height="100%">
                          
                        <!-- UnitName -->
                        <v-card class="py-2 mb-3 infobereich__attributes_name" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_name_title" elevation=0>Name:</v-card>
                          </v-row>
                          <v-row no-gutters class="pr-3 px-2">
                            <v-col class="px-1" cols="10">
                              <v-text-field class="infobereich__attributes_name_text-field" hide-details height="100%" v-model="nodeTitle"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                              <v-btn class="infobereich__attributes_name_button" height="100%" min-width="0" @click="updateTitle(nodeTitle)">
                                <v-icon icon="mdi-content-save" size="Large"></v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>
                          
                        <!-- Unit Type -->
                        <v-card class="py-2 mb-3 infobereich__attributes_type" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_type_title" elevation=0>Type:</v-card>
                          </v-row>
                          <v-row no-gutters class="pr-2 pl-1">
                            <v-btn-toggle class="px-10" v-model="nodeType">
                              <v-btn class="mr-2 infobereich__attributes_type_title_button" width="110" @click="updateType('deposit')">
                                Deposit
                              </v-btn>
                              <v-btn class="infobereich__attributes_type_title_button" width="110" @click="updateType('interface')">
                                Interface
                              </v-btn>
                            </v-btn-toggle>
                          </v-row>
                        </v-card>
                          
                        <!-- Unit Beschreibung -->
                        <v-card class="py-2 mb-3 infobereich__attributes_description" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_description_title" elevation=0>Beschreibung:</v-card>
                          </v-row>
                          <v-row no-gutters class="pr-3 pl-2">
                            <v-col class="px-1" cols="10">
                              <v-textarea class="infobereich__attributes_description_textarea" no-resize hide-details v-model="nodeDescription"></v-textarea>
                            </v-col>
                            <v-col cols="2">
                              <v-btn class="infobereich__attributes_description_button" height="100%" min-width="0" @click="updateDescription(nodeDescription)">
                                <v-icon icon="mdi-content-save" size="Large"></v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>
                          
                        <!-- Unit Beziehungen -->
                        <v-card class="py-2 mb-3 infobereich__attributes_relations" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_relations_title" elevation=0>Stratigraphische Beziehungen:</v-card>
                          </v-row>
                          <v-row no-gutters class="px-2">
                            <v-list class="px-2 infobereich__attributes_relations_list" height="200" min-width="100%" max-width="100%">
                              <v-list-item class="mb-7 pb-0 px-0" max-height="0" v-for="n in nodeRelations" :key="n">
                                <v-row no-gutters height="fit-content">
                                    <v-card class="pa-2 infobereich__attributes_relations_list_item" width="87%" height="70">
                                      Mit: {{ n.targetLabel }}<br>Art: {{ n.type }}
                                    </v-card>
                                    <v-btn class="infobereich__attributes_relations_list_button" height="70" min-width="0" max-width="0">
                                      <v-icon icon="mdi-delete-empty" size="Large" @click="deleteEdge( n.id, n.sourceID, n.targetID )"></v-icon>
                                    </v-btn>
                                </v-row>
                              </v-list-item>
                            </v-list>
                          </v-row>
                        </v-card>
                          
                          <!-- Gruppenzugehörigkeit -->
                        <v-card class="py-2 infobereich__attributes_groups" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_groups_title" elevation=0>Unit Gruppenzugehörigkeit:</v-card>
                          </v-row>
                          <v-row no-gutters class="pr-4 pl-1">
                            <v-list class="px-2 infobereich__attributes_groups_list" height="200" min-width="100%" max-width="100%">
                              <v-list-item class="pb-0 px-0" min-height="0" v-for="n in 10" :key="n">
                                <v-btn class="infobereich__attributes_groups_list_button" width="100%">Beispielgruppe</v-btn>
                              </v-list-item>
                            </v-list>
                          </v-row>
                        </v-card>
                        
                      </v-list>
                    </v-card>
                  </v-row>
                  
                  <!-- Unit löschen -->
                  <v-row no-gutters>
                    <v-btn class="infobereich__delete_unit_button" height="50" width="100%" @click="deleteNode()">Unit Löschen</v-btn>
                  </v-row>
                </v-col>
              </v-card>
            </v-card>
          </v-row>
        </div>
        
      </v-row>
    </v-card>
  </div>
</template>

  /**
   * [-------------------------------------------------------------------------]
   * [------------------------- Reactive Variables ----------------------------]
   * [-------------------------------------------------------------------------]
   */
  var nodeTitle = ref(""); // string
  var nodeType = ref(-1); // int
  var nodeDescription = ref(""); // string
  var nodesInUnitSearch = ref([]); // array<string>
  var nodeSearchedFor = ref(""); // string
  var nodeRelations = ref([]); // array<{ id: string, type: string, targetLabel: string, sourceID: string, targetID: string }>
  var highestDefaultCount = ref("0"); // string
  var infoCardDisabled = ref(true); // boolean
  var modulesNames = ref(["Screenshot", "Group", "View", "Exp/Imp", "Filter", "Timemodel"]); // array<string>
  var aktiveModuleName = ref("Screenshot"); // string
  var imageFileName = ref(""); // string
  var processingSteps = ref([]); // array<{ type: string, step: string }>
  var currentProcessingStep = ref(0); // int
  var processStepBackButtonDisabled = ref(true) // boolean
  var processStepForwardButtonDisabled = ref(true) // boolean

  /**
   * [-------------------------------------------------------------------------]
   * [----------------------- Non-Reactive Variables --------------------------]
   * [-------------------------------------------------------------------------]
   */
  const { width, height } = useWindowSize();
  const windowHeight = height;
  const windowWidth = width;
  var selectedNodeID = "";
  var connectionInProgress = false;
  var idOfCurrentStratiTool = "";
  var alreadyCut = false;
  const nodeTypes = {
    deposit: markRaw(DepositNode),
    interface: markRaw(InterfaceNode)
  }
  const handleStyles = {
    deposit: {
      default: {
        top_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
        bottom_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
        left_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;",
        right_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;"
      },
      isValid: {
        top_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%;",
        bottom_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%;",
        left_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%;",
        right_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%;"
      },
      isNotValid: {
        top_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%;",
        bottom_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%;",
        left_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%;",
        right_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%;"
      },
    },
    interface: {
      default: {
        top_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;",
        bottom_middle: "height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;",
        left_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;",
        right_middle: "height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;"
      },
      isValid: {
        top_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;",
        bottom_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;",
        left_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;",
        right_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #00ff44; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;"
      },
      isNotValid: {
        top_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;",
        bottom_middle: "height: 10px; width: 30px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;",
        left_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;",
        right_middle: "height: 30px; width: 10px; border: 2px; border-style: solid; border-color: #fc030f; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;"
      },
    }
  }





  /**                                 Watcher
   * /=========================================================================\
   * Saves the current state of the graph, after adding a new unit.
   * \=========================================================================/
   * ================>>>> saves the current processing step <<<<================
   * 
   */
  watch( nodeDropped, hasBeenDropped => {
    if( hasBeenDropped ){
      saveProcessingStep("addNewNode");
      nodeDropped.value = false;
    }
  } )
  
  /**                                 Watcher
   * /=========================================================================\
   * Changes the currently displayed module of the module component.
   * \=========================================================================/
   * 
   */
  watch(aktiveModuleName, switchedToModule => {
    document.getElementById("screenshot_module").style.zIndex = 0;
    document.getElementById("group_module").style.zIndex = 0;
    document.getElementById("view_module").style.zIndex = 0;
    document.getElementById("exp/imp_module").style.zIndex = 0;
    document.getElementById("filter_module").style.zIndex = 0;
    document.getElementById("timemodel_module").style.zIndex = 0;
    document.getElementById(switchedToModule.toLowerCase() + "_module").style.zIndex = 1;
  })
  
  /**                                 Watcher
   * /=========================================================================\
   * Zooms in on the node that was searched for.
   * \=========================================================================/
   * 
   */
  watch(nodeSearchedFor, userInput => {
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].data.label == userInput ){
        zoomToNode(nodesInGraph[a].id);
        fillInfoCard(nodesInGraph[a]);
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else {
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      }
    }
  })





  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Creates a new index-number for next node to be created.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createNewIndexForNextNode() {
    if( getNodes.value.length != 0 ) {
      const numbers = [];
      const nodesInGraph = getNodes.value
      const nodesInGraphLength = nodesInGraph.length
      const rangeToCheck = { start: 10, length: 3 }
      
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( nodesInGraph[a].data.label.substring(0, 9) == "Neue Unit" ){
          const checkedNumbers = checkNumbers(rangeToCheck, nodesInGraph[a].data.label, nodesInGraph[a].data.label.length)
          numbers.push( checkedNumbers )
        }
      }
      
      let highestNumber = Math.max( ...numbers );
      highestNumber++;
      const highestNumberAsString = highestNumber.toString();
      
      if( highestNumberAsString !== -Infinity ){
        highestDefaultCount.value = highestNumberAsString;
      } else {
        highestDefaultCount.value = "0";
      }
    } else {
      highestDefaultCount.value = "0"
    }
  }




  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Checks the last digits of a node within a given range. If they represent 
   * a number, it will be returned. Otherwise a '0' is returned by default.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {{ start: int, length: int }} rangeToCheck - 
   * @param {string} label -
   * @param {number} labelLength -
   * @returns {number} The index-number of the node
   */
  function checkNumbers(rangeToCheck, label, labelLength) {
    let startPosition = rangeToCheck.start;
    const numbersToCheck = []
    
    for( let a = 0; a < rangeToCheck.length; a++ ){
      if( labelLength < (startPosition + 1) ) {
        const numberSubstringAsInt = parseInt( label.substring( startPosition, startPosition + 1 ) )
        numbersToCheck.push( !isNaN(numberSubstringAsInt) )
      } else {
        break;
      }
      startPosition++;
    }

    const checker = arr => arr.every(n => n === true);
    if( checker(numbersToCheck) ){
      return parseInt( label.substring( rangeToCheck.start, labelLength ) )
    }
    return 0;
  }




  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Fills the individual subcomponents of the infoCard with information from a 
   * node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param { {computePosition: {x: int, y: int, z: int}, connectable: any, data: {description: string, findingID: string, groupIDs: array<string>, label: string, nodeStyle: string, relations: array<{edgeID: string, id: string, relationType: string, sourceID: string, targetID: string}>, selected: boolean, styles: {bottom_middle: string, left_middle: string, right_middle: string, top_middle: string}, validConnections: {bottom_middle: boolean, left_middle: boolean, right_middle: boolean, top_middle: boolean}, volumeID: string}, dimensions: {width: int, height: int}, draggable: any, events: any, focusable: any, handleBounds: {source: array, target: array , id: string, initialized: boolean, isParent: boolean, parentNode: any, position: {x: int, y: int}, resizing: boolean, selectable: any, selected: boolean, type: string}, id: string, initialized: boolean, isParent: boolean, parentNode: any, position: {x: int, y: int}, resizing: boolean, selectable: any, type: string} } node - A node from the graph
   */
  function fillInfoCard(node) {
    // Note the id of the currently selected node and activate the InfoCard
    selectedNodeID = node.id
    infoCardDisabled.value = false
    document.getElementById("infoCard").style.opacity = "1";
    
    // Fill the fields of the infocard with ...
    // ... the title, ... 
    nodeTitle.value = node.id
    // ... description, ...
    nodeDescription.value = node.data.description
    // ... type ... 
    if( node.type == "deposit" ) {
      nodeType.value = 0;
    } else {
      nodeType.value = 1;
    }
    // ... and relations of the node.
    for( const relation of node.data.relations ) {
      const targetNode = getNodes.value.find( obj => { return obj.id == relation.id } )
      if( relation.id == targetNode.id ) {
        nodeRelations.value.push( { 
          id: relation.edgeID,
          type: relation.relationType, 
          targetLabel: targetNode.data.label,
          sourceID: relation.sourceID,
          targetID: relation.targetID
        } )
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Sets the InfoCard to the default state and resets global variables that 
   * were related to the previously selected node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function clearInfoCard() {
    selectedNodeID = "";
    nodeSearchedFor.value = "";
    infoCardDisabled.value = true
    document.getElementById("infoCard").style.opacity = "0.5";

    // node title
    nodeTitle.value = "";
    // node description
    nodeDescription.value = "";
    // node type
    nodeType.value = -1;
    // node relations
    nodeRelations.value = [];
  }





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
  









  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Creates a new default node with given parameters.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {any} param - Parameters for the edge to be created
   * @returns { {id: string, source: string, target, string, sourceHandle: string, targetHandle: string, type: string, markerEnd: any, style: {strokeWidth: string, strike: string}} }
   */
  function getDefaultEdge(param) {
    return {
      id: param.target + " -> " + param.source,
      source: param.source,
      target: param.target,

      sourceHandle: param.sourceHandle,
      targetHandle: param.targetHandle,

      type: 'custom',
      markerEnd: MarkerType.ArrowClosed,
      style: {
        strokeWidth: '4px',
        stroke: '#ffffff',
      },
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Adjusts the parameter of the default Edge.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param { {id: string, source: string, target, string, sourceHandle: string, targetHandle: string, type: string, markerEnd: any, style: {strokeWidth: string, strike: string}} } newEdge - 
   * @param param - Parameters for the edge to be created
   */
  function adjustDefaultEdge(newEdge, param) {
    newEdge.source = param.target;
    newEdge.target = param.source;
    newEdge.sourceHandle = param.targetHandle;
    newEdge.targetHandle = param.sourceHandle;
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Removes a duplicate edge between two nodes.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param param - Parameters for the edge to be created
   */
  function removeDuplicateEdge(param) {
    const edgesInGraph = getEdges.value;
    const edgesInGraphlength = edgesInGraph.length;
    for( let a = 0; a < edgesInGraphlength; a++ ){
      if( ((edgesInGraph[a].target == param.source && edgesInGraph[a].source == param.target) || (edgesInGraph[a].target == param.target && edgesInGraph[a].source == param.source)) && (edgesInGraph[a].sourceHandle == 'left_middle' || edgesInGraph[a].sourceHandle == 'right_middle') ){
        removeEdges(edgesInGraph[a].id);
        break;
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Adds a new entry to a node's collection of entries about all relations with 
   * other nodes.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *  
   * @param type -
   * @param sourceNodeID -
   * @param targetNodeID -
   * @param relations -
   * @param relationType -
   * @param edgeID -
   */
  function addNewRelationEntryToNode(type, sourceNodeID, targetNodeID, relations, relationType, edgeID) {
    switch( type ){
      case 'source':
        relations.push({
          id: targetNodeID,
          relationType: relationType,
          edgeID: edgeID,
          sourceID: sourceNodeID,
          targetID: targetNodeID,
        })
        break;
      case 'target':
        relations.push({
          id: sourceNodeID,
          relationType: relationType,
          edgeID: edgeID,
          sourceID: sourceNodeID,
          targetID: targetNodeID,
        })
        break;
      default:
        console.log("ERROR")
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Adds a new relation to the relations-subcomponent of the InfoCard.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param nodesInGraph -
   * @param sourceNodeID -
   * @param targetNodeID -
   */
  function updateRelationsSubComponent(nodesInGraph, sourceNodeID, targetNodeID) {
    const selectedNodeRelations = nodesInGraph[ nodesInGraph.map( (x) => {return x.id} ).indexOf( selectedNodeID ) ].data.relations;
    const selectedNodeRelationsLength = selectedNodeRelations.length;
    const nodesInGraphLength = nodesInGraph.length;
    nodeRelations.value = [];
    
    for( let a = 0; a < selectedNodeRelationsLength; a++ ){
      nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
        if( selectedNodeRelations[a].id == nodesInGraph[b].id ) {
          nodeRelations.value.push({
            id: selectedNodeRelations[a].edgeID,
            type: selectedNodeRelations[a].relationType,
            targetLabel: nodesInGraph[b].data.label,
            sourceID: sourceNodeID,
            targetID: targetNodeID,
          });
          break nodes;
        }
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Checks whether the new edge is already noted as an entry in the node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {Array<{edgeID: string, id: string, relationType: string, sourceID: string, targetID: string}>} allRelations
   * @param {string} targetNodeId
   * @param {string} targetNodeRelationtype 
   * @returns {boolean} Whether an entry for this relation already exists
   */
  function searchForEntry( relations, nodeID, nodeRelationType ) {
    const relationsLength = relations.length;
    if( relations.length ){
      for( let a = 0; a < relationsLength; a++ ) {
        if( relations[a].id == nodeID && relations[a].relationType == nodeRelationType ) {
          return true;
        }
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Goes through all the nodes that came stratigraphically after the start node 
   * and checks which would not be suitable for the type of relation to be 
   * created according to the rules of stratigraphy.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {} relations -
   * @param {} nodeID -
   * @param {} nonValidNodes - 
   * @returns {array<string>} - Ids of the non-matching nodes
   */
  function checkRelationsAfter( relations, nodeID, nonValidNodes ) {
    let nonValid = nonValidNodes
    
    if( relations.length > 0 ) {
      const nodesInGraph = getNodes.value
      const nodesInGraphLength = nodesInGraph.length
      const relationslength = relations.length
      for( let a = 0; a < relationslength; a++ ) {
        if( (relations[a].relationType == 'after' || relations[a].relationType == 'korrelation') && !nonValid.includes(relations[a].id)){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsAfter( nodesInGraph[b].data.relations, nodeID, nonValid)
              nonValid.push(... nonValidIDs );
              nonValid = [ ...new Set(nonValid) ]
              break nodes;
            }
          }
        }
      }
    }
    return nonValid
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Goes through all the nodes that came stratigraphically before the start 
   * node and checks which would not be suitable for the type of relation to be 
   * created according to the rules of stratigraphy.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {} relations - 
   * @param {} nodeID - 
   * @param {} nonValidNodes - 
   * @returns {array<string>} - Ids of the non-matching nodes
   */
  function checkRelationsBefore( relations, nodeID, nonValidNodes ) {
    let nonValid = nonValidNodes
    
    if( relations.length > 0 ) {
      const relationsLength = relations.length
      const nodesInGraph = getNodes.value
      const nodesInGraphLength = nodesInGraph.length
      for( let a = 0; a < relationsLength; a++ ){
        if( (relations[a].relationType == 'before' || relations[a].relationType == 'korrelation') && !nonValid.includes(relations[a].id)){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ) {
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsBefore( nodesInGraph[b].data.relations, nodeID, nonValid)
              nonValid.push(... nonValidIDs );
              nonValid = [ ...new Set(nonValid) ]
              break nodes;
            }
          }
        }
      }
    }
    return nonValid
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Goes through all the nodes that are stratigraphically correlating with the
   * start node and checks which would not be suitable for the type of relation 
   * to be created according to the rules of stratigraphy.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {} relations - 
   * @param {} nodeID - 
   * @param {} nonValidNodes - 
   * @returns {array<array<string>, array<string>>} 
   */
  function checkRelationsCorrelating( relations, nodeID, nonValidNodes ) {
    let nonValid = nonValidNodes;
    const toBeDeleted = [];
    
    if( relations.length > 0 ) {
      const relationsLength = relations.length;
      const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < relationsLength; a++ ){
        if( relations[a].relationType == 'before' && !nonValid.includes(relations[a].id) ){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsBefore( nodesInGraph[b].data.relations, nodeID, nonValid )
              nonValid.push(... nonValidIDs );
              nonValid = [ ...new Set(nonValid) ]
              break nodes;
            }
          }
        } else if( relations[a].relationType == 'after' && !nonValid.includes(relations[a].id) ){
          nonValid.push( relations[a].id )
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsAfter( nodesInGraph[b].data.relations, nodeID, nonValid )
              nonValid.push(... nonValidIDs );
              nonValid = [ ...new Set(nonValid) ];
              break nodes;
            }
          }
        } else if( relations[a].relationType == 'korrelation' && !nonValid.includes(relations[a].id) ){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsCorrelating( nodesInGraph[b].data.relations, nodeID, nonValid )
              const relationsOfNodeLength = nodesInGraph[b].data.relations.length
              for( let c = 0; c < relationsOfNodeLength; c++ ){
                if( nodesInGraph[b].data.relations[c].id == nodeID ){
                  toBeDeleted.push(relations[a].id)
                }
              }
              toBeDeleted.push(...nonValidIDs[1])
              nonValid.push(...nonValidIDs[0] );
              nonValid = [...new Set(nonValid)]
              break nodes;
            }
          }
        }
      }
    }
    return [nonValid, toBeDeleted]
  }

  


  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Reduces the non valid ids by the ids of all nodes that are connected to the
   * source node via a correlation relationship and are therefore in a row.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {} nonValidNodes - 
   * @param {} nodeID - 
   * @returns {array<string>} 
   */
  function reduceNonValidIDsByRowIDs(nonValidNodes, nodeID) {
    const newNonValidNodes = nonValidNodes[0];
    let toBeDeleted = nonValidNodes[1];
    toBeDeleted.push(... getNodesInARow(nonValidNodes[1], nodeID, []))
    toBeDeleted = [...new Set(toBeDeleted)]
    
    const toBeDeletedLength = toBeDeleted.length;
    for( let a = 0; a < toBeDeletedLength; a++ ){
      const index = newNonValidNodes.indexOf( toBeDeleted[a] )
      newNonValidNodes.splice( index, 1 )
    }
    
    return newNonValidNodes
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Gets all nodes that are in a row via correlation relations. Starting 
   * from the source node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {} nextLookAt - 
   * @param {} nodeID - 
   * @param {} toBeDeleted - 
   * @returns {array<string>} 
   */
  function getNodesInARow(nextLookAt, nodeID, toBeDeleted) {
    const forNextStep = [];

    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nextLookAt.includes(nodesInGraph[a].id) && nodesInGraph[a].id != nodeID ){
        toBeDeleted.push( nodesInGraph[a].id );
        const relationsLength = nodesInGraph[a].data.relations.length
        for( let b = 0; b < relationsLength; b++ ){
          if( nodesInGraph[a].data.relations[b].relationType == "korrelation" && nodesInGraph[a].data.relations[b].id != nodeID && !toBeDeleted.includes(nodesInGraph[a].data.relations[b].id) ){
            toBeDeleted.push( nodesInGraph[a].data.relations[b].id )
            forNextStep.push( nodesInGraph[a].data.relations[b].id )
            getNodesInARow( forNextStep, nodeID, toBeDeleted)
          }
        }
      }
    }
    toBeDeleted = [...new Set(toBeDeleted)]
    return toBeDeleted
  }

  


  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Deletes a node and the associated entries for relations from other nodes in
   * the graph.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: deleteNode
   * 
   */
  function deleteNode() {
    for( const[_, value] of Object.entries(getNodes.value) ) {
      if( value.data.selected ) {
        
        if( nodesInUnitSearch.value.includes( value.data.label ) ) {
          const index = nodesInUnitSearch.value.indexOf(value.data.label);
          nodesInUnitSearch.value.splice(index, 1);
        }
        
        removeNodes(value.id)
      }
      else {
        value.data.relations.forEach( ( relation, idx ) => {
          if( relation.id == selectedNodeID ) {
            value.data.relations.splice(idx, 1);
          }
        })
      }
    }
    clearInfoCard()
    
    saveProcessingStep( "deleteNode" )
  }



  

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Deletes an edge and its associated entries in the graph
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * ====>>> type: deleteEdge
   * 
   * @param {} edgeID -
   * @param {} sourceID -
   * @param {} targetID - 
   */
  function deleteEdge( edgeID, sourceID, targetID ) {
    for( const[_, nodeInGraph] of Object.entries(getNodes.value) ) {
      if( nodeInGraph.id == sourceID || nodeInGraph.id == targetID ){
        nodeInGraph.data.relations.forEach( (relation, idx) => {
          if( relation.edgeID == edgeID ){
            nodeInGraph.data.relations.splice( idx, 1 );
          }
        } )
      }
    }
    nodeRelations.value.forEach( ( relation, idx ) => {
      if( relation.id == edgeID ) {
        nodeRelations.value.splice( idx, 1 );
      }
    } )
    removeEdges( edgeID )

    saveProcessingStep( "deleteEdge" )
  }

  

  
  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Updates the label of a node and the entry in the unit search subcomponent.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: updateTitle
   * 
   * @param {} input - 
   */
  function updateTitle( input ) {
    if( getNodes.value.length != 0 ) {
      for( const[_, node] of Object.entries(getNodes.value) ) {
        if( node.data.selected ) {
          if( nodeSearchedFor.value == node.data.label ) {
            nodeSearchedFor.value = input
          }
          const index = nodesInUnitSearch.value.indexOf(node.data.label);
          nodesInUnitSearch.value.splice(index, 1);
          nodesInUnitSearch.value.push(input)
          node.data.label = input
        }
      }
      
      saveProcessingStep( "updateTitle" )
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
   * Switches between both editors, showing one and hiding the other.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeEditor() {
    const canvas = document.getElementById("canvas")
    const graph = document.getElementById("graph")

    if( graph.style.opacity == "1" ) {
      graph.style.opacity = "0"
      graph.style.zIndex = "0"
    } else {
      graph.style.opacity = "1"
      graph.style.zIndex = "1"
    }
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