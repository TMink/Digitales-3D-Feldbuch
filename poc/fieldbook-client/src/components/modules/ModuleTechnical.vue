<template>
  <v-col 
    lg="12" >
    <v-card >
      <v-row>
        <v-col>
          <v-card-text>
            <h2 class="text-h6 font-weight-medium">
              {{ $t('technical') }}
            </h2>
          </v-card-text>

        </v-col>
        <v-col lg="3">
          <v-text-field 
            no-resize color="primary" 
            :hide-no-data="false" 
            :label="$t('date')"
            v-model="object.date">
          </v-text-field>

        </v-col>
      </v-row>
      <v-row>
      <v-col>
        <v-textarea 
          rows="19" 
          counter 
          color="primary" 
          v-model="object.technical">
        </v-textarea>
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