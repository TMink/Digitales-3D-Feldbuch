<template>
  <div style="position: relative">

    <!-- Main Scene-->
    <canvas id="mainCanvas" style="position: absolute" tabindex='1'></canvas>

    <!-- Left sidebar: GUI -->
    <div style="float: left;">
      <v-card>
        <!-- Tools -->
        <v-navigation-drawer v-model="leftDrawer.showDrawers[0]" 
                             color="background"
                             style="left: 49px; top:104px; width: 351px;"
                             temporary
        >
          <v-list-item height="50" prepend-icon="mdi-camera-control"
                       title="Tools"
          ></v-list-item>

          <v-divider></v-divider>

          <v-form>
            <!-- Measurement Tool -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" 
                  elevation="0">

                  <!-- Checkboxes -->
                  <v-row>
                    <v-col>
                      
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center"
                               class="pa-1"
                        > Abstand messen
                        </v-row>
                            
                        <v-card color="opp_background">
                          <v-row no-gutters class="pt-4 px-3">
                            <v-col>
                              <v-select v-model="measureTool.title"
                                label="Linie"
                                color="opp_background"
                                :items="measureTool.allTitles"
                                :@update="updateTitle()"
                              ></v-select>
                            </v-col>
                          </v-row>

                          <v-divider></v-divider>
                            
                          <v-row no-gutters class="pt-4 px-3">
                            <!-- Checkbox description-->
                            <v-col cols="10">
                              <v-text-field
                                v-model="measureTool.textField"
                                placeholder="Neuer Bezeichner"
                              >
                              </v-text-field>
                            </v-col>

                            <v-col cols="2">
                              <v-btn icon class="ma-1" color="primary"
                                     v-on:click="saveLineTitle()">
                                <v-icon>mdi-content-save-all</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>

                          <v-row no-gutters class="ps-4 pb-3">
                            <v-col cols="12">
                              <v-btn width="300" color="error"
                                     v-on:click="deleteLine()">
                                <v-icon>mdi-delete</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>

                      </v-card>
  
                    </v-col>
                  </v-row>
                  
                </v-card>
              </v-col>
            </v-row>

          </v-form>

        </v-navigation-drawer>

        <!-- Place -->
        <v-navigation-drawer v-model="leftDrawer.showDrawers[1]" 
                             color="background"
                             style="left: 49px; top:104px; width: 470px;" 
                             temporary
        >
          <v-list-item height="50" prepend-icon="mdi-map-marker-radius-outline"
            title="Stellen"
          ></v-list-item>
  
          <v-divider></v-divider>

          <v-form>

            <!-- Filter -->
            <v-row>
              <v-col>
                <v-card color="transparent" elevation="0" width="100%" 
                        class="pa-2">

                  <!-- Model -->
                  <v-row no-gutters class="pl-3">
                    Model
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2 ">
                      <v-combobox v-model="plaModel.number"
                        label="Nr"
                        item-title="modelNumber"
                        bgColor="opp_background"
                        :items="plaModel.allNumbers"
                      ></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 ">
                      <v-combobox v-model="plaModel.title"
                        label="Titel"
                        item-title="modelTitel"
                        bgColor="opp_background"
                        :items="plaModel.allTitles"
                      ></v-combobox>
                    </v-col>

                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider thickness="5"></v-divider>

            <!-- Model Interaktion -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" 
                  elevation="0">
                  <v-row class="pb-2">
                    <v-col>
                      
                      <!-- Checkboxes -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center"
                               class="pa-1"
                        >Allgemein
                        </v-row>
                            
                        <v-card color="opp_background" class="pa-2">
                            
                          <v-row no-gutters>
                            <!-- Opacity-->
                            <v-col cols="2" class="px-2 pt-4">
                              <v-slider v-model="plaMods.opacitySliderValue" :max="1"
                                        :disabled="plaMods.disabled">
                              </v-slider>
                            </v-col>
      
                            <v-divider vertical=false></v-divider>
      
                            <!-- Checkbox description-->
                            <v-col cols="10" class="py-5 px-4">
                              Deckkraft
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-card>
  
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-spacer></v-spacer>
                  <v-row>
                    <v-col>
  
                      <!-- Color Picker -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" 
                               class="pa-1"
                        >Farbwähler
                        </v-row>
          
                      <v-card id="cpPlace" color="opp_background" class="pa-2">
                          <v-color-picker v-model="plaMods.colorPicker.color"
                            hide-canvas
                            hide-sliders
                            hide-inputs
                            show-swatches
                            swatches-max-height="235px"
                            width="100%"
                            :disabled="plaMods.disabled"
                            :v-on:update="changeColor(
                                            plaMods.colorPicker.color, 
                                            plaMods.colorPicker.object)"
                          ></v-color-picker>
                        </v-card>
                      </v-card>
  
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

          </v-form>
        </v-navigation-drawer>

        <!-- Positions -->
        <v-navigation-drawer v-model="leftDrawer.showDrawers[2]" 
                             color="background"
                             style="left: 49px; top:104px; width: 470px;" 
                             temporary
        >
          <v-list-item height="50" prepend-icon="mdi-map-marker-radius-outline"
            title="Positions Filter"
          ></v-list-item>
  
          <v-divider></v-divider>

          <v-form>

            <!-- Filter -->
            <v-row>
              <v-col>
                <v-card color="transparent" elevation="0" width="100%" 
                        class="pa-2">

                  <!-- Position -->
                  <v-row no-gutters class="pl-3">
                    Position
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2">
                      <v-combobox v-model="posData.number"
                        label="Nr"
                        item-title="positionNumber"
                        bgColor="opp_background"
                        :items="posData.allNumbers"
                      ></v-combobox>
                    </v-col>

                    <v-col cols="3" class="pl-2">
                      <v-combobox v-model="posData.subNumber"
                        label="U.Nr"
                        bgColor="opp_background"
                        item-title="positionSubnumber"
                        :items="posData.allSubNumbers"
                      ></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 pr-2">
                      <v-combobox v-model="posData.title"
                        label="Titel"
                        item-title="positionTitle"
                        bgColor="opp_background"
                        :items="posData.allTitles"
                      ></v-combobox>
                    </v-col>

                  </v-row>

                  <!-- Model -->
                  <v-row no-gutters class="pl-3">
                    Model
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2 ">
                      <v-combobox v-model="posModel.number"
                        label="Nr"
                        item-title="modelNumber"
                        bgColor="opp_background"
                        :items="posModel.allNumbers"
                        :disabled="!posModel.disableInput"
                      ></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 ">
                      <v-combobox v-model="posModel.title"
                        label="Titel"
                        item-title="modelTitel"
                        bgColor="opp_background"
                        :items="posModel.allTitles"
                        :disabled="!posModel.disableInput"
                      ></v-combobox>
                    </v-col>

                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider thickness="5"></v-divider>

            <!-- Model Interaktion -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" 
                  elevation="0">
                  <v-row class="pb-2">
                    <v-col>
                      
                      <!-- Checkboxes -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center"
                               class="pa-1"
                        >Allgemein
                        </v-row>
                            
                        <v-card color="opp_background" class="pa-2">
                          <v-row no-gutters>
                            <!-- Attach position-->
                            <v-col cols="2" class="px-3 pt-5">
                              <v-checkbox 
                                :v-model="posMods.attachTransformControls"
                                :disabled="posMods.disabled"
                                :true-value="posMods.attachTransformControls"
                                :false-value="!posMods.attachTransformControls"
                                @Click="attachTransformControls(
                                  posMods.attachTransformControls)">
                              </v-checkbox>
                            </v-col>

                            <v-divider vertical=false></v-divider>

                            <!-- Checkbox description-->
                            <v-col cols="10" class="px-4 py-9">
                              Modell Bewegen
                            </v-col>
    
                          </v-row>
                          
                          <v-divider></v-divider>
                            
                          <v-row no-gutters>
                            <!-- Opacity-->
                            <v-col cols="2" class="px-2 pt-4">
                              <v-slider :disabled="posMods.disabled"
                                v-model="posMods.opacitySliderValue"
                                :max="1">
                              </v-slider>
                            </v-col>
      
                            <v-divider vertical=false></v-divider>
      
                            <!-- Checkbox description-->
                            <v-col cols="10" class="py-5 px-4">
                              Deckkraft
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-card>
  
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                  <v-spacer></v-spacer>
                  <v-row>
                    <v-col>
  
                      <!-- Color Picker -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" 
                               class="pa-1"
                        >Farbwähler
                        </v-row>
          
                      <v-card id="cpPosition" color="opp_background" class="pa-2">
                          <v-color-picker v-model="posMods.colorPicker.color"
                            hide-canvas
                            hide-sliders
                            hide-inputs
                            show-swatches
                            swatches-max-height="235px"
                            width="100%"
                            :disabled="posMods.disabled"
                            :v-on:update="changeColor(posMods.colorPicker.color, 
                                                      posMods.colorPicker.object)"
                          ></v-color-picker>
                        </v-card>
                      </v-card>
  
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

          </v-form>
        </v-navigation-drawer>
      </v-card>

      <!-- Navigation buttons -->
      <v-card rounded="0" width="50" height="86.6vh">
        <v-card rounded="0" align="center" width="50" height="50">
          <v-card-text>S</v-card-text>
        </v-card>
        <!-- Controls -->
        <v-btn v-model="leftDrawer.btnNames[0]" rounded="0" icon="mdi-camera-control" 
               width="50" height="50" :color="leftDrawer.btnColors[0]"
               @click.stop="leftDrawer.showDrawers[0] = !leftDrawer.showDrawers[0]; 
                            leftDrawer.showDrawers[1] = false;
                            leftDrawer.showDrawers[2] = false;
                            leftDrawer.showDrawers[3] = false;
                            updateBtnColor(leftDrawer.btnNames[0]);"
        ></v-btn>
        <!-- Place -->
        <v-btn v-model="leftDrawer.btnNames[1]" rounded="0" icon="mdi-radar" width="50" 
               height="50" :color="leftDrawer.btnColors[1]"
               @click.stop="leftDrawer.showDrawers[0] = false;
                            leftDrawer.showDrawers[1] = !leftDrawer.showDrawers[1];
                            leftDrawer.showDrawers[2] = false;
                            leftDrawer.showDrawers[3] = false;
                            updateBtnColor(leftDrawer.btnNames[1]);"
        ></v-btn>
        <!-- Positions -->
        <v-btn v-model="leftDrawer.btnNames[2]" rounded="0" width="50" height="50"
               icon="mdi-map-marker-radius-outline"  
               :color="leftDrawer.btnColors[2]"
               @click.stop="leftDrawer.showDrawers[0] = false;
                            leftDrawer.showDrawers[1] = false;
                            leftDrawer.showDrawers[2] = !leftDrawer.showDrawers[2]; 
                            leftDrawer.showDrawers[3] = false;
                            updateBtnColor(leftDrawer.btnNames[2]);"
        ></v-btn>
      </v-card>
    </div>

    <!-- Legend -->
    <div style="float: right;">
      <v-card color="grey" align="left" height="70" width="350"
              style="top: 10px; right: 10px">
        <v-card-text>
          <img src="../assets/keys/ALT_1.png" width="90" height="37" 
               style="vertical-align: -10px"> 
          <font size="+2" color="black"> = Objektauswahl</font>
        </v-card-text>
      </v-card>

      <v-card color="grey" align="left" height="70" width="350"
              style="top: 15px; right: 10px">
        <v-card-text>
          <img src="../assets/keys/CTRL_1.png" width="90" height="37" 
               style="vertical-align: -10px"> 
          <font size="+2" color="black"> = Modelle bewegen</font>
        </v-card-text>
      </v-card>
    </div>
  </div>

  <!-- Bottom drawer: Position information-->
  <v-navigation-drawer v-model="bottomDrawer.showDrawer" location="bottom" 
                       temporary width="385">
    <v-row class="pt-4 pl-4">
      <!-- 1st BOX -->
      <v-col cols="3">
        <v-card variant="tonal" class="pa-2">
          <v-list density="compact">

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ posInfo.positionNumber }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Positionsnummber
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ posInfo.subNumber }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Unternummer
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ posInfo.title }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Ansprache
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ posInfo.material }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Material
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 2nd BOX -->
      <v-col cols="3">
        <v-card variant="tonal" class="pa-2">
          <v-list density="compact">
            <v-row>

              <v-col cols="6">
                <v-list-item variant="tonal">
                  <v-list-item-title class="text-h6">
                    {{ posInfo.right }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    Rechtswert
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item variant="tonal">
                  <v-list-item-title style="color:white" class="text-h6">
                    {{ posInfo.up }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    Hochwert
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ posInfo.height }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Höhe
              </v-list-item-subtitle>
            </v-list-item>

            <v-card class="pa-4" color="accent">
              <div class="text-h4 text-center" :label="$t('lastEdited')">
                {{ posInfo.date }}
              </div>
              <div class="text-grey text-center">
                {{ $t('lastEdited') }}
              </div>
            </v-card>
          </v-list>
        </v-card>
      </v-col>

      <!-- 3rd BOX -->
      <v-col cols="3">
        <v-card variant="tonal" class="pa-2">
          <v-list density="compact">
            <v-row>

              <v-col cols="6">
                <v-list-item variant="tonal">
                  <v-list-item-title class="text-h6">
                    {{ posInfo.count }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    Anzahl
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>

              <v-col cols="6">
                <v-list-item variant="tonal">
                  <v-list-item-title class="text-h6">
                    {{ posInfo.weight }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-subtitle>
                    Gewicht
                  </v-list-item-subtitle>
                </v-list-item>
              </v-col>
            </v-row>

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ posInfo.dating }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Datierung
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ posInfo.adressOf }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                AnspracheVon
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ posInfo.description }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Beschreibung
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- SubCanvas -->
      <v-divider vertical></v-divider>
      <v-col class="pa-0" cols="3">
        <v-list-item class="justify-center pt-4">
          {{ posInfo.modelName }}
        </v-list-item>

        <v-divider></v-divider>
        <div style="text-align:center" class="pt-4">
          <canvas v-show="true" id="subCanvas" width="300" height="300"
                  style="display: inline;
                         border: 1px solid rgb(255, 255, 255)">
          </canvas>
        </div>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
