<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 16.10.2024 16:01:59
 * Modified By: Julian Hardtung
 * 
 * Description: `find types` input module for places
 -->

<template>
  <v-card class="mb-2 pb-2 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('findType') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn variant="flat" icon v-on:click="object.modulePreset.findTypes = !object.modulePreset.findTypes">
        <v-icon v-if="object.modulePreset.findTypes">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider></v-divider>

    <v-row v-if="object.modulePreset.findTypes" no-gutters class="mt-4 pb-2">
      <v-col cols="6" class="pr-2">
        <v-checkbox
          color="primary"
          persistent-hint 
          :label="$t('noFind')" 
          :hint="$t('noFindDescr')"
          v-model="object.noFinding">
        </v-checkbox>
      </v-col>

      <v-col cols="6" class="pr-5">
        <v-checkbox 
          persistent-hint 
          color="secondary"
          :hint="$t('restFindDescr')" 
          :label="$t('restFind')"
          v-model="object.restFinding">
        </v-checkbox>
      </v-col>
    </v-row>
    <v-row v-else no-gutters style="padding-top:6px"></v-row>
  </v-card>
</template>

<script>

  export default {
		
		props: {
			objectProp: Object,
		},

    emits: ['dataToModuleViewer'],

		data () {
			return {
				object: {
          noFinding: null,
          restFinding: null,
        },
			}
		},

    watch: {
      objectProp: function(objectPropData) {
        this.object = objectPropData;
      },
      "object.noFinding": {
        handler: function() {
          if ( this.object.noFinding != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'noFinding', this.object.noFinding ]);
          }
        }
      },
      "object.restFinding": {
        handler: function() {
          if ( this.object.restFinding != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'restFinding', this.object.restFinding ]);
          }
        }
      },
      "object.modulePreset.findTypes": {
        handler: function() {
          if ( this.object.modulePreset.findTypes != null) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'modulePreset.findTypes', this.object.modulePreset.findTypes ]);
          }
        }
      }
    },

    created() {
      this.object = this.objectProp;
    },
		
	}

</script>

<style scoped></style>