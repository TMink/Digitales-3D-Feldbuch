<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 18.10.2024 14:42:03
 * Modified By: Julian Hardtung
 * 
 * Description: `profile` input module for places
 -->

<template>
  <v-card class="mb-2 pb-2 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('profile') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn variant="flat" icon v-on:click="this.showModule = !this.showModule">
        <v-icon v-if="this.showModule">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider></v-divider>

    <v-textarea 
      v-if="this.showModule"
      rows="3"
      no-resize
      counter 
      style="margin-top:15px; margin-bottom: -10px;"
      maxlength="254"
      color="primary" 
      v-model="profile"
      :label="$t('profile')">
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
    profileProp: String,
    showModuleProp: Boolean,
	},

  emits: ['dataToModuleViewer'],

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      profile: null,
      pathNames: null,
      showModule: null,
    }
  },

  watch: {
    showModuleProp: function(showModuleBool) {
      this.showModule = showModuleBool;
    },
    profileProp: function(profilePropData) {
        this.profile = profilePropData;
    },
    'profile': {
      handler: function() {
        if (this.profile != null) {
          this.$emit("dataToModuleViewer", [ 'profile', this.profile ]);
        }
      }
    },
    'showModule': {
      handler: function() {
        if (this.showModule != null) {
          this.$emit("dataToModuleViewer", [ 'modulePreset.profile', this.showModule ]);
        }
      }
    },
  },

  created() {
    this.profile = this.profileProp;
    this.showModule = this.showModuleProp;
  },

};

</script>

<style scoped></style>