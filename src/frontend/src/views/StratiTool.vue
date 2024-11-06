<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 06.11.2024 01:11:11
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
                      <v-card-title width="100%" height="100%" class="d-flex align-center justify-center">{{ graphAktiveModuleName }}</v-card-title>
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
                  <v-card id="exp/imp_module" class="pa-2 exp-imp_module__base" :height="windowHeight - 345" width="367" style="position:absolute; z-index: 0; opacity: 1;">
                    <v-row no-gutters>
                      <v-card class="pa-2" :height="windowHeight - 838" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                        <v-card-title class="d-flex align-center justify-center pa-0 pb-2" >Export</v-card-title>
                        <v-btn class="infobereich__attributes_type_title_button" width="100%" height="50" @click="exportData()">
                          Press Me
                        </v-btn>
                      </v-card>
                    </v-row>
                    <v-row no-gutters>
                      <v-card class="pa-2" :height="windowHeight - 838" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                        <v-card-title class="d-flex align-center justify-center pa-0 pb-2" >Import</v-card-title>
                        <v-btn class="infobereich__attributes_type_title_button" width="100%" height="50" @click="createImportDataDialog = true">
                          Press Me
                        </v-btn>
                        <v-dialog v-model="createImportDataDialog" max-width="320" persistent>
                          <v-card class="pa-4">
                            <v-file-input show-size accept=".json" v-model="dataToBeImported" label="Datei auswählen"/>
    
                            <v-card-actions class="justify-center">
                              <v-btn icon color="success" v-on:click="importData()">
                                <v-icon>mdi-check-circle</v-icon>
                              </v-btn>
                              <v-btn icon color="primary" @click="createImportDataDialog = false">
                                <v-icon>mdi-close-circle</v-icon>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-card>
                    </v-row>
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
                  <v-card class="px-5 py-0 units__graph_base" variant="text">
                    <v-col class="pa-0" align="center">

                      <!-- Subcomponent title -->
                      <v-card class="pt-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Harris-Matrix Speichern
                        </v-card-title>
                      </v-card>
                      
                      <!-- Save -->
                      <v-card class="pt-1 my-3" height="fit-content" variant="text">
                        <v-btn width="100%" @click="saveAll()">
                          Speichern
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-card>
                </v-col>
                
                <!-- Switch processing steps -->
                <v-col>
                  <v-card class="px-5 py-0 units__graph_base" variant="text">
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
                
                <!-- 3D-Editor Tools -->
                <v-card id="units_3dTools" width="100%" height="100%" class="notVisible">
                  <v-row no-gutters>
                    
                    <!-- Unit List -->
                    <v-col>
                      <v-card class="px-5 py-0 units__3d_base" variant="text" height="92">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Auflistung aller Units
                            </v-card-title>
                          </v-card>
                          <v-slide-group show-arrows="always">
                            <v-row justify="center" align="center" class="my-2" no-gutters>
                              <v-slide-group-item v-for="n in unitListContent" :key="n">
                                <v-btn :id=n.id class="mx-1 units__3d_list_button_notClicked" rounded v-on:click="fillInfoCard3d(n.id)">
                                  {{ n.label }}
                                </v-btn>
                              </v-slide-group-item>
                            </v-row>
                          </v-slide-group>
                        </v-col>
                      </v-card>
                    </v-col>
                    
                    <!-- Next Tool -->
                    <!-- <v-col>
                      <v-card class="px-5 py-0 units__3d_base" variant="text">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Auflistung aller Units2
                            </v-card-title>
                          </v-card>
                          <Sidebar :highestIndexOfDefaultNode="highestIndexOfDefaultNode"/>
                        </v-col>
                      </v-card>
                    </v-col> -->
                    
                  </v-row>
                </v-card>

                <!-- Graph-Editor Tools -->
                <v-card id="units_graphTools" width="100%" class="visible">
                  <v-row no-gutters>
                    
                    <!-- Unit creation -->
                    <v-col>
                      <v-card id="unitCreation" class="px-5 py-0 units__graph_base" variant="text" height="100%">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Neue Unit erstellen
                            </v-card-title>
                          </v-card>
                          <Sidebar :highestIndexOfDefaultNode="highestIndexOfDefaultNode"/>
                        </v-col>
                      </v-card>
                    </v-col>
                      
                    <!-- Unit Search -->
                    <v-col>
                      <v-card class="px-5 units__graph_base" variant="text" height="100%">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Unit suchen
                            </v-card-title>
                          </v-card>
                          <v-combobox class="mb-2" style="height: 52px; width: 250px" hide-selected :items="unitSearchDopDownMenueContent" persistent-hint :hide-no-data="true" v-model="unitSearchInput"></v-combobox>
                        </v-col>
                      </v-card>
                    </v-col>
                    
                    <!-- Unit cleanup -->
                    <v-col>
                      <v-card class="px-5 units__graph_base" variant="text" height="100%">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-3" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Unit aufräumen
                            </v-card-title>
                          </v-card>
                          <v-btn @click="cleanUp">Harris-Matrix anordnen</v-btn>
                        </v-col>
                      </v-card>
                    </v-col>
                    
                  </v-row>
                </v-card>
                
              </v-row>
            </v-card>
          </v-row>
  
          <!-- Editoren -->
          <v-row no-gutters style="width:fit-content;">
            <canvas id="canvas_3d" class="tile notVisible" :height="windowHeight - 328" :width="windowWidth - 825"></canvas>
            <v-card id="canvas_graph" class="dnd-flow plato visible" @drop="onDrop" :height="windowHeight - 320" :width="windowWidth - 817" style="position:relative; z-index: 0; opacity: 1;" >
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
                      <v-card-title class="justify-center">{{ selectedNodeName }}</v-card-title>
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
                              <v-text-field class="infobereich__attributes_name_text-field" hide-details height="100%" v-model="selectedNodeName"></v-text-field>
                            </v-col>
                            <v-col cols="2">
                              <v-btn class="infobereich__attributes_name_button" height="100%" min-width="0" @click="updateTitle(selectedNodeName)">
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
                            <v-btn-toggle class="px-10" v-model="selectedNodeType">
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
                              <v-textarea class="infobereich__attributes_description_textarea" no-resize hide-details v-model="selectedNodeDescription"></v-textarea>
                            </v-col>
                            <v-col cols="2">
                              <v-btn class="infobereich__attributes_description_button" height="100%" min-width="0" @click="updateDescription(selectedNodeDescription)">
                                <v-icon icon="mdi-content-save" size="Large"></v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>

                        <!-- Unit 3D-Object -->
                        <v-card class="py-2 pb-0 mb-3 infobereich__attributes_type" width="100%" height="130">
                          
                          <!-- Attribute-Header -->
                          <v-row no-gutters align-content="center">
                            <v-card class="pl-3 infobereich__attributes_type_title" elevation="0">3D-Objekt:</v-card>
                          </v-row>
                          
                          <!-- New 3D-Object creation -->
                          <v-card id="infoCard_attributes_createNewObject" class="pt-3 px-16 visible" variant="text" width="100%">
                            <v-btn class="infobereich__attributes_description_button" height="60" min-width="100%" @click="createAddModelDialog = true">
                                Neues 3D-Objekt<br>hinzufügen
                            </v-btn>
                            <v-dialog v-model="createAddModelDialog" max-width="800" persistent>
                              <v-card class="pa-4">
                                <v-card-title>{{ $t('add', { msg: $t('model') }) }}</v-card-title>
    
                                <v-text-field v-model="selectedNodeNewModelName" :label="$t('title')" :hint="$t('please_input', { msg: $t('title_of', { msg: $t('model') }) })"/>
    
                                <v-file-input show-size accept=".glb" v-model="selectedNodeNewModel" :label="$t('input', { msg: $t('model') })"/>
    
                                <v-card-actions class="justify-center">
                                  <v-btn icon color="success" v-on:click="addObject()">
                                    <v-icon>mdi-check-circle</v-icon>
                                  </v-btn>
                                  <v-btn icon color="primary" @click="createAddModelDialog = false">
                                    <v-icon>mdi-close-circle</v-icon>
                                  </v-btn>
                                </v-card-actions>
                              </v-card>
                            </v-dialog>
                          </v-card>

                          <!-- Edit existing 3D-Object -->
                          <v-card id="infoCard_attributes_editExistingObject" variant="text" class="px-3 notVisible" width="100%">
                            <v-row no-gutters>
                              <v-card variant="text">
                                <v-card-title class="pa-1" >Name: {{ selectedNodeModelName }}</v-card-title>
                              </v-card>
                            </v-row>
                            <v-row no-gutters>
                              
                              <!-- Switch existing 3D-Object -->
                              <v-col cols="6">
                                <v-btn class="infobereich__attributes_description_button" height="40" min-width="100%" @click="createSwitchObjektDiablog = true">
                                  Wechseln
                                </v-btn>
                                <v-dialog v-model="createSwitchObjektDiablog" max-width="800" persistent>
                                  <v-card class="pa-4">
                                    <v-card-title>{{ $t('add', { msg: $t('model') }) }}</v-card-title>
    
                                    <v-text-field v-model="selectedNodeNewModelName" :label="$t('title')" :hint="$t('please_input', { msg: $t('title_of', { msg: $t('model') }) })"/>
    
                                    <v-file-input show-size accept=".glb" v-model="selectedNodeNewModel" :label="$t('input', { msg: $t('model') })"/>
    
                                    <v-card-actions class="justify-center">
                                      <v-btn icon color="success" v-on:click="switchObject()">
                                        <v-icon>mdi-check-circle</v-icon>
                                      </v-btn>
                                      <v-btn icon color="primary" @click="createSwitchObjektDiablog = false">
                                        <v-icon>mdi-close-circle</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-col>

                              <!-- Delete 3D-Object -->
                              <v-col cols="6">
                                <v-btn class="infobereich__attributes_description_button" height="40" min-width="100%" @click="createDeleteModelDialog = true">
                                  Löschen
                                </v-btn>
                                <v-dialog v-model="createDeleteModelDialog" max-width="300" persistent>
                                  <v-card class="pa-4">
                                    <v-card-title class="text-wrap" style="word-break: break-word;">Wollen sie das 3D-objekt wirklich löschen?</v-card-title>
                                    
                                    <v-card-actions class="justify-center">
                                      <v-btn icon color="success" v-on:click="deleteObject">
                                        <v-icon>mdi-check-circle</v-icon>
                                      </v-btn>
                                      <v-btn icon color="primary" @click="createDeleteModelDialog = false">
                                        <v-icon>mdi-close-circle</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                    
                                  </v-card>
                                </v-dialog>
                              </v-col>
                              
                            </v-row>
                          </v-card>
                          
                        </v-card>
                          
                        <!-- Unit Beziehungen -->
                        <v-card class="py-2 mb-3 infobereich__attributes_relations" width="100%">
                          <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_relations_title" elevation=0>Stratigraphische Beziehungen:</v-card>
                          </v-row>
                          <v-row no-gutters class="px-2">
                            <v-list class="px-2 infobereich__attributes_relations_list" height="200" min-width="100%" max-width="100%">
                              <v-list-item class="mb-7 pb-0 px-0" max-height="0" v-for="n in selectedNodeRelations" :key="n">
                                <v-row no-gutters height="fit-content">
                                  <v-card class="pa-2 infobereich__attributes_relations_list_item" width="87%" height="70">
                                    Mit: {{ n.targetLabel }}<br>Art: {{ n.type }}
                                  </v-card>
                                  <v-btn class="infobereich__attributes_relations_list_button" height="70" min-width="0" max-width="0">
                                    <v-icon icon="mdi-delete-empty" size="Large" @click="createDeleteNodeRelationDialog = true; edgeToBeDeleted = n"></v-icon>
                                  </v-btn>
                                </v-row>
                              </v-list-item>
                              <v-dialog v-model="createDeleteNodeRelationDialog" max-width="320" persistent>
                                <v-card class="pa-4">
                                  <v-card-title class="text-wrap" style="word-break: break-word;">Wollen sie die Beziehung {{ edgeToBeDeleted.id }} wirklich löschen?</v-card-title>
                                  <v-card-actions class="justify-center">
                                    <v-btn icon color="success" v-on:click="deleteEdge( edgeToBeDeleted.id, edgeToBeDeleted.sourceID, edgeToBeDeleted.targetID )">
                                      <v-icon>mdi-check-circle</v-icon>
                                    </v-btn>
                                    <v-btn icon color="primary" @click="createDeleteNodeRelationDialog = false">
                                      <v-icon>mdi-close-circle</v-icon>
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
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
                    <v-btn class="infobereich__delete_unit_button" height="50" width="100%" @click="createDeleteNodeDialog = true">
                      Unit Löschen
                    </v-btn>
                    <v-dialog v-model="createDeleteNodeDialog" max-width="320" persistent>
                      <v-card class="pa-4">
                        <v-card-title class="text-wrap" style="word-break: break-word;">Wollen sie die Unit wirklich löschen?</v-card-title>
    
                        <v-card-actions class="justify-center">
                          <v-btn icon color="success" v-on:click="deleteNode">
                            <v-icon>mdi-check-circle</v-icon>
                          </v-btn>
                          <v-btn icon color="primary" @click="createDeleteNodeDialog = false">
                            <v-icon>mdi-close-circle</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
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

