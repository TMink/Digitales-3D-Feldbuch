<!--
 Created Date: 23.09.2024 10:14:23
 Author: Tobias Mink
 
 Last Modified: 06.01.2025 01:18:31
 Modified By: Tobias Mink
 
 Description: 
 --> This system is being implemented as part of a master's thesis and enables 4D analysis and visualization of the stratigraphy of an excavation

 <template>
  <div id="wrapper">
    <Navigation active_tab_prop="2" />
    <v-card class="pa-1 background">
      <v-row no-gutters style="width:fit-content;">
        
        <!-- > > > > > > ---- < < < < < < -->
        <!-- > > > > > > Left < < < < < < -->
        <!-- > > > > > > ---- < < < < < < -->
        <div>

          <!-- Hilfe -->
          <v-row no-gutters style="width: fit-content">
            <v-card class="pa-1 tile" height="100" width="400">
              <v-btn class="pa-7 px-14 help__button" height="100%" width="100%" @click="createHelpDialog = true" variant="text" elevation="24">
                Hilfe
              </v-btn>
              <v-dialog v-model="createHelpDialog" persistent >
                <v-card :height="windowHeight" class="tile">
                  
                  <!-- Pages navigation -->
                  <v-row no-gutters style="max-height: 6%;">
                    <!-- Hilfe Überschrift -->
                    <v-col cols="11">
                      <v-card class="help__start_base d-flex align-center justify-center" height="100%">
                        <v-card-Title>Wählen sie eine Komponente aus, über die Sie mehr erfahren möchten</v-card-Title>
                      </v-card>
                    </v-col>
                    
                    <!-- Verlassen-button -->
                    <v-col cols="1">
                      <v-card class="pa-2 help__start_base d-flex justify-center" height="100%">
                        <v-btn class="help__button" height="100%" width="100%" @click="createHelpDialog = false">
                          <v-icon size="x-large">mdi-alpha-x-circle</v-icon>
                        </v-btn>
                      </v-card>
                    </v-col>
                  </v-row>
                  
                  <!-- Pages -->
                  <v-row no-gutters style="max-width: 100%;">
                    
                    <!-- Start Page -->
                    <v-card id="helpOverview" class="help__start_base d-flex align-center justify-center help_element__visible" :height="windowHeight - 131" width="100%">
                      <v-card rounded="0" height="90%" width="90%">
                        
                        <!-- Header -->
                        <v-card rounded="0" class="d-flex align-center justify-center text-h5 help__navigation_header" height="6%" width="100%">
                          Header
                        </v-card>
                        
                        <!-- Components -->
                        <v-row no-gutters style="height: 88%">
                          <v-col cols="3">
                            <v-card class="d-flex align-center justify-center help__navigation_hilfe" rounded="0" height="10%" width="100%">
                              <v-card-title class="text-h5">
                                Hilfe
                              </v-card-title>
                            </v-card>
                            <v-btn class="text-h5 help__navigation_module" rounded="0" height=90% width="100%" @click="changeHelpPageComponent('module')">
                              Module
                            </v-btn>
                          </v-col>
                          <v-col>
                            <v-btn class="text-h5 help__navigation_system_tools" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('systemTools')">
                              System-Tools
                            </v-btn>
                            <v-btn class="text-h5 help__navigation_graph-3d_tools" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('graph3dTools')">
                              Graph/3D-Tools
                            </v-btn>
                            <v-btn class="text-h5 help__navigation_graph-3d_editor" rounded="0" height="80%" width="100%" @click="changeHelpPageComponent('graph3dEditor')">
                              Graph/3D-Editor
                            </v-btn>
                          </v-col>
                          <v-col cols="3">
                            <v-btn class="text-h5 help__navigation_glossar" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('glossar')">
                              Glossar
                            </v-btn>
                            <v-btn class="text-h5 help__navigation_editor_wechseln" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('changeEditor')">
                              Editor wechseln
                            </v-btn>
                            <v-btn class="text-h5 help__navigation_infobereich" rounded="0" height="80%" width="100%" @click="changeHelpPageComponent('infoCard')">
                              Infobereich
                            </v-btn>
                          </v-col>
                        </v-row>
                        
                        <!-- Footer -->
                        <v-card rounded="0" class="d-flex align-center justify-center text-h5 help__navigation_footer" height="6%" width="100%">
                          Footer
                        </v-card>
                        
                      </v-card>
                    </v-card>

                    <!-- Detail Ansicht -->
                    <v-card id="helpDetailView" class="pa-3 help__start_base help_element__notVisible" :height="windowHeight - 131" width="100%">
                      <v-card class="d-flex" height="100%" rounded="0">
                        <v-row no-gutters style="height: 100%">
                          <v-col cols="3">
                            
                            <!-- Komponente -->
                            <v-row no-gutters style="height: 55%">
                              <v-card class="d-flex align-center justify-center" variant="text" rounded="0" height="100%" width="100%">
                                <v-card class="tile" height="100%" width="100%" variant="text">
                                  
                                  <!-- Komponente Header -->
                                  <v-card-title class="d-flex align-center justify-center">
                                    Komponente
                                  </v-card-title>

                                  <!-- Komponente: Module -->
                                  <v-card id="helpComponentModule" class="d-flex align-center justify-center help_element__notVisible" height="91%" width="100%" variant="text">
                                    <v-card class="pa-1 hollow" height="100%" width="50%">
                                      <v-card class="pa-2 tile d-flex align-center justify-center" height="12%">
                                        <v-row no-gutters>
                                          <v-col cols="3" class="d-flex align-center justify-center">
                                            <v-btn variant="text" width="50%" height="100%" icon="mdi-arrow-left-bold"></v-btn>
                                          </v-col>
                                          <v-col cols="6">
                                            <v-card-title width="100%" height="100%" class="d-flex align-center justify-center">{{ aktiveHelpPageSubcomponentName  }}</v-card-title>
                                          </v-col>
                                          <v-col cols="3" class="d-flex align-center justify-center">
                                            <v-btn variant="text" width="50%" height="100%" icon="mdi-arrow-right-bold" ></v-btn>
                                          </v-col>
                                        </v-row>
                                      </v-card>
                                      <v-card class="hollow" height="88%" width="100%">
                                        
                                        <!-- Screenshot-Modul -->
                                        <v-card id="helpSubcomponentModulesScreenshotContainer" class="help_element__visible" height="100%" width="100%" variant="text">
                                          <v-card id="helpScreenshot" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="screenshot_module__base" height="100%" width="100%" variant="text">
                                              <!-- Image name -->
                                              <v-text>Dateiname:</v-text>
                                              <v-text-field hide-details class="pa-1 mb-5" v-model="imageFileName"></v-text-field>
                                                
                                              <!-- Image format -->
                                              <v-text>Dateinformat:</v-text>
                                              <v-row no-gutters style="height: 50px;">
                                                <v-col class="px-1">
                                                  <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%">
                                                    PNG
                                                  </v-btn>
                                                </v-col>
                                                <v-col class="px-1">
                                                  <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%">
                                                    JPEG
                                                  </v-btn>
                                                </v-col>
                                                <v-col class="px-1">
                                                  <v-btn class="infobereich__attributes_type_title_button" width="100%" height="100%">
                                                    SVG
                                                  </v-btn>
                                                </v-col>
                                              </v-row>
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                        
                                        <!-- Group-Modul -->
                                        <v-card id="helpSubcomponentModulesGroupContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                          <v-card id="helpGroup" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="group_module__base d-flex align-center justify-center" height="100%" width="271" variant="text">
                                              <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="490">
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                      
                                        <!-- View-Modul -->
                                        <v-card id="helpSubcomponentModulesViewContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                          <v-card id="helpView" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="view_module__base d-flex align-center justify-center" height="100%" width="271" variant="text">
                                              <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="490">
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                      
                                        <!-- Exp/Imp-Modul -->
                                        <v-card id="helpSubcomponentModulesExpImpContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                          <v-card id="helpExpImp" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="pa-2 exp-imp_module__base" height="100%" width="271" variant="text">
                                              <v-row no-gutters>
                                                
                                                <!-- Export -->
                                                <v-card class="pa-2" height="223" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                                                  <v-card-title class="d-flex align-center justify-center pa-0 pb-2">
                                                    Export
                                                  </v-card-title>
                                                  <v-btn class="infobereich__attributes_type_title_button" width="100%" height="50">
                                                    Press Me
                                                  </v-btn>
                                                </v-card>
                                                
                                              </v-row>
                                              <v-row no-gutters>
                                                
                                                <!-- Import -->
                                                <v-card class="pa-2" height="223" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                                                  <v-card-title class="d-flex align-center justify-center pa-0 pb-2">
                                                    Import
                                                  </v-card-title>
                                                  <v-btn class="infobereich__attributes_type_title_button" width="100%" height="50">
                                                    Press Me
                                                  </v-btn>
                                                </v-card>
                                                
                                              </v-row>
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                      
                                        <!-- Filter -->
                                        <v-card id="helpSubcomponentModulesFilterContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                          <v-card id="helpFilter" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="filter_module__base d-flex align-center justify-center" height="100%" width="271" variant="text">
                                              <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="490">
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                        
                                        <!-- Timemodel -->
                                        <v-card id="helpSubcomponentModulesTimemodelContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                          <v-card id="helpTimemodel" class="help_subcomponend__notFocus" height="100%" width="100%" variant="text">
                                            <v-card class="timemodel_module__base d-flex align-center justify-center" height="100%" width="272" variant="text">
                                              <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="490">
                                            </v-card>
                                          </v-card>
                                        </v-card>
                                          
                                      </v-card>
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: System-Tools -->
                                  <v-card id="helpComponentHarrisMatrixTools" height="92.2%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card class="tile" height="106px" width="100%" variant="text">
                                      <v-card id="helpSubcomponentHarrisMatrixToolsContainer" class="help_element__visible" height="100%" width="100%" variant="text">
                                        <v-row no-gutters>

                                          <!-- Harris-Matrix speichern -->
                                          <v-col cols="6">
                                            <v-card id="helpSaveGraph" class="help_subcomponend__notFocus" height="100%" variant="text">
                                              <v-card class="px-5 py-0 units__graph_base" variant="text">
                                                <v-col class="pa-0" align="center">
                                                
                                                  <!-- Subcomponent title -->
                                                  <v-card class="pt-1" variant="text">
                                                    <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                      Bearbeitungsstand Speichern
                                                    </v-card-title>
                                                  </v-card>
                                                  
                                                  <!-- Save -->
                                                  <v-card class="pt-1 my-3" height="fit-content" variant="text">
                                                    <v-btn width="100%">
                                                      Speichern
                                                    </v-btn>
                                                  </v-card>
                                                </v-col>
                                              </v-card>
                                            </v-card>
                                          </v-col>

                                          <!-- Arbeitsschritte wechseln -->
                                          <v-col cols="6">
                                            <v-card id="helpChangeProcessingStep" class="help_subcomponend__notFocus" height="100%" variant="text">
                                              <v-card class="units__graph_base" variant="text">
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
                                                      <v-col cols="2">
                                                        <v-card variant="text">
                                                          <v-card-text class="pa-0" style="text-align: center; line-height: 100%;">
                                                            zurück
                                                          </v-card-text>
                                                        </v-card>
                                                        <v-btn :disabled="true" variant="text" width="25%" height="40%" icon="mdi-arrow-u-left-top"></v-btn>
                                                      </v-col>
                                                        
                                                      <!-- Forward -->
                                                      <v-col cols="2">
                                                        <v-card variant="text">
                                                          <v-card-text class="pa-0" style="text-align: center; line-height: 100%;">
                                                            vor
                                                          </v-card-text>
                                                        </v-card>
                                                        <v-btn :disabled="true" variant="text" width="25%" height="40%" icon="mdi-arrow-u-right-top"></v-btn>
                                                      </v-col>
                                                        
                                                    </v-row>
                                                  </v-card>
                                                </v-col>
                                                               
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                          
                                        </v-row>
                                      </v-card>
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: Graph/3D-Tools -->
                                  <v-card id="helpComponentGraph3dTools" height="91%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card class="tile" height="106px" width="100%" variant="text">
                                      
                                      <!-- 3D - Tools -->
                                      <v-card id="helpSubcomponent3dToolsContainer" class="help_element__notVisible" height="100%" width="100%" variant="text">
                                        <v-row no-gutters>
                                          
                                          <!-- Subkomponente: Unit Liste -->
                                          <v-col cols="6">
                                            <v-card id="helpUnitList" class="help_subcomponend__notFocus" height="100%" variant="text" width="100%">
                                              <v-card class="px-5 py-0 units__3d_base" variant="text">
                                                
                                                <!-- Subcomponent title -->
                                                <v-card class="pt-1" variant="text">
                                                  <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                    Auflistung aller Units
                                                  </v-card-title>
                                                </v-card>
  
                                                <!-- Unit Liste -->
                                                <v-card class="pt-2 pb-8" variant="text">
                                                  <v-slide-group mandatory show-arrows="always"></v-slide-group>
                                                </v-card>
                                                
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                          
                                          <!-- Subkomponente: 3D-Objekt schneiden -->
                                          <v-col cols="6">
                                            <v-card id="help3dCut" class="help_subcomponend__notFocus" height="100%" variant="text" width="100%">
                                              <v-card class="px-5 py-0 units__3d_base" variant="text">
                                                
                                                <!-- Subcomponent title -->
                                                <v-card class="pt-1" variant="text">
                                                  <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                    3D-Objekt schneiden
                                                  </v-card-title>
                                                </v-card>
                                                
                                                <!-- Schneiden starten -->
                                                <v-card class="pt-1 my-3" height="fit-content" variant="text">
                                                  <v-btn width="100%" @click="loadCutTool()">
                                                    Schneidmodus starten
                                                  </v-btn>
                                                </v-card>
                                                  
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                          
                                        </v-row>
                                      </v-card>

                                      <!-- Graph - Tools -->
                                      <v-card id="helpSubcomponentGraphToolsContainer" class="help_element__visible" height=100% width="100%" variant="text">
                                        <v-row no-gutters>
                                            
                                          <!-- Subkomponente: Neue Unit erstellen -->
                                          <v-col cols="4">
                                            <v-card id="helpUnitCreateUnit" class="help_subcomponend__notFocus" variant="text" height="100%">
                                              <v-card class="units__graph_base" variant="text">
                                                <v-col class="pa-0" align="center">
                                                  <v-card class="pt-1 mb-1" variant="text">
                                                    <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                      Neue Unit erstellen
                                                    </v-card-title>
                                                  </v-card>
                                                  <v-card class="nodes mb-2" width="fit-content" variant="text">
                                                    <v-row no-gutters style="width: fit-content">
                                                      <v-col align="center">
                                                        <v-card height="fit-content" width="fitcontent" variant="text">
                                                          <v-card-text class="pa-1 deposit__dragable_name" style="text-align: center; line-height: 100%;">
                                                            Deposit
                                                          </v-card-text>
                                                        </v-card>
                                                        <div class="deposit__dragable">D</div>
                                                      </v-col>
                                                      <v-col align="center">
                                                        <v-card class="d-flex align-center justify-center" height="fit-content" width="fitcontent" variant="text">
                                                          <v-card-text class="pa-1 interface__dragable_name" style="text-align: center; line-height: 100%;">
                                                            Interface
                                                          </v-card-text>
                                                        </v-card>
                                                        <div class="interface__dragable">I</div>
                                                      </v-col>
                                                    </v-row>
                                                  </v-card>
                                                </v-col>
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                            
                                          <!-- Subkomponente: Unit suchen -->
                                          <v-col cols="4">
                                            <v-card id="helpUnitSearch" class="help_subcomponend__notFocus" height="100%" variant="text">
                                              <v-card class="units__graph_base" variant="text" height="100%">
                                                <v-col class="pa-0" align="center">
                                                  <v-card class="pt-1 mb-1" variant="text">
                                                    <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                      Unit suchen
                                                    </v-card-title>
                                                  </v-card>
                                                  <v-combobox class="mb-2" style="height: 52px; width: 150px" hide-selected :items="unitSearchDropDownMenueItems" persistent-hint :hide-no-data="true" v-model="unitSearchInput"></v-combobox>
                                                </v-col>
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                            
                                          <!-- Subkomponente: Unit aufräumen -->
                                          <v-col cols="4">
                                            <v-card id="helpUnitCleanUp" class="help_subcomponend__notFocus" height="100%" variant="text">
                                              <v-card class="px-5 units__graph_base" variant="text" height="100%">
                                                <v-col class="pa-0" align="center">
                                                  <v-card class="pt-1 mb-3" variant="text">
                                                    <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                                                      Unit aufräumen
                                                    </v-card-title>
                                                  </v-card>
                                                  <v-btn >CleanUp</v-btn>
                                                </v-col>
                                              </v-card>
                                            </v-card>
                                          </v-col>
                                            
                                        </v-row>
                                      </v-card>
                                      
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: Graph/3D-Editor -->
                                  <v-card id="helpComponentGraph3dEditor" height="92.2%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card class="pb-15 d-flex align-center justify-center" height="100%" width="100%" variant="text">
                                      <v-card id="helpGraphEditorContainer" class="tile help_element__visible" variant="text">
                                        <v-card id="helpGraphEditor" class="tile help_componend__notFocus" variant="text">
                                          <v-img width="550" src="assets/stratiTool/helpPages/graphEditor.jpg" ></v-img>
                                        </v-card>
                                      </v-card>
                                      <v-card id="help3dEditorContainer" class="tile help_element__notVisible" variant="text">
                                        <v-card id="help3dEditor" class="tile help_componend__notFocus" variant="text">
                                          <v-img width="550" src="assets/stratiTool/helpPages/3dEditor.jpg" ></v-img>
                                        </v-card>
                                      </v-card>
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: Glossar -->
                                  <v-card id="helpComponentGlossar" height="92.2%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card id="helpGlossarContainer" class="help_element__visible" variant="text">
                                      <v-card id="helpGlossar" class="help_componend__notFocus" variant="text">
                                        <v-btn class="pa-7 px-14 glossar__button" height="100%" width="400">
                                          Glossar
                                        </v-btn>
                                      </v-card>
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: Editor wechsel -->
                                  <v-card id="helpComponentChangeEditor" height="92.2%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card id="helpChangeEditorContainer" class="help_element__visible" variant="text">
                                      <v-card id="helpChangeEditor" class="help_componend__notFocus" variant="text">
                                        <v-btn class="pa-7 px-14 modus_wechseln__button" height="100%" width="400">
                                          "Name des aktuellen Editors" - Editor
                                        </v-btn>
                                      </v-card>
                                    </v-card>
                                  </v-card>

                                  <!-- Komponente: Infobereich -->
                                  <v-card id="helpComponentInfoCard" height="91%" width="100%" variant="text" class="px-2 d-flex align-center justify-center help_element__notVisible">
                                    <v-card id="helpInfoCardContainer" class="pa-1 hollow help_element__visible" height="100%" width="50%" variant="text">
                                      <v-card id="infoCard" class="pa-2 help__infobereich_base" height="100%" width="100%" variant="text">
                                        <v-col class="pa-0">
                                            
                                          <!-- Unit Titel -->
                                          <v-row no-gutters class="pb-2">
                                            <v-card id="helpInfoCardUnitTitle" class="help_subcomponend__notFocus" width="100%" height="35" variant="text">
                                              <v-card class="help__infobereich_title" width="100%" height="100%" variant="text"></v-card>
                                            </v-card>
                                          </v-row>
                                            
                                          <!-- Unit Bild -->
                                          <v-row no-gutters class="pb-2">
                                            <v-card id="helpInfoCardUnitImage" class="help_subcomponend__notFocus" width="100%" height="230" variant="text">
                                              <v-card class="pa-2 help__infobereich_image_outside" width="100%" height="100%" variant="text">
                                                <v-card class="help__infobereich_image_inside" width="100%" height="200" variant="text"></v-card>
                                              </v-card>
                                            </v-card>
                                          </v-row>
                                            
                                          <!-- Unit Attribute -->
                                          <v-row no-gutters class="pb-2">
                                            <v-card id="helpInfoCardUnitAttributes" class="py-0 help_subcomponend__notFocus" height="188" width="100%" variant="text">
                                              <v-card class="py-1 pa-1 help__infobereich_attributes_list" height="100%" variant="text"></v-card>
                                            </v-card>
                                          </v-row>
                                          
                                          <!-- Unit löschen -->
                                          <v-row no-gutters>
                                            <v-card id="helpInfoCardUnitDelete" class="help_subcomponend__notFocus" height="40" width="100%" variant="text">
                                              <v-btn class="help__infobereich_delete_unit_button" height="100%" width="100%">
                                                Unit Löschen
                                              </v-btn>
                                            </v-card>
                                          </v-row>
                                          
                                        </v-col>
                                      </v-card>
                                    </v-card>
                                  </v-card>
                                  
                                </v-card>
                              </v-card>
                            </v-row>
                            
                            <!-- Subkomponenten -->
                            <v-row no-gutters style="height: 45%">
                              <v-card class="pa-2 tile" rounded="0" height="100%" width="100%">
                                
                                <!-- Subkomponente Header -->
                                <v-card-title class="d-flex align-center justify-center">
                                  Subkomponenten
                                </v-card-title>
                                
                                <!-- Subkomponenten-Liste -->
                                <v-list class="px-2 tile" max-height="90%" min-height="60%" min-width="100%" max-width="100%">
                                  <v-list-item class="pb-1 px-0" v-for="n in aktiveHelpPageSubcomponents" :key="n">
                                    <v-btn :id="n.id + 'Button'" class="help_subcomponent_button__notClicked" height="100" width="100%" @click="changeHelpPageSubcomponent(n)">
                                      {{ n.name }}
                                    </v-btn>
                                  </v-list-item>
                                </v-list>
                                
                              </v-card>
                            </v-row>

                          </v-col>
                          <v-col>
                            
                            <!-- Name und Beschreibung der Komponente und Menü -->
                            <v-row no-gutters style="height: 35%">
                              
                              <!-- Name und Beschreibung der Komponente -->
                              <v-col cols="8">
                                <v-card class="tile" rounded="0" height="100%" width="100%">
                                  <v-card class="tile" height="100%" width="100%" rounded="0">
                                    <v-card-title class="d-flex align-center justify-center text-h4">
                                      {{ aktiveHelpPageComponent.name }}
                                    </v-card-title>
                                    <v-text class="px-5 d-flex align-center justify-center text-h6">{{ aktiveHelpPageComponent.description }}</v-text>
                                  </v-card>
                                </v-card>
                              </v-col>
                              
                              <!-- Menü -->
                              <v-col>
                                <v-card class="px-3 pb-5 mx-auto flex-1-0 tile" rounded="0" height="100%" width="100%">
                                  <v-card-title class="d-flex align-center justify-center">
                                    Wählen sie eine Komponente aus
                                  </v-card-title>
                                  <v-card rounded="0" height="90%" width="100%" style="position: relative">
                                    
                                    <!-- Header -->
                                    <v-row no-gutters style="height: 6%">
                                      <v-card class="help__navigation_header" rounded="0" height="100%" width="100%"></v-card>
                                    </v-row>
                                    
                                    <!-- Components -->
                                    <v-row no-gutters style="height: 88%">
                                      <v-col cols="3" class="fill-height d-flex flex-column">
                                        <!-- Hilfe -->
                                        <v-card class="help_componend__notFocus" rounded="0" height="10%" width="100%">
                                          <v-card class="d-flex align-center justify-center help__navigation_hilfe" height="100%" width="100%">
                                            <v-card-title class="text-caption">
                                              Hilfe
                                            </v-card-title>
                                          </v-card>
                                        </v-card>
                                        <!-- module -->
                                        <v-btn id="helpSmallNavigationmodule" class="help__navigation_module text-caption help_componend__notFocus" rounded="0" height=90% width="100%" @click="changeHelpPageComponent('module')">
                                            Modul
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="6" class="fill-height d-flex flex-column">
                                        <!-- System-Tools -->
                                        <v-btn id="helpSmallNavigationharrisMatrixTools" class="help__navigation_system_tools text-caption help_componend__notFocus" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('systemTools')">
                                          System-Tools
                                        </v-btn>
                                        <!-- Graph/3D-Tools -->
                                        <v-btn id="helpSmallNavigationgraph3dTools" class="help__navigation_graph-3d_tools text-caption help_componend__notFocus" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('graph3dTools')">
                                          Graph/3D-Tools
                                        </v-btn>
                                        <!-- Graph/3D-Editor -->
                                        <v-btn id="helpSmallNavigationgraph3dEditor" class="help__navigation_graph-3d_editor text-caption help_componend__notFocus" rounded="0" height="80%" width="100%" @click="changeHelpPageComponent('graph3dEditor')">
                                          Graph/3D-Editor
                                        </v-btn>
                                      </v-col>
                                      <v-col cols="3" class="fill-height d-flex flex-column">
                                        <!-- Glossar -->
                                        <v-btn id="helpSmallNavigationglossar" class="help__navigation_glossar text-caption help_componend__notFocus" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('glossar')">
                                          Glossar
                                        </v-btn>
                                        <!-- Editor wechseln -->
                                        <v-btn id="helpSmallNavigationchangeEditor" class="help__navigation_editor_wechseln text-caption help_componend__notFocus" rounded="0" height="10%" width="100%" @click="changeHelpPageComponent('changeEditor')">
                                          Editor wechsel
                                        </v-btn>
                                        <!-- Infobereich -->
                                        <v-btn id="helpSmallNavigationinfoCard" class="help__navigation_infobereich text-caption help_componend__notFocus" rounded="0" height="80%" width="100%" @click="changeHelpPageComponent('infoCard')">
                                          Infobereich
                                        </v-btn>
                                      </v-col>
                                    </v-row>
                                    
                                    <!-- Footer -->
                                    <v-row no-gutters style="height: 6%">
                                      <v-card class="help__navigation_footer" rounded="0" height="100%" width="100%" style="border: 1px; border-style: solid"></v-card>
                                    </v-row>
                                    
                                  </v-card>
                                </v-card>
                              </v-col>
                              
                            </v-row>
                            
                            <!-- Name und Beschreibung der Subkomponente -->
                            <v-row no-gutters style="height: 65%">
                              <v-card class="tile" rounded="0" height="100%" width="100%">

                                <v-card id="defaultSubcomponentDescription" class="tile d-flex align-center justify-center help_element__visible" height="100%" width="100%" rounded="0">
                                  <v-card-title class="text-h4">
                                    Wählen sie eine der Subkomponenten aus um genauer Informationen zu erhalten
                                  </v-card-title>
                                </v-card>
                                  
                                <!-- Name und Beschreibung der Subkomponente -->
                                <v-card id="subcomponentDescription" class="tile help_element__notVisible" height="100%" width="100%" rounded="0">
                                  <!-- Name -->
                                  <v-card-title class="d-flex align-center justify-center text-h4">
                                    {{ aktiveHelpPageSubcomponentName }}
                                  </v-card-title>
                                  <!-- Beschreibung -->
                                  <v-card class="pl-5" variant="text">
                                    <v-text class="text-h6">{{ aktiveHelpPageSubcomponent.description }}</v-text>
                                  </v-card>
                                  <v-card class="pa-2" variant="text" elevation="0">
                                    <v-list max-height="592" class="help_subcomponend_info__liste">
                                      <v-list-item variant="text">
                                        <v-row no-gutters>
                                          <v-col cols="5">
                                            <v-card class="help_subcomponend_info__base d-flex align-center justify-center" elevation="0" height="200">
                                              <img src="@/components/graph-editor-components/Images/hover.jpg" height="102">
                                            </v-card>
                                          </v-col>  
                                          <v-col cols="7">
                                            <v-card class="pt-4 help_subcomponend_info__base" elevation="0">
                                              <v-text class="text-h5">1. Um eine der beiden Unit-typen (Deposit links und Interface rechts) auszuwählen, hovert man mit der Maus über einen der beiden Bereiche. Danach wählt man über eine der beiden Unit-Typen über einen Klick mit der linken Maustatste aus und hält diese dabei gedrückt.</v-text>
                                            </v-card>
                                          </v-col>  
                                        </v-row>
                                      </v-list-item>
                                      <v-list-item variant="text">
                                        <v-row no-gutters>
                                          <v-col cols="5">
                                            <v-card class="help_subcomponend_info__base d-flex align-center justify-center" elevation="0">
                                              <img src="@/components/graph-editor-components/Images/bewegen.jpg" height="400">
                                            </v-card>
                                          </v-col>
                                          <v-col cols="7">
                                            <v-text class="text-h5">2. Jetzt zieht man den zuvor gewählten Unit-Typ in den Bereich der Graph/3D-Editor Komponente. Eine Verfärbung des Bereichs signalisiert, dass eine Unit des ausgewählten Typs erstellt werden kann.</v-text>
                                          </v-col>
                                        </v-row>
                                      </v-list-item>
                                      <v-list-item variant="text">
                                        <v-row no-gutters>
                                          <v-col cols="5">
                                            <v-card class="help_subcomponend_info__base d-flex align-center justify-center" elevation="0">
                                              <img src="@/components/graph-editor-components/Images/fertig.jpg" height="400">
                                            </v-card>
                                          </v-col>
                                          <v-col cols="7">
                                            <v-text class="text-h5">3. Abschließend lässt man die linke Maustatse los, worauf eine neue Unit an der Position des Mauszeigers erstellt wird.</v-text>
                                          </v-col>
                                        </v-row>
                                      </v-list-item>
                                    </v-list>
                                  </v-card>
                                </v-card>

                              </v-card>
                            </v-row>
                            
                          </v-col>
                        </v-row>
                      </v-card>
                    </v-card>
                    
                  </v-row>
                  
                </v-card>
              </v-dialog>
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
              <v-card class="px-0 hollow" :height="windowHeight - 328">
                
                <!-- Screenshot-Modul -->
                <v-card id="screenshot_module" class="pa-2 screenshot_module__base" height="100%" width="100%" style="position:absolute; z-index: 1; opacity: 1;">
                  <v-card variant="text" width="100%">
                    <!-- Image name -->
                    <v-text>Dateiname:</v-text>
                    <v-text-field hide-details class="mb-5 module__textfield" v-model="imageFileName"></v-text-field>
                    <!-- Image format -->
                    <v-text>Dateinformat:</v-text>
                    <v-row no-gutters style="height: 50px;">
                      <v-col class="px-1">
                        <v-btn class="module__button" width="100%" height="100%" @click="takeScreenshot('png')">
                          PNG
                        </v-btn>
                      </v-col>
                      <v-col class="px-1">
                        <v-btn class="module__button" width="100%" height="100%" @click="takeScreenshot('jpeg')">
                          JPEG
                        </v-btn>
                      </v-col>
                      <v-col class="px-1">
                        <v-btn class="module__button" width="100%" height="100%" @click="takeScreenshot('svg')">
                          SVG
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-card>
                  
                <!-- Group-Modul -->
                <v-card id="group_module" class="pa-2 group_module__base d-flex align-center justify-center" height="100%" width="100%" style="position:absolute; z-index: 0; opacity: 1;">
                  <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                </v-card>

                <!-- View-Modul -->
                <v-card id="view_module" class="pa-2 view_module__base d-flex align-center justify-center" height="100%" width="100%" style="position:absolute; z-index: 0; opacity: 1;">
                  <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                </v-card>

                <!-- Exp/Imp-Modul -->
                <v-card id="exp/imp_module" class="pa-2 exp-imp_module__base" height="100%" width="100%" style="position:absolute; z-index: 0; opacity: 1;">
                  <v-row no-gutters>
                    <!-- Export -->
                    <v-card class="pa-5" :height="windowHeight - 838" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                      <v-card-title class="d-flex align-center justify-center pa-0 pb-2" >Export</v-card-title>
                      <v-btn class="mb-2 module__button" width="100%" height="100" @click="exportData()">
                        Harris-Matrix
                      </v-btn>
                      <v-btn class="module__button" width="100%" height="100" @click="exportData()">
                        Harris-Matrix + Modelle
                      </v-btn>
                    </v-card>
                  </v-row>
                  <v-row no-gutters>
                    <!-- Import -->
                    <v-card class="pa-5" :height="windowHeight - 838" width="100%" variant="text" style="border: 1px; border-style: solid; border-color: white;">
                      <v-card-title class="d-flex align-center justify-center pa-0 pb-2" >Import</v-card-title>
                      <v-btn class="mb-2 module__button" width="100%" height="100" @click="createImportDataDialog = true">
                        Harris-Matrix
                      </v-btn>
                      <v-btn class="module__button" width="100%" height="100" @click="createImportDataDialog = true">
                        Harris-Matrix + Modelle
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
                <v-card id="filter_module" class="pa-2 filter_module__base d-flex align-center justify-center" height="100%" width="100%" style="position:absolute; z-index: 0; opacity: 1;">
                  <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                </v-card>
                  
                <!-- Timemodel -->
                <v-card id="timemodel_module" class="pa-2 timemodel_module__base d-flex align-center justify-center" height="100%" width="100%" style="position:absolute; z-index: 0; opacity: 1;">
                  <img src="@/components/graph-editor-components/Images/work_in_progress_background.jpg" height="1010">
                </v-card>
                  
              </v-card>
            </v-card>
          </v-row>
          
        </div>
        
        <!-- > > > > > > ------ < < < < < < -->
        <!-- > > > > > > Middle < < < < < < -->
        <!-- > > > > > > ------ < < < < < < -->
        <div>
          
          <!-- System-Tools -->
          <v-row no-gutters style="width:fit-content">
            <v-card class="tile" height="100" :width="windowWidth - 816">
              <v-row no-gutters>
                
                <!-- Bearbeitungsstand speichern -->
                <v-col>
                  <v-card class="px-5 py-0 system_tools__base" variant="text" height="100%">
                    <v-col class="pa-0" align="center">

                      <!-- Subcomponent title -->
                      <v-card class="pt-1" variant="text">
                        <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                          Bearbeitungsstand Speichern
                        </v-card-title>
                      </v-card>
                      
                      <!-- Save -->
                      <v-card class="pt-1 my-3" height="fit-content" variant="text">
                        <v-btn class="system_tools__button" width="100%" @click="saveAll()">
                          Speichern
                        </v-btn>
                      </v-card>
                      
                    </v-col>
                  </v-card>
                </v-col>
                
                <!-- Switch processing steps -->
                <v-col>
                  <v-card class="px-5 py-0 system_tools__base" variant="text" height="100%">
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
          
          <!-- Graph/3D-Tools -->
          <v-row no-gutters style="width:fit-content">
            <v-card class="tile" height="100" :width="windowWidth - 816">
              <v-row no-gutters>
                
                <!-- 3D-Editor Tools -->
                <v-card id="units_3dTools" width="100%" height="100%" class="notVisible">
                  <v-row no-gutters>
                    
                    <!-- Unit List -->
                    <v-col cols="6">
                      <v-card class="px-5 py-0 units__3d_base" variant="text" height="92">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Auflistung aller Units
                            </v-card-title>
                          </v-card>
                          <v-card class="pt-2" variant="text">
                            <v-slide-group mandatory>
                              <v-slide-group-item v-for="n in unitListContent" :key="n">
                                <v-btn :id=n.id :class=n.class rounded v-on:click="fillInfoCard3d(n.id)">
                                  {{ n.label }}
                                </v-btn>
                              </v-slide-group-item>
                            </v-slide-group>
                          </v-card>
                        </v-col>
                      </v-card>
                    </v-col>
                    
                    <!-- Modelle schneiden -->
                    <v-col cols="6">
                      <v-card class="px-5 py-0 units__3d_base" variant="text" height="92">
                        <v-col class="pa-0" align="center">

                          <!-- Subcomponent title -->
                          <v-card class="pt-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Modelle schneiden
                            </v-card-title>
                          </v-card>

                          <!-- Schneiden starten -->
                          <v-card class="pt-1 my-3" height="fit-content" variant="text">
                            <v-btn class="units__3d_cut_button" width="100%" @click="loadCutTool()">
                              Schneidmodus starten
                            </v-btn>
                          </v-card>
                          
                        </v-col>
                      </v-card>
                    </v-col>
                    
                  </v-row>
                </v-card>

                <!-- Graph-Editor Tools -->
                <v-card id="units_graphTools" width="100%" height="100%" class="visible">
                  <v-row no-gutters>
                    
                    <!-- Unit creation -->
                    <v-col>
                      <v-card id="unitCreation" class="units__graph_base" variant="text" height="92">
                        <v-card class="pt-1 mb-1" variant="text">
                          <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                            Neue Unit erstellen
                          </v-card-title>
                        </v-card>
                        <v-card align="center" variant="text" height="100%">
                          <Sidebar :highestIndexOfDefaultNode="highestIndexOfDefaultNode"/>
                        </v-card>
                      </v-card>
                    </v-col>
                      
                    <!-- Unit Search -->
                    <v-col>
                      <v-card class="px-5 units__graph_base" variant="text" height="92">
                        <v-col class="pa-0" align="center">
                          <v-card class="pt-1 mb-1" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Unit suchen
                            </v-card-title>
                          </v-card>
                          <v-combobox class="mb-2 units__graph_search_field" style="height: 52px; width: 250px" hide-selected :items="unitSearchDropDownMenueItems" persistent-hint :hide-no-data="true" v-model="unitSearchInput"></v-combobox>
                        </v-col>
                      </v-card>
                    </v-col>
                    
                    <!-- Unit Sort -->
                    <v-col>
                      <v-card class="px-5 units__graph_base" variant="text" height="100%">
                        <v-row no-gutters class="d-flex justify-center">
                          <v-card class="pt-1 mb-3" variant="text">
                            <v-card-title class="pa-0" style="text-align: center; line-height: 100%;">
                              Units sortieren
                            </v-card-title>
                          </v-card>
                        </v-row>
                        <v-row no-gutters>
                          <v-col class="ml-6" align="right" cols="7">
                            <v-btn class="units__graph_sort_button" @click="cleanUp">Sortieren</v-btn>
                          </v-col>
                          <v-col class="ml-4" cols="4" align="right">
                            <v-btn height="100%" width="50%" class="units__graph_sort_button">
                              <v-icon size="x-large">mdi-table-eye-off</v-icon>
                            </v-btn>
                          </v-col>
                          <!-- <v-col class="ml-4" cols="4" align="right">
                            <v-btn height="100%" width="50%" class="units__graph_sort_button_clicked">
                              <v-icon size="x-large">mdi-table-eye</v-icon>
                            </v-btn>
                          </v-col> -->
                        </v-row>
                      </v-card>
                    </v-col>
                    
                  </v-row>
                </v-card>
                
              </v-row>
            </v-card>
          </v-row>
  
          <!-- Editoren -->
          <v-row no-gutters style="width:fit-content;">
            <canvas id="canvas_3d" class="notVisible model_editor__background" :height="windowHeight - 328" :width="windowWidth - 825"></canvas>
            <v-card id="canvas_graph" class="dnd-flow visible graph_editor__background" @drop="onDrop" :height="windowHeight - 320" :width="windowWidth - 817" style="position:relative; z-index: 0; opacity: 1;">
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
            
            <!-- <v-card class="ma-5" height="945" width="200" style="position:absolute; z-index: 2; opacity: 1; border-radius: 0%;">
              <v-card height="100%" width="100%" style="border: 8px; border-style: ridge; border-radius: 0%; border-color: #874e1c; background-color: #866345;">
                
                <v-card variant="text" height="100%" width="100%" class="d-flex justify-center">
                  <v-row no-gutters>
                    <v-col cols="12" class="pa-0 mt-9 d-flex justify-center">
                      
                      <v-card style="height: 100px; width: 100px; line-height: 86px; text-align: center; color: black; background-color:rgb(30, 154, 30); border: 2px solid #ffffff; border-radius: 10%; padding: 6px;">
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Top"/>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Left"/>
                        <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined">
                          <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">Neue Unit_0</v-card-text>
                        </v-card>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Right"/>
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Bottom"/>
                      </v-card>
                      
                    </v-col>
                    <v-col cols="12" class="pa-0 d-flex justify-center">
                      
                      <v-card style="height: 100px; width: 100px; line-height: 86px; text-align: center; color: black; background-color:rgb(30, 154, 30); border: 2px solid #ffffff; border-radius: 10%; padding: 6px;">
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Top"/>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Left"/>
                        <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined">
                          <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">Neue Unit_3</v-card-text>
                        </v-card>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Right"/>
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Bottom"/>
                      </v-card>
                      
                    </v-col>
                    <v-col cols="12" class="pa-0 d-flex justify-center">
                      
                      <v-card style="height: 100px; width: 100px; line-height: 100px; text-align: center; color: black; background-color:rgb(172, 108, 24); border: 2px solid #ffffff; border-radius: 100%; padding: 7%;">
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;" :position="Position.Top"/>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;" :position="Position.Left"/>
                        <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined" style="border-radius: 100%;">
                          <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">Neue Unit_4</v-card-text>
                        </v-card>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;" :position="Position.Right"/>
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;" :position="Position.Bottom"/>
                      </v-card>
                      
                    </v-col>
                    <v-col cols="12" class="pa-0 d-flex justify-center">

                      <v-card style="height: 100px; width: 100px; line-height: 100px; text-align: center; color: black; background-color:rgb(172, 108, 24); border: 2px solid #ffffff; border-radius: 100%; padding: 7%;">
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-top-left-radius: 100%; border-top-right-radius: 100%;" :position="Position.Top"/>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-top-left-radius: 100%;" :position="Position.Left"/>
                        <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined" style="border-radius: 100%;">
                          <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">Neue Unit_7</v-card-text>
                        </v-card>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-right-radius: 100%; border-top-right-radius: 100%;" :position="Position.Right"/>
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%; border-bottom-left-radius: 100%; border-bottom-right-radius: 100%;" :position="Position.Bottom"/>
                      </v-card>
                      
                    </v-col>
                    <v-col cols="12" class="pa-0 d-flex justify-center">

                      <v-card style="height: 100px; width: 100px; line-height: 86px; text-align: center; color: black; background-color:rgb(30, 154, 30); border: 2px solid #ffffff; border-radius: 10%; padding: 6px;">
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Top"/>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :position="Position.Left"/>
                        <v-card class="d-flex align-center justify-center" height="100%" width="100%" variant="outlined">
                          <v-card-text class="pa-1" style="text-align: center; line-height: 100%;">Neue Unit_9</v-card-text>
                        </v-card>
                        <Handle style="height: 18px; width: 8px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Right"/>
                        <Handle style="height: 8px; width: 18px; border: 2px; border-style: solid; border-color: #FFFFFF; border-radius: 0%;" :isValidConnection=testForValidConnection type="target" :position="Position.Bottom"/>
                      </v-card>
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                    <v-col cols="12" class="pa-0">
                      
                    </v-col>
                  </v-row>
                </v-card>
                
              </v-card>
            </v-card> -->
            
          </v-row>
          
        </div>
  
        <!-- > > > > > > ----- < < < < < < -->
        <!-- > > > > > > Right < < < < < < -->
        <!-- > > > > > > ----- < < < < < < -->
        <div>
          
          <!-- Glossar -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="pa-1 d-flex align-center justify-center tile" height="100" width="400">
              <v-btn class="pa-7 px-14 glossar__button" height="100%" width="100%" @click="createGlossarDialog = true" elevation="24" >
                Glossar
              </v-btn>
            </v-card>
            <v-dialog v-model="createGlossarDialog" persistent >
              <v-card :height="windowHeight" class="tile">
                  
                <!-- Pages navigation -->
                <v-row no-gutters style="max-height: 6%;">
                  <!-- Hilfe Überschrift -->
                  <v-col cols="11">
                    <v-card class="glossar__base d-flex align-center justify-center" height="100%">
                      <v-card-Title>Wählen sie einen fachbegriff aus, über die Sie mehr erfahren möchten</v-card-Title>
                    </v-card>
                  </v-col>
                    
                  <!-- Verlassen-button -->
                  <v-col cols="1">
                    <v-card class="pa-2 glossar__base d-flex justify-center" height="100%">
                      <v-btn class="help__button" width="100%" height="100%" @click="createGlossarDialog = false">
                        <v-icon size="x-large">mdi-alpha-x-circle</v-icon>
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Pages -->
                <v-row no-gutters style="max-width: 100%;">
                  <v-card class="pa-12 glossar__base" height="100%" width="100%">
                    <v-expansion-panels>
                      <v-expansion-panel class="system_tools__button" title="Stratifikation">
                        <v-expansion-panel-text>
                          The science dealing with the description of all rock bodies forming the Earth’s crust— sedimentary, igneous, and metamorphic— and their organization into distinctive, useful, mappable units based on their inherent properties or attributes. Stratigraphic procedures include the description, classification, naming, and correlation of these units for the purpose of establishing their relationship in space and their succession in time. <a href="https://watermark.silverchair.com/9780813759388_backmatter.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAx8wggMbBgkqhkiG9w0BBwagggMMMIIDCAIBADCCAwEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMrRv6SHjACAPG6l4KAgEQgIIC0vhd_zeH4BXSk6i6_Ov3cJJXdrUeZKL849WBn1pbSApdk04b3zinb3YtbFFJSc9eK8OK689qL5npDzhjnyq-nxPImmYwyToVb--zRPgDvjr8d5ui6Ee6KdAFLYBYscN3j6UHULarR25C3QZ2c1X6l8jENPqKjnqZNbmNsFJfrhVlcekHZro11jbQqH0Dj7oSjIkVxTtDKBPJx0w_CM0OVVPLcsyl8tqMZxJmsdanKu5M1b3dTbHIi6QZThwyN4N_NKftc_nSyPz5IQfShq9AaG7cTOyyeWJM0XVrEMRR7uLc2F0idKDwYBYcEyJfsGOna2ayZtvIADSB-B3lDP-sDj3m5Wf2Llbcqw9azNvAPGsp9C7YO6b4faUfjjh2kGAlij-6lw9FaYD1RkDCtfVptSVYz64Zb9PO1hdn_KBjNWvcZ9rvT82ZJ9K9_8SyJHfreGpmV6K01aeDsZm27Y-ZOW1hmlPiBTGxT8rC8KwVgGiXe1VW5wX0cLXMNZhZplXAtGzDujAv1Jwu9taJqadqIICWkinLKFALHffJlUGF4G8xprjgaiGf0nRsKHtvBhFrH5i1MUamoXn__A_S96axYnrrnj5CgNeka3NSCUvDmLahusnUL4gpOTesrqm1805O0beVRzaxARG7B9eXqKZhn5RSiR68P5e0AQSYUro1qi4R2jg6iBHMPqDpDHhO4xOvDDVcDZT_wFuHGo5tLXI8GkJj1eLktL8NlU92AlSxtudcq4ak1Hd3pIrIcOBeGEdgFADUhPSC-fOXF05XXOZiUMG8NSfzpsyKGkv0fLt3bkosIE6_23HHZV0WFeMj-26k1Yw1skWmd33ooA_-qTla4Dv-HF_A-ZN7io5-ZA0JnvT30rToGtgvcYXKowRx61gJTGZxX4GMo9PiluUisjF6aWHYCUNVijBj-SxrDHJf16RjtBzwxC0WhKVLCmphTcky-bsZ"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Einheit (Harris-Matrix)">
                        <v-expansion-panel-text>
                          A body of rock recognized as a unit (distinct entity) in the classification of the Earth’s rocks, based on any of the many properties and attributes that rocks possess. Stratigraphic units based on one property will not necessarily coincide with those based on another. <a href="https://watermark.silverchair.com/9780813759388_backmatter.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAx8wggMbBgkqhkiG9w0BBwagggMMMIIDCAIBADCCAwEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMrRv6SHjACAPG6l4KAgEQgIIC0vhd_zeH4BXSk6i6_Ov3cJJXdrUeZKL849WBn1pbSApdk04b3zinb3YtbFFJSc9eK8OK689qL5npDzhjnyq-nxPImmYwyToVb--zRPgDvjr8d5ui6Ee6KdAFLYBYscN3j6UHULarR25C3QZ2c1X6l8jENPqKjnqZNbmNsFJfrhVlcekHZro11jbQqH0Dj7oSjIkVxTtDKBPJx0w_CM0OVVPLcsyl8tqMZxJmsdanKu5M1b3dTbHIi6QZThwyN4N_NKftc_nSyPz5IQfShq9AaG7cTOyyeWJM0XVrEMRR7uLc2F0idKDwYBYcEyJfsGOna2ayZtvIADSB-B3lDP-sDj3m5Wf2Llbcqw9azNvAPGsp9C7YO6b4faUfjjh2kGAlij-6lw9FaYD1RkDCtfVptSVYz64Zb9PO1hdn_KBjNWvcZ9rvT82ZJ9K9_8SyJHfreGpmV6K01aeDsZm27Y-ZOW1hmlPiBTGxT8rC8KwVgGiXe1VW5wX0cLXMNZhZplXAtGzDujAv1Jwu9taJqadqIICWkinLKFALHffJlUGF4G8xprjgaiGf0nRsKHtvBhFrH5i1MUamoXn__A_S96axYnrrnj5CgNeka3NSCUvDmLahusnUL4gpOTesrqm1805O0beVRzaxARG7B9eXqKZhn5RSiR68P5e0AQSYUro1qi4R2jg6iBHMPqDpDHhO4xOvDDVcDZT_wFuHGo5tLXI8GkJj1eLktL8NlU92AlSxtudcq4ak1Hd3pIrIcOBeGEdgFADUhPSC-fOXF05XXOZiUMG8NSfzpsyKGkv0fLt3bkosIE6_23HHZV0WFeMj-26k1Yw1skWmd33ooA_-qTla4Dv-HF_A-ZN7io5-ZA0JnvT30rToGtgvcYXKowRx61gJTGZxX4GMo9PiluUisjF6aWHYCUNVijBj-SxrDHJf16RjtBzwxC0WhKVLCmphTcky-bsZ"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Befund">
                        <v-expansion-panel-text>
                          Features are non-portable artifacts such as monuments, graves, floors, hearths and other structural edifices that cannot be removed or recovered from their original cultural matrix. Later on Archaeologist started to give importance to eco facts in addition to artifacts and features. <a href="https://archaeology.assam.gov.in/frontimpotentdata/identification-and-exploration-archaeological-sites-and-monuments#:~:text=Features%20are%20non%2Dportable%20artifacts,addition%20to%20artifacts%20and%20features."> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Schicht">
                        <v-expansion-panel-text>
                          A layer (generally tabular body) of rock characterized by certain lithologic properties or attributes that distinguish it from adjacent layers from which it is separated by visible planes of bedding. <a href="https://watermark.silverchair.com/9780813759388_backmatter.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAx8wggMbBgkqhkiG9w0BBwagggMMMIIDCAIBADCCAwEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMrRv6SHjACAPG6l4KAgEQgIIC0vhd_zeH4BXSk6i6_Ov3cJJXdrUeZKL849WBn1pbSApdk04b3zinb3YtbFFJSc9eK8OK689qL5npDzhjnyq-nxPImmYwyToVb--zRPgDvjr8d5ui6Ee6KdAFLYBYscN3j6UHULarR25C3QZ2c1X6l8jENPqKjnqZNbmNsFJfrhVlcekHZro11jbQqH0Dj7oSjIkVxTtDKBPJx0w_CM0OVVPLcsyl8tqMZxJmsdanKu5M1b3dTbHIi6QZThwyN4N_NKftc_nSyPz5IQfShq9AaG7cTOyyeWJM0XVrEMRR7uLc2F0idKDwYBYcEyJfsGOna2ayZtvIADSB-B3lDP-sDj3m5Wf2Llbcqw9azNvAPGsp9C7YO6b4faUfjjh2kGAlij-6lw9FaYD1RkDCtfVptSVYz64Zb9PO1hdn_KBjNWvcZ9rvT82ZJ9K9_8SyJHfreGpmV6K01aeDsZm27Y-ZOW1hmlPiBTGxT8rC8KwVgGiXe1VW5wX0cLXMNZhZplXAtGzDujAv1Jwu9taJqadqIICWkinLKFALHffJlUGF4G8xprjgaiGf0nRsKHtvBhFrH5i1MUamoXn__A_S96axYnrrnj5CgNeka3NSCUvDmLahusnUL4gpOTesrqm1805O0beVRzaxARG7B9eXqKZhn5RSiR68P5e0AQSYUro1qi4R2jg6iBHMPqDpDHhO4xOvDDVcDZT_wFuHGo5tLXI8GkJj1eLktL8NlU92AlSxtudcq4ak1Hd3pIrIcOBeGEdgFADUhPSC-fOXF05XXOZiUMG8NSfzpsyKGkv0fLt3bkosIE6_23HHZV0WFeMj-26k1Yw1skWmd33ooA_-qTla4Dv-HF_A-ZN7io5-ZA0JnvT30rToGtgvcYXKowRx61gJTGZxX4GMo9PiluUisjF6aWHYCUNVijBj-SxrDHJf16RjtBzwxC0WhKVLCmphTcky-bsZ"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Profil">
                        <v-expansion-panel-text>
                          When digging, if an archaeologist is creating an artificial edge (like the edges of a trench or a section through a feature) then the edges have to be vertical – as straight as possible. This edge is called the profile. The archaeologist can then study the profile to understand the stratigraphy. The profile provides a picture of what is happening with the soil at that spot. Part of the recording process is then drawing and photographing this profile. <a href="https://www.archaeologic.org/archaeology-glossary} [Accessed: (26 November 2024"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Schichtprofil">
                        <v-expansion-panel-text>
                          A section gives archaeologists a view of what is happening in the stratigraphy at a certain point, in this way it is similar to a profile. A common method of excavation (especially in commercial archaeology) is to half-section a feature. This means that the archaeologist cuts the feature in half. The remaining artificial edge is the section. This section is then photographed and drawn. <a href="https://www.archaeologic.org/archaeology-glossary} [Accessed: (26 November 2024"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Sequenz">
                        <v-expansion-panel-text>
                          The study of rock relationships within a chronostratigraphic framework of repetitive, genetically related strata bounded by surfaces of erosion or nondeposition or their correlative conformities. <a href="https://watermark.silverchair.com/9780813759388_backmatter.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAAx8wggMbBgkqhkiG9w0BBwagggMMMIIDCAIBADCCAwEGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMrRv6SHjACAPG6l4KAgEQgIIC0vhd_zeH4BXSk6i6_Ov3cJJXdrUeZKL849WBn1pbSApdk04b3zinb3YtbFFJSc9eK8OK689qL5npDzhjnyq-nxPImmYwyToVb--zRPgDvjr8d5ui6Ee6KdAFLYBYscN3j6UHULarR25C3QZ2c1X6l8jENPqKjnqZNbmNsFJfrhVlcekHZro11jbQqH0Dj7oSjIkVxTtDKBPJx0w_CM0OVVPLcsyl8tqMZxJmsdanKu5M1b3dTbHIi6QZThwyN4N_NKftc_nSyPz5IQfShq9AaG7cTOyyeWJM0XVrEMRR7uLc2F0idKDwYBYcEyJfsGOna2ayZtvIADSB-B3lDP-sDj3m5Wf2Llbcqw9azNvAPGsp9C7YO6b4faUfjjh2kGAlij-6lw9FaYD1RkDCtfVptSVYz64Zb9PO1hdn_KBjNWvcZ9rvT82ZJ9K9_8SyJHfreGpmV6K01aeDsZm27Y-ZOW1hmlPiBTGxT8rC8KwVgGiXe1VW5wX0cLXMNZhZplXAtGzDujAv1Jwu9taJqadqIICWkinLKFALHffJlUGF4G8xprjgaiGf0nRsKHtvBhFrH5i1MUamoXn__A_S96axYnrrnj5CgNeka3NSCUvDmLahusnUL4gpOTesrqm1805O0beVRzaxARG7B9eXqKZhn5RSiR68P5e0AQSYUro1qi4R2jg6iBHMPqDpDHhO4xOvDDVcDZT_wFuHGo5tLXI8GkJj1eLktL8NlU92AlSxtudcq4ak1Hd3pIrIcOBeGEdgFADUhPSC-fOXF05XXOZiUMG8NSfzpsyKGkv0fLt3bkosIE6_23HHZV0WFeMj-26k1Yw1skWmd33ooA_-qTla4Dv-HF_A-ZN7io5-ZA0JnvT30rToGtgvcYXKowRx61gJTGZxX4GMo9PiluUisjF6aWHYCUNVijBj-SxrDHJf16RjtBzwxC0WhKVLCmphTcky-bsZ"> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Oberfläche">
                        <v-expansion-panel-text>
                          This term refers to the point of contact between different stratigraphic layers or units. Interfaces can be the result of natural processes such as erosion or deposition, or they can be the result of human activity, such as the construction of a wall or the digging of a pit. In the stratigraphic record, interfaces often represent points of change or transition, and studying them can provide important insights into the sequence and timing of events at an archaeological site. Apart from cuts (which form a special type of interface) interfaces are not commonly numbered as separate contexts, or recorded in the Matrix as a matter of course. <a href="https://archgoodpractice.com/glossary/#:~:text=be%20separately%20subgrouped.-,Deposit,waste%20products%2C%20or%20other%20debris."> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel class="system_tools__button" title="Sediment">
                        <v-expansion-panel-text>
                          In archaeology, a ‘deposit’ refers to the material left behind by a human activity, or sometimes natural processes. It can be a single event or the accumulated result of many. Often discussed as being either a layer or a fill, this material can include soil, artefacts, waste products, or other debris. <a href="https://archgoodpractice.com/glossary/#:~:text=be%20separately%20subgrouped.-,Deposit,waste%20products%2C%20or%20other%20debris."> => Quelle</a>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-row>
                
              </v-card>
            </v-dialog>
          </v-row>
  
          <!-- Editor Wechseln -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="pa-1 d-flex align-center justify-center tile" height="100" width="400">
              <v-btn class="px-14 modus_wechseln__button" v-on:click="changeEditor" height="100%" width="100%" elevation="24">
                Wechseln zu <br> {{ currentModeDisplayed }}-Editor
              </v-btn>
            </v-card>
          </v-row>
            
          <!-- Infobereich -->
          <v-row no-gutters style="width:fit-content;">
            <v-card class="pa-1 hollow" :height="windowHeight - 320" width="400">
              <v-card :disabled="infoCardDisabled" id="infoCard" class="pa-2 infobereich__base" height="100%" width="100%">
                <v-col class="pa-0">
                    
                  <!-- Unit Titel -->
                  <v-row no-gutters class="pb-2" align-content="center">
                    <v-card class="infobereich__title" width="100%" height="50" elevation="0">
                      <v-card-title class="pa-1">{{ selectedNodeName }}</v-card-title>
                    </v-card>
                  </v-row>
                    
                  <!-- Unit Bild -->
                  <v-row no-gutters class="pb-3">
                    <v-card class="pa-2 infobereich__image_outside" width="100%" height="300" elevation="0">
                      <v-card class="infobereich__image_inside" width="100%" height="272">{{  }}</v-card>
                    </v-card>
                  </v-row>
                    
                  <!-- Unit Attribute -->
                  <v-row no-gutters class="pb-3">
                    <v-card class="py-0" :max-height="windowHeight - 795" width="100%" elevation="0">
                      <v-list class="py-1 pa-1 infobereich__attributes_list" max-height="100%">
                          
                        <!-- UnitName -->
                        <v-card class="py-2 mb-3 infobereich__attributes_name" width="100%">
                          <v-row no-gutters class="mb-2">
                            <v-card class="pl-3 pb-1 infobereich__attributes_name_title" elevation=0 width="100%">
                              <v-card-title class="pt-0 pl-0 pr-0 pb-1" style="text-align: center; line-height: 100%;">Name</v-card-title>
                            </v-card>
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
                          <v-row no-gutters class="mb-2">
                            <v-card class="pl-3 pb-1 infobereich__attributes_type_title" elevation=0 width="100%">
                              <v-card-title class="pt-0 pl-0 pr-0 pb-1" style="text-align: center; line-height: 100%;">Typ</v-card-title>
                            </v-card>
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
                          <v-row no-gutters class="mb-2">
                            <v-card class="pl-3 pb-1 infobereich__attributes_description_title" elevation=0 width="100%">
                              <v-card-title class="pt-0 pl-0 pr-0 pb-1" style="text-align: center; line-height: 100%;">Beschreibung</v-card-title>
                            </v-card>
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
                        <v-card class="py-2 pb-0 mb-3 infobereich__attributes_type" width="100%" height="405">
                          <v-row no-gutters class="mb-2">
                            <v-card class="pl-3 infobereich__attributes_type_title" elevation="0" width="100%">
                              <v-card-title class="pt-0 pl-0 pr-0 pb-1" style="text-align: center; line-height: 100%;">Modell</v-card-title>
                            </v-card>
                          </v-row>
                          <!-- Load new 3D-Object -->
                          <v-card id="infoCard_attributes_createNewObject" class="pt-3 px-16 visible" variant="text" width="100%">
                            <v-btn class="infobereich__attributes_model_create_button" height="60" min-width="100%" @click="createAddModelDialog = true">
                                Neues Modell<br>hinzufügen
                            </v-btn>
                            <v-dialog v-model="createAddModelDialog" max-width="800" persistent>
                              <v-card class="pa-4 tile">
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
                            <!-- Ansprache -->
                            <v-row no-gutters class="mb-1">
                              <v-card variant="text">
                                <v-card-title class="pa-1 text-subtitle-1" >Ansprache:</v-card-title>
                                <v-card-subtitle>{{ selectedNodeModelName }}</v-card-subtitle>
                              </v-card>
                            </v-row>
                            <!-- Funde -->
                            <v-row no-gutters class="mb-1">
                              <v-card variant="text">
                                <v-card-title class="pa-1 text-subtitle-1">Funde:</v-card-title>
                              </v-card>
                            </v-row>
                            <v-row no-gutters class="mb-4 mx-3">
                              <v-list class="px-2 infobereich__attributes_model_finds_list" height="200" min-width="100%" max-width="100%">
                                <v-list-item class="mb-6 pa-0"  min-height="100" max-height="0" v-for="n in selectedFinds" :key="n">
                                  <v-row no-gutters>
                                    <v-col cols="10">
                                      <v-card class="pt-1 pl-3 pb-1 infobereich__attributes_model_list_item">
                                        <v-card-title class="pa-0 text-subtitle-1">
                                          Bezeichner: {{ n.findName }}<br/>Koordinaten:<br/> x: {{ n.findCorrds.x }}, y: {{ n.findCorrds.x }}, z: {{ n.findCorrds.x }}<br/>Modell vorhanden: {{ n.modelPresent }}
                                        </v-card-title>
                                      </v-card>
                                    </v-col>
                                    <v-col>
                                      <v-row no-gutters>
                                        <v-btn class="infobereich__attributes_model_finds_modify_button" height="58" min-width="0" max-width="0">
                                          <v-icon icon="mdi-wrench-cog" size="Large" @click="createModifyFindDialog = true;"></v-icon>
                                        </v-btn>
                                      </v-row>
                                      <v-row no-gutters>
                                        <v-btn class="infobereich__attributes_model_finds_delete_button" height="58" min-width="0" max-width="0">
                                          <v-icon icon="mdi-delete-empty" size="Large" @click="createDeleteFindDialog = true;"></v-icon>
                                        </v-btn>
                                      </v-row>
                                    </v-col>
                                  </v-row>
                                </v-list-item>
                                <v-dialog v-model="createDeleteFindDialog" max-width="320" persistent>
                                  <v-card class="pa-4">
                                    <v-card-title class="text-wrap" style="word-break: break-word;">Wollen sie den Fund {{ findToBeDeleted.id }} wirklich löschen?</v-card-title>
                                    <v-card-actions class="justify-center">
                                      <v-btn icon color="success" v-on:click="deleteFind( findToBeDeleted.id )">
                                        <v-icon>mdi-check-circle</v-icon>
                                      </v-btn>
                                      <v-btn icon color="primary" @click="createDeleteFindDialog = false">
                                        <v-icon>mdi-close-circle</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                                <v-dialog v-model="createModifyFindDialog" max-width="320" persistent>
                                  <v-card class="pa-4">
                                    <v-card-title class="text-wrap" style="word-break: break-word;">Wollen sie den Fund {{ findToBeDeleted.id }} wirklich löschen?</v-card-title>
                                    <v-card-actions class="justify-center">
                                      <v-btn icon color="success" v-on:click="deleteFind( findToBeDeleted.id )">
                                        <v-icon>mdi-check-circle</v-icon>
                                      </v-btn>
                                      <v-btn icon color="primary" @click="createModifyFindDialog = false">
                                        <v-icon>mdi-close-circle</v-icon>
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-list>
                            </v-row>
                            <v-row no-gutters>
                              <!-- Switch existing 3D-Object -->
                              <v-col cols="6">
                                <v-btn class="infobereich__attributes_model_switch_button" height="40" min-width="100%">
                                  <v-icon icon="mdi-wrench-cog" size="Large" @click="createSwitchObjektDiablog = true"></v-icon>
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
                                <v-btn class="infobereich__attributes_model_delete_button" height="40" min-width="100%">
                                  <v-icon icon="mdi-delete-empty" size="Large" @click="createDeleteModelDialog = true"></v-icon>
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
                          <v-row no-gutters class="mb-2">
                            <v-card class="pl-0 infobereich__attributes_type_title" elevation="0" width="100%">
                              <v-card-title class="pt-0 pl-0 pr-0 pb-1" style="text-align: center; line-height: 100%;">Stratigraphische Beziehungen</v-card-title>
                            </v-card>
                          </v-row>
                          <!-- <v-row no-gutters class="py-0" align-content="center">
                            <v-card class="pl-3 pb-1 infobereich__attributes_relations_title" elevation=0>:</v-card>
                          </v-row> -->
                          <v-row no-gutters class="px-2">
                            <v-list class="px-2 infobereich__attributes_relations_list" height="200" min-width="100%" max-width="100%">
                              <v-list-item class="mb-7 pb-0 px-0" max-height="0" v-for="n in selectedNodeRelations" :key="n">
                                <v-row no-gutters height="fit-content">
                                  <v-card class="pa-2 infobereich__attributes_relations_list_item" width="86%" height="70">
                                    Mit: {{ n.targetLabel }}<br/>Art: {{ n.type }}
                                  </v-card>
                                  <v-btn class="infobereich__attributes_relations_list_delete_button" height="70" min-width="0" max-width="0">
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
                    <v-btn class="infobereich__delete_unit_button" height="50" width="100%" @click="createDeleteNodeDialog = true" elevation="8">
                      Unit Löschen
                    </v-btn>
                    <v-dialog v-model="createDeleteNodeDialog" max-width="320" persistent>
                      <v-card class="pa-4">
                        <v-card-title class="text-wrap" style="word-break: break-word;">
                          Wollen sie die Unit wirklich löschen?
                        </v-card-title>
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
  import { Handle, Position } from '@vue-flow/core'

  import * as THREE from 'three';
  import { SUBTRACTION, Brush, Evaluator, GridMaterial } from 'three-bvh-csg'
  import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
  import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
  import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
  import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
  import { onMounted, onUnmounted, markRaw, ref, watch, toRaw } from 'vue';
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
  import { BufferGeometry } from 'three/src/Three.js';
  import { MeshStandardMaterial } from 'three/src/Three.js';
  
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
  var selectedFinds = ref([
    { findName: "Keramik", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
    { findName: "Fiebel", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
    { findName: "Fund 3", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
    { findName: "Fund 4", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
    { findName: "Fund 5", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
    { findName: "Fund 6", findCorrds: { x: "100", y: "100", z:"100" }, modelPresent: "Ja", model: null },
  ]); // array

  /** > > > > > > ---- < < < < < < **/
  /** > > > > > > Left < < < < < < **/
  /** > > > > > > ---- < < < < < < **/
  // ----Component----> Hilfe
  var createHelpDialog = ref(false)
  var aktiveHelpPageComponent = ref({
    name: "",
    description: "",
  }) // Object
  var aktiveHelpPageSubcomponents = ref([]) // array<Object>
  var aktiveHelpPageSubcomponent = ref({
    id: "",
    name: "",
    description: "",
  }) // Object
  var aktiveHelpPageSubcomponentName = ref("")
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
  var unitSearchDropDownMenueItems = ref([]); // array<string>
  // -Subcomponent-> Unit List (3D-Editor)
  var unitListContent = ref([]); // array<string>
  // ----Component----> Editoren

  /** > > > > > > ----- < < < < < < **/
  /** > > > > > > Right < < < < < < **/
  /** > > > > > > ----- < < < < < < **/
  // ----Component----> Glossar
  var createGlossarDialog = ref(false)
  // ----Component----> Modus wechseln
  var currentMode = ref("Graph") // string
  var currentModeDisplayed = ref("3D") // string
  // ----Component----> Infobereich
  var infoCardDisabled = ref(true); // boolean
  var createDeleteNodeDialog = ref(false) // boolean
  var createDeleteNodeRelationDialog = ref(false) // boolean
  var createAddModelDialog = ref(false) // boolean
  var createDeleteModelDialog = ref(false) // boolean
  var createSwitchObjektDiablog = ref(false) // boolean
  var edgeToBeDeleted = ref(null) // array<>
  var createDeleteFindDialog = ref(false) //boolean
  var findToBeDeleted = ref(null) // int
  var createModifyFindDialog = ref(false) //boolean
  

  /**
   * [-------------------------------------------------------------------------]
   * [----------------------- Non-Reactive Variables --------------------------]
   * [-------------------------------------------------------------------------]
   */
  const getData = await fromOfflineDB.getAllObjects("StratiToolDB", "stratiTool");
  const { width, height } = useWindowSize();
  const windowHeight = height; // int
  const windowWidth = width; // int
  var currentlySelectedNodeID = ""; // string
  var currentlySelectedNodeType = ""; // string
  var connectionInProgress = false; // boolean
  var idOfCurrentStratiTool = ""; // string
  var alreadyCut = false; // boolean
  var enviromentParameter = {
    renderer: null,
    scene: null,
    camera: null,
    savedCamera: null,
    arcballControls: null,
    transformControls: null,
    ambientLight: null,
    directionalLight: null,
    objects: null,
    needsUpdate: true,
    csgEvaluator: null,
    brushToCutWith: null,
    brushesToBeCut: [],
    effectComposer: null,
    renderPass: null,
    outlinePass: null,
    fxaaShader: null,
    gammaCorrectionShader: null,
    params: {
      arcballControlsShowGizmo: true,
      transformControlsShowGizmo: false,
    }
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
  const helpComponents = {
    module: {
      component: {
        id: "helpComponentModule",
        name: "Module",
        description: "Diese Komponente bietet allgemeine Funktionen für beispielsweise den Exp/Import des aktuellen Bearbeitungsstands oder die Erstellung einer momentanen Aufnahme eines eigens gewählten Ausschnits der Harris-Matrix. Der obere Bereich der Komponente ermöglicht über die beiden Pfeile durch die einzelnen Module zu wechseln und diese auszuwählen. Dabei wird der Name des aktuell ausgewählten Moduls in der Mitte zwischen beiden Pfeilen angezeigt. Der BEreich darunter beeinhaltet, je nach ausgewählten Modul, die gegebenene Funktionalität.",
      },
      subcomponents: [
        { id: "helpScreenshot", 
          containerID: "helpSubcomponentModulesScreenshotContainer", 
          name: "Screenshot", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
        {
          id: "helpGroup", 
          containerID: "helpSubcomponentModulesGroupContainer", 
          name: "Group", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
        {
          id: "helpView", 
          containerID: "helpSubcomponentModulesViewContainer", 
          name: "View", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
        {
          id: "helpExpImp", 
          containerID: "helpSubcomponentModulesExpImpContainer", 
          name: "Exp/Imp", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
        {
          id: "helpFilter", 
          containerID: "helpSubcomponentModulesFilterContainer", 
          name: "Filter", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
        {
          id: "helpTimemodel", 
          containerID: "helpSubcomponentModulesTimemodelContainer", 
          name: "Timemodel", 
          description: "TODO", 
          smallNavigationID: "helpSmallNavigationModule",
        },
      ],
      
    },
    systemTools: {
      component: {
        id: "helpComponentHarrisMatrixTools",
        name: "System - Tools",
        description: "TODO",
      },
      subcomponents: [
        {
          id: "helpSaveGraph", 
          containerID: "helpSubcomponentHarrisMatrixToolsContainer", 
          name: "Harris-matrix speichern", 
          description: "TODO"},
        {
          id: "helpChangeProcessingStep", 
          containerID: "helpSubcomponentHarrisMatrixToolsContainer", 
          name: "Arbeitsschritt wechseln", 
          description: "TODO"
        },
      ],
    },
    graph3dTools: {
      component: {
        id: "helpComponentGraph3dTools",
        name: "Graph/3D - Tools",
        description: "Innerhalb dieser Komponente werden Funktionen für die Interaktion mit den beiden Editoren bereitgestellt. Dabei ändern sich die bereitsgestellten Tools je nachdem welcher Editor aktuell ausgewählt ist.",
      },
      subcomponents: [
        {
          id: "helpUnitCreateUnit", 
          containerID: "helpSubcomponentGraphToolsContainer", 
          name: "Neue Unit erstellen (Graph)", 
          description: "Mittels dieser Subkomponente lassen sich neue Units dem Graphen hinzufügen. Jede neu erstellte Unit wird dabei mit dem Namen: 'Neue Unit_' + einem Index erstellt. Dieser kann im nachhinein über den Infobereich angepasst werden. Die Erstellung einer neuen Unit erfolgt in drei Schritten:"
        },
        {
          id: "helpUnitSearch", 
          containerID: "helpSubcomponentGraphToolsContainer", 
          name: "Unit suchen (Graph)", 
          description: "TODO",
        },
        {
          id: "helpUnitCleanUp", 
          containerID: "helpSubcomponentGraphToolsContainer", 
          name: "Unit aufräumen (Graph)", 
          description: "TODO",
        },
        {
          id: "helpUnitList", 
          containerID: "helpSubcomponent3dToolsContainer", 
          name: "Auflistung aller Units (3D)", 
          description: "TODO",
        },
        {
          id: "help3dCut", 
          containerID: "helpSubcomponent3dToolsContainer", 
          name: "Schneiden von 3D-Objekten (3D)", 
          description: "TODO",
        },
      ],
    },
    graph3dEditor: {
      component: {
        id: "helpComponentGraph3dEditor",
        name: "Graph/3D - Editor",
        description: "TODO",
      },
      subcomponents: [
        {
          id: "helpGraphEditor", 
          containerID: "helpGraphEditorContainer", 
          name: "Interaktion mit dem Graph", 
          description: "TODO",
        },
        {
          id: "help3dEditor", 
          containerID: "help3dEditorContainer", 
          name: "Interaktion mit 3D-Objekten", 
          description: "TODO",
        },
      ],
    },
    glossar: {
      component: {
        id: "helpComponentGlossar",
        name: "Glossar",
        description: "TODO",
      },
      subcomponents: [
        {
          id: "helpGlossar", 
          containerID: "helpGlossarContainer", 
          name: "Bespaßigung ihrer Glossarität", 
          description: "TODO",
        },
      ],
    },
    changeEditor: {
      component: {
        id: "helpComponentChangeEditor",
        name: "Editor wechseln",
        description: "TODO",
      },
      subcomponents: [
        {
          id: "helpChangeEditor", 
          containerID: "helpChangeEditorContainer", 
          name: "Wechsel zwischen beiden Editoren", 
          description: "TODO",
        },
      ],
    },
    infoCard: {
      component: {
        id: "helpComponentInfoCard",
        name: "Infobereich",
        description: "TODO",
      },
      subcomponents: [
      {
        id: "helpInfoCardUnitTitle", 
        containerID: "helpInfoCardContainer", 
        name: "Name der Unit", 
        description: "TODO",
      },
      {
        id: "helpInfoCardUnitImage", 
        containerID: "helpInfoCardContainer", 
        name: "Bild der Unit", 
        description: "TODO",
      },
      {
        id: "helpInfoCardUnitAttributes", 
        containerID: "helpInfoCardContainer", 
        name: "Beschreibende Attribute der Unit", 
        description: "TODO",
      },
      {
        id: "helpInfoCardUnitDelete", 
        containerID: "helpInfoCardContainer", 
        name: "Löschen einer Unit", 
        description: "TODO",
      },
      ],
    },
  }
  var lastHelpComponentClicked = "";
  var lastHelpSubcomponentClicked = "";
  var lastHelpSubcomponentContainerClicked = "";
  var lastSmallNavigationComponentClicked = "";

  function changeHelpPageComponent(selectedComponentName) {
    for( const [ componentName, items ] of Object.entries(helpComponents) ){
      if( componentName == selectedComponentName ){

        let helpComponent = null;
        let helpSubcomponent = null;
        let helpSubcomponentContainer = null;

        if( componentName === "module" ){
          aktiveHelpPageSubcomponent.value.name = items.subcomponents[0].name
        }
        aktiveHelpPageSubcomponentName.value = ""
        aktiveHelpPageSubcomponent.value.description = ""
      
        if( lastHelpComponentClicked != "" ){
          helpComponent = document.getElementById(lastHelpComponentClicked)
          helpComponent.classList.remove("help_element__visible")
          helpComponent.classList.add("help_element__notVisible")
          let helpSmallNavigation = document.getElementById(lastSmallNavigationComponentClicked)
          helpSmallNavigation.classList.remove("help_componend__focus")
          helpSmallNavigation.classList.add("help_componend__notFocus")
          const smallNavigationID = "helpSmallNavigation" + selectedComponentName
          helpSmallNavigation = document.getElementById(smallNavigationID)
          helpSmallNavigation.classList.remove("help_componend__notFocus")
          helpSmallNavigation.classList.add("help_componend__focus")
          lastSmallNavigationComponentClicked = smallNavigationID
        } else {
          const smallNavigationID = "helpSmallNavigation" + selectedComponentName
          let helpSmallNavigation = document.getElementById(smallNavigationID)
          helpSmallNavigation.classList.remove("help_componend__notFocus")
          helpSmallNavigation.classList.add("help_componend__focus")
          lastSmallNavigationComponentClicked = smallNavigationID
        }
        lastHelpComponentClicked = items.component.id
        
        if( lastHelpSubcomponentClicked != "" ){
          helpSubcomponent = document.getElementById(lastHelpSubcomponentClicked)
          helpSubcomponent.classList.remove("help_subcomponend__focus")
          helpSubcomponent.classList.add("help_subcomponend__notFocus")
          let subcomponentDescription = document.getElementById("subcomponentDescription")
          subcomponentDescription.classList.remove("help_element__visible")
          subcomponentDescription.classList.add("help_element__notVisible")
          let defaultSubcomponentDescription = document.getElementById("defaultSubcomponentDescription")
          defaultSubcomponentDescription.classList.remove("help_element__notVisible")
          defaultSubcomponentDescription.classList.add("help_element__visible")
        } else {
          let subcomponentDescription = document.getElementById("subcomponentDescription")
          subcomponentDescription.classList.remove("help_element__visible")
          subcomponentDescription.classList.add("help_element__notVisible")
          let defaultSubcomponentDescription = document.getElementById("defaultSubcomponentDescription")
          defaultSubcomponentDescription.classList.remove("help_element__notVisible")
          defaultSubcomponentDescription.classList.add("help_element__visible")
        }
        let helpSubcomponentButton = document.getElementById(lastHelpSubcomponentClicked + 'Button')
        if( helpSubcomponentButton != undefined ){
          helpSubcomponentButton.classList.remove("help_subcomponent_button__clicked")
          helpSubcomponentButton.classList.add("help_subcomponent_button__notClicked")
        }
        lastHelpSubcomponentClicked = items.subcomponents[0].id
        
        if( lastHelpSubcomponentContainerClicked != "" ){
          helpSubcomponentContainer = document.getElementById(lastHelpSubcomponentContainerClicked)
          helpSubcomponentContainer.classList.remove("help_element__visible")
          helpSubcomponentContainer.classList.add("help_element__notVisible")
        }
        
        if( items.subcomponents[0].containerID != undefined ){
          helpSubcomponentContainer = document.getElementById(items.subcomponents[0].containerID)
          helpSubcomponentContainer.classList.remove("help_element__notVisible")
          helpSubcomponentContainer.classList.add("help_element__visible")
          lastHelpSubcomponentContainerClicked = items.subcomponents[0].containerID
        }

        aktiveHelpPageComponent.value.name = items.component.name
        aktiveHelpPageComponent.value.description = items.component.description

        aktiveHelpPageSubcomponents.value = items.subcomponents
        
        helpComponent = document.getElementById(items.component.id)
        helpComponent.classList.remove("help_element__notVisible")
        helpComponent.classList.add("help_element__visible")
        
        const helpOverview = document.getElementById("helpOverview")
        const helpDetailView = document.getElementById("helpDetailView")
        helpOverview.classList.remove("help_element__visible")
        helpOverview.classList.add("help_element__notVisible")
        helpDetailView.classList.remove("help_element__notVisible")
        helpDetailView.classList.add("help_element__visible")
        break;
      }
    }
  }

  function changeHelpPageSubcomponent(selectedSubcomponent) {
    let helpSubcomponent = null;
    let helpSubcomponentContainer = null;

    aktiveHelpPageSubcomponent.value.name = selectedSubcomponent.name
    aktiveHelpPageSubcomponentName.value = selectedSubcomponent.name
    aktiveHelpPageSubcomponent.value.description = selectedSubcomponent.description

    let subcomponentDescription = document.getElementById("subcomponentDescription")
    subcomponentDescription.classList.remove("help_element__notVisible")
    subcomponentDescription.classList.add("help_element__visible")
    
    let defaultSubcomponentDescription = document.getElementById("defaultSubcomponentDescription")
    defaultSubcomponentDescription.classList.remove("help_element__visible")
    defaultSubcomponentDescription.classList.add("help_element__notVisible")

    if(selectedSubcomponent.containerID != undefined){
      if( lastHelpSubcomponentContainerClicked != "" && lastHelpSubcomponentContainerClicked != selectedSubcomponent.containerID ){
        helpSubcomponentContainer = document.getElementById(lastHelpSubcomponentContainerClicked)
        helpSubcomponentContainer.classList.remove("help_element__visible")
        helpSubcomponentContainer.classList.add("help_element__notVisible")
        lastHelpSubcomponentContainerClicked = selectedSubcomponent.containerID
      }
      helpSubcomponentContainer = document.getElementById(selectedSubcomponent.containerID)
      helpSubcomponentContainer.classList.remove("help_element__notVisible")
      helpSubcomponentContainer.classList.add("help_element__visible")
    }

    if( lastHelpSubcomponentClicked != "" && lastHelpSubcomponentClicked != selectedSubcomponent.id ){
      helpSubcomponent = document.getElementById(lastHelpSubcomponentClicked)
      helpSubcomponent.classList.remove("help_subcomponend__focus")
      helpSubcomponent.classList.add("help_subcomponend__notFocus")
      let helpSubcomponentButton = document.getElementById(lastHelpSubcomponentClicked + 'Button')
      helpSubcomponentButton.classList.remove("help_subcomponent_button__clicked")
      helpSubcomponentButton.classList.add("help_subcomponent_button__notClicked")
      lastHelpSubcomponentClicked = selectedSubcomponent.id
    }

    let helpSubcomponentButton = document.getElementById(selectedSubcomponent.id + 'Button')
    helpSubcomponentButton.classList.remove("help_subcomponent_button__notClicked")
    helpSubcomponentButton.classList.add("help_subcomponent_button__clicked")
    helpSubcomponent = document.getElementById(selectedSubcomponent.id)
    helpSubcomponent.classList.remove("help_subcomponend__notFocus")
    helpSubcomponent.classList.add("help_subcomponend__focus")
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
        if( currentlySelectedNodeID != "" ) {
          changeNodeInUnitsListToNotClickedStyle( currentlySelectedNodeID )
        }
        zoomToNode(nodesInGraph[a].id);
        selectedNodeModelName.value = ""
        fillInfoCard(nodesInGraph[a]);

        enviromentParameter.outlinePass.selectedObjects.pop()
        const objectsInScene = enviromentParameter.scene.children.slice(3, -2)
        const objectsInSceneLength = objectsInScene.length
        const nodeID = nodesInGraph[a].id
        for( let a = 0; a < objectsInSceneLength; a++ ){
          if( objectsInScene[a].userData.nodeID == nodeID ){
            if( objectsInScene[a].name.indexOf('Result') > -1 ){
              enviromentParameter.outlinePass.selectedObjects.push(objectsInScene[a])
            }
          }
        }
        changeNodeInUnitsListToClickedStyle(nodesInGraph[a].id)
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else if( currentlySelectedNodeID != "" && currentMode.value != "3D" ) {
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
    if( whichMode == "Graph" ){
      currentModeDisplayed.value = "3D"
      enviromentParameter.renderer.setAnimationLoop(null);
      changeVisibility("canvas_graph", "visible")
      changeVisibility("units_graphTools", "visible")
      
      changeVisibility("canvas_3d", "notVisible")
      changeVisibility("units_3dTools", "notVisible")
    } else if( whichMode == "3D" ){
      currentModeDisplayed.value = "Harris-Matrix"
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
  onInit(() => {
    if( getData.length > 0 ){
      initGraph()
    } else {
      saveProcessingStep("init");
    }
  })

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function initGraph() {
    if( allProcessingSteps.value.length > 0 ){
      loadProcessingStep(currentProcessingStep.value - 1, "onInit")
      enableOrDisableProcessingStepButtons()
      addNodesToUnitSearchAndUnitList()
    }
  }

  function loadProcessingStep(whichStep, when) {
    const parsedProcessingStep = JSON.parse(allProcessingSteps.value[whichStep].step);

    if( currentProcessingStep.value > 1 && (allProcessingSteps.value[whichStep].type === "addNewNode") ){
      const lastNodeID = parsedProcessingStep.nodes[parsedProcessingStep.nodes.length - 1].id;
      fromObject(parsedProcessingStep);
      if( when === "forward" ){
        updateNode(lastNodeID, (node) => ({
          position: { x: node.position.x - 100 / 2, y: node.position.y - 100 / 2 }
        }))
      } else {
        updateNode(lastNodeID, (node) => ({
          position: {x: node.position.x - node.dimensions.width / 2, y: node.position.y - node.dimensions.height / 2},
        }));
      }
    }
    else {
      fromObject(parsedProcessingStep);
    }
  }

  function enableOrDisableProcessingStepButtons() {
    if( currentProcessingStep.value > 1 ){
      processStepBackButtonDisabled.value = false;
    } else {
      processStepBackButtonDisabled.value = true;
    }
    if( currentProcessingStep.value < allProcessingSteps.value.length ){
      processStepForwardButtonDisabled.value = false;
    } else {
      processStepForwardButtonDisabled.value = true;
    }
  }
  
  function addNodesToUnitSearchAndUnitList() {
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].data.selected === true ){
        fillInfoCard(nodesInGraph[a]);
      }
      addNodeToUnitSearchDropDownMenue(nodesInGraph[a])
      addNodeToUnitList(nodesInGraph[a])
    }
  }

  function addNodeToUnitSearchDropDownMenue(node) {
    unitSearchDropDownMenueItems.value.push(node.data.label);
  }
  
  function addNodeToUnitList(node) {
    let newUnitListEntry = createUnitListEntry(node)
    unitListContent.value.push(newUnitListEntry);
  }

  function createUnitListEntry(node) {
    if( node.data.selected === true ){
      return { id: node.id, label: node.data.label, class: "mx-1 units__3d_list_button_clicked" }
    } else {
      return { id: node.id, label: node.data.label, class: "mx-1 units__3d_list_button_notClicked" }
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
      'top_middle': 'after',
      'bottom_middle': 'before',
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
    if( currentlySelectedNodeID !== "" ){
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
      const nonValidBeforeReduction = []
      if( nodesInGraph[a].id == params.nodeId ) {
        changeNodeHandleConnectionStatus(nodesInGraph[a], "top_middle", false)
        changeNodeHandleConnectionStatus(nodesInGraph[a], "bottom_middle", false)
        changeNodeHandleConnectionStatus(nodesInGraph[a], "left_middle", false)
        changeNodeHandleConnectionStatus(nodesInGraph[a], "right_middle", false)
        
        switch( params.handleId ){
          case 'top_middle':
            nonValidNodes.push( ...checkRelationsAfter(nodesInGraph[a].data.relations, nodesInGraph[a].id, []));
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                changeNodeHandleConnectionStatus(nodesInGraph[b], "top_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "left_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "right_middle", false)
                if( nonValidNodes.includes(nodesInGraph[b].id) ){
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "bottom_middle", false)
                }
              }
            }
            break;
          case 'bottom_middle':
            nonValidNodes.push( ...checkRelationsBefore( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                changeNodeHandleConnectionStatus(nodesInGraph[b], "bottom_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "left_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "right_middle", false)
                if( nonValidNodes.includes(nodesInGraph[b].id) ){
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "top_middle", false)
                }
              }
            }
            break;
          case 'left_middle':
            nonValidNodes.push(...checkRelationsCorrelating( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            nonValidBeforeReduction.push(...reduceNonValidIDsByRowIDs(nonValidNodes, nodesInGraph[a].id))
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                changeNodeHandleConnectionStatus(nodesInGraph[b], "top_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "bottom_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "left_middle", false)
                if( nonValidBeforeReduction.includes(nodesInGraph[b].id) ){
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "left_middle", false)
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "right_middle", false)
                }
              }
            }
            break;
          case 'right_middle':
            nonValidNodes.push( ...checkRelationsCorrelating( nodesInGraph[a].data.relations, nodesInGraph[a].id, [] ) );
            nonValidBeforeReduction.push( ...reduceNonValidIDsByRowIDs(nonValidNodes) )
            for( let b = 0; b < nodesInGraphLength; b++ ){
              if( nodesInGraph[b].id != params.nodeId ) {
                changeNodeHandleConnectionStatus(nodesInGraph[b], "top_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "bottom_middle", false)
                changeNodeHandleConnectionStatus(nodesInGraph[b], "right_middle", false)
                if( nonValidBeforeReduction.includes(nodesInGraph[b].id) ){
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "left_middle", false)
                  changeNodeHandleConnectionStatus(nodesInGraph[b], "right_middle", false)
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
      changeNodeHandleConnectionStatus(nodesInGraph[a], "top_middle", true)
      changeNodeHandleConnectionStatus(nodesInGraph[a], "bottom_middle", true)
      changeNodeHandleConnectionStatus(nodesInGraph[a], "left_middle", true)
      changeNodeHandleConnectionStatus(nodesInGraph[a], "right_middle", true)
      changeNodeHandleStyle(nodesInGraph[a], "top_middle", "default")
      changeNodeHandleStyle(nodesInGraph[a], "bottom_middle", "default")
      changeNodeHandleStyle(nodesInGraph[a], "left_middle", "default")
      changeNodeHandleStyle(nodesInGraph[a], "right_middle", "default")
    }
  })

  function changeNodeHandleConnectionStatus(node, handlePosition, status) {
    node.data.validConnections[handlePosition] = status;
  }
  
  function changeNodeHandleStyle(node, handlePosition, style) {
    node.data.styles[handlePosition] = handleStyles[node.type][style][handlePosition]
  }



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
    updateNodeStyleInUnitListSubcomponent(params.node);
    updateNodeStylesInGraph(params.node);
    saveProcessingStep("nodeInGraphClicked")
  })

  function updateNodeStylesInGraph(clickedNode) {
    changeAllNodeStylesToNotClicked(clickedNode);
    changeClickedNodeStyleToClickedAndFillInfoCard(clickedNode);
  }

  function updateNodeStyleInUnitListSubcomponent(clickedNode) {
    if( currentlySelectedNodeID != "" ){
      changeNodeInUnitsListToNotClickedStyle(currentlySelectedNodeID)
    }
    changeNodeInUnitsListToClickedStyle(clickedNode.id)
  }

  function changeAllNodeStylesToNotClicked(){
    const nodesInGraph = getNodes.value;
    const nodesInGraphLength = nodesInGraph.length;
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].data.selected == true ) {
        changeNodeInGraphToNotClickedStyle(nodesInGraph[a])
        break;
      }
    }
  }

  function changeClickedNodeStyleToClickedAndFillInfoCard(clickedNode){
    clearInfoCard()
    fillInfoCard(clickedNode)
    changeNodeInGraphToClickedStyle(clickedNode)
  }

  function changeNodeInGraphToClickedStyle(node) {
    node.data.nodeStyle = "clicked_" + node.type;
    node.data.selected = true;
  }

  function changeNodeInGraphToNotClickedStyle(node) {
    node.data.nodeStyle = "notClicked_" + node.type;
    node.data.selected = false;
  }

  function changeNodeInUnitsListToClickedStyle(nodeID) {
    const node = document.getElementById(nodeID);
    node.classList.remove("units__3d_list_button_notClicked");
    node.classList.add("units__3d_list_button_clicked");
  }

  function changeNodeInUnitsListToNotClickedStyle(nodeID) {
    const node = document.getElementById(nodeID);
    node.classList.remove("units__3d_list_button_clicked");
    node.classList.add("units__3d_list_button_notClicked");
  }

  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called on a pointer click event on the pane. Resets the style of the 
   * selected node back to its default appearance.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * =====>>> type: paneClicked
   * 
   */
  onPaneClick(() => {
    if( getNodes.value.length != 0 ) {
      resetAllNodeStylesToNotClickedAndClearInfoCard()
      saveProcessingStep( "paneClicked" )
    }
  })

  function resetAllNodeStylesToNotClickedAndClearInfoCard() {
    const nodesInGraph = getNodes.value;
      const nodesInGraphLength = nodesInGraph.length;
      for( let a = 0; a < nodesInGraphLength; a++ ){
        if( nodesInGraph[a].id == currentlySelectedNodeID ) {
          clearInfoCard()
          changeNodeInUnitsListToNotClickedStyle(nodesInGraph[a].id)
          changeNodeInGraphToNotClickedStyle(nodesInGraph[a])
          break;
        }
      }
  }



  /**                            Vue-flow function
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * Called after adding/changing a node in the graph. Adds the label of the 
   * newly created node to the unit-search sub-component.
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  onNodesChange((changes) => {
    if( changes[0].type == "add" ){
      addNodeToUnitSearchDropDownMenue(changes[0].item)
      addNodeToUnitList(changes[0].item)
    } else if( changes[0].type == "remove") {
      removeNodesFromUnitSearchAndUnitList(changes[0].id)
      resetDefaultNodeIndex()
    }
  })
  
  function resetDefaultNodeIndex() {
    const nodesInGraphLength = getNodes.value.length
    if( nodesInGraphLength == 0 ){
      highestIndexOfDefaultNode.value = '0'
    }
  }

  function removeNodesFromUnitSearchAndUnitList(nodeID) {
    const nodesInUnitListLength = unitListContent.value.length
    for( let b = 0; b < nodesInUnitListLength; b++ ){
      if( unitListContent.value[b].id == nodeID ){
        removeNodeFromUnitSearchDropDownMenue(unitListContent.value[b])
        removeNodeFromUnitList(b)
        break;
      }
    }
  }

  function removeNodeFromUnitSearchDropDownMenue(node) {
    if( unitSearchDropDownMenueItems.value.includes(node.label) ) {
      let nodeIndex = unitSearchDropDownMenueItems.value.indexOf(node.label);
      unitSearchDropDownMenueItems.value.splice(nodeIndex, 1);
    }
  }

  function removeNodeFromUnitList(nodeIndex) {
    unitListContent.value.splice(nodeIndex, 1)
  }


  
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
        if( nodesInGraph[a].id === param.node.id ) {
          const handleStatusTopMiddle = getHandleStatus(param.node.data.validConnections.top_middle)
          changeNodeHandleStyle(nodesInGraph[a], "top_middle", handleStatusTopMiddle)
          
          const handleStatusBotomMiddle = getHandleStatus(param.node.data.validConnections.bottom_middle)
          changeNodeHandleStyle(nodesInGraph[a], "bottom_middle", handleStatusBotomMiddle)
          
          const handleStatusLeftMiddle = getHandleStatus(param.node.data.validConnections.left_middle)
          changeNodeHandleStyle(nodesInGraph[a], "left_middle", handleStatusLeftMiddle)
          
          const handleStatusRightMiddle = getHandleStatus(param.node.data.validConnections.right_middle)
          changeNodeHandleStyle(nodesInGraph[a], "right_middle", handleStatusRightMiddle)
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
        if( nodesInGraph[a].id === param.node.id ) {
          changeNodeHandleStyle(nodesInGraph[a], "top_middle", "default")
          changeNodeHandleStyle(nodesInGraph[a], "bottom_middle", "default")
          changeNodeHandleStyle(nodesInGraph[a], "left_middle", "default")
          changeNodeHandleStyle(nodesInGraph[a], "right_middle", "default")
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
    currentlySelectedNodeID = node.id
    currentlySelectedNodeType = node.type
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
      const objectsInScene = enviromentParameter.scene.children.slice(3, -2)
      const objectsInSceneLength = objectsInScene.length
      for( let a = 0; a < objectsInSceneLength; a++ ){
        if( objectsInScene[a].userData.nodeID == node.id ){
          if( objectsInScene[a].name.indexOf('Result') > -1 ){
            enviromentParameter.outlinePass.selectedObjects.push(objectsInScene[a])
          } else {
            selectedNodeModelName.value = objectsInScene[a].name
          }
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
    currentlySelectedNodeID = "";
    currentlySelectedNodeType = "";
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
    enviromentParameter.outlinePass.selectedObjects.pop()
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
      if( currentProcessingStep.value != allProcessingSteps.value.length && !alreadyCut ) {
        alreadyCut = true;
        allProcessingSteps.value = allProcessingSteps.value.slice( 0, currentProcessingStep.value )
        allProcessingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
        currentProcessingStep.value = currentProcessingStep.value + 1
      } else {
        alreadyCut = false
        allProcessingSteps.value.push( { type: changeType, step: JSON.stringify(toObject()) } );
        currentProcessingStep.value = currentProcessingStep.value + 1;
      }
    }
    
    enableOrDisableProcessingStepButtons()
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
    unitSearchDropDownMenueItems.value = [];
    unitListContent.value = []

    currentProcessingStep.value = currentProcessingStep.value - 1
    loadProcessingStep(currentProcessingStep.value - 1, "back")
    
    enableOrDisableProcessingStepButtons()
    addNodesToUnitSearchAndUnitList()
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
    unitSearchDropDownMenueItems.value = [];
    unitListContent.value = [];

    currentProcessingStep.value = currentProcessingStep.value + 1
    loadProcessingStep(currentProcessingStep.value - 1, "forward")
    
    enableOrDisableProcessingStepButtons()
    addNodesToUnitSearchAndUnitList()
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
    const selectedNodeRelations2 = nodesInGraph[ nodesInGraph.map( (x) => {return x.id} ).indexOf( currentlySelectedNodeID ) ].data.relations;
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
  function checkRelationsBefore( relations, nodeID, nonValidNodes ) {
    let nonValid = nonValidNodes
    
    if( relations.length > 0 ) {
      const nodesInGraph = getNodes.value
      const nodesInGraphLength = nodesInGraph.length
      const relationslength = relations.length
      for( let a = 0; a < relationslength; a++ ) {
        if( (relations[a].relationType == 'before' || relations[a].relationType == 'korrelation') && !nonValid.includes(relations[a].id)){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
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
  function checkRelationsAfter( relations, nodeID, nonValidNodes ) {
    let nonValid = nonValidNodes
    
    if( relations.length > 0 ) {
      const relationsLength = relations.length
      const nodesInGraph = getNodes.value
      const nodesInGraphLength = nodesInGraph.length
      for( let a = 0; a < relationsLength; a++ ){
        if( (relations[a].relationType == 'after' || relations[a].relationType == 'korrelation') && !nonValid.includes(relations[a].id)){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ) {
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
        if( relations[a].relationType == 'after' && !nonValid.includes(relations[a].id) ){
          nonValid.push(relations[a].id)
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsAfter( nodesInGraph[b].data.relations, nodeID, nonValid )
              nonValid.push(... nonValidIDs );
              nonValid = [ ...new Set(nonValid) ];
              break nodes;
            }
          }
        } else if( relations[a].relationType == 'before' && !nonValid.includes(relations[a].id) ){
          nonValid.push( relations[a].id )
          nodes: for( let b = 0; b < nodesInGraphLength; b++ ){
            if( nodesInGraph[b].id == relations[a].id ) {
              const nonValidIDs = checkRelationsBefore( nodesInGraph[b].data.relations, nodeID, nonValid )
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
          if( relation.id == currentlySelectedNodeID ) {
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
   * Deletes a find and its corresponding 3D-model, if one is present
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * ================>>>> saves the current processing step <<<<================
   * ====>>> type: deleteFind
   * 
   * @param findID 
   */
  function deleteFind( findID ) {
    console.log("WORK IN PROGRESS")
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
          const index = unitSearchDropDownMenueItems.value.indexOf(node.data.label);
          unitSearchDropDownMenueItems.value.splice(index, 1);
          unitSearchDropDownMenueItems.value.push(input);

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
        if( node.id == currentlySelectedNodeID ) {
          currentlySelectedNodeType = newType;
          node.type = newType;
          node.data.nodeStyle = "clicked_" + newType;
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
    if( currentMode.value == "3D" ){
      currentMode.value = "Graph";
    } else if( currentMode.value == "Graph" ){
      currentMode.value = "3D";
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
  function getHandleStatus(connection) { 
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
        if( currentlySelectedNodeID != "" ) {
          changeNodeInUnitsListToNotClickedStyle( currentlySelectedNodeID )
        }
        clearInfoCard()
        fillInfoCard(nodesInGraph[a])
        
        changeNodeInUnitsListToClickedStyle(nodesInGraph[a].id)
        nodesInGraph[a].data.nodeStyle = "clicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = true;
      } else if( nodesInGraph[a].id == nodeID && nodesInGraph[a].data.selected ) {
        changeNodeInUnitsListToNotClickedStyle( nodesInGraph[a].id )
        clearInfoCard()
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      } else {
        changeNodeInUnitsListToNotClickedStyle( nodesInGraph[a].id )
        nodesInGraph[a].data.nodeStyle = "notClicked_" + nodesInGraph[a].type;
        nodesInGraph[a].data.selected = false;
      }
    }
    saveProcessingStep("nodeInUnitListClicked")
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
      nodeID: currentlySelectedNodeID,
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
    const gismos = cutControls()
    
    const newBrushObject = {
      brush: new Brush( new THREE.BoxGeometry(), new GridMaterial() ),
      materialMap: new Map(),
      resultObjectFromCsgOperation: resultObjectsFromCsgOperation(loadedObject),
      operationType: getOperationType(),
    }
    newBrushObject.brush.name = loadedObject.name
    newBrushObject.brush.userData.id = loadedObject.userData.id
    newBrushObject.brush.userData.nodeID = loadedObject.userData.nodeID
    
    
    updateBrush( newBrushObject.brush, 'mesh', brushParams.brush1Complexity, loadedObject.children[0].geometry )
    updateMaterialOfBrushToBeCut( newBrushObject.brush, loadedObject.children[0].material )
    updateMaterialMap( newBrushObject )
    
    enviromentParameter.scene.add( newBrushObject.brush )
    enviromentParameter.scene.add( newBrushObject.resultObjectFromCsgOperation.resultObject )

    pasteControls(gismos)
    enviromentParameter.outlinePass.selectedObjects.pop()
    enviromentParameter.outlinePass.selectedObjects.push(newBrushObject.resultObjectFromCsgOperation.resultObject)
    enviromentParameter.brushesToBeCut.push(newBrushObject);
  }

  const someColors = [ 0xC2F970, 0x44344F, 0x564D80, 0x98A6D4, 0xD3FCD5, 0xA8763E, 0x6F1A07, 0x2B2118 ]
  let countForColors = 0

  const brushParams = {
    brush1Shape: 'box',
	  brush1Complexity: 1,
	  brush1Color: '#2a4375',

    brush2Shape: 'box',
	  brush2Complexity: 1,
	  brush2Color: '#E91E63',
  }

  function getOperationType() {
    if( currentlySelectedNodeType == "deposit" ){
      return SUBTRACTION;
    } else if( currentlySelectedNodeType == "interface" ){
      return HOLLOW_SUBTRACTION;
    }
  }

  function createCsgEvaluator() {
    enviromentParameter.csgEvaluator = new Evaluator();
  }

  function createBrushToCutWith() {
    enviromentParameter.brushToCutWith = new Brush(new THREE.BoxGeometry(), new GridMaterial());
    enviromentParameter.brushToCutWith.position.set(0, -4, 20);
    updateBrush(enviromentParameter.brushToCutWith, brushParams.brush2Shape, brushParams.brush2Complexity)
    updateMaterialOfBrushToBeCutWith(enviromentParameter.brushToCutWith)
    const gismos = cutControls()
    enviromentParameter.scene.add(enviromentParameter.brushToCutWith)
    pasteControls(gismos)
  }
  
  function resultObjectsFromCsgOperation(loadedObject) {
    const resultObject = new THREE.Mesh(new BufferGeometry(), new MeshStandardMaterial({
      flatShading: false,
		  polygonOffset: true,
		  polygonOffsetUnits: 0.1,
		  polygonOffsetFactor: 0.1,
    }))
    resultObject.castShadow = true;
    resultObject.receiveShadow = true;
    resultObject.frustumCulled = false;
    resultObject.name = loadedObject.name + "Result";
    resultObject.userData.id = loadedObject.userData.id;
    resultObject.userData.nodeID = loadedObject.userData.nodeID;
    const originalMaterial = resultObject.material
    return { resultObject: resultObject, originalMaterial: originalMaterial }
  }

  function updateMaterialMap(brushObject) {
    let mat;
	  mat = brushObject.brush.material.clone();
	  mat.side = THREE.FrontSide;
	  mat.opacity = 1;
	  mat.transparent = false;
	  mat.depthWrite = true;
	  brushObject.materialMap.set( brushObject.brush.material, mat );
    
	  mat = enviromentParameter.brushToCutWith.material.clone();
	  mat.side = THREE.FrontSide;
	  mat.opacity = 1;
	  mat.transparent = false;
	  mat.depthWrite = true;
    mat.color.set(someColors[countForColors]);
    countForColors++;
	  brushObject.materialMap.set( enviromentParameter.brushToCutWith.material, mat );
    
	  brushObject.materialMap.forEach( ( m1, m2 ) => {
	  	m1.enableGrid = false;
	  	m2.enableGrid = false;
	  } );
  }

  function updateBrush( brush, type, complexity, loadedObjectGeometry ) {
    brush.geometry.dispose()

    switch( type ){
      case 'box':
        const dim = Math.round( THREE.MathUtils.lerp( 1, 10, complexity ) );
			  brush.geometry = new THREE.BoxGeometry( 9, 20, 17, dim, dim, dim );
			  break;
      case 'mesh':
        brush.geometry = loadedObjectGeometry.clone();
			  break;
      default:
        console.log("ERROR")
    }

    brush.geometry = brush.geometry.toNonIndexed();

    const position = brush.geometry.attributes.position;
	  const array = new Float32Array( position.count * 3 );
	  for ( let i = 0, l = array.length; i < l; i += 9 ) {
        
	  	array[ i + 0 ] = 1;
	  	array[ i + 1 ] = 0;
	  	array[ i + 2 ] = 0;
    
	  	array[ i + 3 ] = 0;
	  	array[ i + 4 ] = 1;
	  	array[ i + 5 ] = 0;
    
	  	array[ i + 6 ] = 0;
	  	array[ i + 7 ] = 0;
	  	array[ i + 8 ] = 1;
    
	  }
  
	  brush.geometry.setAttribute( 'color', new THREE.BufferAttribute( array, 3 ) );
	  brush.prepareGeometry();
	  enviromentParameter.needsUpdate = true;
  }

  function updateMaterialOfBrushToBeCut(brush, loadedObjectMaterial) {
    brush.material = loadedObjectMaterial
    brush.material.opacity = 1;
	  brush.material.transparent = true;
	  brush.material.depthWrite = false;
	  brush.material.polygonOffset = true;
	  brush.material.polygonOffsetFactor = 0.2;
	  brush.material.polygonOffsetUnits = 0.2;
	  brush.material.side = THREE.DoubleSide;
	  brush.material.premultipliedAlpha = true;
    brush.material.color.set( 0x2a4375 )
    brush.frustumCulled = false
  }

  function updateMaterialOfBrushToBeCutWith(brush) {
    brush.material.opacity = 0;
	  brush.material.transparent = true;
	  brush.material.depthWrite = false;
	  brush.material.polygonOffset = true;
	  brush.material.polygonOffsetFactor = 0.2;
	  brush.material.polygonOffsetUnits = 0.2;
	  brush.material.side = THREE.DoubleSide;
	  brush.material.premultipliedAlpha = true;
	  brush.material.roughness = 0.25;
	  brush.material.color.set( 0xffffff );
    brush.frustumCulled = false
    enviromentParameter.transformControls.attach( brush );
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
      if( nodesInGraph[a].id == currentlySelectedNodeID ){
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
    removeObject(currentlySelectedNodeID)

    // remove objectID from node
    const nodesInGraph = getNodes.value
    const nodesInGraphLength = nodesInGraph.length
    for( let a = 0; a < nodesInGraphLength; a++ ){
      if( nodesInGraph[a].id == currentlySelectedNodeID ){
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
    const objectsInScene = enviromentParameter.scene.children.slice(3, -2)
    
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
      enviromentParameter.camera.rotation.set( cameraRotation[ 0 ], cameraRotation[ 1 ], cameraRotation[ 2 ] );
    }

    createCsgEvaluator()
    createBrushToCutWith()
    
    createEffectComposer()
    createRenderPass()
    createOutlinePass()
    createFxaaShader()
    createGammeCorrectionShader()
  }

  function cutControls() {
    const gismoArcball = enviromentParameter.scene.children.pop();
    const gismoTransform = enviromentParameter.scene.children.pop();

    return { transform: gismoTransform, arcball: gismoArcball }
  }

  function pasteControls(gismos) {
    enviromentParameter.scene.add(gismos.transform);
    enviromentParameter.scene.add(gismos.arcball);
  }

  function createEffectComposer() {
    enviromentParameter.effectComposer = new EffectComposer(enviromentParameter.renderer)
  }

  function createRenderPass() {
    enviromentParameter.renderPass = new RenderPass(enviromentParameter.scene, enviromentParameter.camera)

    enviromentParameter.effectComposer.addPass(enviromentParameter.renderPass)
  }

  function createOutlinePass() {
    const canvas3D = document.getElementById("canvas_3d");
    enviromentParameter.outlinePass = new OutlinePass(new THREE.Vector2(canvas3D.clientWidth, canvas3D.clientHeight), enviromentParameter.scene, enviromentParameter.camera);
    enviromentParameter.outlinePass.edgeThickness = 1.0;
    enviromentParameter.outlinePass.edgeStrength = 3.0;
    enviromentParameter.outlinePass.edgeGlow = 1;
    enviromentParameter.outlinePass.renderToScreen = true;
    enviromentParameter.outlinePass.visibleEdgeColor.set(0xffffff);
    
    enviromentParameter.effectComposer.addPass(enviromentParameter.outlinePass)
  }

  function createFxaaShader() {
    const canvas3D = document.getElementById("canvas_3d");
    enviromentParameter.fxaaShader = new ShaderPass(FXAAShader);
    enviromentParameter.fxaaShader.uniforms["resolution"].value.set(1 / canvas3D.clientWidth, 1 / canvas3D.clientHeight);
    
    enviromentParameter.effectComposer.addPass(enviromentParameter.fxaaShader);
  }

  function createGammeCorrectionShader() {
    enviromentParameter.gammaCorrectionShader = new ShaderPass(GammaCorrectionShader);
    enviromentParameter.effectComposer.addPass(enviromentParameter.gammaCorrectionShader)
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
    enviromentParameter.renderer.setClearColor( 0x28303d, 0);
    enviromentParameter.renderer.shadowMap.enabled = true;
    enviromentParameter.renderer.shadowMap.type = 1;
    enviromentParameter.renderer.toneMapping = 0;
    enviromentParameter.renderer.toneMappingExposure = 1.3;
    // enviromentParameter.renderer.outputEncoding = THREE.GammaEncoding
    enviromentParameter.renderer.gammaOutput = true;
    enviromentParameter.renderer.gammaFactor = 1.45;
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
    enviromentParameter.ambientLight = new THREE.AmbientLight( 0xF2F2F2  );
    enviromentParameter.scene.add(enviromentParameter.ambientLight);
    
    enviromentParameter.directionalLight = new THREE.DirectionalLight( 0x404040, 2 );
    enviromentParameter.ambientLight.position.set(-1, 2, 3)
    enviromentParameter.scene.add(enviromentParameter.directionalLight);
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function createControls() {
    enviromentParameter.arcballControls = new ArcballControls( enviromentParameter.camera, enviromentParameter.renderer.domElement, enviromentParameter.scene );
    enviromentParameter.arcballControls.addEventListener( 'change', function() {
      enviromentParameter.effectComposer.render();
    } )
    enviromentParameter.arcballControls.enablePan = false;

    enviromentParameter.transformControls = new TransformControls( enviromentParameter.camera, enviromentParameter.renderer.domElement );
    enviromentParameter.transformControls.setSize( 0.75 );
    enviromentParameter.transformControls.addEventListener('dragging-changed', e => {
      enviromentParameter.arcballControls.enabled = !e.value;
    });
    enviromentParameter.transformControls.addEventListener('objectChange', () => {
      enviromentParameter.needsUpdate = true;
    });
    const arcballGismo = enviromentParameter.scene.children.pop()
    enviromentParameter.scene.add(enviromentParameter.transformControls)
    enviromentParameter.scene.add(arcballGismo)
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
    const objectsInScene = enviromentParameter.scene.children.slice(3, -2)
    if( objectsInScene.length ){
      const barycenter = getBarycenter(objectsInScene)
      
      enviromentParameter.arcballControls.target.set(barycenter.x, barycenter.y, barycenter.z)
      enviromentParameter.arcballControls.update()
    }
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function reCenterControlsAndCamera() {
    const objectsInScene = enviromentParameter.scene.children.slice(3, -2)
    if( objectsInScene.length ){
      const barycenter = getBarycenter(objectsInScene)
      
      enviromentParameter.arcballControls.target.set(barycenter.x, barycenter.y, barycenter.z)
      enviromentParameter.camera.position.set(barycenter.x, barycenter.y - 15, barycenter.z);
      enviromentParameter.arcballControls.update()
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
    if( enviromentParameter.needsUpdate && enviromentParameter.brushesToBeCut[0] != null && enviromentParameter.brushToCutWith != null ){
      enviromentParameter.needsUpdate = false;
      
      const brushesToBeCutLength = enviromentParameter.brushesToBeCut.length
      for( let a = 0; a < brushesToBeCutLength; a++ ){
        enviromentParameter.brushesToBeCut[a].brush.updateMatrixWorld();
        enviromentParameter.brushToCutWith.updateMatrixWorld();
  
        enviromentParameter.csgEvaluator.useGroups = true
        enviromentParameter.csgEvaluator.evaluate( enviromentParameter.brushesToBeCut[a].brush, enviromentParameter.brushToCutWith, enviromentParameter.brushesToBeCut[a].operationType, enviromentParameter.brushesToBeCut[a].resultObjectFromCsgOperation.resultObject);

        enviromentParameter.brushesToBeCut[a].resultObjectFromCsgOperation.resultObject.material = enviromentParameter.brushesToBeCut[a].resultObjectFromCsgOperation.resultObject.material.map( m => enviromentParameter.brushesToBeCut[a].materialMap.get( m ) );
      }
    }

    const brushesToBeCutLength = enviromentParameter.brushesToBeCut.length
    for( let a = 0; a < brushesToBeCutLength; a++ ){
      enviromentParameter.brushesToBeCut[a].brush.visible = false;
    }

    enviromentParameter.arcballControls.setGizmosVisible(enviromentParameter.params.arcballControlsShowGizmo);
    enviromentParameter.transformControls.showX = enviromentParameter.params.transformControlsShowGizmo
    enviromentParameter.transformControls.showY = enviromentParameter.params.transformControlsShowGizmo
    enviromentParameter.transformControls.showZ = enviromentParameter.params.transformControlsShowGizmo
    
    enviromentParameter.brushToCutWith.visible = true;
    enviromentParameter.transformControls.enabled = true;
    enviromentParameter.transformControls.visible = true;

    enviromentParameter.effectComposer.render()
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
  function createBeforeBatch(nodesInGraph, nodesInGraphLength, node, relations) {
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
  function createAfterBatch(nodesInGraph, nodesInGraphLength, node, relations) {
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
          if( (relations[b].relationType == 'before') && (relations[b].id != rearangedNodes[0]) && !rearangedNodes.includes(relations[b].id) ){
            const newBeforeBatch = createBeforeBatch(nodesInGraph, nodesInGraphLength, node, relations[b]);
            nextBatch.push(newBeforeBatch);
            rearangedNodes.push(relations[b].id);
          }
          else if( (relations[b].relationType == 'after') && (relations[b].id != rearangedNodes[0]) && !rearangedNodes.includes(relations[b].id)){
            const newAfterBatch = createAfterBatch(nodesInGraph, nodesInGraphLength, node, relations[b])
            nextBatch.push(newAfterBatch);
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

  



  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  async function importData(){

    let parsedData = []

    const output = await new Promise((resolve) => {
      let reader = new FileReader();
      let f = toRaw(dataToBeImported.value);

      reader.onload = e => {
        const newString = e.target.result;
        resolve(newString);
      }

      reader.readAsText(f);
    });
    
    let cutString = output.split('|')
    for( let a = 0; a < cutString.length; a++ ){
      parsedData.push(JSON.parse(cutString[a]));
    }

    idOfCurrentStratiTool = parsedData[0];
    allProcessingSteps.value = parsedData[1];
    currentProcessingStep.value = parsedData[2];
    enviromentParameter.scene = parsedData[3];
    enviromentParameter.savedCamera = parsedData[4];

    clearInfoCard();
    await initEnviroment();
    initGraph();
    
  }





  /**
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * 
   */
  function exportData() {

    saveAll();

    const idAsJson = JSON.stringify(idOfCurrentStratiTool);
    
    const allProcessingStepsAsJson = JSON.stringify(allProcessingSteps.value);
    const currentProcessingStepAsJson = JSON.stringify(currentProcessingStep.value);

    const sceneAsJson = JSON.stringify(convertSceneToJson());
    const cameraAsJson = JSON.stringify(convertCameraToJson());

    const wholeJsonString = idAsJson + "|" + allProcessingStepsAsJson + "|" + currentProcessingStepAsJson + "|" + sceneAsJson + "|" + cameraAsJson;

    const filename = "harris_matrix_export";

    var blob = new Blob([wholeJsonString], { type: "application/json" });
    saveAs(blob, filename + ".json");
  }





  /**
   * 
   */
  function loadCutTool() {
    if( !enviromentParameter.params.transformControlsShowGizmo ){
      enviromentParameter.params.transformControlsShowGizmo = true;
      enviromentParameter.brushToCutWith.material.opacity = 0.005;
    } else {
      enviromentParameter.params.transformControlsShowGizmo = false;
      enviromentParameter.brushToCutWith.position.set(0, -4, 20);
      enviromentParameter.brushToCutWith.material.opacity = 0;
      enviromentParameter.needsUpdate = true;
    }
  }


  

  /**                              Vue-Livecycle
   * /:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::\
   * Equivalent semantic to mounted in <script>.
   * \:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::/
   * 
   */
  onMounted(async () => {
    await getDataFromIndexedDB();
    await initEnviroment()
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
  background-color: #000000;
}

.hollow {
  border: 4px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #000000;
}

.tile {
  border: 4px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
}

.button {
  border: 5px;
  border-style: double;
  border-color: #1C2128;
  text-align: center;
  line-height: 0px;
  background-color: #0d3c88;
}

.plato {
  border: 4px;
  border-style: ridge;
  border-color: #171C23;
  background-color: #283d2d;
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
 * > > > > > > Help < < < < < <
 *
 */

.help__button {
  border: 4px;
  border-style: outset;
  border-color: #2d0e06;
  background-color: #b23918;
}

.help__navigation_header {
  border: 1px; 
  border-style: solid; 
  border-color: #ffffff;
  background-color: #5C4646;
}

.help__navigation_footer {
  border: 1px; 
  border-style: solid; 
  border-color: #ffffff;
  background-color: #27303d;
}

.help__navigation_hilfe {
  border: 1px; 
  border-style: solid;
  border-radius: 0%;
  border-color: #ffffff;
  background-color: #b23918;
}

.help__navigation_module {
  border: 1px; 
  border-style: solid; 
  border-color: #ffffff;
  background-color: #866345;
}

.help__navigation_system_tools {
  border: 1px; 
  border-style: solid;
  border-radius: 0%; 
  border-color: #ffffff;
  background-color: #866345;
}

.help__navigation_graph-3d_tools {
  border: 1px; 
  border-style: solid;
  border-radius: 0%; 
  border-color: #ffffff;
  background-color: #5d5d48;
}

.help__navigation_graph-3d_editor {
  border: 1px; 
  border-style: solid;
  border-radius: 0%;
  border-color: #ffffff;
  background-color: #5d5d48;
}

.help__navigation_glossar {
  border: 1px; 
  border-style: solid;
  border-radius: 0%;
  border-color: #ffffff;
  background-color: #b23918;
}

.help__navigation_editor_wechseln {
  border: 1px; 
  border-style: solid;
  border-radius: 0%;
  border-color: #ffffff;
  background-color: #6f2510;
}

.help__navigation_infobereich {
  border: 1px; 
  border-style: solid;
  border-radius: 0%;
  border-color: #ffffff;
  background-color: #866345;
}

.help_element__visible {
  position:absolute;
  z-index: 1;
  opacity: 1;
}

.help_element__notVisible {
  position:absolute;
  z-index: 0;
  opacity: 0;
}

.help_componend__focus {
  border: 5px; 
  border-style: solid; 
  border-color: #ff0000;
}

.help_componend__notFocus {
  border: 1px; 
  border-style: solid; 
  border-color: #ffffff;
}

.help_subcomponent_button__clicked {
  border: 3px; 
  border-style: outset; 
  border-color: #ff0000;
  border-color: #592b02;
  background-color: #994a04;
}

.help_subcomponent_button__notClicked {
  border: 3px; 
  border-style: outset; 
  border-color: #ffffff00;
  border-color: #592b02;
  background-color: #994a04;
}

.help_subcomponend__focus {
  border: 3px; 
  border-style: solid;
  border-color: #ff0000;
}

.help_subcomponend__notFocus {
  border: 3px; 
  border-style: solid; 
  border-color: #ffffff00;
}

.help__start_base {
  border: 4px;
  border-style: ridge;
  border-color: #64472c;
  background-color: #64472c;
}

.help__infobereich_base {
  border: 10px;
  border-style: ridge;
  border-color: #6c523c;
  background-color: #6c523c;
  opacity: 0.5;
}

.help__infobereich_title {
  text-align: center;
  border: 4px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.help__infobereich_attributes_list {
  border: 4px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.help__infobereich_image_outside {
  border: 4px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.help__infobereich_image_inside {
  border: 3px; 
  border-style: ridge;
  border-radius: 2%;
  border-color: #906743;
  text-align: center;
  background-color: #906743;
}

.help__infobereich_delete_unit_button {
  border: 4px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.help_subcomponend_info__base {
  border-radius: 0%;
  background-color: #8c6848;
}

.help_subcomponend_info__liste {
  border: 4px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

/**
 *
 * > > > > > > Glossar < < < < < <
 *
 */

.glossar__base {
  border: 4px;
  border-style: ridge;
  border-color: #64472c;
  background-color: #64472c;
}

.glossar__button {
  border: 4px;
  border-style: outset;
  border-color: #2d0e06;
  background-color: #b23918;
}

/**
 *
 * > > > > > > Modus wechseln < < < < < <
 *
 */

.modus_wechseln__button {
  border: 4px;
  border-style: outset;
  border-color: #2d0e06;
  background-color: #6f2510;
}

/**
 *
 * > > > > > > System-Tools < < < < < <
 * 
*/
.system_tools__base {
  border: 2px;
  border-style: outset;
  border-color: #874e1c;
  background-color: #866345;
}

.system_tools__button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

/**
 *
 * > > > > > > Graph/3D-Tools < < < < < <
 *
 */

/**
 * < < < 3D-Editor > > >
 */

.model_editor__background {
  border: 4px;
  border-style: ridge;
  border-color: #4f5d48;
  background-color: #4f5d48;
}

.units__3d_base {
  border: 3px;
  border-style: outset;
  border-color: #34422c;
  background-color: #4f5d48;
}

.units__3d_cut_button {
  border: 3px;
  border-style: outset;
  border-color: #34422c;
  background-color: #3e4939;
}

.units__3d_list_button_notClicked {
  border: 4px;
  border-style: outset;
  border-color: #34422c;
  background-color: #4f5d48;
}

.units__3d_list_button_clicked {
  border: 4px;
  border-style: outset;
  border-color: #34422c;
  background-color: #738769;
}
 
/**
 * < < < Graph-Editor > > >
 */

.graph_editor__background {
  border: 4px;
  border-style: ridge;
  border-color: #5d5d48;
  background-color: #5d5d48;
}

.units__graph_base {
  border: 3px;
  border-style: outset;
  border-color: #3a3a2b;
  background-color: #5d5d48;
}

.units__graph_search_field {
  background-color: #464637;
}

.units__graph_sort_button {
  border: 3px;
  border-style: outset;
  border-color: #464637;
  background-color: #464637;
}

.units__graph_sort_button_clicked {
  border: 3px;
  border-style: outset;
  border-color: #464637;
  background-color: #5d5d49;
}

/**
 *
 * > > > > > > Module < < < < < <
 *
 */

.module__button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.module__textfield {
  background-color: #6e5239;
}

.screenshot_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}

.group_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}

.view_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}

.exp-imp_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}

.filter_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}

.timemodel_module__base {
  border: 1px;
  border-style: ridge;
  border-color: #5c4430;
  background-color: #866345;
  opacity: 0.5;
}
 
/**
 *
 * > > > > > > Infobereich < < < < < <
 *
 */

.infobereich__base {
  border: 10px;
  border-style: ridge;
  border-color: #6c523c;
  background-color: #6c523c;
  opacity: 0.5;
}

.infobereich__title {
  text-align: center;
  border: 7px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.infobereich__attributes_list {
  border: 7px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.infobereich__image_outside {
  border: 7px;
  border-style: ridge;
  border-color: #9f7652;
  background-color: #8c6848;
}

.infobereich__image_inside {
  border: 3px; 
  border-style: ridge;
  border-radius: 2%;
  border-color: #906743;
  text-align: center;
  background-color: #906743;
}

.infobereich__attributes_name {
  border: 4px;
  border-style: ridge;
  border-color: #bc804c;
  background-color: #bc804c;
}

.infobereich__attributes_name_title {
  background-color: #bc804c;
}

.infobereich__attributes_name_text-field {
  border: 4px;
  border-style: ridge;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_name_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_type {
  border: 5px;
  border-style: ridge;
  border-color: #bc804c;
  background-color: #bc804c;
}

.infobereich__attributes_type_title {
  background-color: #bc804c;
}

.infobereich__attributes_type_title_button {
  border: 4px;
  border-style: double;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_description {
  border: 5px;
  border-style: ridge;
  border-color: #bc804c;
  background-color: #bc804c;
}

.infobereich__attributes_description_title {
  background-color: #bc804c;
}

.infobereich__attributes_description_textarea {
  border: 5px;
  border-style: ridge;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_description_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_model_create_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_model_switch_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_model_delete_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_model_finds_list {
  border: 3px;
  border-style: solid;
  border-radius: 1%;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_model_list_item {
  border: 2px;
  border-style: solid;
  border-radius: 1%;
  border-color: #a05f26;
  background-color: #c67228;
}

.infobereich__attributes_model_finds_modify_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_model_finds_delete_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_relations {
  border: 5px;
  border-style: ridge;
  border-color: #bc804c;
  background-color: #bc804c;
}

.infobereich__attributes_relations_title {
  background-color: #bc804c;
}

.infobereich__attributes_relations_list {
  border: 2px;
  border-style: ridge;
  border-radius: 1%;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_relations_list_item {
  border: 2px;
  border-style: solid;
  border-radius: 1%;
  border-color: #a05f26;
  background-color: #c67228;
}

.infobereich__attributes_relations_list_delete_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__attributes_groups {
  border: 5px;
  border-style: ridge;
  border-color: #bc804c;
  background-color: #bc804c;
}

.infobereich__attributes_groups_title {
  background-color: #bc804c;
}

.infobereich__attributes_groups_list {
  border: 2px;
  border-style: ridge;
  border-radius: 1%;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_groups_list_item {
  border: 2px;
  border-style: solid;
  border-radius: 1%;
  border-color: #ab672b;
  background-color: #c99568;
}

.infobereich__attributes_groups_list_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

.infobereich__delete_unit_button {
  border: 2px;
  border-style: outset;
  border-color: #592b02;
  background-color: #994a04;
}

</style>