<template>
  <v-col lg="6">
    <v-card class="pa-4">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('visibility') }}
      </h2>
      <v-divider></v-divider>
      <v-slider 
        :max="3" 
        step="1"
        tick-size="4" 
        :ticks="tickLabels" 
        show-ticks="always" 
        class="px-2"
        style="padding-top:44px"
        track-color="primary"
        thumb-color="secondary" 
        v-model="visibility" 
        color="warning">
      </v-slider>
    </v-card>
  </v-col>
</template>

<script>
  export default {
		
		props: {
			visibilityProp: String,
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
			}
		},

    watch: {
      "visibility": {
        handler: function() {
          if ( this.visibility != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'visibility', this.visibility ]);
          }
        }
      }
    },

    created() {
      this.visibility = this.visibilityProp;
    },
		
	}
</script>

<style scoped></style>
