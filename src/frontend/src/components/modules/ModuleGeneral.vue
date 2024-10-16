<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 16.10.2024 15:53:29
 * Modified By: Julian Hardtung
 * 
 * Description: `general information` input module for places/positions
 -->

<template>
  <v-col lg="12" class="mb-2">

    <!-- POSITIONS -->
    <v-card class="pa-4"
      v-if="type == 'positions'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="align-center pt-4">
        <v-col cols="2">
          <v-text-field 
            color="primary" 
            :label="$tc('posNumber', 2) + ' *'" 
            maxlength="5" 
            hide-details 
            v-model="object.positionNumber" 
            @keypress="filterAllNonNumeric(event)">
          </v-text-field>
        </v-col>

        <v-col cols="2">
          <v-text-field 
            hide-details 
            color="primary" 
            :label="$tc('subNumber', 2)" 
            maxlength="5"
            :disabled="!object.hasSubNumber" 
            v-model="object.subNumber">
          </v-text-field>
        </v-col>

        <v-col cols="2">
          <v-tooltip location="bottom">
            <template v-slot:activator="{ props }">
              <v-checkbox 
                hide-details 
                v-bind="props"
                :label="$t('hasSubNumber')" 
                color="secondary" 
                v-model="object.hasSubNumber">
              </v-checkbox>
            </template>
            {{ $t('checkIfSubNumber') }}
          </v-tooltip>
        </v-col>

        <v-col cols="2">
          <v-tooltip location="bottom">
              <template v-slot:activator="{ props }">
                <v-checkbox 
                  class="pl-4" 
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
        
        <v-spacer></v-spacer>

        <v-col cols="2">
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
        <v-col lg="4">
          <v-combobox
            multiple
            chips
            closable-chips
            :rules="titleRules"
            color="primary" 
            :items="titleItems"
            persistent-hint
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

        <v-col lg="8">
          <v-textarea 
            rows="5" 
            maxlength="254"
            counter="254"
            color="primary" 
            :label="$t('description')" 
            v-model="object.description">
          </v-textarea>
        </v-col>
      </v-row>
    </v-card>

    <!-- PLACES -->
    <v-card class="pa-4" v-if="type == 'places'">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('generalInformation') }}
      </h2>
      <v-divider/>
      <v-row class="pt-4">
        <v-col lg="4">
          <v-combobox
            hide-selected 
            multiple
            chips
            closable-chips
            :rules="titleRules"
            color="primary" 
            :items="titleItems" 
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

        <v-col lg="8">
          <v-textarea 
            rows="8"
            maxlength="254"
            counter="254" 
            color="primary" 
            v-model="object.description" 
            :label="$t('description')">
          </v-textarea>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
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
        description: null,
        editor: null,
        date: null,
        title: [],

        positionNumber: null,
        hasSubNumber: null,
        subNumber: null,
      },
      titleItems: [],
      editorItems: [],

      titleRules: [
        value => {
          if (value.length > 0) return true
          return this.$t('isMandatory', {msg: this.$tc('title', 2)})
        }
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
      var lvrTitles = JSON.parse(import.meta.env.VITE_TITLES);
      this.titleItems = lvrTitles.concat(titles);
    },
    "object.description": {
      handler: function () {
        if ( this.object.description != null ) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['description', this.object.description]);
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