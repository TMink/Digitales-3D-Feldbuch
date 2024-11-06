<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 22.10.2024 12:39:16
 * Modified By: Julian Hardtung
 * 
 * Description: `general information` input module for places/positions
 -->

<template>
    <!-- POSITIONS -->
    <v-card class="pa-4 mb-2 mr-2"
      v-if="type == 'positions'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="align-center pt-4">
        <v-col cols="3">
          <v-text-field 
            color="primary" 
            :label="$tc('posNumber', 2) + ' *'" 
            maxlength="5" 
            hide-details 
            v-model="object.positionNumber" 
            @keypress="filterAllNonNumeric(event)">
          </v-text-field>
        </v-col>

        <v-col cols="3">
          <v-text-field 
            hide-details 
            color="primary" 
            :label="$tc('subNumber', 2)" 
            maxlength="5"
            :disabled="!object.hasSubNumber" 
            v-model="object.subNumber">
          </v-text-field>
        </v-col>

        <v-col class="justify-start">

        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-checkbox 
              class="justify-start"
              hide-details 
              v-bind="props"
              :label="$t('hasSubNumber')" 
              color="secondary" 
              v-model="object.hasSubNumber">
            </v-checkbox>
          </template>
          {{ $t('checkIfSubNumber') }}
        </v-tooltip>

          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-checkbox 
                v-bind="props"
                hide-details 
                v-model="object.isSeparate" 
                color="primary"
                :disabled="!object.hasSubNumber" 
                :label="$t('isSeparate')">
              </v-checkbox>
            </template>
            <span v-html="$t('checkIfSeperateSubNumber')"></span>
          </v-tooltip>
        </v-col>
        
        <v-col class="justify-end" cols="3">
          <v-text-field
            color="primary"
            :rules="dateRules"
            :label="$t('date')"
            maxlength="10" 
            v-model="object.date">
          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-combobox
            multiple
            chips
            closable-chips
            :rules="titleRules"
            color="primary" 
            :items="titleItemsPos"
            persistent-hint
            :label="$tc('title', 1) + ' *'" 
            :hide-no-data="false" 
            v-model="object.title">

            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  {{ $t('noResults') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>

          <v-combobox
            class="pt-4"
            color="primary" 
            :items="editorItemsSecondProp" 
            :label="$tc('editor', 1)" 
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
        </v-col>
      </v-row>
    </v-card>

    <!-- PLACES -->
    <v-card class="mb-2 mr-2 pa-4" v-if="type == 'places'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="pt-4">
        <v-col>
          <v-combobox
            hide-selected 
            multiple
            chips
            closable-chips
            :rules="titleRules"
            color="primary" 
            :items="titleItemsPlace" 
            :label="$tc('title', 2) + ' *'" 
            :hide-no-data="false" 
            v-model="object.title">

            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-title>
                  {{ $t('noResults') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-combobox>

          <v-text-field
            class="pt-1" 
            no-resize 
            hide-selected 
            :rules="dateRules"
            color="primary"
            maxlength="10"
            :hide-no-data="false" 
            :label="$t('date')" 
            v-model="object.date">
          </v-text-field>

          <v-combobox
            hide-selected
            hide-details
            class="pt-1"
            color="primary" 
            :items="editorItemsSecondProp" 
            :label="$tc('editor', 1)" 
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
        </v-col>

      </v-row>
    </v-card>
</template>

<script>

import { toRaw } from 'vue';

export default {
		
	props: {
    objectProp: Object,
    titleItemsSecondProp: Array,
    editorItemsSecondProp: Array,
  },

  emits: ['dataToModuleViewer'],

  data() {
    return {
      type: null,
      object: {
        editor: null,
        date: null,
        title: [],

        positionNumber: null,
        hasSubNumber: null,
        subNumber: null,
      },
      titleItemsPos: [],
      titleItemsPlace: [],
      editorItems: [],

      titleRules: [
        /* value => {
          if (value.length > 0) return true
          return this.$t('isMandatory', {msg: this.$tc('title', 1)})
        } */
      ],
      dateRules: [
        value => {
          if (!isNaN(new Date(value))) {
            return true;
          } else {
            let dateArray = value.split(".");
            let flippedDate = `${dateArray[2]}.${dateArray[1]}.${dateArray[0]}`;

            if (!isNaN(new Date(flippedDate))) {
              return true;
            }
          }
          return this.$t('invalidDate')
        }
      ],
    }
  },

  watch: {
    objectProp: function(datingPropData) {
        this.object = datingPropData;
    },
    titleItemsSecondProp: function(titles) {
      var lvrTitlesPos = JSON.parse(import.meta.env.VITE_TITLES);
      var lvrTitlesPlace = JSON.parse(import.meta.env.VITE_PLACE_TITLES);
      this.titleItemsPos = lvrTitlesPos.concat(titles);
      this.titleItemsPlace = lvrTitlesPlace.concat(titles);
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
    "object.title": {
      handler: function () {
        if (toRaw(this.object.title).join('; ').length > 254) {
          this.$nextTick(() => this.object.title.pop())
        }
        
        if ( this.object.title != [] ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['title', toRaw(this.object.title)]);
        }
      }
    },
    "object.positionNumber": {
      handler: function () {
        if ( this.object.positionNumber != null && this.type == 'positions' ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['positionNumber', this.object.positionNumber]);
        }
      }
    },
    "object.hasSubNumber": {
      handler: function () {
        if ( this.object.hasSubNumber != null && this.type == 'positions' ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['hasSubNumber', this.object.hasSubNumber]);
        }
      }
    },
    "object.subNumber": {
      handler: function () {
        if ( this.object.subNumber != null && this.type == 'positions' ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['subNumber', this.object.subNumber]);
        }
      }
    },
    "object.isSeparate": {
      handler: function () {
        if ( this.object.isSeparate != null && this.type == 'positions' ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['isSeparate', this.object.isSeparate]);
        }
      }
    },
  },

  created() {
    this.type = this.getType(this.$route.path);
    this.object = this.objectProp;
  },

  methods: {
    getType(path) {
      const lowerName = path.substring(
        path.indexOf("/") + 1, 
        path.lastIndexOf("/")
      );
      return lowerName
    },
  }

}

</script>

<style scoped></style>