<script setup>
  import * as THREE from 'three';
  import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { onMounted, onUnmounted, markRaw, ref, watch, toRaw} from 'vue';
  import { useWindowSize } from 'vue-window-size';
  import { VueFlow, useVueFlow, MarkerType } from '@vue-flow/core';
  import * as img from 'html-to-image';
  import { saveAs } from 'file-saver';
  
  import Sidebar from '../components/graph-editor-components/Sidebar.vue';
  import Navigation from '../components/Navigation.vue';
  import useDragAndDrop from '../components/graph-editor-components/useDnD.js';
  import DropzoneBackground from '../components/graph-editor-components/DropzoneBackground.vue';
  import CustomEdge from '../components/graph-editor-components/CustomEdges/CustomEdge.vue';
  import DepositNode from '../components/graph-editor-components/CustomNodes/DepositNode.vue';
  import InterfaceNode from '../components/graph-editor-components/CustomNodes/InterfaceNode.vue';
  
  import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
  
  // Sync with IndexedDB
  await fromOfflineDB.syncLocalDBs();
  
  // Get functions from vueFlow
  const { updateNode, onInit, fromObject, toObject, removeNodes, fitView, getEdges, removeEdges, onConnect, addEdges, onNodeClick, onPaneClick, getNodes, onNodesChange, onPaneMouseLeave, onConnectStart, onConnectEnd, onNodeMouseEnter, onNodeMouseLeave} = useVueFlow()
  // Get functions from Drag and Drop
  const { onDragOver, onDrop, onDragLeave, isDragOver, nodeDropped } = useDragAndDrop()


  /**
   * [-------------------------------------------------------------------------]
   * [------------------------- Reactive Variables ----------------------------]
   * [-------------------------------------------------------------------------]
   */
  // +++ Generally +++
  var allModelsInGraph = ref([]) // array<object>

  // +++ SelectedNode +++
  var selectedNodeName = ref(""); // string
  var selectedNodeType = ref(-1); // int
  var selectedNodeDescription = ref(""); // string
  var selectedNodeRelations = ref([]); // array<{ id: string, type: string, targetLabel: string, sourceID: string, targetID: string }>
  var selectedNodeNewModelName = ref("") // string
  var selectedNodeNewModel = ref(null) // null
  var selectedNodeModelName = ref("Noch kein Model hinzugefügt") // string

  /** > > > > > > ---- < < < < < < **/
  /** > > > > > > Left < < < < < < **/
  /** > > > > > > ---- < < < < < < **/
  // ----Component----> Glossar
  // ----Component----> Help
  // ----Component----> Modules
  var graphModuleNames = ref(["Screenshot", "Group", "View", "Exp/Imp", "Filter", "Timemodel"]); // array<string>
  var graphAktiveModuleName = ref("Screenshot"); // string
  // ----> Screenshot-Tool (Graph-Editor)
  var imageFileName = ref(""); // string
  // ----> Exp/Imp-Tool (Graph-Editor)
  var createImportDataDialog = ref(false); // boolean
  var dataToBeImported = ref(null); // string
  
  /** > > > > > > ------ < < < < < < **/
  /** > > > > > > Middle < < < < < < **/
  /** > > > > > > ------ < < < < < < **/
  // ----Component----> Harris-Matrices
  // -Subcomponent-> Save Harris-Matrix
  // -Subcomponent-> Switch processing steps
  var allProcessingSteps = ref([]); // array<{ type: string, step: string }>
  var currentProcessingStep = ref(0); // int
  var processStepBackButtonDisabled = ref(true) // boolean
  var processStepForwardButtonDisabled = ref(true) // boolean
  // ----Component----> Units
  // -Subcomponent-> Unit Create (Graph-Editor)
  var highestIndexOfDefaultNode = ref("0"); // string
  // -Subcomponent-> Unit Search (Graph-Editor)
  var unitSearchInput = ref(""); // string
  var unitSearchDopDownMenueContent = ref([]); // array<string>
  // -Subcomponent-> Unit List (3D-Editor)
  var unitListContent = ref([]); // array<string>
  // ----Component----> Editoren

  /** > > > > > > ----- < < < < < < **/
  /** > > > > > > Right < < < < < < **/
  /** > > > > > > ----- < < < < < < **/
  // ----Component----> Modus wechseln
  var currentMode = ref("graph") // string
  // ----Component----> Placeholder
  // ----Component----> Infobereich
  var infoCardDisabled = ref(true); // boolean
  var createDeleteNodeDialog = ref(false) // boolean
  var createDeleteNodeRelationDialog = ref(false) // boolean
  var createAddModelDialog = ref(false) // boolean
  var createDeleteModelDialog = ref(false) // boolean
  var createSwitchObjektDiablog = ref(false) // boolean
  var edgeToBeDeleted = ref(null) // array<>
  

  /**
   * [-------------------------------------------------------------------------]
   * [----------------------- Non-Reactive Variables --------------------------]
   * [-------------------------------------------------------------------------]
   */
  const getData = await fromOfflineDB.getAllObjects("StratiToolDB", "stratiTool");
  const { width, height } = useWindowSize();
  const windowHeight = height; // int
  const windowWidth = width; // int
  var selectedNodeID = ""; // string
  var connectionInProgress = false; // boolean
  var idOfCurrentStratiTool = ""; // string
  var alreadyCut = false; // boolean
  var enviromentParameter = {
    renderer: null,
    scene: null,
    camera: null,
    savedCamera: null,
    controls: null,
    light: null,
    objects: null,
  }
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
  watch(nodeDropped, hasBeenDropped => {
    if( hasBeenDropped ){
      saveProcessingStep("addNewNode");
      nodeDropped.value = false;
    }
  })
  
  /**                                 Watcher
   * /=========================================================================\
   * Changes the currently displayed module of the module component.
   * \=========================================================================/
   * 
   */
  watch(graphAktiveModuleName, switchedToModule => {
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
  watch(unitSearchInput, userInput => {
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].data.label == userInput ){
        if( selectedNodeID != "" ) {
          changeUnitsListsButtonStyle( selectedNodeID, "notSelected" );
        }
        zoomToNode(nodesInGraph[a].id);
        selectedNodeModelName.value = ""
        fillInfoCard(nodesInGraph[a]);

        changeUnitsListsButtonStyle( nodesInGraph[a].id, "selected" )
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else if( selectedNodeID != "" && currentMode.value != "3d" ) {
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      }
    }
  })

  /**                                 Watcher
   * /=========================================================================\
   * Switches the subcomponents of a component when changing the editor and 
   * displays the corresponding subcomponents that are required for editing 
   * while using the respective editor that was switched to.
   * \=========================================================================/
   * 
   */
  watch(currentMode, whichMode => {
    if( whichMode == "graph" ){
      enviromentParameter.renderer.setAnimationLoop(null);
      changeVisibility("canvas_graph", "visible")
      changeVisibility("units_graphTools", "visible")
      
      changeVisibility("canvas_3d", "notVisible")
      changeVisibility("units_3dTools", "notVisible")
    } else if( whichMode == "3d" ){
      enviromentParameter.renderer.setAnimationLoop(animate);
      changeVisibility("canvas_3d", "visible")
      changeVisibility("units_3dTools", "visible")
      
      changeVisibility("canvas_graph", "notVisible")
      changeVisibility("units_graphTools", "notVisible")
    }
  })
  
  /**                                 Watcher
   * /=========================================================================\
   * 
   * \=========================================================================/
   * 
   */
  watch(selectedNodeModelName, whichName => {
    if( whichName == "" ){
      changeVisibility("infoCard_attributes_createNewObject", "visible")
      changeVisibility("infoCard_attributes_editExistingObject", "notVisible")
    } else {
      changeVisibility("infoCard_attributes_createNewObject", "notVisible")
      changeVisibility("infoCard_attributes_editExistingObject", "visible")
    }
  })


  
  

  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called when the page is initialized. Loads all existing system data, if 
   * available. If no data is available, a new processing step with the type 
   * "init" is created.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: init
   * 
   */
  onInit(async() => {
    if( getData.length > 0 ){
      if( allProcessingSteps.value.length > 0 ){
        const parsedProcessingStep = JSON.parse(allProcessingSteps.value[currentProcessingStep.value - 1].step);

        if( currentProcessingStep.value > 1 && (allProcessingSteps.value[currentProcessingStep.value - 1].type === "addNewNode") ){
          const lastNodeID = parsedProcessingStep.nodes[parsedProcessingStep.nodes.length - 1].id;
          fromObject(parsedProcessingStep);
          updateNode(lastNodeID, (node) => ({
            position: {x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2},
          }));
        }
        else {
          fromObject(parsedProcessingStep);
        }

        if( currentProcessingStep.value > 1 ){
          processStepBackButtonDisabled.value = false;
        }
        if( currentProcessingStep.value < allProcessingSteps.value.length ){
          processStepForwardButtonDisabled.value = false;
        }
        
        const nodesInGraph = getNodes.value;
        const nodesInGraphLength = nodesInGraph.length;
        for( let a = 0; a < nodesInGraphLength; a++ ){
          if( nodesInGraph[a].data.selected === true ){
            fillInfoCard(nodesInGraph[a]);
          }
          unitSearchDopDownMenueContent.value.push(nodesInGraph[a].data.label);
          unitListContent.value.push({ id: nodesInGraph[a].id, label: nodesInGraph[a].data.label });
        }
      }
    } else {
      saveProcessingStep("init");
    }
  })

  function initGraph() {
    if( allProcessingSteps.value.length > 0 ){
      const parsedProcessingStep = JSON.parse(allProcessingSteps.value[currentProcessingStep.value - 1].step);

      if( currentProcessingStep.value > 1 && (allProcessingSteps.value[currentProcessingStep.value - 1].type === "addNewNode") ){
        const lastNodeID = parsedProcessingStep.nodes[parsedProcessingStep.nodes.length - 1].id;
        fromObject(parsedProcessingStep);
        updateNode(lastNodeID, (node) => ({
          position: {x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2},
        }));
      }
      else {
        fromObject(parsedProcessingStep);
      }

      if( currentProcessingStep.value > 1 ){
        processStepBackButtonDisabled.value = false;
      }
      if( currentProcessingStep.value < allProcessingSteps.value.length ){
        processStepForwardButtonDisabled.value = false;
      }
        
      const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( nodesInGraph[a].data.selected === true ){
          fillInfoCard(nodesInGraph[a]);
        }
        unitSearchDopDownMenueContent.value.push(nodesInGraph[a].data.label);
        unitListContent.value.push({ id: nodesInGraph[a].id, label: nodesInGraph[a].data.label });
      }
    }
  }



  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called after adding an edge. Updates the entries of the sourceNode and 
   * targetNode by the relation just created and updates existing korrelation-
   * relations if they were created between the same nodes. Also dynamically 
   * adjusts the entry of the relation displayed in the InfoCard, if the 
   * sourceNode or targetNode should be the currently selected node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: addNewEdge
   * 
   */
  onConnect((param) => {
    const nodesInGraph = getNodes.value;
    const sourceNodeRelations = nodesInGraph[nodesInGraph.map((x) => {return x.id}).indexOf(param.source)].data.relations;
    const targetNodeRelations = nodesInGraph[nodesInGraph.map((x) => {return x.id}).indexOf(param.target)].data.relations;
    const relationPerHandle = {
      'top_middle': 'before',
      'bottom_middle': 'after',
      'left_middle': 'korrelation',
      'right_middle': 'korrelation',
    };
    const sourceRelationType = relationPerHandle[param.sourceHandle];
    const targetRelationType = relationPerHandle[param.targetHandle];

    // Create default edge and adjust if necessary
    const newEdge = getDefaultEdge(param);
    if( param.targetHandle === 'top_middle' ) {
      adjustDefaultEdge(newEdge, param)
    }

    // Create an entry of the new relation for both nodes and add the edge to the graph.
    let entryExistsSource = 0
    let entryExistsTarget = 0
    entryExistsSource = searchForEntry(sourceNodeRelations, param.target, sourceRelationType)
    entryExistsTarget = searchForEntry(targetNodeRelations, param.source, targetRelationType)
    if( entryExistsSource == 0 ){
      addNewRelationEntryToNode('source', param.source, param.target, param.sourceHandle, param.targetHandle, sourceNodeRelations, targetRelationType, newEdge.id);
      addNewRelationEntryToNode('target', param.source, param.target, param.sourceHandle, param.targetHandle, targetNodeRelations, sourceRelationType, newEdge.id);
      addEdges([newEdge]);
    }
    // Edge case: If there is already a correlation-relation between the nodes, 
    // delete it and create the new one. This case occurs when the handles of 
    // the source and target nodes are swapped.
    else if( entryExistsSource && (param.sourceHandle == 'left_middle' || param.sourceHandle == 'right_middle') ){
      const sourceNodeRelationsLength = sourceNodeRelations.length;
      for( let a = 0; a < sourceNodeRelationsLength; a++ ){
        if( entryExistsSource == sourceNodeRelations[a].id ){
          sourceNodeRelations[a].sourceID = param.source
          sourceNodeRelations[a].sourceHandle = param.sourceHandle
          sourceNodeRelations[a].targetID = param.target
          sourceNodeRelations[a].targetHandle = param.targetHandle
        }
      const targetNodeRelationsLength = targetNodeRelations.length;
      for(let a = 0; a < targetNodeRelationsLength; a++ ){
        if( entryExistsTarget == targetNodeRelations[a].id ){
          targetNodeRelations[a].sourceID = param.source
          targetNodeRelations[a].sourceHandle = param.sourceHandle
          targetNodeRelations[a].targetID = param.target
          targetNodeRelations[a].targetHandle = param.targetHandle
        }
      }
      }
      removeDuplicateEdge(param)
      addEdges([newEdge]);
    }

    // Edge Case: If the currently selected node is part of the created 
    // relation, the relations-sub-component must be updated. Otherwise it will 
    // only be updated when the node is selected again.
    if( selectedNodeID !== "" ){
      updateRelationsSubComponent(nodesInGraph, param.source, param.target)
    }
    
    saveProcessingStep("addNewEdge");
  })

  

  

  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called at the start of a connection event. Checks all other nodes in the 
   * graph to see whether they would be suitable for a connection according to 
   * the rules of stratigraphy, depending on the selected handel of the source 
   * node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onConnectStart((params) => {
    connectionInProgress = true;

    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      const nonValidNodes = []
      const nonValidAfterReduction = []
      if( nodesInGraph[a].id == params.nodeId ) {
        nodesInGraph[a].data.validConnections.top_middle = false;
        nodesInGraph[a].data.validConnections.bottom_middle = false;
        nodesInGraph[a].data.validConnections.left_middle = false;
        nodesInGraph[a].data.validConnections.right_middle = false;
        
        switch( params.handleId ){
          case 'top_middle':
            nonValidNodes.push( ...checkRelationsBefore(nodesInGraph[a].data.relations, nodesInGraph[a].id, []));
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                nodesInGraph[b].data.validConnections.top_middle = false;
                nodesInGraph[b].data.validConnections.left_middle = false;
                nodesInGraph[b].data.validConnections.right_middle = false;
                if( nonValidNodes.includes(nodesInGraph[b].id) ){
                  nodesInGraph[b].data.validConnections.bottom_middle = false;
                }
              }
            }
            break;
          case 'bottom_middle':
            nonValidNodes.push( ...checkRelationsAfter( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                nodesInGraph[b].data.validConnections.bottom_middle = false;
                nodesInGraph[b].data.validConnections.left_middle = false;
                nodesInGraph[b].data.validConnections.right_middle = false;
                if( nonValidNodes.includes(nodesInGraph[b].id) ){
                  nodesInGraph[b].data.validConnections.top_middle = false;
                }
              }
            }
            break;
          case 'left_middle':
            nonValidNodes.push(...checkRelationsCorrelating( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            nonValidAfterReduction.push(...reduceNonValidIDsByRowIDs(nonValidNodes, nodesInGraph[a].id))
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                nodesInGraph[b].data.validConnections.top_middle = false;
                nodesInGraph[b].data.validConnections.bottom_middle = false;
                nodesInGraph[b].data.validConnections.left_middle = false;
                if( nonValidAfterReduction.includes(nodesInGraph[b].id) ){
                  nodesInGraph[b].data.validConnections.left_middle = false;
                  nodesInGraph[b].data.validConnections.right_middle = false;
                }
              }
            }
            break;
          case 'right_middle':
            nonValidNodes.push( ...checkRelationsCorrelating( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            nonValidAfterReduction.push( ...reduceNonValidIDsByRowIDs(nonValidNodes) )
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                nodesInGraph[b].data.validConnections.top_middle = false;
                nodesInGraph[b].data.validConnections.bottom_middle = false;
                nodesInGraph[b].data.validConnections.right_middle = false;
                if( nonValidAfterReduction.includes(nodesInGraph[b].id) ){
                  nodesInGraph[b].data.validConnections.left_middle = false;
                  nodesInGraph[b].data.validConnections.right_middle = false;
                }
              }
            }
            break;
          default:
            console.log("Somethings gone wrong")
        }
        break;
      }
    }
  })





  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called at the end of a connection event. Resets the restrictions set by 
   * the oneConnectStart function.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onConnectEnd(() => {
    connectionInProgress = false;
    
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length
    for( let a = 0; a < nodesInGraphLength; a++ ){
      nodesInGraph[a].data.validConnections.top_middle = true;
      nodesInGraph[a].data.validConnections.bottom_middle = true;
      nodesInGraph[a].data.validConnections.left_middle = true;
      nodesInGraph[a].data.validConnections.right_middle = true;
      nodesInGraph[a].data.styles.top_middle = handleStyles[nodesInGraph[a].type].default.top_middle;
      nodesInGraph[a].data.styles.bottom_middle = handleStyles[nodesInGraph[a].type].default.bottom_middle;
      nodesInGraph[a].data.styles.left_middle = handleStyles[nodesInGraph[a].type].default.left_middle;
      nodesInGraph[a].data.styles.right_middle = handleStyles[nodesInGraph[a].type].default.right_middle;
    }
  })





  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called on a pointer-click event on a node. Resets the info card and fills 
   * it with the data of the selected node. Also adjusts the style of the node 
   * and resets that of the previously selected node, if there was on.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: nodeClicked
   * 
   */
  onNodeClick( (params) => {
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].id == params.node.id ) {
        if( selectedNodeID != "" ) {
          changeUnitsListsButtonStyle( selectedNodeID, "notSelected" )
        }
        clearInfoCard()
        fillInfoCard(nodesInGraph[a])
        
        changeUnitsListsButtonStyle( nodesInGraph[a].id, "selected" )
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else {
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      } 
    }
    saveProcessingStep( "nodeClicked" )
  })





  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called on a pointer click event on the pane. Resets the style of the 
   * selected node back to its default appearance.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: paneClicked
   * 
   */
  onPaneClick( () => {
    if( getNodes.value.length != 0 ) {
      const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( nodesInGraph[a].id == selectedNodeID ) {
          clearInfoCard()
          
          const button = document.getElementById(nodesInGraph[a].id)
          button.style = "border: 4px; border-style: double; border-color: #1C2128; background-color: #2a394f;"
          nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
          nodesInGraph[a].data.selected = false;
          break;
        }
      }
      
      saveProcessingStep( "paneClicked" )
    }
  })





  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called after adding/changing a node in the graph. Adds the label of the 
   * newly created node to the unit-search sub-component.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onNodesChange((changes) => {
    if( Object.hasOwn( changes[0], 'item' ) ){
      if( changes[0].type == "add" ){
        unitSearchDopDownMenueContent.value.push(changes[0].item.data.label)
        unitListContent.value.push({ id: changes[0].item.id, label: changes[0].item.data.label });
      }
    } else if( changes[0].type == "remove") {
      const nodesInUnitListLength = unitListContent.value.length
      for( let b = 0; b < nodesInUnitListLength; b++ ){
        if( unitListContent.value[b].id == changes[0].id ){
          if( unitSearchDopDownMenueContent.value.includes(unitListContent.value[b].label) ) {
            let index = unitSearchDopDownMenueContent.value.indexOf(unitListContent.value[b].label);
            unitSearchDopDownMenueContent.value.splice(index, 1);
          }
          unitListContent.value.splice(b, 1)
          break;
        }
      }

      const nodesInGraphLength = getNodes.value.length
      if( nodesInGraphLength == 0 ){
        highestIndexOfDefaultNode.value = '0'
      }
    }
  })
  



  
  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called when the pointer hovers over a node in the graph. While creating a 
   * new relation, updates the style of the node's handels while hovering over 
   * it. The chosen style depends on whether the node is suitable for a the new 
   * relation with the source node's handel, or not.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onNodeMouseEnter((param) => {
    if( connectionInProgress ) {
      const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( param.node.id === nodesInGraph[a].id ) {
          const validStatusTopMiddle = getValidStatus(param.node.data.validConnections.top_middle)
          nodesInGraph[a].data.styles.top_middle = handleStyles[param.node.type][validStatusTopMiddle].top_middle
          
          const validStatusBotomMiddle = getValidStatus(param.node.data.validConnections.bottom_middle)
          nodesInGraph[a].data.styles.bottom_middle = handleStyles[param.node.type][validStatusBotomMiddle].bottom_middle
          
          const validStatusLeftMiddle = getValidStatus(param.node.data.validConnections.left_middle)
          nodesInGraph[a].data.styles.left_middle = handleStyles[param.node.type][validStatusLeftMiddle].left_middle
          
          const validStatusRightMiddle = getValidStatus(param.node.data.validConnections.right_middle)
          nodesInGraph[a].data.styles.right_middle = handleStyles[param.node.type][validStatusRightMiddle].right_middle
          break;
        }
      }
    }
  })





  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called when the pointer stops hovering a node. While creating a new 
   * relation, updates the style of the node over which the mouse pointer was 
   * last hovered.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onNodeMouseLeave((param) => {
    if( connectionInProgress ) {
      const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( param.node.id == nodesInGraph[a].id ) {
          nodesInGraph[a].data.styles.top_middle = handleStyles[param.node.type].default.top_middle;
          nodesInGraph[a].data.styles.bottom_middle = handleStyles[param.node.type].default.bottom_middle;
          nodesInGraph[a].data.styles.left_middle = handleStyles[param.node.type].default.left_middle;
          nodesInGraph[a].data.styles.right_middle = handleStyles[param.node.type].default.right_middle;
          break;
        }
      }
    }
  })



  

  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called when the pointer leaves the pane. Updates the index for the next 
   * node that is created.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ---------->>>> Creates new index for next node to be created <<<<----------
   * 
   */
  onPaneMouseLeave(() => {
    createNewIndexForNextNode()
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
        highestIndexOfDefaultNode.value = highestNumberAsString;
      } else {
        highestIndexOfDefaultNode.value = "0";
      }
    } else {
      highestIndexOfDefaultNode.value = "0"
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

    // node title
    selectedNodeName.value = node.data.label
    // node description
    selectedNodeDescription.value = node.data.description
    // node type
    if( node.type == "deposit" ) {
      selectedNodeType.value = 0;
    } else {
      selectedNodeType.value = 1;
    }
    // node model
    if( enviromentParameter.scene.children.length ){
      const objectsInScene = enviromentParameter.scene.children.slice(1, -1)
      const objectsInSceneLength = objectsInScene.length
      for( let a = 0; a < objectsInSceneLength; a++ ){
        if( objectsInScene[a].userData.nodeID == node.id ){
          selectedNodeModelName.value = objectsInScene[a].name
        }
      }
    }

    // ... and relations of the node.
    for( const relation of node.data.relations ) {
      const targetNode = getNodes.value.find( obj => { return obj.id == relation.id } )
      if( relation.id == targetNode.id ) {
        selectedNodeRelations.value.push( { 
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
    unitSearchInput.value = "";
    infoCardDisabled.value = true
    document.getElementById("infoCard").style.opacity = "0.5";

    // node title
    selectedNodeName.value = "";
    // node description
    selectedNodeDescription.value = "";
    // node type
    selectedNodeType.value = -1;
    // node relations
    selectedNodeRelations.value = [];
    // node model
    selectedNodeModelName.value = ""
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
      allProcessingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
      currentProcessingStep.value = currentProcessingStep.value + 1;
    } else {
      // Wenn der aktuell ausgewählte Bearbeitungsschritt nicht der neuste ist, lösche alle die danach kamen und speicher den neuen und deaktiviere den Vor-Button
      if( currentProcessingStep.value != allProcessingSteps.value.length && !alreadyCut ) {
        alreadyCut = true;
        allProcessingSteps.value = allProcessingSteps.value.slice( 0, currentProcessingStep.value )
        allProcessingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
        currentProcessingStep.value = currentProcessingStep.value + 1
      } 
      // Sonst speicher den neuen Bearbeitungsschritt und zähle den aktuellen Bearbeitungsschritt eins hoch
      else {
        alreadyCut = false
        allProcessingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
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
    unitSearchDopDownMenueContent.value = [];
    unitListContent.value = []

    currentProcessingStep.value = currentProcessingStep.value - 1
    const parsedProcessingStep = JSON.parse( allProcessingSteps.value[currentProcessingStep.value - 1].step )
    
    if( ( currentProcessingStep.value > 1 ) && ( allProcessingSteps.value[ currentProcessingStep.value - 1 ].type == "addNewNode" ) ) {
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

      unitSearchDopDownMenueContent.value.push(node.data.label)
      unitListContent.value.push({ id: node.id, label: node.data.label });
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
    unitSearchDopDownMenueContent.value = [];
    unitListContent.value = [];

    // Vermerke den neuen aktuellen Bearbeitungsschritt
    currentProcessingStep.value = currentProcessingStep.value + 1
    // Lade den aktuell ausgewählten Bearbeitungsstand
    const parsedProcessingStep = JSON.parse( allProcessingSteps.value[currentProcessingStep.value - 1].step )
    
    if( allProcessingSteps.value[ currentProcessingStep.value - 1 ].type == "addNewNode" ) {
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
    if( currentProcessingStep.value == allProcessingSteps.value.length ) {
      processStepForwardButtonDisabled.value = true
    }

    for( const[_, node] of Object.entries(getNodes.value) ) {
      // Ive a node was selected, open the info card and fill it
      if( node.data.selected == true ) {
        fillInfoCard(node)
      }

      // Fill drop down menu of unit search
      unitSearchDopDownMenueContent.value.push(node.data.label)
      unitListContent.value.push({ id: node.id, label: node.data.label });
    }

    createNewIndexForNextNode()
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Adjusts the current viewport so that the specified node is in the center.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param nodeID - 
   */
  function zoomToNode( nodeID ) {
    fitView({
      nodes: [ nodeID ],
      duration: 1000,
      padding: 1
    })
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
  function addNewRelationEntryToNode(type, sourceNodeID, targetNodeID, sourceHandle, targetHandle, relations, relationType, edgeID) {
    switch( type ){
      case 'source':
        relations.push({
          id: targetNodeID,
          relationType: relationType,
          edgeID: edgeID,
          sourceID: sourceNodeID,
          targetID: targetNodeID,
          sourceHandle: sourceHandle,
          targetHandle: targetHandle,
        })
        break;
      case 'target':
        relations.push({
          id: sourceNodeID,
          relationType: relationType,
          edgeID: edgeID,
          sourceID: sourceNodeID,
          targetID: targetNodeID,
          sourceHandle: sourceHandle,
          targetHandle: targetHandle,
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
    const selectedNodeRelations2 = nodesInGraph[ nodesInGraph.map( (x) => {return x.id} ).indexOf( selectedNodeID ) ].data.relations;
    const selectedNodeRelationsLength = selectedNodeRelations2.length;
    const nodesInGraphLength = nodesInGraph.length;
    selectedNodeRelations.value = [];
    
    for( let a = 0; a < selectedNodeRelationsLength; a++ ){
      nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
        if( selectedNodeRelations2[a].id == nodesInGraph[b].id ) {
          
          selectedNodeRelations.value.push({
            id: selectedNodeRelations2[a].edgeID,
            type: selectedNodeRelations2[a].relationType,
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
          // return true;
          return nodeID;
        }
      }
    }
    return 0;
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
        removeNodes(value.id)
        removeObject(value.id)
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
    createDeleteNodeDialog.value = false
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
    selectedNodeRelations.value.forEach( ( relation, idx ) => {
      if( relation.id == edgeID ) {
        selectedNodeRelations.value.splice( idx, 1 );
      }
    } )
    removeEdges( edgeID )
    createDeleteNodeRelationDialog.value = false;
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
          // Update Unit-Search textfield (Graph-Editor)
          if( unitSearchInput.value == node.data.label ) {
            unitSearchInput.value = input
          }
          
          // Update Unit-Search Drop-Down (Graph-Editor)
          const index = unitSearchDopDownMenueContent.value.indexOf(node.data.label);
          unitSearchDopDownMenueContent.value.splice(index, 1);
          unitSearchDopDownMenueContent.value.push(input);

          // Update Unit-list (3D-Editor)
          const nodesInUnitListLength = unitListContent.value.length
          for( let b = 0; b < nodesInUnitListLength; b++ ){
            if( unitListContent.value[b].id == node.id ){
              unitListContent.value[b].label = input;
            }
          }
          
          node.data.label = input
        }
      }
      
      saveProcessingStep( "updateTitle" )
    }
  }
  

  

  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Updates the description of a node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: updateDescription
   * 
   * @param {} input - 
   */
  function updateDescription( input ) {
    if( getNodes.value.length != 0 ) {
      for( const[_, value] of Object.entries(getNodes.value) ) {
        if( value.data.selected ) {
          value.data.description = input
        }
      }
      
      saveProcessingStep( "updateDescription" )
    }
  }

  

  
  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Updates the type of a node.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: updateType
   * 
   * @param {} newType - 
   */
  function updateType( newType ) {
    if( getNodes.value.length != 0 ) {
      for( const[_, node] of Object.entries(getNodes.value) ) {
        if( node.id == selectedNodeID ) {
          node.type = newType
          node.data.nodeStyle = "clicked_" + newType
        }
      }
      
      saveProcessingStep( "updateType" )
    }
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * TODO
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function getHelp() {
    // TODO
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
    if( currentMode.value == "3d" ){
      currentMode.value = "graph";
    } else if( currentMode.value == "graph" ){
      currentMode.value = "3d";
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
          .toPng(document.getElementById('canvas_graph'))
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageFileName.value + '.png';
            link.href = dataUrl;
            link.click();
          });
        break;
      case 'jpeg':
        img
          .toJpeg(document.getElementById('canvas_graph'), { quality: 1 })
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = imageFileName.value + '.jpeg';
            link.href = dataUrl;
            link.click();
          });
        break;
      case 'svg':
        img
          .toSvg(document.getElementById('canvas_graph'), { filter: filter })
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
    const index = graphModuleNames.value.indexOf( graphAktiveModuleName.value );
    if( index == 0 ) {
      graphAktiveModuleName.value = graphModuleNames.value[graphModuleNames.value.length - 1]
    } else {
      graphAktiveModuleName.value = graphModuleNames.value[index - 1]
    }
  }
  


  

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Switch to a module further to the right.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeModuelRight() {
    const index = graphModuleNames.value.indexOf( graphAktiveModuleName.value );
    if( index == (graphModuleNames.value.length - 1) ) {
      graphAktiveModuleName.value = graphModuleNames.value[0]
    } else {
      graphAktiveModuleName.value = graphModuleNames.value[index + 1]
    }
  }




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Manually save the graph.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function saveAll() {
    enviromentParameter.renderer.setAnimationLoop(null);
    if( idOfCurrentStratiTool != "" ) {
      const parsedModels = parseModelData( allModelsInGraph.value )
      const sceneJSON = convertSceneToJson()
      const savedCamera = convertCameraToJson()
      await fromOfflineDB.updateIndexedDBObject({ _id: idOfCurrentStratiTool, graph: {allProcessingSteps: JSON.parse(JSON.stringify(allProcessingSteps.value)), currentProcessingStep: currentProcessingStep.value}, threeD: {allModels: parsedModels, scene: sceneJSON, camera: savedCamera}}, "StratiToolDB", "stratiTool" );
    } else {
      const newID = String( Date.now() )
      idOfCurrentStratiTool = newID;
      const parsedModels = parseModelData( allModelsInGraph.value )
      const sceneJSON = convertSceneToJson()
      const savedCamera = convertCameraToJson()
      await fromOfflineDB.addObject( {_id: newID, graph: {allProcessingSteps: JSON.parse(JSON.stringify(allProcessingSteps.value)), currentProcessingStep: currentProcessingStep.value}, threeD: {allModels: parsedModels, scene: sceneJSON, camera: savedCamera}}, "StratiToolDB", "stratiTool" );
    }
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Parses the data of all models that are in the graph in order to be able to 
   * transfer them to the IndexedDB.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param {array<Object>} allModels
   * @returns {array<Object>} Parsed input array 
   */
  function parseModelData(allModels) {
    const separateModelData = []
    const allModelsLength = allModels.length
    for( let a = 0; a < allModelsLength; a++ ){
      separateModelData.push( allModels[a].model )
    }
    const parsedModels = JSON.parse(JSON.stringify(allModels))
    for( let a = 0; a < allModelsLength; a++ ){
      parsedModels[a].model = separateModelData[a]
    }
    return parsedModels
  }




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Converts a boolean to the contextual equivalent string.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** 
   * 
   * @param {} connection -
   * @returns {string} The contextual equivalent string.
   */
  function getValidStatus(connection) { 
    if( connection ){
      return 'isValid'
    }
    return 'isNotValid'
  }

  


  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function fillInfoCard3d(nodeID) {
    const nodesInGraph = getNodes.value
    const nodesInGraphLength = nodesInGraph.length
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].id == nodeID && !nodesInGraph[a].data.selected ){
        if( selectedNodeID != "" ) {
          changeUnitsListsButtonStyle( selectedNodeID, 'notSelected' )
        }
        clearInfoCard()
        fillInfoCard(nodesInGraph[a])
        
        changeUnitsListsButtonStyle( nodesInGraph[a].id, 'selected' )
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else if( nodesInGraph[a].id == nodeID && nodesInGraph[a].data.selected ) {
        changeUnitsListsButtonStyle( nodesInGraph[a].id, 'notSelected' )
        clearInfoCard()
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      } else {
        changeUnitsListsButtonStyle( nodesInGraph[a].id, 'notSelected' )
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      }
    }
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeUnitsListsButtonStyle(buttonID, mode) {
    if( mode === 'selected' ) {
      const button = document.getElementById(buttonID)
      button.style = "border: 4px; border-style: double; border-color: #1C2128; background-color: #485b7a;"
    } else if( mode === 'notSelected' ){
      const button = document.getElementById(buttonID)
      button.style = "border: 4px; border-style: double; border-color: #1C2128; background-color: #2a394f;"
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function modelToArrayBuffer(rawData) {
    const output = await new Promise((resolve) => {
      let reader = new FileReader();
      let f = rawData;

      reader.onload = e => {
        const modelString = e.target.result
        resolve(modelString)
      }

      reader.readAsArrayBuffer(f);
    });
    return output;
  }



  

  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function addObject() {
    // new model data
    const newObject = {
      _id: String(Date.now()),
      title: selectedNodeNewModelName.value,
      model: await modelToArrayBuffer(toRaw(selectedNodeNewModel.value)),
      color: '#ffffff',
      opacity: 1,
      coordinates: null,
      scale: null,
      rotation: null,
      loaderType: selectedNodeNewModel.value.name.split('.')[1],
      nodeID: selectedNodeID,
    }
    
    allModelsInGraph.value.push(newObject);
    selectedNodeModelName.value = newObject.title;
    createAddModelDialog.value = false;
    
    await addObjectToScene(newObject)
    addObjectIdToNode(newObject._id)
    reCenterControlsAndCamera()
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function addObjectToScene(object) {
    const loadedObject = await objLoader(object, selectedNodeNewModelName.value);
    const gismo = enviromentParameter.scene.children.pop();
    enviromentParameter.scene.add(loadedObject);
    enviromentParameter.scene.add(gismo);
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function addObjectIdToNode(objectID) {
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].id == selectedNodeID ){
        nodesInGraph[a].data.objectID = objectID;
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function changeVisibility(elementID, status) {
    const element = document.getElementById(elementID)
    if( status == "visible" ){
      element.classList.remove("notVisible")
      element.classList.add(status)
    } else if( status == "notVisible" ){
      element.classList.remove("visible")
      element.classList.add(status)
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function deleteObject() {
    removeObject(selectedNodeID)

    // remove objectID from node
    const nodesInGraph = getNodes.value
    const nodesInGraphLength = nodesInGraph.length
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].id == selectedNodeID ){
        nodesInGraph[a].data.objectID = ""
      }
    }

    // remove object name from infoCard
    selectedNodeModelName.value = ""

    // hide model creation dialog
    createDeleteModelDialog.value = false;
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function switchObject() {
    deleteObject()
    addObject()

    createSwitchObjektDiablog.value = false
  }




  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function removeObject(nodeID) {
    const objectsInScene = enviromentParameter.scene.children.slice(1, -1)
    
    const objectsInSceneLength = objectsInScene.length
    for( let a = 0; a < objectsInSceneLength; a++ ){
      if( objectsInScene[a].userData.nodeID == nodeID ){
        enviromentParameter.scene.remove(objectsInScene[a])
      }
    }

    reCenterControlsAndCamera()
  }

  
  

  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function getDataFromIndexedDB() {
    if( getData.length > 0 ){
      idOfCurrentStratiTool = getData[0]._id;
      allProcessingSteps.value = getData[0].graph.allProcessingSteps;
      currentProcessingStep.value = getData[0].graph.currentProcessingStep;
      allModelsInGraph.value = getData[0].threeD.allModels;
      enviromentParameter.scene = getData[0].threeD.scene;
      enviromentParameter.savedCamera = getData[0].threeD.camera;
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function initEnviroment() {
    
    let cameraPosition;
    let cameraRotation;

    createRenderer()
    
    if( enviromentParameter.scene == null ) {
      createCamera()
      createScene()
      createIllumination()
      createControls()
      reCenterControls()
    } else {
      await loadCamera()
      await loadScene()
      cameraPosition = [ enviromentParameter.camera.position.x, enviromentParameter.camera.position.y, enviromentParameter.camera.position.z ]
      cameraRotation = [ enviromentParameter.camera.rotation.x, enviromentParameter.camera.rotation.y, enviromentParameter.camera.rotation.z ]
      enviromentParameter.scene.children.pop();
      createControls()
      reCenterControls()
      enviromentParameter.camera.position.set( cameraPosition[ 0 ], cameraPosition[ 1 ], cameraPosition[ 2 ] );
      enviromentParameter.camera.rotation.set( cameraRotation[ 0 ], cameraRotation[ 1 ], cameraRotation[ 2 ]);
    }

    // enviromentParameter.renderer.setAnimationLoop(animate);
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createRenderer() {
    const canvas3D = document.getElementById("canvas_3d");
    
    enviromentParameter.renderer = new THREE.WebGLRenderer({
      canvas: canvas3D,
      antialias: true
    });
    enviromentParameter.renderer.setPixelRatio( canvas3D.devicePixelratio );
    enviromentParameter.renderer.setClearColor( 0x28303d, 1);
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createCamera() {
    const canvas3D = document.getElementById("canvas_3d");
    enviromentParameter.camera = new THREE.PerspectiveCamera( 45, canvas3D.clientWidth / canvas3D.clientHeight, 0.01, 2000 );
    enviromentParameter.camera.position.z = 10;
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createScene() {
    enviromentParameter.scene = new THREE.Scene();
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createIllumination() {
    enviromentParameter.light = new THREE.AmbientLight( 0xd9d9d9 );
    enviromentParameter.scene.add(enviromentParameter.light);
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createControls() {
    enviromentParameter.controls = new ArcballControls( enviromentParameter.camera, enviromentParameter.renderer.domElement, enviromentParameter.scene );
    enviromentParameter.controls.addEventListener( 'change', function() {
      enviromentParameter.renderer.render( enviromentParameter.scene, enviromentParameter.camera );
    } )
    enviromentParameter.controls.enablePan = false;
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function loadCamera() {
    enviromentParameter.camera = await jsonLoader(enviromentParameter.savedCamera)
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function loadScene() {
    enviromentParameter.scene = await jsonLoader(enviromentParameter.scene)
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function convertSceneToJson() {
    enviromentParameter.scene.updateMatrixWorld()
    const sceneJSON = enviromentParameter.scene.toJSON()
    return sceneJSON
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function convertCameraToJson() {
    const cameraAsJSON = enviromentParameter.camera.toJSON()
    return cameraAsJSON
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function reCenterControls() {
    const objectsInScene = enviromentParameter.scene.children.slice(1, -1)
    if( objectsInScene.length ){
      const barycenter = getBarycenter(objectsInScene)
      
      enviromentParameter.controls.target.set(barycenter.x, barycenter.y, barycenter.z)
      enviromentParameter.controls.update()
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function reCenterControlsAndCamera() {
    const objectsInScene = enviromentParameter.scene.children.slice(1, -1)
    if( objectsInScene.length ){
      const barycenter = getBarycenter(objectsInScene)
      
      enviromentParameter.controls.target.set(barycenter.x, barycenter.y, barycenter.z)
      enviromentParameter.camera.position.set(barycenter.x, barycenter.y - 15, barycenter.z);
      enviromentParameter.controls.update()
    }
  }





  
  /**
   * Gets the barycenter of an object/group of objects.
   * @param {*} objects 
   * @returns Vector3
   */
  function getBarycenter( arrayOfObjects ) {
    
    const groupCenter = new THREE.Vector3()

    const howManyObjects = arrayOfObjects.length
    for( let a = 0; a < howManyObjects; a++ ){
      const howManyChildren = arrayOfObjects[a].children.length
      for( let b = 0; b < howManyChildren; b++ ){
        
        const boundingBox = new THREE.Box3();
        boundingBox.setFromObject( arrayOfObjects[a].children[b] );
        const center = new THREE.Vector3();
        boundingBox.getCenter( center );
      
        groupCenter.x += center.x
        groupCenter.y += center.y
        groupCenter.z += center.z
      }
    }

    groupCenter.x = groupCenter.x / howManyObjects
    groupCenter.y = groupCenter.y / howManyObjects
    groupCenter.z = groupCenter.z / howManyObjects

    return groupCenter
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function animate() {
    enviromentParameter.renderer.render( enviromentParameter.scene, enviromentParameter.camera );
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function objLoader(objectData) {
    const loader = new GLTFLoader();
    const object = await new Promise((resolve) => {
      loader.parse(objectData.model, '', (glb) => {
        resolve( glb.scene );
      });
    });
    const newObject = traverseForName(object, "", objectData.title, objectData._id, objectData.nodeID)
    return newObject;
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function traverseForName(object, idxDepth, name, id, nodeID) {
    let count = 0;
    
    const adjustedObject = object
    adjustedObject.name = name + idxDepth;
    adjustedObject.userData.id = id;
    adjustedObject.userData.nodeID = nodeID;

    const length = adjustedObject.children.length;
    if( length > 0 ){
      for( let a = 0; a < length; a++ ){
        const newIdxDepth = "_" + count;
        adjustedObject.children[a] = traverseForName(adjustedObject.children[a], newIdxDepth, adjustedObject.name, id, nodeID)
        count++
      }
    }
    
    return adjustedObject
  }




  
  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function jsonLoader(objectAsJSON) {
    const loader = new THREE.ObjectLoader()
    const object = loader.parse(objectAsJSON)
    return object
  }

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function cleanUp() {
    const nodesInGraph = getNodes.value
    const nodesInGraphLength = nodesInGraph.length
    if( nodesInGraphLength > 0 ){
      rearangeNodesInGraph( [nodesInGraph[0].id], [{node: nodesInGraph[0], relations: nodesInGraph[0].data.relations}], [] )
    }
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param nodesInGraph 
   * @param nodesInGraphLength 
   * @param node 
   * @param relations 
   */
  function createAfterBatch(nodesInGraph, nodesInGraphLength, node, relations) {
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( relations.id == nodesInGraph[a].id ){
        let newX = node.position.x
        let newY = node.position.y - 200
        nodesInGraph[a].position.x = adjustPositionIfAlreadyOccupied(nodesInGraph[a].id, nodesInGraph, nodesInGraphLength, newX, newY);
        nodesInGraph[a].position.y = newY;
        return {node: nodesInGraph[a], relations: nodesInGraph[a].data.relations}
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createBeforeBatch(nodesInGraph, nodesInGraphLength, node, relations) {
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( relations.id == nodesInGraph[a].id ){
        let newX = node.position.x;
        let newY = node.position.y + 200;
        nodesInGraph[a].position.x = adjustPositionIfAlreadyOccupied(nodesInGraph[a].id, nodesInGraph, nodesInGraphLength, newX, newY);
        nodesInGraph[a].position.y = newY;
        return {node: nodesInGraph[a], relations: nodesInGraph[a].data.relations};
      }
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function getNewXPosition(id, nodesInGraph, nodesInGraphLength, newX, newY) {
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( (nodesInGraph[a].position.x == newX && nodesInGraph[a].position.y == newY) && nodesInGraph[a].id != id ){
        return false;
      }
    }
    return true
  }
  




  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param id 
   * @param nodesInGraph 
   * @param nodesInGraphLength 
   * @param newX 
   * @param newY 
   */
  function adjustPositionIfAlreadyOccupied(id, nodesInGraph, nodesInGraphLength, newX, newY) {
    let done = false;
    let xPosition = newX;
    while( !done ){
      done = getNewXPosition(id, nodesInGraph, nodesInGraphLength, xPosition, newY)
      if( !done ){
        xPosition += 200;
      }
    }
    return xPosition;
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * @param alreadyRearangedNodeIDs 
   * @param batchToBeRearanged 
   */
  function rearangeNodesInGraph( alreadyRearangedNodeIDs, batchToBeRearanged ) {
    let nextBatch = [];
    let rearangedNodes = alreadyRearangedNodeIDs;

    const currentBatch = batchToBeRearanged;
    const currentBatchLength = currentBatch.length;
    for( let a = 0; a < currentBatchLength; a++ ){
      const node = currentBatch[a].node;
      const relations = currentBatch[a].relations;
      const relationsLength = relations.length;
      if( relationsLength > 0 ){
        
        const nodesInGraph = getNodes.value
        const nodesInGraphLength = nodesInGraph.length
        
        for( let b = 0; b < relationsLength; b++ ){
          if( (relations[b].relationType == 'after') && (relations[b].id != rearangedNodes[0]) && !rearangedNodes.includes(relations[b].id) ){
            const newAfterBatch = createAfterBatch(nodesInGraph, nodesInGraphLength, node, relations[b]);
            nextBatch.push(newAfterBatch);
            rearangedNodes.push(relations[b].id);
          }
          else if( (relations[b].relationType == 'before') && (relations[b].id != rearangedNodes[0]) && !rearangedNodes.includes(relations[b].id)){
            const newBeforeBatch = createBeforeBatch(nodesInGraph, nodesInGraphLength, node, relations[b])
            nextBatch.push(newBeforeBatch);
            rearangedNodes.push(relations[b].id);
          }
          else if( (relations[b].relationType == 'korrelation') && (relations[b].id != rearangedNodes[0]) && !rearangedNodes.includes(relations[b].id) ){
            node: for( let c = 0; c < nodesInGraphLength; c++ ){
              if( relations[b].id == nodesInGraph[c].id && !rearangedNodes.includes(relations[b].id)){
                if( (relations[b].id == relations[b].sourceID && relations[b].sourceHandle == "right_middle") || (relations[b].id == relations[b].targetID && relations[b].targetHandle == "right_middle") ){
                  nodesInGraph[c].position.x = node.position.x - 200
                  nodesInGraph[c].position.y = node.position.y
                  if( !rearangedNodes.includes(relations[b].id) ){
                    nextBatch.push({node: nodesInGraph[c], relations: nodesInGraph[c].data.relations})
                  }
                  break node;
                }
                if( (relations[b].id == relations[b].sourceID && relations[b].sourceHandle == "left_middle") || (relations[b].id == relations[b].targetID && relations[b].targetHandle == "left_middle") ){
                  nodesInGraph[c].position.x = node.position.x + 200
                  nodesInGraph[c].position.y = node.position.y
                  if( !rearangedNodes.includes(relations[b].id) ){
                    nextBatch.push({node: nodesInGraph[c], relations: nodesInGraph[c].data.relations})
                  }
                  break node;
                }
              }
            }
            rearangedNodes.push(relations[b].id);
          }
        }
        rearangeNodesInGraph(rearangedNodes, nextBatch)
      }
    }
  }

  async function importData(){

    let parsedData = []

    const output = await new Promise((resolve) => {
      let reader = new FileReader();
      let f = toRaw(dataToBeImported.value);

      reader.onload = e => {
        const newString = e.target.result
        resolve(newString)
      }

      reader.readAsText(f);
    });
    
    let cutString = output.split('|')
    for( let a = 0; a < cutString.length; a++ ){
      parsedData.push(JSON.parse(cutString[a]))
    }

    idOfCurrentStratiTool = parsedData[0];
    allProcessingSteps.value = parsedData[1];
    currentProcessingStep.value = parsedData[2];
    enviromentParameter.scene = parsedData[3];
    enviromentParameter.savedCamera = parsedData[4];

    clearInfoCard()
    await initEnviroment()
    initGraph()
    
  }

  function exportData() {

    saveAll()

    const idAsJson = JSON.stringify(idOfCurrentStratiTool)
    
    const allProcessingStepsAsJson = JSON.stringify(allProcessingSteps.value);
    const currentProcessingStepAsJson = JSON.stringify(currentProcessingStep.value);

    const sceneAsJson = JSON.stringify(convertSceneToJson())
    const cameraAsJson = JSON.stringify(convertCameraToJson())

    const wholeJsonString = idAsJson + "|" + allProcessingStepsAsJson + "|" + currentProcessingStepAsJson + "|" + sceneAsJson + "|" + cameraAsJson

    const filename = "harris_matrix_export"

    var blob = new Blob([wholeJsonString], { type: "application/json" });
    saveAs(blob, filename + ".json");
  }


  /**                              Vue-Livecycle
   * /:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::\
   * Equivalent semantic to mounted in <script>.
   * \:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::/
   * 
   */
  onMounted(async () => {
    
    await getDataFromIndexedDB();
    initEnviroment()
    
  })

  /**                               Vue-Livecycle
   * /:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::\
   * Equivalent semantic to unmounted in <script>.
   * \:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::/
   * 
   */
  onUnmounted(async() => {
    saveAll()
    
  })
</script>

<script>
export default {
  name: 'StratiTool',
}
</script>

<style>
@import '@vue-flow/core/dist/style.css';
@import '../components/graph-editor-components/style.css';

/**
 *
 * > > > > > > Universal < < < < < <
 *
 */

.background {
  background-color: #171C23;
}

.hollow {
  border: 4px;
  border-style: ridge;
  border-color: #171C23;
  background-color: #171C23;
}

.tile {
  border: 4px;
  border-style: ridge;
  border-color: #171C23;
  background-color: #303d52
}

.button {
  border: 5px;
  border-style: double;
  border-color: #1C2128;
  text-align: center;
  line-height: 0px;
  background-color: #485b7a;
}

.plato {
  border: 4px;
  border-style: ridge;
  border-color: #171C23;
  background-color: #28303d;
}

.visible {
  position: absolute;
  z-index: 1; 
  opacity: 1;
}

.notVisible {
  position: absolute;
  z-index: 0; 
  opacity: 0;
}

/**
 *
 * > > > > > > Units < < < < < <
 *
 */

/**
 * < < < 3D-Editor > > >
 */

.units__3d_base {
  border: 2px;
  border-style: outset;
  border-color: #171C23;
  background-color: #303d52
}

.units__3d_list_button_notClicked {
  border: 4px;
  border-style: double;
  border-color: #1C2128;
  background-color: #2a394f;
}

.units__3d_list_button_clicked {
  border: 4px;
  border-style: double;
  border-color: #1C2128;
  background-color: #485b7a;
}
 
/**
 * < < < Graph-Editor > > >
 */

.units__graph_base {
  border: 2px;
  border-style: outset;
  border-color: #171C23;
  background-color: #303d52
}

/**
 *
 * > > > > > > Module < < < < < <
 *
 */

.screenshot_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.group_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.view_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.exp-imp_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.filter_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.timemodel_module__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}
 
/**
 *
 * > > > > > > Infobereich < < < < < <
 *
 */

.infobereich__base {
  border: 4px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #2a4375;
  opacity: 0.5;
}

.infobereich__title {
  text-align: center;
  line-height: 37px;
}

.infobreich__attributes {
  background-color: #485c7b;
}

.infobereich__attributes_list {
  border: 6px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #677893;
}

.infobereich__image_outside {
  border: 6px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #677893;
}

.infobereich__image_inside {
  border: 3px; 
  border-style: ridge;
  border-radius: 2%;
  border-color: #0d2953;
  text-align: center;
  background-color: #779fe1
}

.infobereich__attributes_name {
  border: 5px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_name_title {
  background-color: #3c557d;
}

.infobereich__attributes_name_text-field {
  border: 1px; 
  border-style: solid; 
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_name_button {
  border: 4px;
  border-style: double;
  border-color: #1C2128;
  background-color: #485b7a;
}

.infobereich__attributes_type {
  border: 5px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_type_title {
  background-color: #3c557d;
}

.infobereich__attributes_type_title_button {
  border: 4px;
  border-style: double;
  border-color: #1C2128;
  background-color: #485b7a;
}

.infobereich__attributes_description {
  border: 5px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_description_title {
  background-color: #3c557d;
}

.infobereich__attributes_description_textarea {
  border: 1px;
  border-style: solid;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_description_button {
  border: 4px;
  border-style: double;
  border-color: #1C2128;
  background-color: #485b7a;
}

.infobereich__attributes_relations {
  border: 5px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_relations_title {
  background-color: #3c557d;
}

.infobereich__attributes_relations_list {
  border: 2px;
  border-style: ridge;
  border-radius: 1%;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_relations_list_item {
  border: 2px;
  border-style: solid;
  border-radius: 1%;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_relations_list_button {
  border: 2px;
  border-style: double;
  border-color: #1C2128;
  background-color: #af1313;
}

.infobereich__attributes_groups {
  border: 5px;
  border-style: ridge;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_groups_title {
  background-color: #3c557d;
}

.infobereich__attributes_groups_list {
  border: 2px;
  border-style: ridge;
  border-radius: 1%;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_groups_list_item {
  border: 2px;
  border-style: solid;
  border-radius: 1%;
  border-color: #0d2953;
  background-color: #3c557d;
}

.infobereich__attributes_groups_list_button {
  border: 2px;
  border-style: double;
  border-color: #1C2128;
  background-color: #3c557d;
}

.infobereich__delete_unit_button {
  border: 4px;
  border-style: solid;
  border-color: #1C2128;
  background-color:#af1313;
}

</style>