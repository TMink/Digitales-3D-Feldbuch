<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 27.08.2024 12:27:09
 * Modified By: Julian Hardtung
 * 
 * Description: `visibility` input module for places
 -->

<template>
  <!-- <v-col> -->
    <v-card class="mb-4 mr-2 pb-4 px-4">
      <v-row no-gutters class="pt-2">
        <h2 class="text-h6 font-weight-medium pt-2">
          {{ $t('visibility') }}
        </h2>
        
        <v-spacer></v-spacer>

        <!-- HIDE/SHOW MODULE BUTTON -->
        <v-btn variant="flat" icon v-on:click="this.showModule = !this.showModule">
          <v-icon v-if="showModule">mdi-eye-outline</v-icon>
          <v-icon v-else>mdi-eye-off-outline</v-icon>
        </v-btn>
      </v-row>

      <v-divider></v-divider>

      <v-slider 
        v-if="this.showModule"
        :max="3" 
        step="1"
        tick-size="4" 
        :ticks="tickLabels" 
        show-ticks="always" 
        class="px-2"
        style="padding-top:31px; padding-bottom:12px"
        track-color="primary"
        thumb-color="secondary" 
        v-model="visibility" 
        color="warning">
      </v-slider>
      <v-row v-else no-gutters style="padding-top:6px"></v-row>
    </v-card>
  <!-- </v-col> -->
</template>

<script>
  export default {
		
		props: {
			visibilityProp: Number,
      showModuleProp: Boolean,
		},

    emits: ['dataToModuleViewer'],

		data () {
			return {
				visibility: null,
        tickLabels: {
          3: this.$t('veryGood'),
          2: this.$t('good'),
          1: this.$t('moderate'),
          0: this.$t('bad'),
        },
        showModule: true,
			}
		},

    watch: {
      showModuleProp: function(showModuleBool) {
        this.showModule = showModuleBool;
      },
      visibilityProp: function(visibilityPropData) {
          this.visibility = visibilityPropData;
      },
      "visibility": {
        handler: function() {
          if ( this.visibility != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'visibility', this.visibility ]);
          }
        }
      },
      'showModule': {
        handler: function() {
          if (this.showModule != null) {
            this.$emit("dataToModuleViewer", [ 'modulePreset.visibility', this.showModule ]);
          }
        }
      },
    },

    created() {
      this.visibility = this.visibilityProp;
      this.showModule = this.showModuleProp;
    },
		
	}
</script>

<style scoped></style>
