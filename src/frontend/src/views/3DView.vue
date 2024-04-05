<!--
 Created Date: 17.11.2023 16:18:33
 Author: Tobias Mink
 
 Last Modified: 05.04.2024 14:21:58
 Modified By: Tobias Mink
 
 Description: 
 -->

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="1" />

    <!-- Left sidebar: GUI -->
    <div id="leftSidebar" style="position:relative; float: left; z-index: 3; width: 50px; visibility: visible;">
      <v-card>
        <!-- Tools -->
        <v-navigation-drawer v-model="leftDrawer.showDrawers[0]" color="background"
          style="left: 50px; width: 470px; " temporary>
          <v-list-item height="50" prepend-icon="mdi-camera-control" :title="$t('tools')"></v-list-item>

          <v-divider></v-divider>

          <v-form>
            <!-- Measurement Tool -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" elevation="0">

                  <!-- Checkboxes -->
                  <v-row>
                    <v-col>

                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" class="pa-1"> Messungs Tool - WORK IN PROGRESS -
                        </v-row>

                        <v-card color="opp_background">

                          <v-row no-gutters class="pt-4 px-4">
                            <!-- Annotation Mode Button-->
                            <v-col>
                              <v-btn width="100%" color="error" v-on:click="switchToAnModus( annotatTool.modus )">
                                Wechsel zu Messungs-Modus
                              </v-btn>
                            </v-col>
                          </v-row>

                          <v-row no-gutters class="pt-4 px-3">
                            <v-col>
                              <v-select v-model="measureTool.title" :label="$t('line')" color="primary"
                                :items="measureTool.allTitles" :@update="measurementTool.updateTitle( 
                                  measureTool )"></v-select>
                            </v-col>
                          </v-row>

                          <v-divider></v-divider>

                          <v-row no-gutters class="pt-4 px-3">
                            <!-- Checkbox description-->
                            <v-col cols="10">
                              <v-text-field v-model="measureTool.textField" color="primary"
                                :placeholder="$t('newIdentifier')">
                              </v-text-field>
                            </v-col>

                            <v-col cols="2">
                              <v-btn icon class="ma-1" color="primary" v-on:click="measurementTool.saveLineTitle(
                                      this.$root, this.$t, measureTool, 
                                      exParams.main )">
                                <v-icon>mdi-content-save-all</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>

                          <v-row no-gutters class="ps-4 pb-3">
                            <v-col cols="12">
                              <v-btn width="96.6%" color="error" v-on:click="measurementTool.deleteLine(
                                      this.placeInDB, measureTool, exParams.main )">
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
            
            <!-- Annotations Tool -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" elevation="0">

                  <!-- Checkboxes -->
                  <v-row>
                    <v-col>

                      <v-card color="secondary">
                        
                        <v-row no-gutters align="center" justify="center" class="pa-1"> Annotations Tool - WORK IN PROGRESS -
                        </v-row>

                        <v-card color="opp_background">
                          
                          <v-row no-gutters class="pt-4 px-4">
                            <!-- Annotation Mode Button-->
                            <v-col>
                              <v-btn width="100%" color="error" v-on:click="switchToAnModus( annotatTool.modus )">
                                Wechsel zu Annotations-Modus
                              </v-btn>
                            </v-col>
                          </v-row>
                          
                          <v-row no-gutters class="pt-4 px-3">
                            <v-col>
                              <v-select v-model="annotatTool.title" label="Annotation" color="primary"
                                :items="annotatTool.allTitles" :@update="annotationTool.updateTitle( 
                                  annotatTool )"></v-select>
                            </v-col>
                          </v-row>

                          <v-divider></v-divider>

                          <v-row no-gutters class="pt-4 px-3">
                            <!-- Checkbox description-->
                            <v-col cols="10">
                              <v-text-field v-model="annotatTool.textField" color="primary"
                                :placeholder="$t('newIdentifier')">
                              </v-text-field>
                            </v-col>

                            <v-col cols="2">
                              <v-btn icon class="ma-1" color="primary" v-on:click="annotationTool.saveAnnotationTitle(
                                      this.$root, this.$t, annotatTool, 
                                      exParams.main )">
                                <v-icon>mdi-content-save-all</v-icon>
                              </v-btn>
                            </v-col>
                          </v-row>

                          <v-row no-gutters class="ps-4 pb-3">
                            <v-col cols="12">
                              <v-btn width="96.6%" color="error" v-on:click="annotationTool.deleteAnnotation(
                                      this.placeInDB, annotatTool, 
                                      exParams.main )">
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

            <!-- Cutting Tool -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" elevation="0">

                  <!-- Checkboxes -->
                  <v-row>
                    <v-col>

                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" class="pa-1"> Schneid Tool - WORK IN PROGRESS -
                        </v-row>

                        <v-card color="opp_background">

                          <v-row no-gutters class="pt-4 pb-4 px-4">
                            <!-- Segmentation Mode Button-->
                            <v-col>
                              <v-btn width="100%" color="error" v-on:click="segmentationTool.switchToSegmentationMode( 
                                      exParams.stTool, exParams.main )">
                                Switch to Segmentation Mode
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
        <v-navigation-drawer v-model="leftDrawer.showDrawers[1]" color="background"
          style="left: 50px; top:64px; width: 470px; padding-bottom: 48px;" temporary>
          <v-list-item height="50" prepend-icon="mdi-radar" :title="$tc('place', 2)"></v-list-item>

          <v-divider></v-divider>

          <v-form>

            <!-- Filter -->
            <v-row>
              <v-col>
                <v-card color="transparent" elevation="0" width="100%" class="pa-2">

                  <!-- Model -->
                  <v-row no-gutters class="pl-3">
                    {{ $tc('model', 1) }}
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2 ">
                      <v-combobox v-model="placeObject.number" :label="$tc('number', 2)" item-title="modelNumber"
                        color="primary" bgColor="opp_background" :items="placeObject.allNumbers"></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 ">
                      <v-combobox v-model="placeObject.title" :label="$t('title')" item-title="modelTitel"
                        color="primary" bgColor="opp_background" :items="placeObject.allTitles"></v-combobox>
                    </v-col>

                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider thickness="5"></v-divider>

            <!-- Model Interaktion -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" elevation="0">
                  <v-row class="pb-2">
                    <v-col>

                      <!-- Checkboxes -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" class="pa-1"> {{ $t('general') }}
                        </v-row>

                        <v-card color="opp_background" class="pa-2">

                          <v-row no-gutters>
                            <!-- Opacity-->
                            <v-col cols="2" class="px-2 pt-4">
                              <v-slider v-model="placeMods.opacitySliderValue" :max="1" :disabled="placeMods.disabled"
                                track-color="primary" thumb-color="secondary" color="warning">
                              </v-slider>
                            </v-col>

                            <v-divider vertical></v-divider>

                            <!-- Checkbox description-->
                            <v-col cols="10" class="py-5 px-4">
                              {{ $t('opacity') }}
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
                        <v-row no-gutters align="center" justify="center" class="pa-1"> {{ $t('colorPicker') }}
                        </v-row>

                        <v-card id="cpPlace" color="opp_background" class="pa-2">
                          <v-color-picker v-model="placeMods.colorPicker.color" hide-canvas hide-sliders hide-inputs
                            show-swatches swatches-max-height="235px" width="100%" :disabled="placeMods.disabled"
                            :v-on:update="modelInteraktion.changeColor(
                                            placeMods.colorPicker.color, 
                                            placeMods.colorPicker.object)"></v-color-picker>
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
        <v-navigation-drawer v-model="leftDrawer.showDrawers[2]" color="background"
          style="left: 50px; top:64px; width: 470px; padding-bottom: 48px;" temporary>
          <v-list-item height="50" prepend-icon="mdi-map-marker-radius-outline" :title="$t('posFilter')"></v-list-item>

          <v-divider></v-divider>

          <v-form>

            <!-- Filter -->
            <v-row>
              <v-col>
                <v-card color="transparent" elevation="0" width="100%" class="pa-2">

                  <!-- Position -->
                  <v-row no-gutters class="pl-3">
                    {{ $tc('position', 1) }}
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2">
                      <v-combobox v-model="positionData.number" :label="$tc('number', 2)" item-title="positionNumber"
                        color="primary" bgColor="opp_background" :items="positionData.allNumbers"></v-combobox>
                    </v-col>

                    <v-col cols="3" class="pl-2">
                      <v-combobox v-model="positionData.subNumber" :label="$t('subNumber')" color="primary"
                        bgColor="opp_background" item-title="positionSubnumber"
                        :items="positionData.allSubNumbers"></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 pr-2">
                      <v-combobox v-model="positionData.title" :label="$t('title')" item-title="positionTitle"
                        color="primary" bgColor="opp_background" :items="positionData.allTitles"></v-combobox>
                    </v-col>

                  </v-row>

                  <!-- Model -->
                  <v-row no-gutters class="pl-3">
                    {{ $t('model') }}
                  </v-row>

                  <v-row no-gutters>

                    <v-col cols="3" class="pl-2 ">
                      <v-combobox v-model="positionObject.number" :label="$tc('number', 2)" item-title="modelNumber"
                        color="primary" bgColor="opp_background" :items="positionObject.allNumbers"
                        :disabled="!positionObject.disableInput"></v-combobox>
                    </v-col>

                    <v-col cols="6" class="pl-2 ">
                      <v-combobox v-model="positionObject.title" :label="$tc('title', 2)" item-title="modelTitel"
                        color="primary" bgColor="opp_background" :items="positionObject.allTitles"
                        :disabled="!positionObject.disableInput"></v-combobox>
                    </v-col>

                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <v-divider thickness="5"></v-divider>

            <!-- Model Interaktion -->
            <v-row>
              <v-col>
                <v-card width="100%" color="transparent" class="pa-2" elevation="0">
                  <v-row class="pb-2">
                    <v-col>

                      <!-- Checkboxes -->
                      <v-card color="secondary">
                        <v-row no-gutters align="center" justify="center" class="pa-1"> {{ $t('general') }}
                        </v-row>

                        <v-card color="opp_background" class="pa-2">
                          <v-row no-gutters>
                            <!-- Attach position-->
                            <v-col cols="2" class="px-3 pt-5">
                              <v-checkbox :v-model="positionMods.attachTransformControls"
                                :disabled="positionMods.disabled" :true-value="positionMods.attachTransformControls"
                                :false-value="!positionMods.attachTransformControls" color="primary" @Click="controlSettings.attachTransformControls(
                                  positionMods, positionObject, exParams.main )">
                              </v-checkbox>
                            </v-col>

                            <v-divider vertical></v-divider>

                            <!-- Checkbox description-->
                            <v-col cols="10" class="px-4 py-9">
                              {{ $t('moveObj', {obj: $t('model')})}}
                            </v-col>

                          </v-row>

                          <v-divider></v-divider>

                          <v-row no-gutters>
                            <!-- Opacity-->
                            <v-col cols="2" class="px-2 pt-4">
                              <v-slider :disabled="positionMods.disabled" v-model="positionMods.opacitySliderValue"
                                :max="1" track-color="primary" thumb-color="secondary" color="warning">
                              </v-slider>
                            </v-col>

                            <v-divider vertical></v-divider>

                            <!-- Checkbox description-->
                            <v-col cols="10" class="py-5 px-4">
                              {{ $t('opacity')}}
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
                        <v-row no-gutters align="center" justify="center" class="pa-1"> {{ $t('colorPicker') }}
                        </v-row>

                        <v-card id="cpPosition" color="opp_background" class="pa-2">
                          <v-color-picker v-model="positionMods.colorPicker.color" hide-canvas hide-sliders hide-inputs
                            show-swatches swatches-max-height="235px" width="100%" :disabled="positionMods.disabled"
                            :v-on:update="modelInteraktion.changeColor(
                              positionMods.colorPicker.color, 
                              positionMods.colorPicker.object)"></v-color-picker>
                        </v-card>
                      </v-card>

                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

          </v-form>
        </v-navigation-drawer>
        
        <!-- Legend -->
        <v-navigation-drawer v-model="leftDrawer.showDrawers[3]" color="background"
          style="left: 50px; top:64px; width: 470px;" temporary>
          <v-list-item height="50" prepend-icon="mdi-information" title=Legende></v-list-item>

          <v-divider></v-divider>

          <v-form>
            <!-- General control -->
            <v-row>
              <v-col>
                <v-card color="transparent" elevation="0" width="100%" class="pa-2">
                  
                  <v-row no-gutters class="pt-4 px-4">
                    ALT + Linksklick = Objektauswahl
                  </v-row>
                  <v-row no-gutters class="pt-0 px-4">
                    STRG + Linksklick = 3D-Modell bewegen
                  </v-row>
                  
                </v-card>
              </v-col>
            </v-row>
          </v-form>
        </v-navigation-drawer>

      </v-card>

      <!-- Navigation buttons -->
      <v-card width="100%" height="100vh" max-height="100%">

        <!-- Controls -->
        <v-btn v-model="leftDrawer.btnNames[0]" rounded="0" icon="mdi-camera-control" width="100%" height="50"
          :color="leftDrawer.btnColors[0]" @click.stop="leftDrawer.showDrawers[0] = !leftDrawer.showDrawers[0]; 
                            leftDrawer.showDrawers[1] = false;
                            leftDrawer.showDrawers[2] = false;
                            leftDrawer.showDrawers[3] = false;
                            utilities.updateBtnColor(
                              leftDrawer.btnNames[0], leftDrawer);"></v-btn>
        <!-- Place -->
        <v-btn v-model="leftDrawer.btnNames[1]" rounded="0" icon="mdi-radar" width="100%" height="50"
          :color="leftDrawer.btnColors[1]" @click.stop="leftDrawer.showDrawers[0] = false;
                            leftDrawer.showDrawers[1] = !leftDrawer.showDrawers[1];
                            leftDrawer.showDrawers[2] = false;
                            leftDrawer.showDrawers[3] = false;
                            utilities.updateBtnColor(
                              leftDrawer.btnNames[1], leftDrawer);"></v-btn>
        <!-- Positions -->
        <v-btn v-model="leftDrawer.btnNames[2]" rounded="0" width="100%" height="50" icon="mdi-map-marker-radius-outline"
          :color="leftDrawer.btnColors[2]" @click.stop="leftDrawer.showDrawers[0] = false;
                            leftDrawer.showDrawers[1] = false;
                            leftDrawer.showDrawers[2] = !leftDrawer.showDrawers[2]; 
                            leftDrawer.showDrawers[3] = false;
                            utilities.updateBtnColor(
                              leftDrawer.btnNames[2], leftDrawer);"></v-btn>
        <!-- Legende -->
        <v-btn v-model="leftDrawer.btnNames[3]" rounded="0" width="100%" height="50" icon="mdi-information"
          :color="leftDrawer.btnColors[3]" @click.stop="leftDrawer.showDrawers[0] = false;
                            leftDrawer.showDrawers[1] = false;
                            leftDrawer.showDrawers[2] = false;
                            leftDrawer.showDrawers[3] = !leftDrawer.showDrawers[3];
                            utilities.updateBtnColor(
                              leftDrawer.btnNames[3], leftDrawer);"></v-btn>
      </v-card>
    </div>

    <!-- Canvas -->
    <canvas id="mainCanvas" style="position:relative; float:left; z-index: 2;"></canvas>

    <!-- Bottom drawer: Position information-->
    <v-navigation-drawer v-model="bottomDrawer.showDrawer" location="bottom" temporary width="300">

    <v-row>
      <v-col>
        <v-row no-gutters>
          <v-col cols="2" class="pa-1 pt-3 pl-8">
            Positionsnummer: {{ posInfo.positionNumber }}
          </v-col>
          <v-col cols="2" class="pa-1 pt-3 pl-8">
            Unternummer: {{ posInfo.subNumber }}
          </v-col>
          <v-col cols="5" class="pa-1 pt-3 pl-8">
            Zuletzt Bearbeitet: {{ posInfo.date }}
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="1" class="pa-1">
            <v-btn v-on:click="utilities.savePosition(
              this.$root, this.$t, this.posInfo)" color="primary">
              Speichern
            </v-btn>
          </v-col>
          <v-divider vertical></v-divider>
          <v-col cols="2" align="center" class="pt-3">
            {{ posInfo.modelName }}
          </v-col>
        </v-row>
        <v-divider></v-divider>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="8">
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field class="pt-4 pl-4" :label="$t('title')" v-model="posInfo.title">

            </v-text-field>
          </v-col>
          <v-col cols="4" align="center">
            <v-text-field class="pt-4 pl-4" :label="$t('date')" v-model="posInfo.dating">
            </v-text-field>
          </v-col>
          <v-col cols="4" align="center">
            <v-text-field class="pt-4 pl-4 pr-4" :label="$t('editor')" v-model="posInfo.editor">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="4">
            <v-text-field class="pt-0 pl-4" :label="$t('count')" v-model="posInfo.count">
            </v-text-field>
          </v-col>
          <v-col cols="4" align="center">
            <v-text-field class="pt-0 pl-4" :label="$t('weight')" v-model="posInfo.weight">
            </v-text-field>
          </v-col>
          <v-col cols="4" align="center">
            <v-text-field class="pt-0 pl-4 pr-4" :label="$t('material')" v-model="posInfo.material">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field class="pt-0 pl-4 pr-4" :label="$t('description')" v-model="posInfo.description">
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="2" align="center">
        <v-row no-gutters>
          <v-col class="pt-4">
            <v-text-field class="pl-4 pr-4" :label="$t('right')" v-model="posInfo.right">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field class="pl-4 pr-4" :label="$t('up')" v-model="posInfo.up">
            </v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field class="pl-4 pr-4" :label="$t('height')" v-model="posInfo.height">
            </v-text-field>
          </v-col>
        </v-row>
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="2" align="center" class="py-6">
        <v-divider vertical></v-divider>
        <canvas v-show="true" id="subCanvas" width="200" height="200" style="display: inline;
                         border: 1px solid rgb(255, 255, 255)">
        </canvas>
      </v-col>
    </v-row>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { Mesh, Vector3, Clock } from 'three';
