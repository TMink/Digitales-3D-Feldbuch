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
              v-model="technical"
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
      technicalProp: String,
    },
  
    emits: ['dataToModelViewer'],
  
    /**
     * Reactive Vue.js data
     */
    data() {
      return {
        technical: null,
      }
    },
  
    watch: {
      'technical': {
        handler: function() {
          if (this.technical != null) {
            this.$emit("dataToModelViewer", [ 'technical', this.technical ]);
          }
        }
      },
    },
  
    created() {
      this.technical = this.technical;
    },
  
  };
  
  </script>
  
  <style scoped></style>