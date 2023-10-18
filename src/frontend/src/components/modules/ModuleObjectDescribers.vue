<template>
  <!-- CARD 3 COUNT -->
  <v-col cols="6">
    <v-card class="pa-4">
      <h2 class="text-h6 font-weight-medium pl-3 pb-1">
        {{ $t('objectDescribers') }}
      </h2>
      <v-divider class="ml-3"></v-divider>
      <v-row style="padding-top: 58px;">
          <v-text-field 
            color="primary" 
            hide-details
            class="pl-6 pr-3 pb-3"
            :label="$t('count')"  
            v-model="object.count"
            @keypress="filterAllNonNumeric(event)" 
            :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
          </v-text-field>
        <v-divider vertical class="mt-n3"/>
          <v-text-field
            color="primary" 
            :label="$t('weight')" 
            hide-details
            class="px-3 pb-3"
            v-model="object.weight"
            @keypress="filterNonNumeric(event)" 
            :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
          </v-text-field>
      </v-row>
    </v-card>
  </v-col>

  <!-- CARD 5 MATERIAL -->
  <v-col cols="6">
      <v-card class="pa-4">
        <h2 class="text-h6 font-weight-medium pb-1">
          {{ $t('material') }}
        </h2>
        <v-divider class="mr-3 pb-4"/>
        <v-combobox
            color="primary"
            :label="$t('material')"
            :items="materialItemsSecondProp"
            hide-details
            class="pr-3"
            style="padding-top: 29px;"
            v-model="object.material"
            :hint="$tc('please_input', 2, { msg: 'Material' })">
        </v-combobox>

        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              {{ $t('noResults') }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </v-card>
  </v-col>
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
    }
  },

  watch: {
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
          this.$emit("dataToModuleViewerrr", ['count', this.object.count]);
        }
      }
    }
  },

  async created() {
    //this.materials = JSON.parse(import.meta.env.VITE_MATERIALS);
    this.object = this.objectProp;
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
  