/**
 * Methods overview:
 *  -------------------------------------------------------------------------
 *  # Setup vuetify/html components:
 *  -> setupCanvases                - 
 *  -> onWindowResize               - 
 *  -> collapseDrawer               - 
 *  -------------------------------------------------------------------------
 *  # Update IndexedDb:
 *  -> updateCameraInDB             - 
 *  -> updateModelsInDB             - 
 *  -------------------------------------------------------------------------
 *  # CleanUp:
 *  -> clearCanvases                - 
 *  -> removeModelsInScene          - 
 *  -------------------------------------------------------------------------
 *  # Loaders:
 *  -> loadPlaceModels              - 
 *  -> loadPositionModels           - 
 *  -> loadModelInMain              - 
 *  -> loadModelInSub               - 
 *  -------------------------------------------------------------------------
 *  # Model interaction:
 *  -> changeColor                  -
 *  -> changeOpacity                -
 *  -------------------------------------------------------------------------
 *  # Controls:
 *  -> attachTransformControls      - 
 *  -> detachTransformControls      - 
 *  -> updateArcballControls        - 
 *  -> restoreArcballAnchor         - 
 *  -> updateCamera                 - 
 *  -------------------------------------------------------------------------
 *  # Camera:
 *  -> updateCamera                 - 
 *  -> getCamera                    - 
 *  -> setCamera                    - 
 *  -> makePerspektiveCamera        - 
 *  -------------------------------------------------------------------------
 *  # Utility:
 *  -> getModelCenter               - 
 *  -> addSelectedObject            - 
 *  -> getGroup                     - 
 *  -> gizmoChange                  - 
 *  ------------------------------------------------------------------------- 
 *  # Filter Model:
 *  -> fieldSearch                  - 
 *  -> layering                     - 
 *  -> fillAll                      - 
 *  -> resetFilter                  - 
 *  -> getPositionInfo              - 
 *  -> getPositionModelInfo         - 
 *  -> choseModels                  - 
 *  -> resetModelInfo2Input         - 
 *  -> resetModelInfo2              - 
 *  -> resetPositionInfo2           - 
 *  ------------------------------------------------------------------------- 
 *  # Inits:
 *  -> initMain                     - 
 *  -> initSub                      - 
 *  ------------------------------------------------------------------------
 *  # Animate:
 *  -> animate                      - 
 *  -> render                       - 
 *  -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *  # DEBUGGING:
 *  -> setCharAt                    - 
 *  -> stringReplacer               - 
 */

import * as THREE from 'three';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { ArcballControls } from
  'three/examples/jsm/controls/ArcballControls.js';
import { TransformControls } from
  'three/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from
  'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 
  'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 
  'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 
'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { GammaCorrectionShader } from
  'three/examples/jsm/shaders/GammaCorrectionShader';
import { CSS2DRenderer, CSS2DObject } from 
  'three/examples/jsm/renderers/CSS2DRenderer'

const params = {
  sceneMain: {
    bgColor: 0x263238,
    lightColor: 0xffffff,
    outline: {
      color: '#FFFFFF',
      pulsePeriod: 2,
      edgeStrength: 4,
      edgeThickness: 2,
      edgeGlow: 0.5
    }
  },
  sceneSub: {
    bgColor: 0x263238,
    lightColor: 0xffffff
  }
}

