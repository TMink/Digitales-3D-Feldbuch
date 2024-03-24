<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 24.03.2024 18:54:58
 * Modified By: Julian Hardtung
 * 
 * Description: `coordinates` input module for places/positions
 -->

<template>
  <v-card v-if="type == 'places'" class="mb-4 mr-2 pb-4 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('coordinates') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn flat icon 
        v-on:click="object.modulePreset.coordinates = !object.modulePreset.coordinates">
        <v-icon v-if="object.modulePreset.coordinates">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider/>
    
    <v-row v-if="object.modulePreset.coordinates" style="padding-top:7px">
      <!-- RIGHT -->
      <v-col lg="4">
        <v-text-field 
          hide-details 
          color="primary" 
          density="compact" 
          v-model="object.right"
          :label="$t('right')" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>
        <v-text-field 
          hide-details 
          color="primary" 
          density="compact"
          :label="$t('rightTo')"
          v-model="object.rightTo" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>
      </v-col>

      <v-divider vertical class="mt-1"/>

      <!-- UP -->
      <v-col lg="4">
        <v-text-field 
          hide-details 
          color="primary" 
          density="compact" 
          :label="$t('up')"
          v-model="object.up" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>

        <v-text-field 
          hide-details 
          color="primary" 
          density="compact" 
          :label="$t('upTo')"
          v-model="object.upTo" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>
      </v-col>

      <v-divider vertical class="mt-1"/>

      <!-- DEPTH -->
      <v-col lg="4">
        <v-text-field 
          hide-details 
          color="primary" 
          density="compact" 
          :label="$t('depthTop')"
          v-model="object.depthTop" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>

        <v-text-field 
          hide-details 
          color="primary" 
          density="compact" 
          :label="$t('depthBot')"
          v-model="object.depthBot" 
          @keypress="filterNonNumeric(event)">
        </v-text-field>
      </v-col>
    </v-row>
    <v-row v-else no-gutters style="padding-top:6px"></v-row>
  </v-card>

  <v-card  v-if="type == 'positions'" class="mb-4 mr-2 pb-4 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('coordinates') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn flat icon 
        v-on:click="object.modulePreset.coordinates = !object.modulePreset.coordinates">
        <v-icon v-if="object.modulePreset.coordinates">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider/>

    <v-row v-if="object.modulePreset.coordinates" style="padding-top:46px">
      <v-col lg="4">
        <v-text-field 
          color="primary" 
          hide-details 
          :label="$t('right')" 
          v-model="object.right" 
          @keypress="filterNonNumeric(event)"
          :hint="$tc('please_input', 2, { msg: 'Rechtswert' })">
        </v-text-field>
      </v-col>

      <v-divider vertical/>

      <v-col lg="4">
        <v-text-field 
          hide-details 
          color="primary" 
          :label="$t('up')" 
          v-model="object.up"
          @keypress="filterNonNumeric(event)" 
          :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
        </v-text-field>
      </v-col>

      <v-divider vertical/>

      <v-col lg="4">
        <v-text-field 
          hide-details 
          :label="$t('height')" 
          color="primary" 
          v-model="object.height" 
          @keypress="filterNonNumeric(event)" 
          :hint="$tc('please_input', 2, { msg: 'Höhe' })">
        </v-text-field>
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
        object: null,
        type: null,
			}
		},

    watch: {
      objectProp: function(objectPropData) {
        this.object = objectPropData;
      },
      "object.right": {
        handler: function() {
          if ( this.object.right != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'right', this.object.right ]);
          }
        }
      },
      "object.rightTo": {
        handler: function() {
          if ( this.object.rightTo != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'rightTo', this.object.rightTo ]);
          }
        }
      },
      "object.up": {
        handler: function() {
          if ( this.object.up != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'up', this.object.up ]);
          }
        }
      },
      "object.upTo": {
        handler: function() {
          if ( this.object.upTo != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'upTo', this.object.upTo ]);
          }
        }
      },
      "object.depthBot": {
        handler: function() {
          if ( this.object.depthBot != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'depthBot', this.object.depthBot ]);
          }
        }
      },
      "object.depthTop": {
        handler: function() {
          if ( this.object.depthTop != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'depthTop', this.object.depthTop ]);
          }
        }
      },
      "object.height": {
        handler: function() {
          if ( this.object.height != null && this.type == 'positions' ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'height', this.object.height ]);
          }
        }
      },
      "object.modulePreset.coordinates": {
        handler: function() {
          if ( this.object.modulePreset.coordinates != null) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'modulePreset.coordinates', this.object.modulePreset.coordinates ]);
          }
        }
      }
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
      /**
      * Prevents the input of non numeric values 
      * (allows one single `,` or `.` for float values)
      * @param {*} evt 
      */
      filterNonNumeric(evt) {
        evt = (evt) ? evt : window.event;
        let expect = evt.target.value.toString() + evt.key.toString();

        if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
          evt.preventDefault();
        } else {
          return true;
        }
      },
    }
		
	}
</script>

<style scoped>

.v-field__input {
  padding-top: 0px !important;
}
</style>
