<!--
 * Created Date: 29.10.2024 13:57:08
 * Author: Julian Hardtung
 * 
 * Last Modified: 30.10.2024 17:17:44
 * Modified By: Julian Hardtung
 * 
 * Description: 
 -->

<template>
    <!-- Tab item 'technical drawing' -->
    <v-dialog persistent overlay-color="black" v-model="backgroundDialog">
      <v-card class="pa-4">
        <v-card-title>Set Background Image</v-card-title>
        <v-file-input @change="setBackgroundImage($event)" prepend-icon="mdi-image"
          accept="image/png"></v-file-input>
        <v-btn @click.prevent="saveBackground()">Save</v-btn>
        <v-btn @click.prevent="revertBackground()">Cancel</v-btn>
      </v-card>
    </v-dialog>

    <v-card>
      <v-toolbar :height="50" color="surface" density="default">
        <v-card-title>{{ $t('drawing')}}</v-card-title>
        <v-divider vertical></v-divider>
        <v-btn @click="onToolbarClick('pen')" variant="flat" v-bind:color="canvasSettings.mode ==='pen' ? 'success' : 'none'" icon="mdi-pencil" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('eraser')" variant="flat" v-bind:color="canvasSettings.mode ==='eraser' ? 'success' : 'none'" icon="mdi-eraser" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('text')" variant="flat" v-bind:color="canvasSettings.mode === 'text' ? 'success' : 'none'" icon="mdi-format-text" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('shape')" variant="flat" v-bind:color=" canvasSettings.mode != 'pen' && canvasSettings.mode != 'eraser' 
                && canvasSettings.mode != 'text' && canvasSettings.mode != 'none' ? 'success' : 'none'" icon="mdi-shape" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('colorPicker')" icon="mdi-palette" rounded="0"></v-btn>
        <v-btn @click="onToolbarClick('lineWidth')" icon="mdi-minus" rounded="0"></v-btn>
        <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.undo()" icon="mdi-undo" rounded="0"></v-btn>
        <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.redo()" icon="mdi-redo" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('clear')" icon="mdi-trash-can-outline" rounded="0"></v-btn>
        <v-btn @click.prevent="backgroundDialog = true" icon="mdi-image" rounded="0"></v-btn>
        <v-btn @click.prevent="onToolbarClick('removeBackground')" icon="mdi-image-remove" rounded="0"></v-btn>
      </v-toolbar>
    </v-card>
    <div style="position:relative">
      <v-expand-transition>
        <v-color-picker class="mt-2" style="position:absolute; left:430px; z-index: 1;"
          v-show="canvasSettings.colorPickerVisible" v-model="canvasSettings.color"></v-color-picker>
      </v-expand-transition>

      <v-card class="mt-2" style="position:absolute; left: 480px; z-index: 1;" :width="600">
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
            <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'line'" v-bind:color="canvasSettings.mode === 'line' ? 'success' : 'none'" icon="mdi-minus" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'dotted-line'" v-bind:color="canvasSettings.mode === 'dotted-line' ? 'success' : 'none'" icon="mdi-dots-horizontal" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'circle'" v-bind:color="canvasSettings.mode === 'circle' ? 'success' : 'none'" icon="mdi-circle-outline" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'rectangle'" v-bind:color="canvasSettings.mode === 'rectangle' ? 'success' : 'none'" icon="mdi-square-outline" rounded="0"></v-btn></v-card>
            <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'triangle'" v-bind:color="canvasSettings.mode === 'triangle' ? 'success' : 'none'" icon="mdi-triangle-outline"  rounded="0"></v-btn></v-card>
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
    <v-row no-gutters>
      <v-btn @click="useAsImage()" variant="outlined" color="secondary">
        <v-tooltip activator="parent" location="bottom">
          {{ $t('addToPhoto') }}
        </v-tooltip>
        <v-icon>mdi-content-save-move</v-icon>
      </v-btn>
      <v-btn class="ml-3" @click="downloadImage()" color="success">
        <v-tooltip activator="parent" location="bottom">
          {{ $t('download', {object: "drawing"}) }}
        </v-tooltip>
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </v-row>
</template>

<script>

import FieldbookDrawingCanvas from "../../components/FieldbookDrawingCanvas.vue";
import { useWindowSize } from 'vue-window-size';
import { utils } from '../../utils';

/**
 * Methods overview:
 */
export default {

  components: {
    FieldbookDrawingCanvas
  },

  props: {
    objectProp: Object,
	},

  emits: ['dataToModuleViewer'],

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
        width: 1200,
        height: 800,
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

  watch: {
    showModuleProp: function(showModuleBool) {
      this.showModule = showModuleBool;
    },
    objectProp: function(objectPropData) {
        this.object = objectPropData;
    },
    'object.comment': {
      handler: function() {
        if (this.object.comment != null) {
          this.$emit("dataToModuleViewer", [ 'comment', this.object.comment ]);
        } else if ( this.object.comment == null ) {
          this.$emit("dataToModuleViewer", ['comment', '']);
        }
      }
    },
    "object.editor": {
      handler: function () {
        if ( this.object.editor != null ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['editor', this.object.editor]);
        } else if ( this.object.editor == null ) {
          this.$emit("dataToModuleViewer", ['editor', '']);
        }
      }
    },
    "object.image": {
      handler: async function () {
        if ( this.object.image != null ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['image', this.object.image]);
        } else if ( this.object.image == null ) {
          this.$emit("dataToModuleViewer", ['image', '']);
        }
      }
    },
    "object.date": {
      handler: function () {
        if ( this.object.date != null ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['date', this.object.date]);
        } else {
          this.$emit("dataToModuleViewer", ['date', '']);
        }
      }
    },
    'showModule': {
      handler: function() {
        if (this.showModule != null) {
          this.$emit("dataToModuleViewer", [ 'modulePreset.comment', this.showModule ]);
        }
      }
    },
  },

  async created() {
    /* this.object = this.objectProp;

    if (this.object.image != '') {
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
      if (toolType == "removeBackground"){
        this.$refs.FieldbookDrawingCanvas.removeBackground();
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

    async setBackgroundImage(event) {
      let URL = window.URL;
      this.canvasSettings.backgroundImage = URL.createObjectURL(event.target.files[0]);
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
      this.backgroundDialog = false;
      console.log(this.canvasSettings.backgroundImage)
    },

    /**
     * Add the drawing (and its background image) as an image in the current position
     */
    useAsImage() {
      this.$refs.FieldbookDrawingCanvas.addWhiteBackgroundToImage().toDataURL();
    },

  },

};

</script>

<style scoped></style>