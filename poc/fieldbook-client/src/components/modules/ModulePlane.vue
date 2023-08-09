<template>
  <v-col lg="6">
    <v-card class="pa-4" height="12em">
        <v-textarea 
            rows="4" 
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

  created() {
    this.plane = this.planeProp;
  },

};

</script>

<style scoped></style>