<!--
 * Created Date: 29.10.2024 13:57:08
 * Author: Julian Hardtung
 * 
 * Last Modified: 04.11.2024 18:15:47
 * Modified By: Julian Hardtung
 * 
 * Description: 
 -->

<template>
    <!--############### TOOLBAR ###############-->
    <v-card>
      <v-row class="align-center" no-gutters>
        <v-card-title>{{ $t('drawing')}}</v-card-title>
        <v-divider vertical></v-divider>
        <v-btn @click="onToolbarClick('pen')" variant="flat" v-bind:color="canvasSettings.mode ==='pen' ? 'success' : 'none'" icon="mdi-pencil" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('eraser')" variant="flat" v-bind:color="canvasSettings.mode ==='eraser' ? 'success' : 'none'" icon="mdi-eraser" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('text')" variant="flat" v-bind:color="canvasSettings.mode === 'text' ? 'success' : 'none'" icon="mdi-format-text" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('shape')" variant="flat" v-bind:color=" canvasSettings.mode != 'pen' && canvasSettings.mode != 'eraser' 
                && canvasSettings.mode != 'text' && canvasSettings.mode != 'none' ? 'success' : 'none'" icon="mdi-shape" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('colorPicker')" variant="flat" icon="mdi-palette" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('lineWidth')" variant="flat" icon="mdi-minus" rounded="0"></v-btn>
        <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.undo()" variant="flat" icon="mdi-undo" rounded="0"></v-btn>
        <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.redo()" variant="flat" icon="mdi-redo" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('clear')" variant="flat" icon="mdi-trash-can-outline" rounded="0"></v-btn>
        <!-- <v-btn @click.prevent="backgroundDialog = true" variant="flat" icon="mdi-image" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('removeBackground')" variant="flat" icon="mdi-image-remove" rounded="0"></v-btn> -->
        <v-divider vertical class="px-1 mr-1"></v-divider>
        <!-- <v-col cols="2">

          <v-card variant="outlined"> -->
            <v-file-input class="pa-1" :label="$t('backgroundImage')" 
            density="compact" hide-details 
            @click:clear="revertBackground()" 
            @change="setBackgroundImage($event)" 
            prepend-icon="mdi-image"
              accept="image/tiff, image/jpeg">
            </v-file-input>
          <!-- </v-card>
        </v-col> -->


        <v-divider vertical class="px-1"></v-divider>
        <v-spacer/>
        <v-btn @click="useAsImage()" class="mr-4" variant="outlined" color="secondary">
          <v-tooltip activator="parent" location="bottom">
            {{ $t('addToPhoto') }}
          </v-tooltip>
          <v-icon>mdi-content-save-move</v-icon>
        </v-btn>

        <v-btn @click="downloadImage()" variant="outlined" color="success">
          <v-tooltip activator="parent" location="bottom">
            {{ $t('download', {object: "drawing"}) }}
          </v-tooltip>
          <v-icon>mdi-download</v-icon>
        </v-btn>
        <v-spacer/>
      </v-row>
    </v-card>


    <!--############### ? ###############-->
    <div style="position:relative">
      <v-expand-transition>
        <v-color-picker class="mt-2" style="position:absolute; left:430px; z-index: 1;"
          v-show="canvasSettings.colorPickerVisible" v-model="canvasSettings.color"></v-color-picker>
      </v-expand-transition>

      <v-card class="mt-2">
        <v-expand-transition>
          <v-slider v-model="canvasSettings.lineWidth" :min="1" :max="10" :step="1"
            v-show="canvasSettings.lineWidthVisible" show-ticks="always"
            :ticks="canvasSettings.lineTicks"></v-slider>
        </v-expand-transition>
      </v-card>

      <v-expand-transition>
        <v-card class="mt-2" row v-show="canvasSettings.textModeVisible"
          style="position: absolute; left: 330px; z-index: 1;">
          <v-layout>
            <v-card :width="200" class="mx-2"><v-select :label="$t('fontFamily')" v-model="canvasSettings.selectedFont"
                :items="canvasSettings.fonts"></v-select></v-card>
            <v-card :width="200" class="mx-2"><v-select :label="$t('fontSize')"
                v-model="canvasSettings.selectedFontSize" :items="canvasSettings.fontSizes"></v-select></v-card>
          </v-layout>
        </v-card>
      </v-expand-transition>

      <v-expand-transition>
        <v-card class="mt-2" row v-show="canvasSettings.shapeModeVisible"
          style="position: absolute; left: 380px; z-index: 1;">
          <v-layout>
            <v-card class="mx-2"><v-btn variant="flat" @click="canvasSettings.mode = 'line'" v-bind:color="canvasSettings.mode === 'line' ? 'success' : 'none'" icon="mdi-minus" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn variant="flat" @click="canvasSettings.mode = 'dotted-line'" v-bind:color="canvasSettings.mode === 'dotted-line' ? 'success' : 'none'" icon="mdi-dots-horizontal" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn variant="flat" @click="canvasSettings.mode = 'circle'" v-bind:color="canvasSettings.mode === 'circle' ? 'success' : 'none'" icon="mdi-circle-outline" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn variant="flat" @click="canvasSettings.mode = 'rectangle'" v-bind:color="canvasSettings.mode === 'rectangle' ? 'success' : 'none'" icon="mdi-square-outline" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn variant="flat" @click="canvasSettings.mode = 'triangle'" v-bind:color="canvasSettings.mode === 'triangle' ? 'success' : 'none'" icon="mdi-triangle-outline"  rounded="0"></v-btn></v-card>
            <v-card class="mx-2" :height="50"><v-checkbox :label="$t('fill')" v-model="canvasSettings.filled" icon="mdi-triangle-outline" rounded="0"></v-checkbox></v-card>
          </v-layout>
        </v-card>
      </v-expand-transition>

      <FieldbookDrawingCanvas ref="FieldbookDrawingCanvas" :canvasWidth="canvasSettings.width"
        :canvasHeight="canvasSettings.height" :lineWidth="canvasSettings.lineWidth"
        :color="canvasSettings.color" :mode="canvasSettings.mode" :fontFamily="canvasSettings.selectedFont" 
        :fontSize="canvasSettings.selectedFontSize" :filled="canvasSettings.filled">
      </FieldbookDrawingCanvas>
    </div>
