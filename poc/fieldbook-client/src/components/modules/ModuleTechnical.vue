<template>
    <v-col class="pt-0 pl-0 pr-0">
      <v-card class="pa-2">
        <v-card-text>
          <h2 class="text-h6 font-weight-medium">
            {{ $t('Technische Daten') }}
          </h2>
        </v-card-text>
        <v-col>
          <v-text-field
            class="ma-1 px-2 pt-2"
            no-resize color="primary" 
            :hide-no-data="false"
            :label="$t('date')"
            v-model="object.date">
          </v-text-field>
          </v-col>
          <v-col>
            <v-textarea 
              rows="19" 
              counter 
              color="primary"
              class="ma-1 px-2 pt-2"
              v-model="object.technical">
           </v-textarea>
        </v-col>
      </v-card>
    </v-col>
</template>
  
<script>
  export default {
  
    props: {
      objectProp: Object,
    },
  
    emits: ['dataToModelViewer'],

    data() {
      return {
        object: {
          date: null,
          technical: null,
        }
      }
    },
  
    watch: {
      'object.date': {
        handler: function() {
          if (this.object.date != null) {
            this.$emit("dataToModelViewer", [ 'date', this.object.date ]);
          }
        }
      },
      'object.technical': {
        handler: function() {
          if (this.object.technical != null) {
            this.$emit("dataToModelViewer", [ 'technical', this.object.technical ]);
          }
        }
      },
    },
  
    created() {
      this.object = this.objectProp;
    },
  
  };
  </script>
  
  <style scoped></style>