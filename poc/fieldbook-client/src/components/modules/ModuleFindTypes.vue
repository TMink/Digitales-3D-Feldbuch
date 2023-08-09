<template>
  <v-col lg="6">
    <v-card class="pa-4">
      <v-card-text>
        <h2 class="text-h6 font-weight-medium pb-2">
          {{ $t('findType') }}
        </h2>
      </v-card-text>
      <v-row class="pl-4 pb-4 justify-center">
        <v-col cols="6">
          <v-tooltip 
            :text="$t('noFindDescr')"
            location="bottom">
            <template v-slot:activator="{ props }">
              <v-checkbox
                v-bind="props" 
                color="primary"
                persistent-hint 
                :label="$t('noFind')" 
                v-model="object.noFinding">
              </v-checkbox>
            </template>
          </v-tooltip>
        </v-col>

        <v-col cols="6">
          <v-tooltip 
            :text="$t('restFindDescr')" 
            location="bottom">
            <template v-slot:activator="{ props }">
              <v-checkbox 
                v-bind="props" 
                persistent-hint 
                color="secondary" 
                :label="$t('restFind')"
                v-model="object.restFinding">
              </v-checkbox>
            </template>
          </v-tooltip>
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

    emits: ['dataToModelViewer'],

		data () {
			return {
				object: {
          noFinding: null,
          restFinding: null,
        },
			}
		},

    watch: {
      "object.noFinding": {
        handler: function() {
          if ( this.object.noFinding != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'noFinding', this.object.noFinding ]);
          }
        }
      },
      "object.restFinding": {
        handler: function() {
          if ( this.object.restFinding != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'restFinding', this.object.restFinding ]);
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