</template>

<script>

import FieldbookDrawingCanvas from "../../components/FieldbookDrawingCanvas.vue";
import { useWindowSize } from 'vue-window-size';
import { utils } from '../../utils';
import { fromOfflineDB } from "../../ConnectionToOfflineDB";
import { toRaw } from "vue";

/**
 * Methods overview:
 */
export default {

  components: {
    FieldbookDrawingCanvas
  },


  emits: ['dataToModuleViewer', 'use-drawing'],

  props: {
    objectProp: Object,
  },

  setup() {

    const {width, height } = useWindowSize();

    return {
      windowWidth: width,
      windowHeight: height,
    }
  },

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      imageModel: null,
      object: {
        editor: '',
        date: '',
        comment: '',
        image: ''
      },
      editorItems: [],
      automaticNaming: '',
      uploadImages: '',
      showModule: null,

      canvasSettings: {
        width: this.windowWidth-700,
        height: this.windowHeight-200,
        backgroundColor: "#fff",
        colorPickerVisible: false,
        lineWidthVisible: false,
        textModeVisible: false,
        shapeModeVisible: false,
        color: "#000",
        mode: "none",
        filled: false,
        lineWidth: 3,
        lineTicks: {
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        },
        fonts: ["Arial", "Serif", "Verdana", "Tahoma", "Georgia", "Courier New"],
        fontSizes: [16, 20, 24, 28, 32, 40, 44, 52],
        selectedFont: "Arial",
        selectedFontSize: 20,
        writeMode: false,
        backgroundImage: null,
        oldBackgroundImage: null,
      },
      backgroundDialog: false,
    }
  },


  async created() {
     this.object = this.objectProp;

    /*if (this.object.image != '') {
      this.imageModel = await utils.textureToBase64([this.object.image]);
    } */

    this.showModule = this.showModuleProp;
  },

  methods: {

    /**
     * Updates the displayed image after an image file was chosen
     * @param event 
     */
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        // When file is read, set the imageUrl to the result
        reader.onload = (e) => {
          this.imageModel = e.target.result;
        };
        // Read the file as a data URL
        reader.readAsDataURL(file);
      }
    },


    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },


    /* #################################################
    ############## TECHNICAL DRAWING ###################
    #################################################### */

    /**
     * Changes the status of variables related to the toolbar, if clicked.
     * 
     * @param {string} toolType - Defines the pressed button of the toolbar
     * */
    onToolbarClick(toolType) {
      if (toolType == "pen" || toolType == "eraser") {

        this.canvasSettings.mode = toolType == "eraser" ? "eraser" : "pen";
        this.canvasSettings.lineWidthVisible = false;
        this.canvasSettings.textModeVisible = false;
        this.canvasSettings.colorPickerVisible = false;
        this.canvasSettings.shapeModeVisible = false;
      }
      if (toolType == "colorPicker") {
        this.canvasSettings.lineWidthVisible = false;
        this.canvasSettings.textModeVisible = false;
        this.canvasSettings.shapeModeVisible = false;
        this.canvasSettings.colorPickerVisible = !this.canvasSettings.colorPickerVisible;
      }
      if (toolType == "lineWidth") {
        this.canvasSettings.colorPickerVisible = false;
        this.canvasSettings.textModeVisible = false;
        this.canvasSettings.shapeModeVisible = false;
        this.canvasSettings.lineWidthVisible = !this.canvasSettings.lineWidthVisible;
      }
      if (toolType == "text") {
        this.canvasSettings.mode = "text"
        this.canvasSettings.lineWidthVisible = false;
        this.canvasSettings.colorPickerVisible = false;
        this.canvasSettings.shapeModeVisible = false;
        this.canvasSettings.textModeVisible = !this.canvasSettings.textModeVisible;
      }
      if (toolType == "clear") {
        this.$refs.FieldbookDrawingCanvas.clearCanvas();
      }
      if (toolType == "shape") {
        this.canvasSettings.lineWidthVisible = false;
        this.canvasSettings.textModeVisible = false;
        this.canvasSettings.colorPickerVisible = false;
        this.canvasSettings.shapeModeVisible = !this.canvasSettings.shapeModeVisible;
      }
    },

    /**
     * Converts the base64-output of the Vue-Drawing-Canvas to an Imagefile, which can be downloaded.
     * */
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.$refs.FieldbookDrawingCanvas.addWhiteBackgroundToImage().toDataURL();
      link.target = '_blank';
      link.download = `${Date.now()}.png`
      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    setBackgroundImage(event) {
      let URL = window.URL;
      this.canvasSettings.backgroundImage = URL.createObjectURL(event.target.files[0]);
      
      this.saveBackground();
    },

    async saveBackground() {
      this.backgroundDialog = false;
      await this.setCanvasSize(this.canvasSettings.backgroundImage)
      await this.$refs.FieldbookDrawingCanvas.addBackgroundImage(this.canvasSettings.backgroundImage, this.canvasSettings.width, this.canvasSettings.height);
      this.canvasSettings.oldBackgroundImage = { ...this.canvasSettings.backgroundImage};
      console.log(this.canvasSettings.backgroundImage)
    },

    async setCanvasSize(url) {
      var thisInstance = this;
      var img = new Image();
      img.src = url;
      await img.decode().then(() => {
        if (img.width > 1200) {
          const compression = img.width / 1200;
          img.width /= compression;
          img.height /= compression;
        }
        thisInstance.canvasSettings.width = img.width;
        thisInstance.canvasSettings.height = img.height;
      })
    },

    async revertBackground() {
      if (this.oldBackgroundImage) {
        this.canvasSettings.backgroundImage = {...this.canvasSettings.oldBackgroundImage};
      }
      console.log(this.canvasSettings.backgroundImage)
      this.$refs.FieldbookDrawingCanvas.removeBackground();
    },

    /**
     * Add the drawing (and its background image) as an image in the current position
     */
    async useAsImage() {
      const drawing = this.$refs.FieldbookDrawingCanvas.addWhiteBackgroundToImage().toDataURL();
      var rawPosition = toRaw(this.object);
      rawPosition.image = drawing;
      this.$emit('use-drawing', rawPosition)
      this.$root.vtoast.show({ message: this.$t('saveSuccess')});
    },

  },

};

</script>

<style scoped></style>