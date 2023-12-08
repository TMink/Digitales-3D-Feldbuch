<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 08.12.2023 14:23:39
 * Modified By: Julian Hardtung
 * 
 * Description: input module for technical places
 -->

<template>
  <v-col cols="12" >
    <v-card class="pa-4">
      <v-row class="align-center pb-2">
        <v-col cols="2">
          <h2 class="text-h6 font-weight-medium">
            {{ $t('technical') }}
          </h2>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="2">
          <v-text-field 
            hide-details
            color="primary" 
            :hide-no-data="false" 
            :label="$t('date')"
            v-model="object.date">
          </v-text-field>
        </v-col>
      </v-row>
      <v-divider/>
      <v-row class="pt-4">
      <v-col>
        <v-textarea 
          rows="22" 
          hide-details 
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
  
    emits: ['dataToModuleViewer'],

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
            this.$emit("dataToModuleViewer", [ 'date', this.object.date ]);
          }
        }
      },
      'object.technical': {
        handler: function() {
          if (this.object.technical != null) {
            this.$emit("dataToModuleViewer", [ 'technical', this.object.technical ]);
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