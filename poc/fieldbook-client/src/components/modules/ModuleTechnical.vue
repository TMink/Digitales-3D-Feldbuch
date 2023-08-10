<template>
    <v-col class="pt-0 pl-0 pr-0">
      <v-card class="pa-2">
        <v-card-text>
          <h2 class="text-h6 font-weight-medium">
            {{ $t('Technische Daten') }}
          </h2>
        </v-card-text>
          <v-textarea 
              rows="19" 
              counter 
              color="primary" 
              class="ma-1 px-2 pt-2" 
              v-model="technical">
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
      this.technical = this.technicalProp;
    },
  
  };
  
  </script>
  
  <style scoped></style>