import { SUBTRACTION } from 'three-bvh-csg';
import Navigation from '../components/Navigation.vue';
import { useWindowSize } from 'vue-window-size';
import { exParams } from '../components/3dFunctions/Parameter.js'
import { ObjectLoaders } from '../components/3dFunctions/ObjectLoaders.js'
import { InterfaceToOfflineDB } from '../components/3dFunctions/InterfaceToOfflineDB.js';
import { MeasurementTool, ModelInteraktion, SegmentationTool, AnnotationTool } from '../components/3dFunctions/Tools.js'
import { ControlSettings } from '../components/3dFunctions/ControlSettings.js'
import { CameraSettings } from '../components/3dFunctions/CameraSettings.js'
import { Utilities } from '../components/3dFunctions/Utilities.js'
import { ObjectFilter } from '../components/3dFunctions/ObjectFilter.js'
import { GarbageCollection } from '../components/3dFunctions/GarbageCollection.js'
import { Initialisations } from '../components/3dFunctions/Initialisations.js'
import * as TWEEN from '@tweenjs/tween.js'


export default {
  name: 'ModelViewer',
  components: {
    Navigation
  },

  data() {
    return {
      exParams: exParams,
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
        editor: null,
        modelName: null,
      },

      /**
       * Left drawer: Model Interaktion
       */
      leftDrawer: {
        showDrawers: [ false, false, false, false, false ],
        btnColors: ["transparent", "transparent", "transparent", "transparent", "transparent"],
        btnNames: ["btn1", "btn2", "btn3", "btn4", "btn5"],
      },
      
      /**
       * Place filter and modifiaktion options
       */
      placeObject: {
        number: null,
        title: null,
        allNumbers: [],
        allTitles: [],
        chosenfinalModel: [],
        chosenfinalModelGroup: null,
        infoBlock: []
      },
      placeMods: {
        disabled: false,
        opacitySliderValue: 0,
        colorPicker: {
          color: null,
          object: null,
        },
        token: false,
      },
  
      /**
       * Positions filter and modifiaktion options
       */
      positionData: { // position data
        number: null,
        subNumber: null,
        title: null,
        allNumbers: [],
        allSubNumbers: [],
        allTitles: [],
        chosenPositionModels: [],
        infoBlock: []
      },
      positionObject: { // postion model
        number: null,
        title: null,
        allNumbers: [],
        allTitles: [],
        chosenfinalModel: [],
        chosenfinalModelGroup: null,
        infoBlock: [],
        disableInput: null,
      },
      positionMods: { // position modifikations
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
        modus: false,
      },
      
      annotatTool: {
        title: null,
        allTitles: [],
        infoBlock: [], // { lineName, lableName, [ firstBallName, secondBallName ] }
        textField: null,
        texttoken: false,
        modus: false
      },

      cuttingTool: {
        displayContorls: false,
      },
  
      /**
       * Camera and Controls
       */
      arcballAnchor: [],
      cameraData: {
        position: null,
        rotation: null
      },
    }
  },

  watch: {

    'positionData.number': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.positionMods.token ) {
          this.objectFilter.resetPositionMods( this.positionObject, 
            this.positionMods, exParams.main );
        }

        /* Reset positionData & positionObject menus content 
         *       and positionObject input */
        this.objectFilter.resetPositionInfo( this.positionData );
        this.objectFilter.resetObjectInfoInput( this.positionObject );
        this.objectFilter.resetObjectInfo( this.positionObject );

        /* Update positionData menus */
        this.objectFilter.fieldSearch( 3, this.positionData.chosenPositionModels,
                          [ value, 
                            this.positionData.subNumber, 
                            this.positionData.title ],
                          [ this.positionData.allNumbers, 
                            this.positionData.allSubNumbers, 
                            this.positionData.allTitles ],
                          this.positionData.infoBlock );

        /* Update positionObject menus and dataBlock  */
        this.objectFilter.getPositionObjectInfo( this.positionData,
          this.positionObject );
      }
    },

    'positionData.subNumber': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.positionMods.token ) {
          this.objectFilter.resetPositionMods( this.positionObject, 
            this.positionMods, exParams.main );
        }

        /* Reset positionData & positionObject menus content
         *       and positionObject input */
         this.objectFilter.resetPositionInfo( this.positionData );
         this.objectFilter.resetObjectInfoInput( this.positionObject );
        this.objectFilter.resetObjectInfo( this.positionObject );

        /* Update positionData menus */
        this.objectFilter.fieldSearch( 3, this.positionData.chosenPositionModels,
                          [ this.positionData.number, 
                            value, 
                            this.positionData.title ],
                          [ this.positionData.allNumbers, 
                            this.positionData.allSubNumbers, 
                            this.positionData.allTitles ],
                          this.positionData.infoBlock );

        /* Update positionObject menus and dataBlock  */
        this.objectFilter.getPositionObjectInfo( this.positionData,
          this.positionObject );
      }
    },

    'positionData.title': {
      handler: function( value ) {

        /* Reset modifikations and save changes */
        if ( this.positionMods.token ) {
          this.objectFilter.resetPositionMods( this.positionObject, 
            this.positionMods, exParams.main );
        }

        /* Reset positionData & positionObject menus content
         *       and positionObject input */
        this.objectFilter.resetPositionInfo( this.positionData );
        this.objectFilter.resetObjectInfoInput( this.positionObject );
        this.objectFilter.resetObjectInfo( this.positionObject );

        /* Update positionData menus */
        this.objectFilter.fieldSearch( 3, this.positionData.chosenPositionModels,
                          [ this.positionData.number,
                            this.positionData.subNumber,
                            value ],
                          [ this.positionData.allNumbers,
                            this.positionData.allSubNumbers,
                            this.positionData.allTitles ],
                          this.positionData.infoBlock);

        /* Update positionObject menus and dataBlock  */
        this.objectFilter.getPositionObjectInfo( this.positionData,
          this.positionObject );

      }
    },

    'positionData.chosenPositionModels': {
      handler: function(value) {
        if ( value.length > 0 ) {
          this.positionObject.disableInput = true;
        } else {
          this.positionObject.disableInput = false;
        }
      }
    },

    'positionObject.number': {
      handler: function( value ) {

        /* Reset modifikations and save changes to model */
        if ( this.positionMods.token ) {
          this.objectFilter.resetPositionMods( this.positionObject, 
            this.positionMods, exParams.main );
        }

        /* Reset positionObject menus content */
        this.objectFilter.resetObjectInfo( this.positionObject );

        /* Update positionObject menus */
        this.objectFilter.fieldSearch( 2, this.positionObject.chosenfinalModel,
                          [ value, 
                            this.positionObject.title ],
                          [ this.positionObject.allNumbers, 
                            this.positionObject.allTitles ],
                          this.positionObject.infoBlock );
      }
    },

    'positionObject.title': {
      handler: function( value ) {

        /* Reset modifikations and save changes to model */
        if ( this.positionMods.token ) {
          this.objectFilter.resetPositionMods( this.positionObject, 
            this.positionMods, exParams.main );
        }

        /* Reset positionObject menus content */
        this.objectFilter.resetObjectInfo( this.positionObject );

        /* Update positionObject menus */
        this.objectFilter.fieldSearch( 2, this.positionObject.chosenfinalModel,
                          [ this.positionObject.number,
                            value],
                          [ this.positionObject.allNumbers,
                            this.positionObject.allTitles],
                          this.positionObject.infoBlock );

      }
    },

    'positionObject.chosenfinalModel': {
      handler: async function(value) {
        if ( value.length > 0 ) {
          this.positionMods.token = true;
          this.positionMods.disabled = false;

          /* Update color picker and opacity slider if no model has been 
             modified yet */
          if (this.positionMods.colorPicker == null || 
              this.positionMods.colorPicker.object == null ) {

            const result = this.positionObject.infoBlock.find( arr => 
              value );
            const modelInScene = exParams.main.scene.getObjectByName( 
              value[0] );
            this.positionObject.chosenfinalModelGroup = this.utilities.getGroup(
              modelInScene );
            
            /* color picker */
            this.positionMods.colorPicker.color = result[3];
            this.positionMods.colorPicker.object = 
              this.positionObject.chosenfinalModelGroup;
            
            /* opacity slider */
            this.positionMods.opacitySliderValue = result[4];
          }

          /* Update color picker and opacity slider if a model has been 
             modified */
          else {
            const modelInScene = exParams.main.scene.getObjectByName( 
              value[0] );
            this.positionObject.chosenfinalModelGroup = this.utilities.getGroup( 
              modelInScene );
            
            /* color picker */
            this.positionMods.colorPicker.color = "#" + 
            modelInScene.material.color.getHexString();
            this.positionMods.colorPicker.object = this.positionObject.chosenfinalModelGroup;
            
            /* opacity slider */
            this.positionMods.opacitySliderValue = modelInScene.material.opacity;
          }

        } else {
          this.positionMods.attachTransformControls = false;
          exParams.main.transformControls.detach();
        }
      }
    },

    'placeObject.number': {
      handler: function(value) {

        /* Reset modifikations and save changes to model */
        if (this.placeMods.token) {
          this.objectFilter.resetPlaceMods( this.placeObject, this.placeMods, 
          exParams.main );
        }

        this.objectFilter.resetPlaceObjectInfo( this.placeObject );

        this.objectFilter.fieldSearch( 2, this.placeObject.chosenfinalModel,
                            [ value, 
                              this.placeObject.title ],
                            [ this.placeObject.allNumbers, 
                              this.placeObject.allTitles ],
                            this.placeObject.infoBlock );
      }
    },

    'placeObject.title': {
      handler: function(value) {

        /* Reset modifikations and save changes to model */
        if (this.placeMods.token) {
          this.objectFilter.resetPlaceMods(this.placeObject, this.placeMods, 
          exParams.main );
        }

        this.objectFilter.resetPlaceObjectInfo( this.placeObject );
  
        this.objectFilter.fieldSearch( 2, this.placeObject.chosenfinalModel,
                            [ this.placeObject.number, 
                              value ],
                            [ this.placeObject.allNumbers, 
                              this.placeObject.allTitles ],
                            this.placeObject.infoBlock );
      }
    },

    'placeObject.chosenfinalModel': {
      handler: function(value) {
        if ( value.length > 0 ) {
          this.placeMods.token = true;
          this.placeMods.disabled = false;

          /* Update color picker and opacity slider if no model has been 
             modified yet */
          if (this.placeMods.colorPicker == null || 
              this.placeMods.colorPicker.object == null ) {

            const result = this.placeObject.infoBlock.find( arr => value );
            const modelInScene = exParams.main.scene.getObjectByName( value[0] );
            this.placeObject.chosenfinalModelGroup = this.utilities.getGroup( 
              modelInScene );
            
            /* color picker */
            this.placeMods.colorPicker.color = result[3];
            this.placeMods.colorPicker.object = 
              this.placeObject.chosenfinalModelGroup;
            
            /* opacity slider */
            this.placeMods.opacitySliderValue = result[4];
          }

          /* Update color picker and opacity slider if a model has been 
             modified */
          else {
            const modelInScene = exParams.main.scene.getObjectByName( value[0] );
            this.placeObject.chosenfinalModelGroup = this.utilities.getGroup( 
              modelInScene );
            
            /* color picker */
            this.placeMods.colorPicker.color = "#" + 
            modelInScene.material.color.getHexString();
            this.placeMods.colorPicker.object = this.placeObject.chosenfinalModelGroup;
            
            /* opacity slider */
            this.placeMods.opacitySliderValue = modelInScene.material.opacity;
          }

        }
      }
    },

    'positionMods.opacitySliderValue': {
      handler: function(value) {
        if( this.positionObject.chosenfinalModelGroup != null ) {
          this.positionObject.chosenfinalModelGroup.traverse( ( child ) => {
            if ( child instanceof Mesh ) {
              child.material.opacity = value;
            }
          })
        }
      }
    },

    'placeMods.opacitySliderValue': {
      handler: function(value) {
        if( this.placeObject.chosenfinalModelGroup != null ) {
          this.placeObject.chosenfinalModelGroup.traverse( ( child ) => {
            if ( child instanceof Mesh ) {
              child.material.opacity = value;
            }
          })
        }
      }
    },

    'positionMods.disabled': {
      handler: function(value) {
        if ( value ) {
          document.getElementById("cpPosition").style.pointerEvents = 'none';
        } else {
          document.getElementById("cpPosition").style.pointerEvents = 'auto';
        }
      }
    },

    'placeMods.disabled': {
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

  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },

  created() {
    this.initExternalImports();
  },

  async mounted() {
    /***************************************************************************
     *  ++++ Synchronise with IndexedDB ++++
     */
    await this.indexedDB.synchronise( 'localDBs' );

    
    
    /***************************************************************************
     *  ++++ Load specific data from IndexedDB ++++
     */
    await this.loadDataFromIndexedDB();
    
    
    
    /***************************************************************************
     *  ++++ Link canvases to exParams and specify window width and height. ++++
     */
    this.setupCanvases();
    

    
    /***************************************************************************
     *  ++++ Disable Modifikation Options for places and position. ++++
     * (Needs to be done manualy, becaus of an internal vuetify bug)
     */
    this.positionMods.disabled = true;
    this.placeMods.disabled = true;
    
    
    
    /***************************************************************************
     *  ++++ Initialize the Measurement Tool ++++
     */
    this.initialisations.initMeasurementTool( exParams.main, exParams.mmTool, 
      document );

    if( this.placeID == null || this.placeObjects.length == 0 ){

      this.initialisations.mainInitNoObjects2( exParams.main );
      this.leftSidebar.style.visibility = "hidden";
      this.leftSidebar.style.width = "0px";
      
      this.animation();
      
    } else {
      /***************************************************************************
       *  ++++ Initialize Main- and Sub-Scene ++++
       * 
       * Checks initTokens form exparams => 
       *  false == Scene not initialized yet 
       *  true == Scene already initialized
       */
      for ( const [ sceneName, tokenValue ] of 
        Object.entries( exParams.initTokens ) ) {
        if ( !tokenValue ) {
          switch ( sceneName ) {
            case "main":
              /* Initialize main scene */
              this.initialisations.mainInit( exParams.main );
              /* Initialize main eventlistener */
              this.initMainEventlisteners( window, exParams.main );
              /* Set token to true */
              this.tokenValue = true;
              break;
            case "sub":
              /* Initialize sub scene */
              this.initialisations.subInit( exParams.sub );
              /* Initialize sub eventlistener */
              this.initSubEventlisteners( exParams.sub );
              /* Set token to true */
              this.tokenValue = true;
              break;
          }
        }
      }
  
  
      
      /***************************************************************************
       *  ++++ Load place and position objects into scene. ++++
       * 
       * Determines if:
       *    1. No objects are present in IndexedDb
       * or   
       *    2. Only place objects are present in IndexedDB
       * or
       *    3. Only position objects are present in IndexedDB
       * or
       *    3. Place and position objects are present in IndexedDB
       * 
       * Based on these different cases the camera will be placed accordingly to
       * the amount and size of the objects, present in the scene
       */
      /* 1. No Models found */
      if ( this.placeObjects.length == 0 && this.positionObjects == 0 ) {
        
        console.log( "No Models found" )
      
      /* 2. Only place objects */
      } else if ( this.placeObjects.length != 0 && this.positionObjects == 0 ) {
        
        /* Load objects in scene */
        await this.objectLoaders.loadObjectsInScene( exParams.main, 'places', 
          this.placeID );
        /* Fill object Filter menue options with data based on currently loaded
         * objects. */
        this.objectFilter.getPlaceObjectInfo( this.placeObject, exParams.main );
  
        /* Get object center for camera and control alignment if ... */
        /* ... there is only one objects present or ... */
        if ( exParams.main.objects.allObjects.length < 2 ) {
          this.centerOfObjects = this.utilities.getModelCenter( 
            exParams.main.objects.place.groups[ 0 ] )
        /* ... there are multiple objects present. */
        } else {
          this.centerOfObjects = this.utilities.getBarycenter( 
            exParams.main.objects.place.groups );
        }
  
        console.log("Only place objects")
      
      /* 3. Only position objects */
      } else if ( this.placeObjects.length == 0 && this.positionObjects != 0 ) {
        
        /* Load objects in scene */
        await this.objectLoaders.loadObjectsInScene( exParams.main, 'positions', 
          this.placeID );
        /* Fill object Filter menue options with data based on currently loaded
         * objects. */
        this.objectFilter.getPositionDataInfo( this.positionData, 
          exParams.main );
  
        /* Get object center for camera and control alignment if ... */
        /* ... there is only one objects present or ... */
        if ( exParams.main.objects.allObjects.length < 2 ) {
          this.centerOfObjects = this.utilities.getModelCenter( 
            exParams.main.objects.position.groups[ 0 ] )
        /* ... there are multiple objects present. */
        } else {
          this.centerOfObjects = this.utilities.getBarycenter( 
            exParams.main.objects.position.groups );
        }
  
        console.log("Only position objects")
      
      /* 4. Place and position objects */
      } else if ( this.placeObjects.length != 0 && this.positionObjects != 0 ) {
        /* Load objects in scene */
        await this.objectLoaders.loadObjectsInScene( exParams.main, 'places', 
        this.placeID );
        await this.objectLoaders.loadObjectsInScene( exParams.main, 'positions', 
        this.placeID );
        /* Fill object Filter menue options with data based on currently loaded
        * objects. */
        this.objectFilter.getPlaceObjectInfo( this.placeObject, 
        exParams.main );
        this.objectFilter.getPositionDataInfo( this.positionData, 
        exParams.main );
       
        /* Get object center for camera and control alignment if ... */
        /* ... there is only one objects present or ... */
        if ( exParams.main.objects.allObjects.length < 2 ) {
          this.centerOfObjects = this.utilities.getModelCenter( 
            exParams.main.objects.place.groups[ 0 ] );
        /* ... there are multiple objects present. */
        } else {
          this.centerOfObjects = this.utilities.getBarycenter( 
            exParams.main.objects.place.groups );
        }
        
        console.log("Place and position objects")
      }
  
  
      
      /***************************************************************************
       *  ++++ Initialize the Segmentation Tool ++++
       */
      this.initialisations.initSegmentationTool( exParams.main, exParams.stTool, 
        this.centerOfObjects );
  
  
  
      /***************************************************************************
       *  ++++ Re-center Camera based on predetermine factors ++++
       */
      await this.cameraSettings.updateCamera ( 
        this.centerOfObjects, this.placeID, exParams.main, this.cameraIDsInDB, 
        this.cameraInDB, this.cameraData, this.arcballAnchor
      )
  
  
      
      /***************************************************************************
       *  ++++ Load already drawn lines ++++
       */
      await this.loadLines();
  
  
      
      /***************************************************************************
       *  ++++ Load already created annotations ++++
       */
      await this.loadAnnotations();
  
  
      
      /***************************************************************************
       * ++++ Animate the scene ++++
       */
      this.animate();
    }
  },

  async unmounted() {
    if( this.placeID == null || this.placeObjects == null ) {
      this.garbageCollection.disposeOfObjects(exParams.main)
      
    } else {
      if ( exParams.main.objects.allObjects.length > 0 ) {
        this.indexedDB.updateCamera( this.placeID, this.cameraIDsInDB,
          this.cameraInDB, this.arcballAnchor, exParams.main )
  
        this.indexedDB.updateObjects( exParams.main )
      }
  
      exParams.main.canvas.removeEventListener( 'click', this.updateArcball );
      exParams.main.canvas.removeEventListener( 'click', this.onMouseDown );
      exParams.main.canvas.removeEventListener( 'keydown', this.keyDown );
      exParams.main.canvas.removeEventListener( 'keyup', this.keyUp );
  
      exParams.main.canvas.removeEventListener( 'keydown', this.keyDownAnnotation );
      exParams.main.canvas.removeEventListener( 'keyup', this.keyUpAnnotation );
  
      exParams.main.renderer.domElement.removeEventListener( 'pointerdown', 
        this.onClick, false );
      exParams.main.renderer.domElement.removeEventListener( 'pointerdown', 
        this.onClickAnnotation, false );
      exParams.main.canvas.removeEventListener( 'mousemove', 
        this.onDocumentMouseMove, false);
  
      /* Dispose geometries and materials in scene */
      this.garbageCollection.clearCanvases( exParams.main, exParams.sub );
    }
  },

  methods: {

    detachForFoto() {
      exParams.main.transformControls.detach()
    },

    /**
     * -------------------------------------------------------------------------
     * # Init parameters
     * -------------------------------------------------------------------------
     */
    async initExternalImports() {
      this.indexedDB = new InterfaceToOfflineDB();
      this.controlSettings = new ControlSettings();
      this.garbageCollection = new GarbageCollection();
      this.utilities = new Utilities( this.indexedDB );
      this.objectLoaders = new ObjectLoaders( this.indexedDB );
      this.cameraSettings = new CameraSettings( this.utilities, this.controlSettings );
      this.modelInteraktion = new ModelInteraktion();
      this.segmentationTool = new SegmentationTool();
      this.measurementTool = new MeasurementTool( this.indexedDB );
      this.annotationTool = new AnnotationTool( this.indexedDB );
      this.objectFilter = new ObjectFilter( this.indexedDB );
      this.initialisations = new Initialisations( this.segmentationTool );
    },

    async loadDataFromIndexedDB() {
      this.placeID = this.$generalStore.getCurrentObject( 'place' );
      if( this.placeID != null ) {
        this.placeObjects = await this.indexedDB.get( 'allObjectsWithID', this.placeID, 'Models', 'places', 'Place' );
        if(this.placeObjects.length > 0 ) {
          this.cameraIDsInDB = await this.indexedDB.get( 'properties', '_id', 'Cameras', 'cameras' );
          this.cameraInDB = await this.indexedDB.get( 'object', this.placeID, 'Cameras', 'cameras' );
          this.placeInDB = await this.indexedDB.get( 'object', this.placeID, 'Places', 'places' );
          this.positionObjects = await this.indexedDB.get( 'allObjectsWithID', this.placeID, 'Models', 'positions', 'Place' );
        } 
      }
    }, 

    /**
     * -------------------------------------------------------------------------
     * # Setup vuetify/html components
     * -------------------------------------------------------------------------
     */

    setupCanvases: function() {
      this.mainCanvas = document.getElementById("mainCanvas");
      this.subCanvas = document.getElementById("subCanvas");
      this.leftSidebar = document.getElementById("leftSidebar");
      this.clock = new Clock()
      exParams.main.canvas = this.mainCanvas;
      exParams.sub.canvas = this.subCanvas;
    },
    
    /**
     * -------------------------------------------------------------------------
     * # Loaders
     * -------------------------------------------------------------------------
     */

    loadObjectInSub: async function( objectID ) {
      const object = await this.indexedDB.get( 'object', objectID, 'Models', 'positions' );

      const loader = new ObjectLoaders()
      const loadedObject = await loader.load( object )

      for ( var i in exParams.main.objects.position.groups ) {
        if ( exParams.main.objects.position.entry[ i ]._id == objectID ) {
          this.posInfo.modelName = "Model name: " + 
          exParams.main.objects.position.entry[ i ].modelTitle;
          
          loadedObject.position.set( 
            -exParams.main.objects.position.entry[ i ].position.x, 
            -exParams.main.objects.position.entry[ i ].position.y,
            -exParams.main.objects.position.entry[ i ].position.z )
            
          const height = exParams.main.objects.position.entry[ i ].bbox.max.y - 
            exParams.main.objects.position.entry[ i ].bbox.min.y;
          const width = exParams.main.objects.position.entry[ i ].bbox.max.x - 
            exParams.main.objects.position.entry[ i ].bbox.min.x;
          const length = exParams.main.objects.position.entry[ i ].bbox.max.z - 
            exParams.main.objects.position.entry[ i ].bbox.max.z;
          const largest = Math.max(height, width, length)
          exParams.sub.camera.position.z = largest * 2;

        }
      }

      /* Add model to sub scene */
      exParams.sub.scene.add( loadedObject );
      exParams.sub.object.push( loadedObject );
      
    },

    loadLines: async function() {
      this.linesInDB = await this.indexedDB.get( 'allObjects', undefined, 'Lines', 'lines' );

      if ( this.linesInDB.length > 0 ) {
        this.linesInDB.forEach( elem => {
          exParams.mmTool.line = this.measurementTool.createLine( 
            elem.line.name, elem.line.geoPosition, exParams.mmTool );
          const balls = this.measurementTool.createBalls( 
            elem.balls, elem.line.geoPosition, exParams.mmTool )

          const lineCenter = this.measurementTool.findLineCenter( 
            balls[ 0 ].position,
            balls[ 1 ].position )

          exParams.mmTool.measurementLable = this.measurementTool.createLable( 
            elem.lable.name, elem.lable.distance, lineCenter, exParams.mmTool );

          balls.forEach( ball => {
            exParams.main.scene.add( ball.sphere )
            ball.sphere.position.set( ball.position.x, ball.position.y, 
              ball.position.z )
          })

          /* Add lable to line */
          exParams.mmTool.line.add( exParams.mmTool.measurementLable );
          /* Add line to scene */
          exParams.main.scene.add( exParams.mmTool.line );

          const newLine = {
              _id: elem._id,
              name: elem.name,
              line: exParams.mmTool.line.name,
              lable: exParams.mmTool.measurementLable.name,
              balls: elem.balls,
          }
          this.measureTool.infoBlock.push( newLine );
          
          this.measureTool.allTitles.push( elem.name );
          exParams.mmTool.lineID++;
          exParams.mmTool.line = null;
          exParams.mmTool.measurementLable = null;

        } )
      }
    },

    loadAnnotations: async function() {
      this.annotationsInDB = await this.indexedDB.get( 'allObjects', undefined, 'Annotations', 'annotations' );

      if ( this.annotationsInDB.length > 0 ) {
        this.annotationsInDB.forEach( annotation => {

          /* Create Lable */
          const annotationLable = this.annotationTool.createLable(
            annotation._id, annotation.lableName, 
            annotation.position, exParams.anTool )
          
          /* Create Box */
          const annotationBox = this.annotationTool.createBox(
            annotation.boxName, exParams.anTool )

          /* Add lable to box */
          annotationBox.add(annotationLable)

          /* Add lable and box combo variable Storage for UI purposes */
          const newAnnotationEntry = {
            _id: String( annotation._id ),
            lableName: annotation.lableName,
            boxName: annotation.boxName,
            position: annotation.position,
          }
          exParams.anTool.annotations.push( newAnnotationEntry );
          this.annotatTool.infoBlock.push( newAnnotationEntry );
          this.annotatTool.allTitles.push( annotation.lableName );
          
          /* Add lable and box combo to scene */
          exParams.main.scene.add( annotationBox )
          annotationBox.position.set( annotation.position.x, 
            annotation.position.y, annotation.position.z )

        } )
      }
      
    },

    /**
     * -------------------------------------------------------------------------
     * # Eventlistener functions
     * -------------------------------------------------------------------------
     */

    initMainEventlisteners( window, main ) {
      // Eventlistener
      document.addEventListener( 'click', this.func, false );
      main.canvas.addEventListener( 'click', this.updateArcball );
      main.canvas.addEventListener( 'click', this.onMouseDown );
      window.addEventListener( 'keydown', e => {
        switch ( e.code ) {
          case 'KeyW':
            main.transformControls.mode = 'translate';
            break;
          case 'KeyE':
            main.transformControls.mode = 'rotate';
            break;
          case 'KeyR':
            main.transformControls.mode = 'scale';
            break;
        }
      });

      main.canvas.addEventListener( 'keydown', this.keyDown );
      main.canvas.addEventListener( 'keyup', this.keyUp );
      
      main.canvas.addEventListener( 'keydown', this.keyDownAnnotation )
      main.canvas.addEventListener( 'keyup', this.keyUpAnnotation )


      main.renderer.domElement.addEventListener( 'pointerdown', this.onClick, 
        false );
      main.renderer.domElement.addEventListener( 'pointerdown', 
        this.onClickAnnotation, false );
        main.canvas.addEventListener( 'mousemove', this.onDocumentMouseMove, 
        false);
    },

    initSubEventlisteners( sub ) {
    },

    updateArcball: async function( event ) {
      if ( event.ctrlKey ) {
        
        this.cameraData = this.utilities.getCameraData( exParams.main.camera )

        if ( this.cameraIDsInDB.includes( this.placeID ) ) {
          const newCamera = await this.indexedDB.get( 'object', this.placeID, 'Cameras', 'cameras' );
            
          this.controlSettings.updateWithNewCamera( exParams.main.arcBallControls,
            newCamera );
        } else {
          this.controlSettings.updateWithOldCamera( exParams.main.arcBallControls,
            this.arcballAnchor )
        }

        this.utilities.setCamera( exParams.main.camera, this.cameraData );
      }
    },

    keyDown: function( event ) {
      if (event.key === 'x') {
          exParams.main.ctrlDown = true;
          exParams.main.arcBallControls.enabled = false
          document.body.style.cursor = 'crosshair';
      }
    },

    keyUp: function( event ) {
      if (event.key === 'x') {
        exParams.main.ctrlDown = false;
        exParams.main.arcBallControls.enabled = true
        document.body.style.cursor = 'pointer'
        if ( this.drawingLine ) {
          exParams.mmTool.line.remove(this.measurementLable)
          exParams.main.scene.remove( this.line );
          exParams.mmTool.drawingLine = false;
        }
      }
    },

    switchToMeasureModus: function( buttonPressed ) {
      if( !buttonPressed ) {
        this.measureTool.modus = true;
        exParams.main.arcBallControls.enabled = false;
        document.body.style.cursor = 'crosshair';
      } else {
        this.measureTool.modus = false;
        exParams.main.arcBallControls.enabled = true
        document.body.style.cursor = 'pointer';
        if ( this.drawingLine ) {
          exParams.mmTool.line.remove(this.measurementLable)
          exParams.main.scene.remove( this.line );
          exParams.mmTool.drawingLine = false;
        }
      }
    },

    onMouseDown: async function( event ) {
      event.preventDefault();

      const rect = exParams.main.renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      exParams.main.pointer.x = ( x / exParams.main.canvas.clientWidth ) * 2 - 1;
      exParams.main.pointer.y = ( y / exParams.main.canvas.clientHeight ) * - 2 + 1;

      exParams.main.raycaster.setFromCamera( exParams.main.pointer, exParams.main.camera );
      const intersects = exParams.main.raycaster.intersectObjects( 
        exParams.main.objects.position.groups,
        true );

      if ( intersects.length > 0 && event.altKey ) {
        const objectName = intersects[ 0 ].object.name;

        for ( let i = 0; i < exParams.main.objects.position.entry.length; i++ ) {
          if (exParams.main.objects.position.entry[ i ]._id === objectName ) {
            /* Trigger vuetify components */
            this.bottomDrawer.showDrawer = true;
            this.loadObjectInSub( intersects[ 0 ].object.name );

            /* Draw outline */
            const objectID = exParams.main.objects.position.entry[ i ]._id;
            const objectFromScene = exParams.main.scene.getObjectByName( objectName );

            if ( objectFromScene.parent != exParams.main.scene ) {
              const groupObject = this.utilities.getGroup( objectFromScene );
              const selectedObject = groupObject;
              this.selectedObjects = []
              this.selectedObjects.push( selectedObject )
              // this.addSelectedObject( selectedObject );
              exParams.main.outlinePass.selectedObjects = this.selectedObjects;
            } else {
              const selectedObject = objectFromScene;
              exParams.main.outlinePass.selectedObjects = this.selectedObjects;
            }

            /* Fill drawer with position info */
            const positionID = exParams.main.objects.position.entry[ i ].positionID;
            const positionInDB = await this.indexedDB.get( 'object', positionID, 'Positions', 'positions' );
            this.posInfo = positionInDB;
          }
        }
      }
    },

    onDocumentMouseMove: function ( event ) {
      event.preventDefault();

      const rect = exParams.main.renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      exParams.mmTool.pointer.x = ( x / exParams.main.canvas.clientWidth ) * 2 - 1;
      exParams.mmTool.pointer.y = ( y / exParams.main.canvas.clientHeight ) * - 2 + 1;

      if ( exParams.mmTool.drawingLine ) {
        exParams.mmTool.raycaster.setFromCamera( exParams.mmTool.pointer, exParams.main.camera );
        const intersects = exParams.mmTool.raycaster.intersectObjects( 
          exParams.main.objects.allObjects,
          true );

        if ( intersects.length > 0 ) {
          const positions = exParams.mmTool.line.geometry.attributes.position;

          const v0 = new Vector3(
            positions.array[0],
            positions.array[1],
            positions.array[2]
          )
          const v1 = new Vector3(
            intersects[0].point.x,
            intersects[0].point.y,
            intersects[0].point.z
          )
          exParams.mmTool.line.geometry.attributes.position.needsUpdate = true
          const distance = v0.distanceTo(v1)

          v1.x += 0.0
          v1.y -= 0.3

          exParams.mmTool.measurementLable.element.innerText = "New line \n" + distance.toFixed(2) + 'm'
          exParams.mmTool.measurementLable.position.lerpVectors(v0, v1, 0.5)
        }
      }
    },

    onClick: async function() {
      if ( exParams.main.ctrlDown ) {
        exParams.mmTool.raycaster.setFromCamera( exParams.mmTool.pointer, exParams.main.camera );
        const intersects = exParams.mmTool.raycaster.intersectObjects( 
          exParams.main.objects.allObjects,
          true );
        if ( intersects.length > 0 ) {
          const nameLine = "Line - " + exParams.mmTool.lineID;
          const nameLable = "Lable - " + exParams.mmTool.lineID;
          if ( !exParams.mmTool.drawingLine ) {
            const position = [
              intersects[ 0 ].point.x,
              intersects[ 0 ].point.y,
              intersects[ 0 ].point.z,
              intersects[ 0 ].point.clone.x,
              intersects[ 0 ].point.clone.y,
              intersects[ 0 ].point.clone.z,
            ]
            /* Create Line */
            exParams.mmTool.line = this.measurementTool.createLine( 
              nameLine, position, exParams.mmTool )

            const lineCenter = { 
              x: position.slice(0, 3)[0],
              y: position.slice(0, 3)[1],
              z: position.slice(0, 3)[2]
             }

            /* Create lable */
            exParams.mmTool.measurementLable = this.measurementTool.createLable( nameLable,
              "New Line\n0.0m", lineCenter, exParams.mmTool )
            
            /* Add line and lable to Main Scene */
            exParams.mmTool.line.add(exParams.mmTool.measurementLable)
            exParams.main.scene.add(exParams.mmTool.line);

            exParams.mmTool.drawingLine = true;
          } else {
            const placeInDB = await this.indexedDB.get( 'object', this.placeID,
              'Places', 'places' );
              
            /* Generate names for line and balls */
            const nameOfLine = "New Line - " + 
              exParams.mmTool.measurementLable.element.innerText.split('\n')[1];
            const nameOfBalls = [ "firstBall - " + this.lineID, 
                                  "secondBall - " + this.lineID ];
            const positions = exParams.mmTool.line.geometry.attributes.position;
            positions.array[3] = intersects[0].point.x;
            positions.array[4] = intersects[0].point.y;
            positions.array[5] = intersects[0].point.z;
            exParams.mmTool.line.geometry.attributes.position.needsUpdate = true;
            
            const v0 = [positions.array[0], positions.array[1],
            positions.array[2]];

            const v1 = [positions.array[3], positions.array[4],
            positions.array[5]];
            
            /* Create first and second ball and load them in main Scene */
            const balls = {
              firstBall: this.measurementTool.createBall( nameOfBalls[ 0 ], v0,
                exParams.mmTool ),
              secondBall: this.measurementTool.createBall( nameOfBalls[ 1 ], v1,
                exParams.mmTool )
            }
            
            Object.entries( balls ).forEach( ( [ key, value ] ) => {
              exParams.main.scene.add( value.sphere )
              value.sphere.position.set( value.position.x, value.position.y, 
              value.position.z )
            } )

            const newLine = {
              _id: String(exParams.mmTool.lineID),
              name: nameOfLine,
              line: exParams.mmTool.line.name,
              lable: exParams.mmTool.measurementLable.name,
              balls: nameOfBalls,
            }

            const lineAttr = {
              name: exParams.mmTool.line.name,
              geoPosition: [
                exParams.mmTool.line.geometry.attributes.position.array[0],
                exParams.mmTool.line.geometry.attributes.position.array[1],
                exParams.mmTool.line.geometry.attributes.position.array[2],
                exParams.mmTool.line.geometry.attributes.position.array[3],
                exParams.mmTool.line.geometry.attributes.position.array[4],
                exParams.mmTool.line.geometry.attributes.position.array[5] ],
            }

            /* Lable */
            const lableAttr = {
              name: exParams.mmTool.measurementLable.name,
              distance: exParams.mmTool.measurementLable.element.innerText,
              position: { 
                x: exParams.mmTool.measurementLable.position.x,
                y: exParams.mmTool.measurementLable.position.y,
                z: exParams.mmTool.measurementLable.position.z
              },
            }

            /* Create new entry */
            const newLineEntry = {
              _id: String(exParams.mmTool.lineID),
              name: nameOfLine,
              line: lineAttr,
              lable: lableAttr,
              balls: nameOfBalls
            }

            this.measureTool.infoBlock.push( newLine );
            this.measureTool.allTitles.push( nameOfLine );

            await this.indexedDB.add( 'object', newLineEntry, 'Lines', 'lines' );
            placeInDB.lines.push( exParams.mmTool.lineID );
            await this.indexedDB.update( 'object', placeInDB, 'Places', 'places' );

            exParams.mmTool.lineID = String( Date.now() );
            exParams.mmTool.line = null;
            exParams.mmTool.measurementLable = null;
            exParams.mmTool.drawingLine = false;
          }
        }
      }
    },

    func: function(e) {
      const compareStrings = Boolean(Number(
        e.target.id.localeCompare("mainCanvas")));
      if (!compareStrings) {
        this.leftDrawer.showDrawers[0] = false;
        this.leftDrawer.showDrawers[1] = false;
        this.leftDrawer.showDrawers[2] = false;
        this.leftDrawer.showDrawers[3] = false;
        this.leftDrawer.showDrawers[4] = false;
  
        this.leftDrawer.btnColors[0] = "transparent";
        this.leftDrawer.btnColors[1] = "transparent";
        this.leftDrawer.btnColors[2] = "transparent";
        this.leftDrawer.btnColors[3] = "transparent";
        this.leftDrawer.btnColors[4] = "transparent";
      }
    },

    onClickAnnotation: async function() {
      if ( this.annotatTool.modus ) {
        /* Get information about current place to store the annotation*/
        const placeInDB = await this.indexedDB.get( 'object', this.placeID, 'Places', 
          'places' );
          
        /* Get position of insersection of raycaster with object */
        exParams.mmTool.raycaster.setFromCamera( exParams.mmTool.pointer, exParams.main.camera );
        const intersects = exParams.mmTool.raycaster.intersectObjects( 
          exParams.main.objects.allObjects, true );
        const position = {
          x: intersects[ 0 ].point.x,
          y: intersects[ 0 ].point.y,
          z: intersects[ 0 ].point.z
        }
        
        if( intersects.length > 0 ) {
          /* Create annotation id */
          const annotationID = String( Date.now() );
          
          /* Create lable - id, name, position */
          const annotationLableName = "New Annotation | " + annotationID;
          const annotationLable = this.annotationTool.createLable(
            annotationID, annotationLableName, position, exParams.anTool )
    
          /* Create box - id, name, position */
          const annotationBoxName = "Box - " + annotationID;
          const annotationBox = this.annotationTool.createBox(
            annotationBoxName, exParams.anTool )
          
          /* Add lable to box */
          annotationBox.add(annotationLable)
    
          /* Add lable and box combo variable Storage for UI purposes */
          const newAnnotationEntry = {
            _id: String( annotationID ),
            lableName: annotationLableName,
            boxName: annotationBoxName,
            position: position,
          }
          exParams.anTool.annotations.push( newAnnotationEntry );
          this.annotatTool.infoBlock.push( newAnnotationEntry );
          this.annotatTool.allTitles.push( annotationLableName );
          
          /* Add lable and box combo to scene */
          exParams.main.scene.add( annotationBox )
          annotationBox.position.set( position.x, position.y, 
            position.z )
          
          /* Add lable and box combo to IndexedDB Box - id, name, position */
          await this.indexedDB.add( 'object', newAnnotationEntry, 'Annotations', 'annotations' );
          placeInDB.annotations.push( annotationID );
          await this.indexedDB.update( 'object', placeInDB, 'Places', 'places' );
        }
      }
    },

    keyDownAnnotation: function( event ) {

      if (event.key === 't') {
          exParams.main.annotationButtonPressed = true;
          exParams.main.arcBallControls.enabled = false
          document.body.style.cursor = 'crosshair';
      }
      
    },

    keyUpAnnotation: function( event ) {
      if (event.key === 't') {
        exParams.main.annotationButtonPressed = false;
        exParams.main.arcBallControls.enabled = true
        document.body.style.cursor = 'pointer'
      }
    },

    switchToAnModus: function( buttonPressed ) {
      if( !buttonPressed ) {
        this.annotatTool.modus = true;
        document.body.style.cursor = 'crosshair';
      } else {
        this.annotatTool.modus = false;
        document.body.style.cursor = 'pointer';
      }
    },

    /**
     * -------------------------------------------------------------------------
     * # Animation
     * -------------------------------------------------------------------------
     */
    // Animation	
    animation() {
      if( exParams.main.renderer != null ) {

        exParams.main.scene.getObjectByName("ICO").material.uniforms.u_time.value = this.clock.getElapsedTime();
        
        exParams.main.controls.update();
        exParams.main.renderer.render(exParams.main.scene, exParams.main.camera);
        
        exParams.main.canvas.style.height = (this.windowHeight - 112).toString() + "px";
        exParams.main.canvas.style.width = (this.windowWidth).toString() + "px";
        this.leftSidebar.style.height = (this.windowHeight - 112).toString() + "px";
        
        exParams.main.renderer.setSize( exParams.main.canvas.clientWidth,
          exParams.main.canvas.clientHeight, false );
        exParams.main.renderer.setPixelRatio(window.devicePixelRatio)
        
        exParams.main.camera.aspect = exParams.main.canvas.clientWidth /
          exParams.main.canvas.clientHeight;
        exParams.main.camera.updateProjectionMatrix();
  
        TWEEN.update();
        requestAnimationFrame( this.animation );
      }
    },

    animate: function() {
      /* Check interactions */
      this.render();
      
      /* Render Main and Sub Scene */
      if( exParams.main.renderer != null ) {
        exParams.main.renderer.render( exParams.main.scene, exParams.main.camera );
        exParams.sub.renderer.render( exParams.sub.scene, exParams.sub.camera );
        exParams.main.composer.render()
        exParams.mmTool.css2DRenderer.render( exParams.main.scene, exParams.main.camera )

        exParams.main.canvas.style.height = (this.windowHeight - 112).toString() + "px";
        exParams.main.canvas.style.width = (this.windowWidth - 58).toString() + "px";
        this.leftSidebar.style.height = (this.windowHeight - 112).toString() + "px";
        
        exParams.main.renderer.setSize( exParams.main.canvas.clientWidth, exParams.main.canvas.clientHeight, false );
        exParams.main.composer.setSize( window.innerWidth, window.innerHeight, false );
        exParams.mmTool.css2DRenderer.setSize( exParams.main.canvas.clientWidth, exParams.main.canvas.clientHeight );

        exParams.main.camera.aspect = exParams.main.canvas.clientWidth / exParams.main.canvas.clientHeight;
        exParams.main.camera.updateProjectionMatrix();
      }

      /* Render-Loop */
      requestAnimationFrame( this.animate );
    },

    render: async function() {

      if ( exParams.main.needsUpdate ) {

        exParams.main.needsUpdate = false;
        
        if ( exParams.stTool.brushesOfObjects.length > 0) {
          exParams.stTool.brushesOfObjects.forEach( brush => {
            brush.brush.updateMatrixWorld();
          } )
        }
        exParams.stTool.brushToCutWith.brush.updateMatrixWorld();
        exParams.stTool.csgEvaluator.useGroups = true
        
        exParams.stTool.brushesOfObjects.forEach( brush => {
          exParams.stTool.csgEvaluator.evaluate( brush.brush, 
            exParams.stTool.brushToCutWith.brush,
            SUBTRACTION, brush.resultObject );
        } )

        exParams.stTool.brushesOfObjects.forEach( brush => {
          brush.resultObject.material = brush.resultObject.material.map( m => exParams.stTool.materialMap.get( m ) );
        } );

      }

      /* Dispose Model from Sub Scene */
      if( exParams.sub.scene != null ) {
        if ( !this.bottomDrawer.showDrawer && exParams.sub.scene.children.length > 1 ) {
          exParams.sub.object = [];
          exParams.sub.orbitControls.reset();
          exParams.main.outlinePass.selectedObjects = [];
        }
      }

      /* Rotate model in Sub Scene */
      if ( exParams.sub.object[ 0 ] ) {
        exParams.sub.object[ 0 ].rotation.y += 0.01;
      }

      /* Reset arcball gizmo radius */
      exParams.main.arcBallControls.setTbRadius( 0.67 );
    },

  }
}
</script>

<style scoped></style>