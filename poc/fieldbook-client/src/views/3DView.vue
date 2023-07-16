<template>
  <div style="position: relative">

    <!-- Main Scene-->
    <canvas id="mainCanvas" style="position: absolute"></canvas>

    <div style="float: left;" >
      <v-card>
        <!-- Controls -->
        <v-navigation-drawer color="background"
          style="left: 49px; top:104px; width: 351px;"
          v-model="settingsDrawer[0]"
          temporary
        >
          <v-list-item height="50" 
            prepend-icon="mdi-camera-control"
            title="Controls"
          ></v-list-item>

          <v-divider></v-divider>

        </v-navigation-drawer>

        <!-- Place -->
        <v-navigation-drawer color="background"
          style="left: 49px; top:104px; width: 351px;"
          v-model="settingsDrawer[1]"
          temporary
        >
          <v-list-item height="50"
            prepend-icon="mdi-radar"
            title="Place"
          ></v-list-item>

          <v-divider></v-divider>

          <v-list-item height="50"
            prepend-icon="mdi-view-dashboard" title="Home" value="home"
          ></v-list-item>
          <v-list-item height="50"
            prepend-icon="mdi-forum" title="About" value="about"
          > </v-list-item>
        </v-navigation-drawer>

        <!-- Positions -->
        <v-navigation-drawer color="background"
          style="left: 49px; top:104px; width: 600px;"
          v-model="settingsDrawer[2]"
          temporary
        >
          <v-list-item height="50"
            prepend-icon="mdi-map-marker-radius-outline"
            title="Positions"
          ></v-list-item>
  
          <v-divider></v-divider>

          <v-card color="transparent" elevation="0" width="100%" height="250">
            <v-form>
              <v-card-subtitle class="pa-2 pl-4">Position Info</v-card-subtitle>
              <v-row no-gutters>

                <v-col cols="3" class="pl-2">
                  <v-combobox id="yeah" v-model="positionInfo2.number" :items="positionInfo2.allNumbers" item-title="positionNumber" label="Number" :disabled="isEditing">
        
                  </v-combobox>
                </v-col>

                <v-col cols="3" class="pl-2">
                  <v-combobox v-model="positionInfo2.subNumber" :items="positionInfo2.allSubNumbers" item-title="positionSubnumber" label="Subnumber" :disabled="isEditing">
        
                  </v-combobox>
                </v-col>

                <v-col cols="6" class="pl-2 pr-2">
                  <v-combobox v-model="positionInfo2.title" :items="positionInfo2.allTitles" item-title="positionTitle" label="Title" :disabled="isEditing">
        
                  </v-combobox>
                </v-col>

              </v-row>

              <v-card-subtitle class="pa-2 pl-4">Model Info</v-card-subtitle>
              <v-row no-gutters>

                <v-col cols="3" class="pl-2 ">
                  <v-combobox v-model="modelInfo2.number" :items="modelInfo2.allNumbers" item-title="modelNumber" label="Number" :disabled="isEditing">

                  </v-combobox>
                </v-col>

                <v-col cols="6" class="pl-2 ">
                  <v-combobox v-model="modelInfo2.title" :items="modelInfo2.allTitles" item-title="modelTitel" label="Titel" :disabled="isEditing">

                  </v-combobox>
                </v-col>

                </v-row>
            </v-form>
          </v-card>

          <v-divider></v-divider>

        </v-navigation-drawer>
      </v-card>

      <v-card rounded="0" width="50" height="86.6vh">
        <v-card rounded="0" align="center" width="50" height="50">
          <v-card-text>S</v-card-text>
        </v-card>
        <!-- Controls -->
        <v-btn v-model="btnNames[0]" rounded="0" icon="mdi-camera-control" width="50" height="50" :color="drawerBtnColor[0]"
          @click.stop="settingsDrawer[0] = !settingsDrawer[0]; updateBtnColor(btnNames[0]);
                       settingsDrawer[1] = false;
                       settingsDrawer[2] = false;
                       settingsDrawer[3] = false;"
        ></v-btn>
        <!-- Place -->
        <v-btn v-model="btnNames[1]" rounded="0" icon="mdi-radar" width="50" height="50" :color="drawerBtnColor[1]"
          @click.stop="settingsDrawer[0] = false;
                       settingsDrawer[1] = !settingsDrawer[1]; updateBtnColor(btnNames[1]);
                       settingsDrawer[2] = false;
                       settingsDrawer[3] = false;"
        ></v-btn>
        <!-- Positions -->
        <v-btn v-model="btnNames[2]" rounded="0" icon="mdi-map-marker-radius-outline" width="50" height="50" :color="drawerBtnColor[2]"
          @click.stop="settingsDrawer[0] = false;
                       settingsDrawer[1] = false;
                       settingsDrawer[2] = !settingsDrawer[2]; updateBtnColor(btnNames[2]);
                       settingsDrawer[3] = false;"
        ></v-btn>
      </v-card>
    </div>

    <div style="float: right;">
      <v-card 
      color="grey" 
      align="left" 
      height="70" 
      width="350"
      style="top: 10px; right: 10px">
        <v-card-text>
          <img src="../assets/keys/ALT_1.png" width="90" height="37" style="vertical-align: -10px"> 
          <font size="+2" color="black"> = Objektauswahl</font>
        </v-card-text>
      </v-card>

      <v-card 
      color="grey" 
      align="left" 
      height="70" 
      width="350"
      style="top: 15px; right: 10px">
        <v-card-text>
          <img src="../assets/keys/CTRL_1.png" width="90" height="37" style="vertical-align: -10px"> 
          <font size="+2" color="black"> = Modelle bewegen</font>
        </v-card-text>
      </v-card>
    </div>
  </div>

  <!-- Position information-->
  <v-navigation-drawer v-model="drawer"
    location="bottom"
    temporary width="385">
    <v-row class="pt-4 pl-4">
      <!-- 1st BOX -->
      <v-col cols="3">
        <v-card variant="tonal" class="pa-2">
          <v-list density="compact">

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ positionInfo.positionNumber }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Positionsnummber
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ positionInfo.subNumber }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Unternummer
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title class="text-h6">
                {{ positionInfo.title }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Ansprache
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ positionInfo.material }}
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
                    {{ positionInfo.right }}
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
                    {{ positionInfo.up }}
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
                {{ positionInfo.height }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Höhe
              </v-list-item-subtitle>
            </v-list-item>

            <v-card class="pa-4" color="accent">
              <div class="text-h4 text-center" :label="$t('lastEdited')">
                {{ positionInfo.date }}
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
                    {{ positionInfo.count }}
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
                    {{ positionInfo.weight }}
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
                {{ positionInfo.dating }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                Datierung
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ positionInfo.adressOf }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-subtitle>
                AnspracheVon
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item variant="tonal">
              <v-list-item-title style="color:white" class="text-h6">
                {{ positionInfo.description }}
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

      <!--  -->
      <v-divider vertical></v-divider>
      <v-col class="pa-0" cols="3">
        <v-list-item class="justify-center pt-4">
          {{ modelInSubName }}
        </v-list-item>

        <v-divider></v-divider>
        <div style="text-align:center" class="pt-4">
          <canvas v-show="cardShow" id="subCanvas"
            width="300"
            height="300"
            style="display: inline; border: 1px solid rgb(255, 255, 255)">
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
 *  # Setup vuetify/html components
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
 *  # Utility
 *  -> getModelCenter               - 
 *  -> addSelectedObject            - 
 *  -> getGroup                     - 
 *  -> gizmoChange                  - 
 *  ------------------------------------------------------------------------- 
 *  # Inits:
 *  -> initMain                     - 
 *  -> initSub                      - 
 *  ------------------------------------------------------------------------
 *  # Animate:
 *  -> animate                      - 
 *  -> render                       - 
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
  name: 'Viewer',                                                        // name

  emits: ['view'],
  data() {                                                               // data
    return {
      /* Canvas */
      canvasMain: null,
      canvasSub: null,
      
      /* Loader */
      glbLoader: null,

      /* Position Info */
      positionInfo: {
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
        adressOf: null
      },

      drawer: false,

      settingsDrawer: [false, false, false, false],
      drawerBtnColor: ["transparent", "transparent", "transparent", "transparent"],
      btnNames: ["btn1", "btn2", "btn3", "btn4"],

      cardShow: true,
      autoCompleteModel: null,
      tollesModel: null,

      /* Sidebar: Positions */
      positionInfo2: {
        number: null,
        subNumber: null,
        title: null,
        allNumbers: [],
        allSubNumbers: [],
        allTitles: [],
        infoBlock: []
      },
      modelInfo2: {
        number: null,
        title: null,
        allNumbers: [],
        allTitles: []
      },

      /* Meshes in Scene */
      placeModelsInScene: [], // {placeID, modelID, modelName}
      positionModelsInScene: [], // {positionID, modelID, modelName}

      positionModelsInSceneNames: [],
      isEditing: null,

      modelInSubName: "",

      arcballAnchor: [],
      cameraData: {
        position: null,
        rotation: null
      },

      gizmoState: false,
      colors: [],
    };
  },

  watch: {
    'positionInfo2.number': {
      handler: function() {
        console.log('Current vaule:' + this.positionInfo2.number );
        if ( this.positionInfo2.number != null ) {
          this.positionInfo2.allSubNumbers = [];
          this.positionInfo2.allTitles = [];
          for ( let i=0; i < this.positionInfo2.infoBlock.length; i++ ) {
            if ( this.positionInfo2.infoBlock[i].number == this.positionInfo2.number ) {
              
              if ( !this.positionInfo2.allSubNumbers.includes(this.positionInfo2.infoBlock[i].subNumber)) {
                this.positionInfo2.allSubNumbers.push(this.positionInfo2.infoBlock[i].subNumber)
              }
              if ( !this.positionInfo2.allTitles.includes(this.positionInfo2.infoBlock[i].title) ) {
                this.positionInfo2.allTitles.push(this.positionInfo2.infoBlock[i].title)
              }

            }
          }
        } else {
          this.undoDependencyCheck();
        }
      },
      deep: true
    },

    'positionInfo2.subnumber': {
      handler: function() {
        console.log('Current vaule:' + this.positionInfo2.subNumber);
        if (this.positionInfo2.subNumber != null) {
          this.positionInfo2.allNumbers = [];
          this.positionInfo2.allTitles = [];
          for ( let i=0; i < this.positionInfo2.infoBlock.length; i++ ) {
            if ( this.positionInfo2.infoBlock[i].subNumber == this.positionInfo2.subNumber ) {
              
              if ( !this.positionInfo2.allNumbers.includes(this.positionInfo2.infoBlock[i].number) ) {
                this.positionInfo2.allNumbers.push(this.positionInfo2.infoBlock[i].number)
              }
              if ( !this.positionInfo2.allTitles.includes(this.positionInfo2.infoBlock[i].title) ) {
                this.positionInfo2.allTitles.push(this.positionInfo2.infoBlock[i].title)
              }

            }
          }
        } else {
          this.undoDependencyCheck();
        }
      },
      deep: true
    },

    'positionInfo2.title': {
      handler: function() {
        console.log('Current vaule:' + this.positionInfo2.title);
        if ( this.positionInfo2.title != null ) {
          this.positionInfo2.allNumbers = [];
          this.positionInfo2.allSubNumbers = [];
          for ( let i=0; i < this.positionInfo2.infoBlock.length; i++ ) {
            if ( this.positionInfo2.infoBlock[i].title == this.positionInfo2.title ) {
              
              if ( !this.positionInfo2.allNumbers.includes(this.positionInfo2.infoBlock[i].number) ) {
                this.positionInfo2.allNumbers.push(this.positionInfo2.infoBlock[i].number)
              }
              if ( !this.positionInfo2.allSubNumbers.includes(this.positionInfo2.infoBlock[i].subNumber) ) {
                this.positionInfo2.allSubNumbers.push(this.positionInfo2.infoBlock[i].subNumber)
              }

            }
          }
        } else {
          this.undoDependencyCheck();
        }
      },
      deep: true
    }
  },

  async mounted() {                                                   // mounted
    this.$emit("view", this.$t('threeD_view'));
    await fromOfflineDB.syncLocalDBs();
    
    this.glbLoader = new GLTFLoader();

    this.setupCanvases();
    document.addEventListener("click", this.func, false);

    this.mainInit();
    this.subInit();

    await this.loadPlaceModels();

    if ( this.placeModelsInScene.length > 0 ) {
      this.updateCamera( this.placeModelsInScene[
        this.placeModelsInScene.length - 1 ].modelID )

      await this.loadPositionModels();

      this.getPositionInfo()

      this.animate();
    } else {
      console.log( "No Models found" )
    }
  },

  async unmounted() {                                               // unmounted
    if ( this.placeModelsInScene.length > 0 ) {
      await this.updateModelsInDB();
      await this.updateCameraInDB();
    }
    this.clearCanvases()
  },

  methods: {                                                          // methods

    undoDependencyCheck: function() {
      for ( let i=0; i < this.positionInfo2.infoBlock.length; i++ ) {
            this.undoItemFilter(this.positionInfo2.allNumbers, 
              this.positionInfo2.infoBlock[i].number);

            this.undoItemFilter(this.positionInfo2.allSubNumbers, 
              this.positionInfo2.infoBlock[i].subNumber);

            this.undoItemFilter(this.positionInfo2.allTitles, 
              this.positionInfo2.infoBlock[i].title);
          }
          this.positionInfo2.allNumbers.sort()
          this.positionInfo2.allSubNumbers.sort()
          this.positionInfo2.allTitles.sort()
    },

    undoItemFilter: function(allItems, infoBlockItem) {
      if ( !allItems.includes(infoBlockItem) ) {
        allItems.push(infoBlockItem)
      }
    },

    getPositionInfo: async function() {

      for ( let i=0; i < this.positionModelsInScene.length; i++) {
        const positionID = this.positionModelsInScene[i].positionID
        const positionInDB = await fromOfflineDB.getObject(positionID, 'Positions', 'positions')

        if ( !this.positionInfo2.allNumbers.includes(positionInDB.positionNumber) ) {
          this.positionInfo2.allNumbers.push(positionInDB.positionNumber)
        }
        if ( !this.positionInfo2.allSubNumbers.includes(positionInDB.subNumber) ) {
          this.positionInfo2.allSubNumbers.push(positionInDB.subNumber)
        }
        if ( !this.positionInfo2.allTitles.includes(positionInDB.title) ) {
          this.positionInfo2.allTitles.push(positionInDB.title)
        }

        const newPosition = { 
          number: positionInDB.positionNumber,
          subNumber: positionInDB.subNumber,
          title: positionInDB.title
        }

        this.positionInfo2.infoBlock.push(newPosition)
      }

    },

    callMe: function(e) {
      console.log(e)
    },

    func: function(e) {
      const compareStrings = Boolean(Number(e.target.id.localeCompare("mainCanvas")));
      if (!compareStrings) {
        this.settingsDrawer[0] = false;
        this.settingsDrawer[1] = false;
        this.settingsDrawer[2] = false;
        this.settingsDrawer[3] = false;
  
        this.drawerBtnColor[0] = "transparent";
        this.drawerBtnColor[1] = "transparent";
        this.drawerBtnColor[2] = "transparent";
        this.drawerBtnColor[3] = "transparent";
      }
    },

    updateBtnColor: function(e) {
      if(e) {
        switch(e) {
          case "btn1":
            if (this.drawerBtnColor[0] == "background") {
              this.drawerBtnColor[0] = "transparent"
            } else {
              this.drawerBtnColor[0] = "background"
            }
            this.drawerBtnColor[1] = "transparent"
            this.drawerBtnColor[2] = "transparent"
            this.drawerBtnColor[3] = "transparent"
            break;
          case "btn2":
            this.drawerBtnColor[0] = "transparent"
            if (this.drawerBtnColor[1] == "background") {
              this.drawerBtnColor[1] = "transparent"
            } else {
              this.drawerBtnColor[1] = "background"
            }
            this.drawerBtnColor[2] = "transparent"
            this.drawerBtnColor[3] = "transparent"
            break;
          case "btn3":
            this.drawerBtnColor[0] = "transparent"
            this.drawerBtnColor[1] = "transparent"
            if (this.drawerBtnColor[2] == "background") {
              this.drawerBtnColor[2] = "transparent"
            } else {
              this.drawerBtnColor[2] = "background"
            }
            this.drawerBtnColor[3] = "transparent"
            break;
          case "btn4":
            this.drawerBtnColor[0] = "transparent"
            this.drawerBtnColor[1] = "transparent"
            this.drawerBtnColor[2] = "transparent"
            if (this.drawerBtnColor[3] == "background") {
              this.drawerBtnColor[3] = "transparent"
            } else {
              this.drawerBtnColor[3] = "background"
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
        const modelInScene = this.sceneMain.getObjectByName( modelID );
        const modelInDB = await fromOfflineDB.getObject( modelID, 'Models',
          'places' );

        modelInDB.color = "#" + modelInScene.material.color.getHexString();
        modelInDB.opacity = modelInScene.material.opacity;

        await fromOfflineDB.updateObject( modelInDB, 'Models', 'places' );
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

    /**
     * -------------------------------------------------------------------------
     * # CleanUp
     * -------------------------------------------------------------------------
     */

    /**
     * 
     */
    clearCanvases: function() {
      /* Dispose models */
      this.removeModelsInScene( this.sceneMain, this.modelsInMain );
      this.removeModelsInScene( this.sceneSub, this.modelInSub );

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
          await this.loadModelInMain( objects[ i ].id, 'Place', 'Models',
            'places' );
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
          await this.loadModelInMain( objects[ i ].id, 'Position', 'Models',
            'positions' );
        }
      }
    },

    /**
     * 
     * @param {*} modelID 
     * @param {*} dbName 
     * @param {*} storeName 
     */
    loadModelInMain: async function( modelID, type, dbName, storeName ) {
      /* Get 3D-Model from IndexedDB */
      const object = await fromOfflineDB.getObject( modelID, dbName,
        storeName );
      const model = object.model;
      const color = object.color;
      const opacity = object.opacity;
      const id = object.id;
      const title = object.title;

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

          this.colors.push( object.color );
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

          this.colors.push( object.color );
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
              child.material.transparent = true;
              child.material.opacity = opacity;
              child.name = id;
            }
          } );
          resolve(glb.scene);
        } );
      } );

      this.modelInSubName = "Model name: " + object.title;
      
      /* Reposition camera according to model */
      const bbox = new THREE.Box3().setFromObject( meshGroup );
      const height = bbox.max.y - bbox.min.y;
      this.cameraSub.position.z = height + 60;

      /* Add model to sub scene */
      this.sceneSub.add( meshGroup );
      this.modelInSub.push( meshGroup );
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
    changeColor: async function( color, modelID ) {
      if ( color != null && modelID != null ) {
        this.sceneMain.getObjectByName( modelID ).material.color = 
          new THREE.Color( color );
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
            this.cardShow = true;
            this.drawer = true;
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
            const positionData = await fromOfflineDB.getObject( positionID,
              'Positions', 'positions' );
            this.positionInfo.positionNumber = positionData.positionNumber;
            this.positionInfo.subNumber = positionData.subNumber;
            this.positionInfo.date = positionData.date;
            this.positionInfo.title = positionData.title;
            this.positionInfo.material = positionData.material;
            this.positionInfo.right = positionData.right;
            this.positionInfo.up = positionData.up;
            this.positionInfo.height = positionData.height;
            this.positionInfo.count = positionData.count;
            this.positionInfo.weight = positionData.weight;
            this.positionInfo.description = positionData.description;
            this.positionInfo.dating = positionData.dating;
            this.positionInfo.adressOf = positionData.adressOf;
          }
        }
      }
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
    attachTransformControls: function( i ) {
      const modelName = this.positionModelsInScene[ i ];
      const model = this.sceneMain.getObjectByName( modelName.modelID );
      var groupObject = this.getGroup( model );

      this.tControlsMain.detach();
      this.tControlsMain.attach(groupObject);
    },

    /**
     * 
     */
    detachTransformControls: function() {
      this.tControlsMain.detach();
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
      })
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

      /* Render composer */
      this.composer.render()
      
      /* Render-Loop */
      requestAnimationFrame( this.animate );
    },

    /**
     * 
     */
    render: function() {
      /* Dispose Model from sceneSub */
      if ( !this.drawer && this.sceneSub.children.length > 1 ) {
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
    }
  }
}
</script>

<style scoped></style>