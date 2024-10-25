<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 25.10.2024 17:02:51
 * Modified By: Julian Hardtung
 * 
 * Description: `comment` input module for places
 -->

<template>
  <v-card class="pa-4 pt-2">
      <v-card-title>
        {{ $t('image') }}
      </v-card-title>

      <v-row no-gutters>
        <v-col>

          <v-row no-gutters>
            <v-col cols="4">

              <v-text-field 
              color="primary" 
              :label="$tc('posNumber', 2) + ' *'" 
              maxlength="5" 
              hide-details 
              v-model="object.positionNumber" 
              @keypress="filterAllNonNumeric(event)">
            </v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-text-field 
            color="primary"
            maxlength="10"
            :label="$t('date')  + ' *'" 
            v-model="object.date">
          </v-text-field>
        </v-col>
          </v-row>
            <v-combobox
              class="pt-4"
              color="primary" 
              :items="editorItemsSecondProp" 
              :label="$tc('photographer', 1)  + ' *'" 
              :hide-no-data="false" 
              v-model="object.editor">

              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-title>
                    {{ $t('noResults') }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-combobox>

            <v-textarea 
              rows="3"
              no-resize
              counter 
              maxlength="254"
              color="primary" 
              v-model="object.comment"
              :label="$t('comment')  + ' *'">
            </v-textarea>

            <v-file-input 
              show-size 
              v-model="object.image"
              @change="onFileSelected" 
              prepend-icon="mdi-camera"
              accept="image/png, image/jpeg, image/bmp"
              :label="$t('input', { msg: $t('image') })  + ' *'">
            </v-file-input>
          </v-col>
          <v-col>
            <v-row no-gutters>
              <v-spacer/>
              <v-img
                class="justify-center rounded-sm"
                :width="windowWidth/3.5"
                :height="windowWidth/3.5"
                aspect-ratio="1/1"
                cover
                :src="imageModel">
                <template v-slot:placeholder>
                  <v-card variant="tonal" 
                    class="d-flex align-center justify-center fill-height">
                    <v-icon size="x-large" icon="mdi-image-area"></v-icon>
                  </v-card> 
                </template>
              </v-img>
              <v-spacer/>
            </v-row>
          </v-col>
      </v-row>
    </v-card>
</template>

<script>

import { useWindowSize } from 'vue-window-size';
import { utils } from '../../utils';

/**
 * Methods overview:
 */
export default {

  props: {
    objectProp: Object,
    editorItemsSecondProp: Array,
    showModuleProp: Boolean,
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
    this.object = this.objectProp;

    if (this.object.image != '') {
      this.imageModel = await utils.textureToBase64([this.object.image]);
    }

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
  },

};

</script>

<style scoped></style>