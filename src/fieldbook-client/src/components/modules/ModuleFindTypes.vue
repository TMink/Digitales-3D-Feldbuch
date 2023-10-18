<template>
  <v-col lg="6" >
    <v-card class="pa-4">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('findType') }}
      </h2>
      <v-divider></v-divider>
      <v-row no-gutters class="mt-4">
        <v-col cols="6">
          <v-checkbox
            color="primary"
            persistent-hint 
            :label="$t('noFind')" 
            :hint="$t('noFindDescr')"
            v-model="object.noFinding">
          </v-checkbox>
        </v-col>

        <v-col cols="6">
          <v-checkbox 
            persistent-hint 
            color="secondary"
            :hint="$t('restFindDescr')" 
            :label="$t('restFind')"
            v-model="object.restFinding">
          </v-checkbox>
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
      }
    },

    created() {
      this.object = this.objectProp;
    },
		
	}

</script>

<style scoped></style>