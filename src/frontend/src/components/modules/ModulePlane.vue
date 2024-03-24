<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 24.03.2024 19:31:39
 * Modified By: Julian Hardtung
 * 
 * Description: `plane` input module for places
 -->

<template>
  <v-card class="mb-4 mr-2 pb-4 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('plane') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn flat icon v-on:click="this.showModule = !this.showModule">
        <v-icon v-if="this.showModule">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider></v-divider>

    <v-textarea 
      v-if="this.showModule"
      rows="2"
      counter 
      style="margin-top:23px"
      hide-details
      color="primary" 
      v-model="plane"
      :label="$t('plane')">
    </v-textarea>
    <v-row v-else no-gutters style="padding-top:6px"></v-row>
  </v-card>
</template>

<script>
/**
 * Methods overview:
 */
export default {

  props: {
    planeProp: String,
    showModuleProp: Boolean,
	},

  emits: ['dataToModuleViewer'],

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      plane: null,
      pathNames: null,
      showModule: null,
    }
  },

  watch: {
    showModuleProp: function(showModuleBool) {
      this.showModule = showModuleBool;
    },
    planeProp: function(planePropData) {
        this.plane = planePropData;
    },
    'plane': {
      handler: function() {
        if (this.plane != null) {
          this.$emit("dataToModuleViewer", [ 'plane', this.plane ]);
        }
      }
    },
    'showModule': {
      handler: function() {
        if (this.showModule != null) {
          this.$emit("dataToModuleViewer", [ 'modulePreset.plane', this.showModule ]);
        }
      }
    },
  },

  created() {
    this.plane = this.planeProp;
    this.showModule = this.showModuleProp;
  },

};

</script>

<style scoped></style>