export default {
  name: 'ModelViewer',

  data() {
    return {
      /**
       * Bottom drawer: Specific Position Info
       */
      bottomDrawer: {
        showDrawer: false,
      },
      posInfo: {
        positionNumber: null,
        subNumber: null,
        date: null,
        title: null,
        material: null,
        right: null,
        up: null,
        height: null,
        count: null,
        weight: null,
        description: null,
        dating: null,
        adressOf: null,
        modelName: null,
      },

      /**
       * Left drawer: Model Interaktion
       */
      leftDrawer: {
        showDrawers: [ false, false, false, false ],
        btnColors: ["transparent", "transparent", "transparent", "transparent"],
        btnNames: ["btn1", "btn2", "btn3", "btn4"],
      },
      /* Place filter and modifiaktion options */
      plaModel: {
        number: null,
        title: null,
        allNumbers: [],
        allTitles: [],
        chosenfinalModel: [],
        chosenfinalModelGroup: null,
        infoBlock: []
      },
      plaMods: {
        disabled: false,
        opacitySliderValue: 0,
        colorPicker: {
          color: null,
          object: null,
        },
        token: false,
      },
      
      /* Positions filter and modifiaktion options */
      posData: { // position data
        number: null,
        subNumber: null,
        title: null,
        allNumbers: [],
        allSubNumbers: [],
        allTitles: [],
        chosenPositionModels: [],
        infoBlock: []
      },
      posModel: { // postion model
        number: null,
        title: null,
        allNumbers: [],
        allTitles: [],
        chosenfinalModel: [],
        chosenfinalModelGroup: null,
        infoBlock: [],
        disableInput: null,
      },
      posMods: { // position modifikations
        disabled: false,
        opacitySliderValue: 0,
        attachTransformControls: false,
        colorPicker: {
          color: null,
          object: null,
        },
        token: false,
      },

      /**
       * Tools
       */
       measureTool: {
        title: null,
        allTitles: [],
        infoBlock: [], // { lineName, lableName, [ firstBallName, secondBallName ] }
        textField: null,
        texttoken: false,
      },

      /**
       * Meshes in scene
       */
      placeModelsInScene: [], // { placeID, modelID, modelName }
      positionModelsInScene: [], // { positionID, modelID, modelName }
      positionModelsInSceneNames: [],
      
      /**
       * Camera and Controls
       */
      arcballAnchor: [],
      cameraData: {
        position: null,
        rotation: null
      },

      /**
       * Canvas
       */
      canvasMain: null,
      canvasSub: null,
      
      /**
       * Loader
       */
      glbLoader: null,
    };
  },

  watch: {

    'posData.number': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.posMods.token ) {
          this.resetPositionMods();
        }

        /* Reset posData & posModel menus content 
         *       and posModel input */
        this.resetPositionInfo2();
        this.resetModelInfo2Input();
        this.resetModelInfo2();

        /* Update posData menus */
        this.fieldSearch( 3, this.posData.chosenPositionModels,
                          [ value, 
                            this.posData.subNumber, 
                            this.posData.title ],
                          [ this.posData.allNumbers, 
                            this.posData.allSubNumbers, 
                            this.posData.allTitles ],
                          this.posData.infoBlock );

        /* Update posModel menus and dataBlock  */
        this.getPositionModelInfo();
      }
    },

    'posData.subNumber': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.posMods.token ) {
          this.resetPositionMods();
        }

        /* Reset posData & posModel menus content
         *       and posModel input */
        this.resetPositionInfo2();
        this.resetModelInfo2Input();
        this.resetModelInfo2();

        /* Update posData menus */
        this.fieldSearch( 3, this.posData.chosenPositionModels,
                          [ this.posData.number, 
                            value, 
                            this.posData.title ],
                          [ this.posData.allNumbers, 
                            this.posData.allSubNumbers, 
                            this.posData.allTitles ],
                          this.posData.infoBlock );

        /* Update posModel menus and dataBlock  */
        this.getPositionModelInfo();
      }
    },

    'posData.title': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.posMods.token ) {
          this.resetPositionMods();
        }

        /* Reset posData & posModel menus content
         *       and posModel input */
        this.resetPositionInfo2();
        this.resetModelInfo2Input();
        this.resetModelInfo2();

        /* Update posData menus */
        this.fieldSearch( 3, this.posData.chosenPositionModels,
                          [ this.posData.number,
                            this.posData.subNumber,
                            value ],
                          [ this.posData.allNumbers,
                            this.posData.allSubNumbers,
                            this.posData.allTitles ],
                          this.posData.infoBlock);

        /* Update posModel menus and dataBlock  */
        this.getPositionModelInfo();

      }
    },

    'posData.chosenPositionModels': {
      handler: function(value) {
        if ( value.length > 0 ) {
          this.posModel.disableInput = true;
        } else {
          this.posModel.disableInput = false;
        }
      }
    },

    'posModel.number': {
      handler: function( value ) {

        /* Reset modifikations and save changes to model */
        if ( this.posMods.token ) {
          this.resetPositionMods();
        }

        /* Reset posModel menus content */
        this.resetModelInfo2();

        /* Update posModel menus */
        this.fieldSearch( 2, this.posModel.chosenfinalModel,
                          [ value, 
                            this.posModel.title ],
                          [ this.posModel.allNumbers, 
                            this.posModel.allTitles ],
                          this.posModel.infoBlock );
      }
    },

    'posModel.title': {
      handler: function( value ) {

        /* Reset modifikations and save changes to model */
        if ( this.posMods.token ) {
          this.resetPositionMods();
        }

        /* Reset posModel menus content */
        this.resetModelInfo2();

        /* Update posModel menus */
        this.fieldSearch( 2, this.posModel.chosenfinalModel,
                          [ this.posModel.number,
                            value],
                          [ this.posModel.allNumbers,
                            this.posModel.allTitles],
                          this.posModel.infoBlock );

      }
    },

    'posModel.chosenfinalModel': {
      handler: async function(value) {
        if ( value.length > 0 ) {
          this.posMods.token = true;
          this.posMods.disabled = false;

          /* Update color picker and opacity slider if no model has been 
             modified yet */
          if (this.posMods.colorPicker == null || 
              this.posMods.colorPicker.object == null ) {

            const result = this.posModel.infoBlock.find( arr => 
              value );
            const modelInScene = this.sceneMain.getObjectByName( 
              value[0] );
            this.posModel.chosenfinalModelGroup = this.getGroup(
              modelInScene );
            
            /* color picker */
            this.posMods.colorPicker.color = result[3];
            this.posMods.colorPicker.object = 
              this.posModel.chosenfinalModelGroup;
            
            /* opacity slider */
            this.posMods.opacitySliderValue = result[4];
          }

          /* Update color picker and opacity slider if a model has been 
             modified */
          else {
            const modelInScene = this.sceneMain.getObjectByName( 
              value[0] );
            this.posModel.chosenfinalModelGroup = this.getGroup( 
              modelInScene );
            
            /* color picker */
            this.posMods.colorPicker.color = "#" + 
            modelInScene.material.color.getHexString();
            this.posMods.colorPicker.object = this.posModel.chosenfinalModelGroup;
            
            /* opacity slider */
            this.posMods.opacitySliderValue = modelInScene.material.opacity;
          }

        } else {
          this.posMods.attachTransformControls = false;
          this.tControlsMain.detach();
        }
      }
    },

    'plaModel.number': {
      handler: function(value) {

        /* Reset modifikations and save changes to model */
        if (this.plaMods.token) {
          this.resetPlaceMods();
        }

        this.resetPlaceModelInfo();

        this.fieldSearch( 2, this.plaModel.chosenfinalModel,
                            [ value, 
                              this.plaModel.title ],
                            [ this.plaModel.allNumbers, 
                              this.plaModel.allTitles ],
                            this.plaModel.infoBlock );
      }
    },

    'plaModel.title': {
      handler: function(value) {

        /* Reset modifikations and save changes to model */
        if (this.plaMods.token) {
          this.resetPlaceMods();
        }

        this.resetPlaceModelInfo();
  
        this.fieldSearch( 2, this.plaModel.chosenfinalModel,
                            [ this.plaModel.number, 
                              value ],
                            [ this.plaModel.allNumbers, 
                              this.plaModel.allTitles ],
                            this.plaModel.infoBlock );
      }
    },

    'plaModel.chosenfinalModel': {
      handler: function(value) {
        if ( value.length > 0 ) {
          this.plaMods.token = true;
          this.plaMods.disabled = false;

          /* Update color picker and opacity slider if no model has been 
             modified yet */
          if (this.plaMods.colorPicker == null || 
              this.plaMods.colorPicker.object == null ) {

            const result = this.plaModel.infoBlock.find( arr => value );
            const modelInScene = this.sceneMain.getObjectByName( value[0] );
            this.plaModel.chosenfinalModelGroup = this.getGroup( 
              modelInScene );
            
            /* color picker */
            this.plaMods.colorPicker.color = result[3];
            this.plaMods.colorPicker.object = 
              this.plaModel.chosenfinalModelGroup;
            
            /* opacity slider */
            this.plaMods.opacitySliderValue = result[4];
          }

          /* Update color picker and opacity slider if a model has been 
             modified */
          else {
            const modelInScene = this.sceneMain.getObjectByName( value[0] );
            this.plaModel.chosenfinalModelGroup = this.getGroup( 
              modelInScene );
            
            /* color picker */
            this.plaMods.colorPicker.color = "#" + 
            modelInScene.material.color.getHexString();
            this.plaMods.colorPicker.object = this.plaModel.chosenfinalModelGroup;
            
            /* opacity slider */
            this.plaMods.opacitySliderValue = modelInScene.material.opacity;
          }

        }
      }
    },

    'posMods.opacitySliderValue': {
      handler: function(value) {
        if( this.posModel.chosenfinalModelGroup != null ) {
          this.posModel.chosenfinalModelGroup.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.material.opacity = value;
            }
          })
        }
      }
    },

    'plaMods.opacitySliderValue': {
      handler: function(value) {
        if( this.plaModel.chosenfinalModelGroup != null ) {
          this.plaModel.chosenfinalModelGroup.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.material.opacity = value;
            }
          })
        }
      }
    },

    'posMods.disabled': {
      handler: function(value) {
        if ( value ) {
          document.getElementById("cpPosition").style.pointerEvents = 'none';
        } else {
          document.getElementById("cpPosition").style.pointerEvents = 'auto';
        }
      }
    },

    'plaMods.disabled': {
      handler: function(value) {
        if ( value ) {
          const elem = document.getElementById("cpPlace")
            .style.pointerEvents = 'none';
        } else {
          const elem = document.getElementById("cpPlace")
            .style.pointerEvents = 'auto';
        }
      }
    },

    'measureTool.title': {
      handler: function(value) {
        if (this.measureTool.textField != value && 
            this.measureTool.textField != null) {
          this.measureTool.textField = null
        }
      }
    },

  },

  async mounted() {
    await fromOfflineDB.syncLocalDBs();
    
    this.glbLoader = new GLTFLoader();

    /* Setup */
    this.setupCanvases();
    this.setupEventListeners();
    document.addEventListener("click", this.func, false);
    this.posMods.disabled = true;
    this.plaMods.disabled = true;

    this.mainInit();
    this.subInit();

    await this.loadPlaceModels();

    if ( this.placeModelsInScene.length > 0 ) {
      this.updateCamera( this.placeModelsInScene[
        this.placeModelsInScene.length - 1 ].modelID )

      await this.loadPositionModels();
      await this.loadLines();

      this.getPositionInfo();
      this.getPlaceModelInfo();

      this.animate();
    } else {
      console.log( "No Models found" )
    }
  },

  async unmounted() {
    if ( this.placeModelsInScene.length > 0 ) {
      await this.updateModelsInDB();
      await this.updateCameraInDB();
    }
    this.clearCanvases()
  },

  methods: {

    updateTitle: function() {
      if ( this.measureTool.texttoken ) {
        this.measureTool.title = this.measureTool.textField
        this.measureTool.texttoken = false;
      }

    },

    saveLineTitle: async function() {

      const linesInDB = await fromOfflineDB.getAllObjects(
        'Lines', 'lines' );

      let idToBeRenamed = null;

      this.measureTool.infoBlock.forEach( element => {
        if ( element.name === this.measureTool.title ) {
          element.name = this.measureTool.textField;
          idToBeRenamed = element.id;
        }
      } )

      /* Rename line in IndexedDb */
      const lineInDB = linesInDB.find( e => e.id === idToBeRenamed );
      lineInDB.name = this.measureTool.textField;
      await fromOfflineDB.updateObject( lineInDB, 'Lines', 'lines' );

      this.updateLineMenue();
      this.measureTool.texttoken = true;
    },

    deleteLine: async function() {

      const placeInDB = await fromOfflineDB.getObject( 
        VueCookies.get('currentPlace'), 'Places', 'places' );
      const linesInDB = await fromOfflineDB.getAllObjects(
        'Lines', 'lines' );

      let idToBeDeleted = null

      this.measureTool.infoBlock.forEach( element => {
        if ( element.name === this.measureTool.title ) {
          idToBeDeleted = element.id;
          const index = this.measureTool.infoBlock.indexOf(element)

          /* Delte line from sceneMain */
          const line = this.sceneMain.getObjectByName(this.measureTool.infoBlock[index].line)
          const lable = this.sceneMain.getObjectByName(this.measureTool.infoBlock[index].lable)
          const firstBall = this.sceneMain.getObjectByName(this.measureTool.infoBlock[index].balls[0])
          const secondBall = this.sceneMain.getObjectByName(this.measureTool.infoBlock[index].balls[1])
          
          line.remove( lable );
          line.geometry.dispose();
          line.material.dispose();
          this.sceneMain.remove( line );

          firstBall.geometry.dispose();
          firstBall.material.dispose();
          this.sceneMain.remove( firstBall );

          secondBall.geometry.dispose();
          secondBall.material.dispose();
          this.sceneMain.remove( secondBall );

          /* Delete menue item */
          this.measureTool.textField = null
          this.measureTool.infoBlock.splice(index, 1)
        }
      })

      /* Delete from IndexedDb */
      const lineInDB = linesInDB.find( e => e.id === idToBeDeleted );
      const index = placeInDB.lines.indexOf(lineInDB.name);
      placeInDB.lines.splice( index, 1 );
      await fromOfflineDB.deleteObject( lineInDB, 'Lines', 'lines' );
      await fromOfflineDB.updateObject( placeInDB, 'Places', 'places' )

      this.measureTool.title = null;
      this.updateLineMenue();
    },

    updateLineMenue: function() {
      this.measureTool.allTitles = [];
      this.measureTool.infoBlock.forEach( element => {
        this.measureTool.allTitles.push( element.name );
      })
    },

    func: function(e) {
      const compareStrings = Boolean(Number(
        e.target.id.localeCompare("mainCanvas")));
      if (!compareStrings) {
        this.leftDrawer.showDrawers[0] = false;
        this.leftDrawer.showDrawers[1] = false;
        this.leftDrawer.showDrawers[2] = false;
        this.leftDrawer.showDrawers[3] = false;
  
        this.leftDrawer.btnColors[0] = "transparent";
        this.leftDrawer.btnColors[1] = "transparent";
        this.leftDrawer.btnColors[2] = "transparent";
        this.leftDrawer.btnColors[3] = "transparent";
      }
    },

    updateBtnColor: function(e) {
      if(e) {
        switch(e) {
          case "btn1":
            if (this.leftDrawer.btnColors[0] == "background") {
              this.leftDrawer.btnColors[0] = "transparent"
            } else {
              this.leftDrawer.btnColors[0] = "background"
            }
            this.leftDrawer.btnColors[1] = "transparent"
            this.leftDrawer.btnColors[2] = "transparent"
            this.leftDrawer.btnColors[3] = "transparent"
            break;
          case "btn2":
            this.leftDrawer.btnColors[0] = "transparent"
            if (this.leftDrawer.btnColors[1] == "background") {
              this.leftDrawer.btnColors[1] = "transparent"
            } else {
              this.leftDrawer.btnColors[1] = "background"
            }
            this.leftDrawer.btnColors[2] = "transparent"
            this.leftDrawer.btnColors[3] = "transparent"
            break;
          case "btn3":
            this.leftDrawer.btnColors[0] = "transparent"
            this.leftDrawer.btnColors[1] = "transparent"
            if (this.leftDrawer.btnColors[2] == "background") {
              this.leftDrawer.btnColors[2] = "transparent"
            } else {
              this.leftDrawer.btnColors[2] = "background"
            }
            this.leftDrawer.btnColors[3] = "transparent"
            break;
          case "btn4":
            this.leftDrawer.btnColors[0] = "transparent"
            this.leftDrawer.btnColors[1] = "transparent"
            this.leftDrawer.btnColors[2] = "transparent"
            if (this.leftDrawer.btnColors[3] == "background") {
              this.leftDrawer.btnColors[3] = "transparent"
            } else {
              this.leftDrawer.btnColors[3] = "background"
            }
            break;
          default:
            console.log("error")
        }
      }
    },

    /**
     * -------------------------------------------------------------------------
     * # Setup vuetify/html components
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    setupCanvases: function() {
      this.canvasMain = document.getElementById( 'mainCanvas' );
      this.canvasSub = document.getElementById( 'subCanvas' );

      /* Set canvasMain size */
      this.canvasMain.width = window.innerWidth;
      this.canvasMain.height = window.innerHeight - 168;

      /* Auto Resize */
      window.addEventListener( 'resize', this.onWindowResize, false )
    },

    /**
     * 
     */
    onWindowResize: function () {
      this.cameraMain.aspect = this.canvasMain.clientWidth /
        this.canvasMain.clientHeight;
      this.cameraMain.updateProjectionMatrix();

      this.rendererMain.setSize( this.canvasMain.clientWidth,
        this.canvasMain.clientHeight, false );

      this.composer.setSize( this.canvasMain.clientWidth,
        this.canvasMain.clientHeight );

      this.effectFXAA.uniforms[ 'resolution' ].value.set(
        1 / this.canvasMain.clientWidth, 1 / this.canvasMain.clientHeight );
    },

    /**
     * 
     */
    setupEventListeners: function() {
      
    },

    /**
     * -------------------------------------------------------------------------
     * # Update IndexedDB
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    updateCameraInDB: async function () { 
      const placeID = VueCookies.get( 'currentPlace' );
      const cameraIDsInDB = await fromOfflineDB.getProperties( 'id', 'Cameras',
        'cameras' );
      const cameraInDB = await fromOfflineDB.getObject( placeID, 'Cameras',
        'cameras' );
      const anchor = [];

      const cameraData = [
        this.cameraMain.position.x,
        this.cameraMain.position.y,
        this.cameraMain.position.z,
        this.cameraMain.rotation.x,
        this.cameraMain.rotation.y,
        this.cameraMain.rotation.z
      ];

      /* Create new Anchor for arcball controls or   */
      if ( !cameraIDsInDB.includes( placeID ) ) {
        anchor.push( this.arcballAnchor[ 0 ] );
        anchor.push( this.arcballAnchor[ 1 ] );
        anchor.push( this.arcballAnchor[ 2 ] );
      } else {
        anchor.push( cameraInDB.arcballAnchor[ 0 ] );
        anchor.push( cameraInDB.arcballAnchor[ 1 ] );
        anchor.push( cameraInDB.arcballAnchor[ 2 ] );
      }

      /* Create and save new camera settings  */
      const newCamera = {
        id: placeID,
        cameraPosition: cameraData,
        arcballAnchor: anchor
      };
      await fromOfflineDB.updateObject( newCamera, 'Cameras', 'cameras' );
    },

    /**
     * 
     */
    updateModelsInDB: async function () {
      /* Update place models */
      for ( var i = 0; i < this.placeModelsInScene.length; i++ ) {
        const modelID = this.placeModelsInScene[ i ].modelID;
        this.updateModelOpacityAndColor(modelID, 'places');
      }

      /* Update position models */
      for ( var u = 0; u < this.positionModelsInScene.length; u++ ) {
        const modelID = this.positionModelsInScene[ u ].modelID;
        const modelInScene = this.sceneMain.getObjectByName( modelID );
        const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
          'positions' );

        var groupObject = this.getGroup( modelInScene );

        /* Get local Rotion */
        const euler = groupObject.rotation
        const rotation = [ euler._x, euler._y, euler._z, euler._order ]
        
        /* Get world scale */
        const worldScale = new THREE.Vector3();
        groupObject.getWorldScale( worldScale );
        const scale = [ worldScale.x, worldScale.y, worldScale.z ];

        /* Get world position */
        const worldPosition = new THREE.Vector3();
        groupObject.getWorldPosition( worldPosition );
        const coordinates = [ worldPosition.x, worldPosition.y,
          worldPosition.z ];

        modelInDB.color = "#" + modelInScene.material.color.getHexString();
        modelInDB.opacity = modelInScene.material.opacity;
        modelInDB.coordinates = coordinates;
        modelInDB.scale = scale;
        modelInDB.rotation = rotation;

        await fromOfflineDB.updateObject( modelInDB, 'Models', 'positions' );
      }
    },

    updateModelOpacityAndColor: async function(modelID, storeName) {
      const modelInScene = this.sceneMain.getObjectByName( modelID );
      const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
      storeName );

      modelInDB.color = "#" + modelInScene.material.color.getHexString();
      modelInDB.opacity = modelInScene.material.opacity;

      await fromOfflineDB.updateObject( modelInDB, 'Models', storeName );
    },

    /**
     * -------------------------------------------------------------------------
     * # CleanUp
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    clearCanvases: function() {
      /* Remove models */
      this.removeModelsInScene( this.sceneMain, this.modelsInMain );
      this.removeModelsInScene( this.sceneSub, this.modelInSub );

      /* Remove lines */
      this.removeLinesInScene( this.sceneMain, this.measureTool.infoBlock );

      /* Dispose renderer */
      this.rendererMain.dispose();
      this.rendererMain.forceContextLoss();
      this.rendererMain.renderLists.dispose();
      this.rendererSub.dispose();
      this.rendererSub.forceContextLoss();
      this.rendererSub.renderLists.dispose();

      /* Detach controls */
      this.tControlsMain.detach()

      /* Remove EventListener */
      this.canvasMain.removeEventListener( 'click', this.updateArcball );
      this.canvasMain.removeEventListener( 'click', this.onMouseDown );
      window.removeEventListener( 'resize', this.onWindowResize, false );
      this.canvasMain.removeEventListener( 'keydown', this.keyDown );
      this.canvasMain.removeEventListener( 'keyup', this.keyUp );

      this.rendererMain.domElement.removeEventListener( 'pointerdown', this.onClick, false );
      this.canvasMain.removeEventListener( 'mousemove', this.onDocumentMouseMove, false);
    },

    /**
     * 
     * @param {*} scene 
     * @param {*} models 
     */
    removeModelsInScene: function( scene, models ) {
      /* Dispose models in sceneMain */
      for ( let i = 0; i < models.length; i++ ) {
        const childrenToBeRemoved = [];
        const nameTo = models[ i ].name;
        scene.traverse( ( child ) => {
          if ( child.name == nameTo ) {
            childrenToBeRemoved.push( child );
          }
        } );

        childrenToBeRemoved.forEach( ( child ) => {
          scene.remove( child );
        } );
      }
    },

    /**
     * 
     * @param {*} scene 
     * @param {*} models 
     */
    removeLinesInScene: function( scene, infoBlock ) {
      /* Dispose lines in sceneMain */
      infoBlock.forEach( elem => {
        const lineInScene = this.sceneMain.getObjectByName( elem.line )
        const lableInScene = this.sceneMain.getObjectByName( elem.lable )
        const ballsInScene = [];
        elem.balls.forEach( ball => {
          ballsInScene.push( this.sceneMain.getObjectByName( ball ) );
        } )
  
        /* Remove line */
        lineInScene.remove(lableInScene)
        lineInScene.material.dispose()
        lineInScene.geometry.dispose()
        this.sceneMain.remove(lineInScene)

        /* Remove Lable */
        lableInScene.remove()

        /* Remove Balls */
        ballsInScene.forEach( ball => {
          ball.material.dispose();
          ball.geometry.dispose();
          this.sceneMain.remove( ball );
        } )
      } )
    },

    /**
     * -------------------------------------------------------------------------
     * # Loaders
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    loadPlaceModels: async function() {
      const placeID = VueCookies.get( 'currentPlace' );
      const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
        'Models', 'places' );

      if ( objects ) {
        for ( var i = 0; i < objects.length; i++ ) {
          await this.loadModelInMain( objects[ i ], 'Place' );
        }
      }
    },

    /**
     * 
     */
    loadPositionModels: async function() {
      const placeID = VueCookies.get( 'currentPlace' );
      const objects = await fromOfflineDB.getAllObjectsWithID( placeID, 'Place',
        'Models', 'positions' );

      if ( objects ) {
        for ( var i = 0; i < objects.length; i++ ) {
          await this.loadModelInMain( objects[ i ], 'Position' );
        }
      }
    },

    /**
     * 
     * @param {*} modelID 
     * @param {*} dbName 
     * @param {*} storeName 
     */
    loadModelInMain: async function( object, type ) {
      /* Get 3D-Model from IndexedDB */

      /* Load object */
      const meshGroup = await new Promise( ( resolve ) => {
        this.glbLoader.parse( object.model, '', ( glb ) => {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.material.transparent = true;
              child.material.opacity = object.opacity;
              child.material.color = new THREE.Color( object.color );
              child.name = object.id;
            }
          });
          resolve( glb.scene );
        });
      });

      /* Save variables for  */
      switch ( type ) {
        case 'Place':
          this.placeModelsInScene.push( {
            placeID: object.placeID,
            modelID: object.id, 
            modelTitle: object.title
          } );

          break;

        case 'Position':
          this.positionModelsInScene.push( {
            positionID: object.positionID,
            modelID: object.id,
            modelTitle: object.title
          } );

          this.positionModelsInSceneNames.push(object.title)

          /* Override coordinates (IndexedDB) */
          if ( object.coordinates != null ) {
            meshGroup.position.set( object.coordinates[ 0 ], 
              object.coordinates[ 1 ], object.coordinates[ 2 ] );
          }

          /* Override scale (IndexedDB*/
          if ( object.scale != null ) {
            meshGroup.scale.set( object.scale[ 0 ], object.scale[ 1 ], 
              object.scale[ 2 ] );
          }

          /* Override rotation (IndexedDB) */
          if ( object.rotation != null ) {
            const eulerRotation = new THREE.Euler( object.rotation[ 0 ], 
              object.rotation[ 1 ], object.rotation[ 2 ], 
              object.rotation[ 3 ] );
              meshGroup.setRotationFromEuler( eulerRotation );
          }

          break;

        default:
          console.log( "error" );
      }

      /* Add mesh to main scene */
      this.sceneMain.add( meshGroup );
      this.modelsInMain.push( meshGroup );
    },

    /**
     * 
     * @param {*} modelname 
     */
    loadModelInSub: async function( modelID ) {
      const object = await fromOfflineDB.getObject( modelID, 'Models',
        'positions' );
      const model = object.model;
      const opacity = object.opacity;
      const id = object.id;

      /* Load object */
      const meshGroup = await new Promise( ( resolve ) => {
        this.glbLoader.parse( model, '', ( glb ) => {
          glb.scene.traverse( ( child ) => {
            if ( child instanceof THREE.Mesh ) {
              child.name = id;
            }
          } );
          resolve(glb.scene);
        } );
      } );

      this.posInfo.modelName = "Model name: " + object.title;
      
      /* Reposition camera according to model */
      const bbox = new THREE.Box3().setFromObject( meshGroup );
      const height = bbox.max.y - bbox.min.y;
      this.cameraSub.position.z = height + 60;

      /* Add model to sub scene */
      this.sceneSub.add( meshGroup );
      this.modelInSub.push( meshGroup );
    },

    loadLines: async function() {
      const linesInDB = await fromOfflineDB.getAllObjects( 'Lines', 'lines' );

      if ( linesInDB.length > 0 ) {
        linesInDB.forEach( elem => {
          this.createLine( elem.line.name, elem.line.geoPosition );
          this.createLable( elem.lable.name, elem.lable.position );
          this.createBalls( elem.balls, elem.line.geoPosition )

          this.line.add( this.measurementLable );
          this.sceneMain.add( this.line );

          const newLine = {
              id: elem.id,
              name: elem.name,
              line: this.line.name,
              lable: this.measurementLable.name,
              balls: elem.balls,
          }
          this.measureTool.infoBlock.push( newLine );
          
          this.measureTool.allTitles.push( elem.name );
          this.lineID++;
          this.line = null;
          this.measurementLable = null;

        } )
      }
    },

    createLine: function(name, position) {

      const points = [];
      points.push( new THREE.Vector3(position[0], position[1], position[2]),
                   new THREE.Vector3(position[3], position[4], position[5]) );

      const geometry = new THREE.BufferGeometry().setFromPoints(
        points
      )

      /* Create line */
      this.line = new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: 0x0000ff,
        }),
      )

      this.line.name = name;
      this.line.frustumCulled = false;
    },

    createLable: function( name, position ) {

      this.measurementLable = new CSS2DObject();
      this.measurementLable.name = name;
      const vec3 = new THREE.Vector3( position[0], position[1], position[2] );
      this.measurementLable.position.copy( vec3 );
    },

    createBalls: function( names, position ) {
      const pos = [ 
        [ position[0], position[1], position[2] ],
        [ position[3], position[4], position[5] ]
      ]
      
      names.forEach( (elem, i) => {
        const geometry = new THREE.SphereGeometry( 0.03, 6, 4 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.name = names[i];
        this.sceneMain.add( sphere );
        sphere.position.set( pos[i][0], pos[i][1], pos[i][2] );
      } )

    },

    /**
     * -------------------------------------------------------------------------
     * # Model interaction
     * -------------------------------------------------------------------------
     */

    /**
     * 
     * @param {*} modelName 
     */
    changeColor: async function( color, modelGroup ) {
      if ( color != null && modelGroup != null ) {

        modelGroup.traverse( (child) => {
          if ( child instanceof THREE.Mesh) {
            child.material.color = new THREE.Color( color );
          }
        })
      }
    },

    /**
     * 
     * @param {*} modelName 
     */
    changeOpacity: async function( i ) {
      const modelID = this.positionModelsInScene[ i ].modelID;
      const model = this.sceneMain.getObjectByName( modelID );
      const opacityValue = model.material.opacity;

      if ( opacityValue == 1.0 ) {
        this.sceneMain.getObjectByName( modelID ).material.opacity = 0.0;
      } else {
        this.sceneMain.getObjectByName( modelID ).material.opacity = 1.0;
      }
    },

    /**
     * 
     * @param {*} event 
     */
    onMouseDown: async function( event ) {
      event.preventDefault();

      const rect = this.rendererMain.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.pointer.x = ( x / this.canvasMain.clientWidth ) * 2 - 1;
      this.pointer.y = ( y / this.canvasMain.clientHeight ) * - 2 + 1;

      this.raycaster.setFromCamera( this.pointer, this.cameraMain );
      const intersects = this.raycaster.intersectObjects( this.modelsInMain,
        true );

      if ( intersects.length > 0 && event.altKey ) {
        const objectName = intersects[ 0 ].object.name;

        /* Check if clicked model is a position model */
        for ( let i = 0; i < this.positionModelsInScene.length; i++ ) {
          if ( this.positionModelsInScene[ i ].modelID === objectName ) {

            /* Trigger vuetify components */
            this.bottomDrawer.showDrawer = true;
            this.loadModelInSub( intersects[ 0 ].object.name );

            /* Draw outline */
            const modelID = this.positionModelsInScene[ i ].modelID;
            const modelFromScene = this.sceneMain.getObjectByName( modelID );
            const groupObject = this.getGroup( modelFromScene );

            const selectedObject = groupObject;
            this.addSelectedObject( selectedObject );
            this.outlinePass.selectedObjects = this.selectedObjects;

            /* Fill drawer with position info */
            const positionID = this.positionModelsInScene[ i ].positionID;
            const positionInDB = await fromOfflineDB.getObject( positionID,
              'Positions', 'positions' );
            this.posInfo.positionNumber = positionInDB.positionNumber;
            this.posInfo.subNumber = positionInDB.subNumber;
            this.posInfo.date = positionInDB.date;
            this.posInfo.title = positionInDB.title;
            this.posInfo.material = positionInDB.material;
            this.posInfo.right = positionInDB.right;
            this.posInfo.up = positionInDB.up;
            this.posInfo.height = positionInDB.height;
            this.posInfo.count = positionInDB.count;
            this.posInfo.weight = positionInDB.weight;
            this.posInfo.description = positionInDB.description;
            this.posInfo.dating = positionInDB.dating;
            this.posInfo.adressOf = positionInDB.adressOf;
          }
        }
      }
    },

    /**
     * 
     * @param {*} event 
     */
    onDocumentMouseMove: function ( event ) {
      event.preventDefault();

      const rect = this.rendererMain.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.pointer2.x = ( x / this.canvasMain.clientWidth ) * 2 - 1;
      this.pointer2.y = ( y / this.canvasMain.clientHeight ) * - 2 + 1;

      if ( this.drawingLine ) {
        this.raycaster2.setFromCamera( this.pointer2, this.cameraMain );
        const intersects = this.raycaster2.intersectObjects( this.modelsInMain,
        true );

        if ( intersects.length > 0 ) {
          const positions = this.line.geometry.attributes.position;

          const v0 = new THREE.Vector3(
            positions.array[0],
            positions.array[1],
            positions.array[2]
          )
          const v1 = new THREE.Vector3(
            intersects[0].point.x,
            intersects[0].point.y,
            intersects[0].point.z
          )
          this.line.geometry.attributes.position.needsUpdate = true
          const distance = v0.distanceTo(v1)

          v1.x += 0.0
          v1.y -= 0.3

          this.measurementLable.element.innerText = distance.toFixed(2) + 'm'
          this.measurementLable.position.lerpVectors(v0, v1, 0.5)
        }
      }
    },

    /**
     * 
     */
    onClick: async function() {
      if ( this.ctrlDown ) {
        this.raycaster2.setFromCamera( this.pointer2, this.cameraMain );
        const intersects = this.raycaster2.intersectObjects( this.modelsInMain,
          true );
        if ( intersects.length > 0 ) {
          if ( !this.drawingLine ) {
            const points = [];
            points.push( intersects[0].point );
            points.push( intersects[0].point.clone() );
            const geometry = new THREE.BufferGeometry().setFromPoints(
              points,
            )
            
            /* Create line */
            this.line = new THREE.Line(
              geometry,
              new THREE.LineBasicMaterial({
                color: 0x0000ff,
              }),
            )
            this.line.name = "Line - " + this.lineID;
            this.line.frustumCulled = false;

            /* Create lable */
            this.measurementLable = new CSS2DObject();
            this.measurementLable.name = "Label - " + this.lineID
            this.measurementLable.position.copy( intersects[0].point );
            
            /* Add line and lable to sceneMain */
            this.line.add(this.measurementLable)
            this.sceneMain.add(this.line);

            this.drawingLine = true;
          } else {
            const placeInDB = await fromOfflineDB.getObject( 
              VueCookies.get('currentPlace'), 'Places', 'places' )

            const positions = this.line.geometry.attributes.position;
            positions.array[3] = intersects[0].point.x;
            positions.array[4] = intersects[0].point.y;
            positions.array[5] = intersects[0].point.z;
            this.line.geometry.attributes.position.needsUpdate = true;
            
            const v0 = [positions.array[0], positions.array[1],
            positions.array[2]];

            const v1 = [positions.array[3], positions.array[4],
            positions.array[5]];
            
            this.createRedBall(v0, "firstBall - " + this.lineID)
            this.createRedBall(v1, "secondBall - " + this.lineID)

            const nameOfLine = "New Line - " + this.lineID;
            const nameOfBalls = [ "firstBall - " + this.lineID, 
                                  "secondBall - " + this.lineID ];

            const newLine = {
              id: this.lineID,
              name: nameOfLine,
              line: this.line.name,
              lable: this.measurementLable.name,
              balls: nameOfBalls,
            }

            const lineAttr = {
              name: this.line.name,
              geoPosition: [
                this.line.geometry.attributes.position.array[0],
                this.line.geometry.attributes.position.array[1],
                this.line.geometry.attributes.position.array[2],
                this.line.geometry.attributes.position.array[3],
                this.line.geometry.attributes.position.array[4],
                this.line.geometry.attributes.position.array[5] ],
            }

            /* Lable */
            const lableAttr = {
              name: this.measurementLable.name,
              position: [
                this.measurementLable.position.x,
                this.measurementLable.position.y,
                this.measurementLable.position.z ],
            }

            /* Create new entry */
            const newLineEntry = {
              id: this.lineID,
              name: nameOfLine,
              line: lineAttr,
              lable: lableAttr,
              balls: nameOfBalls,
            }

            this.measureTool.infoBlock.push( newLine );
            this.measureTool.allTitles.push( nameOfLine );

            await fromOfflineDB.addObject( newLineEntry, 'Lines', 'lines' );
            placeInDB.lines.push(nameOfLine);
            await fromOfflineDB.updateObject( placeInDB, 'Places', 'places' );

            this.lineID = String(Date.now());
            this.line = null;
            this.measurementLable = null;
            this.drawingLine = false;
          }
        }
      }
    },

    /**
     * 
     * @param {*} cords 
     * @param {*} name 
     */
    createRedBall: function( cords, name) {
      const geometry = new THREE.SphereGeometry( 0.03, 6, 4 );
      const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
      const sphere = new THREE.Mesh( geometry, material );
      sphere.name = name;
      this.sceneMain.add( sphere );
      sphere.position.set( cords[0], cords[1], cords[2] );
    },

    /**
     * -------------------------------------------------------------------------
     * # Controls
     * -------------------------------------------------------------------------
     */

    /**
      * 
      * @param {*} i 
      */
    attachTransformControls: function() {
      if ( !this.posMods.attachTransformControls ) {
        this.posMods.attachTransformControls = true;
        if ( this.posModel.chosenfinalModelGroup ) {
          this.tControlsMain.detach();
          this.tControlsMain.attach(this.posModel.chosenfinalModelGroup);
        }
      } else {
        this.posMods.attachTransformControls = false;
        this.tControlsMain.detach();
      }
    },

    /**
     * 
     * @param {*} event 
     */
    updateArcball: async function( event ) {
      if ( event.ctrlKey ) {
        const placeID = VueCookies.get( 'currentPlace' );

        this.getCamera( this.cameraMain, this.cameraData );
        const cameraIDsFromDB = await fromOfflineDB.getProperties( 'id',
          'Cameras', 'cameras' );

        if ( cameraIDsFromDB.includes( placeID ) ) {
          const newCamera = await fromOfflineDB.getObject(
            VueCookies.get( 'currentPlace' ), 'Cameras', 'cameras' );

          this.abControlsMain.target.set( newCamera.arcballAnchor[ 0 ],
            newCamera.arcballAnchor[ 1 ], newCamera.arcballAnchor[ 2 ]);

          this.abControlsMain.reset();
          this.abControlsMain.update();
        } else {
          this.abControlsMain.target.set( this.arcballAnchor[ 0 ],
            this.arcballAnchor[ 1 ], this.arcballAnchor[ 2 ] );

          this.abControlsMain.reset();
          this.abControlsMain.update();
        }

        this.setCamera( this.cameraMain, this.cameraData );
      }
    },

    /**
     * 
     * @param {*} arcballAnchor 
     * @param {*} arcballControls 
     */
    restoreArcballAnchor: function( arcballAnchor, arcballControls ) {
      /* Restore saved anchor position for the arcball target */
      arcballControls.target.set( arcballAnchor[ 0 ], arcballAnchor[ 1 ],
        arcballAnchor[ 2 ] );

      /* Save changes made to the arcball control settings */
      arcballControls.update();
    },

    /**
     * -------------------------------------------------------------------------
     * # Camera
     * -------------------------------------------------------------------------
     */
    
    /**
     * 
     * @param {*} modelName 
     */
    updateCamera: async function( modelName ) {
      const placeID = VueCookies.get( 'currentPlace' );
      const cameraIDsFromDB = await fromOfflineDB.getProperties( 'id',
        'Cameras', 'cameras' );

      if ( cameraIDsFromDB.includes( placeID ) ) {
        /* Get camera data from IndexedDB */
        const cameraFromDB = await fromOfflineDB.getObject(
          VueCookies.get( 'currentPlace' ), 'Cameras', 'cameras' );

        /* Update current camera state with camera data from IndexedDB */
        const cameraPosition = cameraFromDB.cameraPosition;
        this.cameraData.position = [ cameraPosition[ 0 ], cameraPosition[ 1 ],
        cameraPosition[ 2 ] ];
        this.cameraData.rotation = [ cameraPosition[ 3 ], cameraPosition[ 4 ],
        cameraPosition[ 5 ] ];

        /* Restore saved anchor position for the arcball target */
        this.restoreArcballAnchor( cameraFromDB.arcballAnchor,
          this.abControlsMain );

        /* Set new camera state */
        this.setCamera( this.cameraMain, this.cameraData );
      } else {
        /* Get center of place model as Vec3 */
        const model = this.sceneMain.getObjectByName( modelName );
        const center = this.getModelCenter( model );

        /* Define an anchor point for the arcball */
        this.arcballAnchor.push( center.x );
        this.arcballAnchor.push( center.y );
        this.arcballAnchor.push( center.z );

        /* Set center as the new arcball target */
        this.abControlsMain.target.set( center.x, center.y, center.z );

        /* Move camera to the object */
        this.cameraMain.position.set( center.x, center.y - 15, center.z );
        this.getCamera( this.cameraMain, this.cameraData );

        /* Save changes made to the arcball control settings */
        this.abControlsMain.update();
      }
    },

    /**
     * 
     * @param {*} camera 
     * @param {*} cameraData 
     */
    getCamera: function( camera, cameraData ) {
      cameraData.position = [ camera.position.x, camera.position.y,
      camera.position.z ];
      cameraData.rotation = [ camera.rotation.x, camera.rotation.y,
      camera.rotation.z ];
    },

    /**
     * 
     * @param {*} camera 
     * @param {*} cameraData 
     */
    setCamera: function( camera, cameraData ) {
      camera.position.set( cameraData.position[ 0 ], cameraData.position[ 1 ],
        cameraData.position[ 2 ] );
      camera.rotation.set( cameraData.rotation[ 0 ], cameraData.rotation[ 1 ],
        cameraData.rotation[ 2 ]);
    },

    /**
     * 
     */
    makePerspectiveCamera: function() {
      const fov = 45;
      const aspect = this.canvasMain.clientWidth / this.canvasMain.clientHeight;
      const near = 0.01;
      const far = 2000;
      const newCamera = new THREE.PerspectiveCamera( fov, aspect, near, far );
      return newCamera;
    },

    /**
     * -------------------------------------------------------------------------
     * # Utility
     * -------------------------------------------------------------------------
     */

    /**
     * 
     * @param {*} model 
     */
    getModelCenter: function( model ) {
      var groupObject = model;
      while ( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent;
      }

      const boundingBox = new THREE.Box3();
      boundingBox.setFromObject( groupObject );
      const center = new THREE.Vector3();
      boundingBox.getCenter( center );

      return center;
    },

    /**
     * 
     * @param {*} object 
     */
    addSelectedObject: function( object ) {
      this.selectedObjects = [];
      this.selectedObjects.push( object );
    },

    /**
     * 
     * @param {THREE.Mesh} model 
     */
    getGroup: function( model ) {
      var groupObject = model;
      while ( !( groupObject instanceof THREE.Group ) ) {
        groupObject = groupObject.parent;
      }
      return groupObject;
    },

    /**
     * 
     * @param {*} event 
     */
    gizmoChange: function( event ) {
      if ( event ) {
        this.abControlsMain.setGizmosVisible( false );
        this.gismoCB = false;
      } else {
        this.abControlsMain.setGizmosVisible( true );
        this.gismoCB = true;
      }
    },

    /**
     * -------------------------------------------------------------------------
     * # Filter Model
     * -------------------------------------------------------------------------
     */

    /**
     * 
     * @param {*} typeSize
     * @param {*} chosenModels
     * @param {*} inputs
     * @param {*} menues
     * @param {*} infos
     */
    fieldSearch: async function( typeSize, chosenModels, inputs, menues, infos ) {
      const areNull = [];
      const notNull = [];
      var layers = [];

      /* Determin which field is 'null' and which is not */
      for ( let a = 0; a < typeSize; a++ ) {
        if ( inputs[ a ] == null ) {
          areNull.push( a );
        } else {
          notNull.push( a );
        }
      }

      this.stringReplacer( typeSize, areNull );

      /* No empty fields */
      if ( notNull.length == typeSize ) {
        this.choseModels( typeSize, chosenModels, inputs, infos )
      }

      /* Only empty fields */
      else if ( areNull.length == typeSize ) {
        this.resetFilter( infos, menues );
      }

      /* Only one given field */
      else if ( notNull.length == 1 ) {
        for ( let b = 0; b < infos.length; b++ ) {
          this.fillAll( menues[ notNull[ 0 ] ], infos[ b ][ notNull[ 0 ] ] );
          layers.push( [infos[ b ][ notNull[ 0 ] ], inputs[ notNull[ 0 ] ]] );
          for( let c = 0; c < areNull.length; c++ ) {
            this.layering( layers, menues[ areNull[ c ] ], 
            infos[ b ][ areNull[ c ] ]);
          }
          layers = [];
        }
      }

      /* Unkown number of given and empty fields */
      else if ( notNull.length > 1 ) {
        for ( let d = 0; d < infos.length; d++ ) {
          for ( let e = 0; e < notNull.length; e++ ) {
            for ( let f = 0; f < notNull.length; f++ ) {
              if ( f != e ) {
                layers.push( [ infos[ d ][ notNull[ f ] ], 
                  inputs[ notNull[ f ] ] ] );
              }
            }
            this.layering( layers, menues[ notNull[ e ] ], 
              infos[ d ][ notNull[ e ] ]);
            layers = [];
          }
          for ( let g = 0; g < areNull.length; g++ ) {
            for ( let h = 0; h < notNull.length; h++ ) {
              layers.push( [ infos[ d ][ notNull[ h ] ], 
                             inputs[ notNull[ h ] ] ] );
            }
            this.layering( layers, menues[ areNull[ g ] ], 
                           infos[ d ][ areNull[ g ] ] );
            layers = [];
          }
        }
      }
    },

    /**
     * 
     * @param {*} layer
     * @param {*} all
     * @param {*} infoBlockItem
     */
    layering: function( layer, all, infoBlockItem ) {
      const layercount = layer.length;
      let check = true;

      for ( let i=0; i < layercount; i++ ) {
        if( !( layer[i][0] == layer[i][1] ) ) {
          check = false;
          break;
        }
      }

      if ( check ) {
        this.fillAll( all, infoBlockItem );
      }
    },

    /**
     * 
     * @param {*} list
     * @param {*} blockItem
     */
    fillAll: function( list, blockItem ) {
      if (!list.includes(blockItem)) {
        list.push(blockItem);
      }
    },

    /**
     * 
     * @param {*} infos
     * @param {*} menues
     */
    resetFilter: function( infos, menues ) {
      for ( let a = 0; a < infos.length; a++ ) {
        for ( let b = 0; b < menues.length; b++ ) {
          this.fillAll(menues[ b ], infos[ a ][ b ]);
        }
      }

      for ( let c = 0; c < menues.length; c++ ) {
        menues[c].sort();
      }
    },

    /**
     * 
     */
     getPlaceModelInfo: async function() {
      for ( let i=0; i < this.placeModelsInScene.length; i++) {
        const modelID = this.placeModelsInScene[ i ].modelID;
        const modelInDB = await fromOfflineDB.getObject(modelID, 'Models', 
          'places');

        if ( !this.plaModel.allNumbers.includes(modelInDB.modelNumber) ) {
          this.plaModel.allNumbers.push(modelInDB.modelNumber);
        }

        if ( !this.plaModel.allTitles.includes(modelInDB.title) ) {
          this.plaModel.allTitles.push(modelInDB.title);
        }

        /* For the filter algorithm to work properly */
        const modelIDArray = [modelInDB.id]
        const newModel = [
          modelInDB.modelNumber,
          modelInDB.title,
          modelIDArray,
          modelInDB.color,
          modelInDB.opacity
        ]

        this.plaModel.infoBlock.push(newModel)
      }
    },

    /**
     * 
     */
    getPositionInfo: async function() {
      const positionIDs = [];

      for ( let i=0; i < this.positionModelsInScene.length; i++) {
        const positionID = this.positionModelsInScene[i].positionID
        const positionInDB = await fromOfflineDB.getObject(positionID, 'Positions', 'positions')

        if ( !positionIDs.includes(positionID) ) {

          if (!this.posData.allNumbers.includes(positionInDB.positionNumber)) {
            this.posData.allNumbers.push(positionInDB.positionNumber)
          }
          if (!this.posData.allSubNumbers.includes(positionInDB.subNumber)) {
            this.posData.allSubNumbers.push(positionInDB.subNumber)
          }
          if (!this.posData.allTitles.includes(positionInDB.title)) {
            this.posData.allTitles.push(positionInDB.title)
          }

          const newPosition = [
            positionInDB.positionNumber,
            positionInDB.subNumber,
            positionInDB.title,
            positionInDB.models
          ]

          this.posData.infoBlock.push(newPosition)

          positionIDs.push(positionID)
        }
        
      }
    },

    /**
     * 
     */
    getPositionModelInfo: async function() {
      for ( let i=0; i < this.posData.chosenPositionModels.length; i++) {
        const modelID = this.posData.chosenPositionModels[ i ];
        const modelInDB = await fromOfflineDB.getObject(modelID, 'Models', 'positions')

        if ( !this.posModel.allNumbers.includes(modelInDB.modelNumber) ) {
          this.posModel.allNumbers.push(modelInDB.modelNumber)
        }

        if ( !this.posModel.allTitles.includes(modelInDB.title) ) {
          this.posModel.allTitles.push(modelInDB.title)
        }

        /* For the filter algorithm to work properly */
        const modelIDArray = [modelInDB.id]
        const newModel = [
          modelInDB.modelNumber,
          modelInDB.title,
          modelIDArray,
          modelInDB.color,
          modelInDB.opacity
        ]

        this.posModel.infoBlock.push(newModel)
      }
    },

    /**
     * 
     * @param {*} typeSize
     * @param {*} chosenModels
     * @param {*} inputs
     * @param {*} infos
     */
    choseModels: function( typeSize, chosenModels, inputs, infos ) {
      let isChosen = true;

      for ( let a = 0; a < infos.length; a++ ) {
        isChosen = true;

        for ( let b = 0; b < typeSize; b++ ) {
          if( !( infos[a][b] == inputs[b] ) ) {
            isChosen = false;
            break;
          }
        }

        if( isChosen ) {
          infos[a][typeSize].forEach( ( elem ) => {
            chosenModels.push( elem );
          } );
        }
      }
    },

    /**
     * 
     */
    resetModelInfo2Input: function() {
      this.posModel.number = null;
      this.posModel.title = null;
      this.posModel.infoBlock = [];
    },

    /**
     * 
     */
    resetModelInfo2: function() {
      this.posModel.allNumbers = [];
      this.posModel.allTitles = [];
      this.posModel.chosenfinalModel = [];
    },

    /**
     * 
     */
     resetPlaceModelInfo: function() {
      this.plaModel.allNumbers = [];
      this.plaModel.allTitles = [];
      this.plaModel.chosenfinalModel = [];
     },
    
    /**
     * 
     */
    resetPositionInfo2: function() {
      this.posData.allNumbers = [];
      this.posData.allSubNumbers = [];
      this.posData.allTitles = [];
      this.posData.chosenPositionModels = [];
    },

    /**
     * 
     */
    resetPositionMods: function() {
      this.posModel.chosenfinalModelGroup = null;
          this.posMods.disabled = true;
          this.updateModelOpacityAndColor(this.posModel.chosenfinalModel[0],
          'positions');
          this.posModel.chosenfinalModelGroup = null;
          this.posMods.colorPicker.color = null;
          this.posMods.opacitySliderValue = 0;
          this.posMods.token = false;
    },

    /**
     * 
     */
    resetPlaceMods: function() {
      this.plaMods.token = false;
      this.plaMods.disabled = true;
      this.updateModelOpacityAndColor(this.plaModel.chosenfinalModel[0],
        'places');
      this.plaModel.chosenfinalModelGroup = null;
      this.plaMods.colorPicker.color = null;
      this.plaMods.opacitySliderValue = 0;
    },

    /**
     * -------------------------------------------------------------------------
     * # Init
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    mainInit: function() {
      /* All loaded meshes in main scene */
      this.modelsInMain = [];

      /* Renderer */
      this.rendererMain = new THREE.WebGLRenderer( {
        canvas: this.canvasMain,
        antialias: true
      } );
      this.rendererMain.setSize( this.canvasMain.clientWidth,
        this.canvasMain.clientHeight );
      this.rendererMain.setClearColor( params.sceneMain.bgColor, 1 );
      this.rendererMain.shadowMap.enabled = true;
      this.rendererMain.shadowMap.type = THREE.PCFSoftShadowMap;
      this.rendererMain.outputEncoding = THREE.SRGBColorSpace;

      /* label Renderer */
      this.labelRenderer = new CSS2DRenderer()
      this.labelRenderer.setSize( this.canvasMain.clientWidth,
        this.canvasMain.clientHeight );
      this.labelRenderer.domElement.style.position = 'absolute'
      this.labelRenderer.domElement.style.top = '35px'
      this.labelRenderer.domElement.style.color = "white"
      this.labelRenderer.domElement.style.pointerEvents = 'none'
      document.body.appendChild( this.labelRenderer.domElement)

      // Scene
      this.sceneMain = new THREE.Scene();

      // Camera
      this.cameraMain = this.makePerspectiveCamera();

      // Light
      const ambientLight = new THREE.AmbientLight( params.sceneMain.lightColor );
      this.sceneMain.add( ambientLight );

      // Controls
      this.abControlsMain = new ArcballControls( this.cameraMain,
        this.rendererMain.domElement, this.sceneMain );
      this.abControlsMain.setGizmosVisible( false );

      this.tControlsMain = new TransformControls( this.cameraMain,
        this.rendererMain.domElement );
      this.tControlsMain.addEventListener( 'dragging-changed', e => {
        this.abControlsMain.enabled = !e.value;
      } );

      this.sceneMain.add( this.tControlsMain );

      // Raycaster
      this.raycaster = new THREE.Raycaster();
      this.pointer = new THREE.Vector2();
      
      this.raycaster2 = new THREE.Raycaster();
      this.pointer2 = new THREE.Vector2();

      // Post processing
      this.composer = new EffectComposer( this.rendererMain );

      this.renderPass = new RenderPass( this.sceneMain, this.cameraMain );
      this.composer.addPass( this.renderPass );

      this.outlinePass = new OutlinePass( new THREE.Vector2(
        this.canvasMain.clientWidth, this.canvasMain.clientHeight ),
        this.sceneMain, this.cameraMain );
      this.outlinePass.hiddenEdgeColor.set( params.sceneMain.outline.color )
      this.outlinePass.pulsePeriod = params.sceneMain.outline.pulsePeriod;
      this.outlinePass.edgeStrength = params.sceneMain.outline.edgeStrength;
      this.outlinePass.edgeThickness = params.sceneMain.outline.edgeThickness;
      this.outlinePass.edgeGlow = params.sceneMain.outline.edgeGlow;
      this.composer.addPass( this.outlinePass );

      // Shader
      this.effectFXAA = new ShaderPass( FXAAShader );
      this.effectFXAA.uniforms[ 'resolution' ].value.set(
        1 / this.canvasMain.clientWidth, 1 / this.canvasMain.clientHeight );
      this.composer.addPass( this.effectFXAA );

      this.gammaCorrectionShader = new ShaderPass( GammaCorrectionShader );
      this.composer.addPass( this.gammaCorrectionShader )

      // Eventlistener
      this.canvasMain.addEventListener( 'click', this.updateArcball );
      this.canvasMain.addEventListener( 'click', this.onMouseDown );
      window.addEventListener( 'keydown', e => {
        switch ( e.code ) {
          case 'KeyW':
            this.tControlsMain.mode = 'translate';
            break;
          case 'KeyE':
            this.tControlsMain.mode = 'rotate';
            break;
          case 'KeyR':
            this.tControlsMain.mode = 'scale';
            break;
        }
      });

      this.intersectsMeasurement = null

      this.ctrlDown = false
      this.lineID = String(Date.now());
      this.line = null
      this.measurementLable = null
      this.drawingLine = false

      this.linesArray = []

      this.canvasMain.addEventListener( 'keydown', this.keyDown );
      this.canvasMain.addEventListener( 'keyup', this.keyUp );

      this.rendererMain.domElement.addEventListener( 'pointerdown', this.onClick, false );
      this.canvasMain.addEventListener( 'mousemove', this.onDocumentMouseMove, false);

    },

    /**
     * 
     */
    keyDown: function( event ) {
      if (event.key === 'x') {
          this.ctrlDown = true;
          this.abControlsMain.enabled = false
          document.body.style.cursor = 'crosshair';
      }
    },

    /**
     * 
     * @param {*} event 
     */
    keyUp: function(event) {
      if (event.key === 'x') {
        this.ctrlDown = false;
        this.abControlsMain.enabled = true
        document.body.style.cursor = 'pointer'
        if ( this.drawingLine ) {
          this.line.remove(this.measurementLable)
          this.sceneMain.remove( this.line );
          this.drawingLine = false;
        }
      }
    },

    /**
     * 
     */
    subInit: function () {
      /* mesh in sub scene */
      this.modelInSub = [];

      /* Renderer */
      this.rendererSub = new THREE.WebGLRenderer( { canvas: this.canvasSub } );
      this.rendererSub.setPixelRatio( this.canvasSub.devicePixelRatio );
      this.rendererSub.setSize( this.canvasSub.clientWidth,
        this.canvasSub.clientHeight );
      this.rendererSub.setClearColor( params.sceneSub.bgColor, 1 );
      this.rendererSub.shadowMap.enabled = true;
      this.rendererSub.shadowMap.type = THREE.PCFSoftShadowMap;

      /* Scene */
      this.sceneSub = new THREE.Scene();

      /* Camera */
      const aspect = this.canvasSub.clientWidth / this.canvasSub.clientHeight;
      this.cameraSub = new THREE.PerspectiveCamera( 45, aspect, 1, 1000 );

      /* Light */
      const ambientLight = new THREE.AmbientLight( params.sceneSub.lightColor );
      this.sceneSub.add( ambientLight );

      /* Controls */
      this.controlsSub = new OrbitControls( this.cameraSub,
        this.rendererSub.domElement );

      /* Event listener */
      this.canvasSub.addEventListener( 'mousemove', () => {
        console.log( "Mouse moved" );
      } )

    },

    /**
     * -------------------------------------------------------------------------
     * # Animation
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    animate: function() {
      /* Check interactions */
      this.render();
      
      /* Render sceneMain and sceneSub */
      this.rendererMain.render( this.sceneMain, this.cameraMain );
      this.rendererSub.render( this.sceneSub, this.cameraSub );
      this.labelRenderer.render( this.sceneMain, this.cameraMain )

      /* Render composer */
      this.composer.render()
      
      /* Render-Loop */
      requestAnimationFrame( this.animate );
    },

    /**
     * 
     */
    render: async function() {
      /* Dispose Model from sceneSub */
      if ( !this.bottomDrawer.showDrawer && this.sceneSub.children.length > 1 ) {
        this.removeModelsInScene( this.sceneSub, this.modelInSub )
        this.modelInSub = [];
        this.controlsSub.reset();
        this.outlinePass.selectedObjects = [];
      }

      /* Rotate model in sceneSub */
      if ( this.modelInSub[ 0 ] ) {
        this.modelInSub[ 0 ].rotation.y += 0.01;
      }

      /* Reset arcball gizmo radius */
      this.abControlsMain.setTbRadius( 0.67 );
    },

    /**
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     * # DEBUGGING
     * -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
     */

    /**
     * 
     * @param {*} str
     * @param {*} index
     * @param {*} chr
     */
    setCharAt: function( str, index, chr ) {
      if ( index > str.length - 1 ) return str;
      return str.substring( 0, index ) + chr + str.substring( index + 1 );
    },

    /**
     * 
     * @param {*} typeSize
     * @param {*} areNull
     */
    stringReplacer: function( typeSize, areNull ) {
      let str = '';

      for ( let a = 0; a < typeSize; a++ ) { 
        
        if ( areNull.includes(a) ) {
          str += '_'
        } else {
          str += 'x';
        }

        if ( a+1 < typeSize ) {
          str += ' , ';
        }
      }

      if ( str.toLowerCase().indexOf("x") === 0) {
        if ( str.toLowerCase().indexOf("_") === -1 ) {
          console.log( "( " + str + " ) - done!")
        } else {
          console.log( "( " + str + " )" );
        }
      }
    },

  }
}
</script>

<style scoped></style>