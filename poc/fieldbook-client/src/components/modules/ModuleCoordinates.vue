<template>
  <v-col lg="6" >
    <v-card v-if="type == 'places'" class="pa-4">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('coordinates') }}
      </h2>

      <v-divider/>
      
      <v-row class="pt-2">
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
    </v-card>

    <v-card  v-if="type == 'positions'" class="pa-4">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('coordinates') }}
      </h2>
      <v-divider/>
      <v-row style="padding-top:46px">
        <v-col lg="4">
          <v-text-field 
            color="primary" 
            hide-details 
            :label="$t('right') + ' *'" 
            :rules="is_required"
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
            :label="$t('up') + ' *'" 
            :rules="is_required" 
            v-model="object.up"
            @keypress="filterNonNumeric(event)" 
            :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
          </v-text-field>
        </v-col>

        <v-divider vertical/>

        <v-col lg="4">
          <v-text-field 
            hide-details 
            :label="$t('height') + ' *'" 
            color="primary" 
            :rules="is_required"
            v-model="object.height" 
            @keypress="filterNonNumeric(event)" 
            :hint="$tc('please_input', 2, { msg: 'Höhe' })">
          </v-text-field>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
export default {
		
		props: {
			objectProp: Object,
		},

    emits: ['dataToModuleViewer'],

		data () {
			return {
        type: null,
        object: {
          depthBot: null,
          depthTop: null,
          upTo: null,
          up: null,
          rightTo: null,
          right: null,

          height: null,
          is_required: [v => !!v || 'Pflichtfeld'],
        },
			}
		},

    watch: {
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
            this.$emit("dataToModuleViewer", [ 'rightTo', this.rightTo ]);
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
      }
    },

    created() {
      this.type = this.getType(this.$route.path)
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
