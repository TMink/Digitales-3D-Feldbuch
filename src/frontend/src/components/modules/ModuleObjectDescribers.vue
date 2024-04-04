<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 04.04.2024 14:34:43
 * Modified By: Julian Hardtung
 * 
 * Description: `object descriptors` input module for positions
 -->

<template>
  <!-- CARD 3 COUNT -->
    <v-card class="mb-4 mr-2 pb-4 px-4">
      <v-row no-gutters class="pt-2">
        <h2 class="text-h6 font-weight-medium pt-2">
          {{ $t('objectDescribers') }}
        </h2>
        
        <v-spacer></v-spacer>

        <!-- HIDE/SHOW MODULE BUTTON -->
        <v-btn flat icon v-on:click="object.modulePreset.objectDescribers = !object.modulePreset.objectDescribers">
          <v-icon v-if="object.modulePreset.objectDescribers">mdi-eye-outline</v-icon>
          <v-icon v-else>mdi-eye-off-outline</v-icon>
        </v-btn>
      </v-row>

      <v-divider></v-divider>
      
      <v-row v-if="object.modulePreset.objectDescribers" no-gutters style="padding-top:37px" >
        <v-col cols="3">

          <v-text-field 
          color="primary" 
          hide-details
          class="pr-3 pb-2"
          :label="$t('count')"  
          v-model="object.count"
          @keypress="filterAllNonNumeric(event)" 
          :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
        </v-text-field>
      </v-col>
      <v-divider vertical class="mt-n3"/>
      <v-col cols="3">

        <v-text-field
        color="primary" 
        :label="$t('weight')" 
        hide-details
        class="px-3 pb-2"
        v-model="object.weight"
        @keypress="filterNonNumeric(event)" 
        :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
      </v-text-field>
    </v-col>
    <v-divider vertical class="mt-n3"/>
    <v-col cols="6">

      <v-combobox
        color="primary"
        :label="$t('material')"
        :items="materialItemsSecondProp"
        hide-details
        class="pl-3 pb-2"
        v-model="object.material"
        :hint="$tc('please_input', 2, { msg: 'Material' })">
      </v-combobox>
    </v-col>
      </v-row>
      <v-row v-else no-gutters style="padding-top:6px"></v-row>
    </v-card>
</template>

<script>

export default {

  props: {
    objectProp: Object,
    materialItemsSecondProp: Array,
  },

  emits: ['dataToModuleViewer'],

  data() {
    return {
      object: {
        material: null,
        weight: null,
        count: null,
      },
      materialItems: [],
    }
  },

  watch: {
    objectProp: function(objectPropData) {
      this.object = objectPropData;
    },
    materialItemsSecondProp: function(materials) {
      var lvrMaterials = JSON.parse(import.meta.env.VITE_MATERIALS);
      this.materialItems = lvrMaterials.concat(materials);
    },
    "object.material": {
      handler: function () {
        if (this.object.material != null) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['material', this.object.material]);
        }
      }
    },
    "object.weight": {
      handler: function () {
        if (this.object.weight != null) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['weight', this.object.weight]);
        }
      }
    },
    "object.count": {
      handler: function () {
        if (this.object.count != null) {
          /* Send data back to ModuleViewer.vue */
          this.$emit("dataToModuleViewer", ['count', this.object.count]);
        }
      }
    },
    "object.modulePreset.objectDescribers": {
        handler: function() {
          if ( this.object.modulePreset.objectDescribers != null) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'modulePreset.objectDescribers', this.object.modulePreset.objectDescribers ]);
          }
        }
      }
  },

  async created() {
    this.object = this.objectProp;
    this.showModule = this.objectProp.modulePreset.findTypes;
  },

  methods: {
    /**
     * Prevents the input of non numeric values 
     * @param {*} evt 
     */
    filterAllNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    /**
     * Prevents the input of non numeric values 
     * (allows one single `,` or `.` for float values)
     * @param {*} evt 
     */
    filterNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
  }

}

</script>
  
<style scoped></style>
  