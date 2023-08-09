<template>
  <v-col lg="6" class="pt-0 pl-0 pr-0">
    <v-card class="pa-4">
      <v-card-text>
        <h2 class="text-h6 font-weight-medium pb-2">
          {{ $t('plane') }}
        </h2>
      </v-card-text>
        <v-textarea 
            rows="2" 
            counter 
            color="primary" 
            class="ma-1 px-2 pt-2" 
            v-model="plane"
            :label="$t('plane')">
        </v-textarea>
    </v-card>
  </v-col>
</template>

<script>
/**
 * Methods overview:
 */
export default {

  props: {
    planeProp: String,
	},

  emits: ['dataToModelViewer'],

  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      plane: null,
      pathNames: null,
    }
  },

  watch: {
    'plane': {
      handler: function() {
        if (this.plane != null) {
          this.$emit("dataToModelViewer", [ 'plane', this.plane ]);
        }
      }
    },
  },

  updated() {
    this.plane = this.planeProp;
  },

};

</script>

<style scoped></style>