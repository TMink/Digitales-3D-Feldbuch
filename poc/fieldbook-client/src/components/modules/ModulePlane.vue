<template>
  <v-col lg="6">
    <v-card class="pa-4">
      <h2 class="text-h6 font-weight-medium pb-1">
        {{ $t('plane') }}
      </h2>
      <v-divider></v-divider>
      <v-textarea 
        rows="2"
        counter 
        class="pt-1 mt-5"
        hide-details
        color="primary" 
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

  emits: ['dataToModuleViewer'],

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
          this.$emit("dataToModuleViewer", [ 'plane', this.plane ]);
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