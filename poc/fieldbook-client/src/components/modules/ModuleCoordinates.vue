<template>
    <v-card v-if="type == 'positions'">
      <v-card-text>
        <h2 class="text-h6 font-weight-medium pb-3">
          {{ $t('gaussKrueger') }}
        </h2>
      </v-card-text>
      <v-row class="pa-4 pt-0" justify="center">
        <v-col lg="3">
          <v-text-field
            color="primary" 
            hide-details 
            :label="$t('right') + ' *'" 
            :rules="is_required"
            v-model="position.right" 
            @keypress="filterNonNumeric(event)"
            :hint="$tc('please_input', 2, { msg: 'Rechtswert' })">
          </v-text-field>
        </v-col>

        <v-divider class="mt-1 mb-n2" vertical></v-divider>

        <v-col lg="3">
          <v-text-field 
            hide-details 
            color="primary" 
            :label="$t('up') + ' *'" 
            :rules="is_required" 
            v-model="position.up"
            @keypress="filterNonNumeric(event)"
            :hint="$tc('please_input', 2, { msg: 'Hochwert' })">
          </v-text-field>
        </v-col>

        <v-divider class="mt-1 mb-n2" vertical></v-divider>

        <v-col lg="3">
          <v-text-field
            hide-details 
            :label="$t('height') + ' *'" 
            color="primary" 
            :rules="is_required" 
            v-model="position.height"
            @keypress="filterNonNumeric(event)"
            :hint="$tc('please_input', 2, { msg: 'Höhe' })">
          </v-text-field>
        </v-col>
      </v-row>
    </v-card>
    
    <v-card class="pa-4" height="12em" v-if="type == 'places'">
        <v-card-text>
            <h2 class="text-h6 font-weight-medium pb-2">
                {{ $t('coordinates') }}
            </h2>
        </v-card-text>
        <v-row 
            no-gutters 
            justify="center">

            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                v-model="object.right"
                :label="$t('right')" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('rightTo')"
                v-model="object.rightTo" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-divider 
                class="mt-n1 mb-n2" 
                vertical />
            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                :label="$t('up')"
                v-model="object.up" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('upTo')"
                v-model="object.upTo" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-divider 
                class="mt-n1 mb-n2" 
                vertical />

            <v-text-field 
                hide-details 
                color="primary" 
                class="px-4 pb-4" 
                density="compact" 
                :label="$t('depthTop')"
                v-model="object.depthTop" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>

            <v-text-field 
                hide-details 
                color="primary" 
                class="pr-4 pb-4" 
                density="compact" 
                :label="$t('depthBot')"
                v-model="object.depthBot" 
                @keypress="filterNonNumeric(event)">
            </v-text-field>
        </v-row>
    </v-card>
</template>

<script>
export default {
		
		props: {
			objectProp: Object,
		},

    emits: ['dataToModelViewer'],

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
        },
			}
		},

    watch: {
      "object.right": {
        handler: function() {
          if ( this.object.right != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'right', this.object.right ]);
          }
        }
      },
      "object.rightTo": {
        handler: function() {
          if ( this.object.rightTo != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'rightTo', this.rightTo ]);
          }
        }
      },
      "object.up": {
        handler: function() {
          if ( this.object.up != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'up', this.object.up ]);
          }
        }
      },
      "object.upTo": {
        handler: function() {
          if ( this.object.upTo != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'upTo', this.object.upTo ]);
          }
        }
      },
      "object.depthBot": {
        handler: function() {
          if ( this.object.depthBot != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'depthBot', this.object.depthBot ]);
          }
        }
      },
      "object.depthTop": {
        handler: function() {
          if ( this.object.depthTop != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'depthTop', this.object.depthTop ]);
          }
        }
      }
    },

    created() {
      this.type = this.getType(this.$route.path)
    },

    updated() {
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

<style scoped></style>
