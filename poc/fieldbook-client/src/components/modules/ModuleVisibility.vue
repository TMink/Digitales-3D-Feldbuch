<template>
  <v-col lg="6" class="pt-0 pl-0 pr-0">
    <v-card class="pa-4">
      <v-card-text>
        <h2 class="text-h6 font-weight-medium pb-2">
          {{ $t('visibility') }}
        </h2>
      </v-card-text>
      <v-slider 
        :max="3" 
        step="1" 
        class="pa-4" 
        tick-size="4" 
        :ticks="tickLabels" 
        show-ticks="always" 
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

    emits: ['dataToModelViewer'],

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
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'visibility', this.visibility ]);
          }
        }
      }
    },

    updated() {
      this.visibility = this.visibilityProp;
    },
		
	}
</script>

<style scoped></style>
