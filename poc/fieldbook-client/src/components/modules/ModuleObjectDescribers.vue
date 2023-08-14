<template>
  <v-row>
    <!-- CARD 3 COUNT -->
    <v-col lg="3">
      <v-card height="100%">
        <v-text-field 
          color="primary" 
          :label="$t('count')" 
          class="ma-1 px-2 pt-2" 
          v-model="object.count"
          @keypress="filterAllNonNumeric(event)" 
          :hint="$tc('please_input', 2, { msg: 'Anzahl' })">
        </v-text-field>
      </v-card>
    </v-col>

    <!-- CARD 4 WEIGHT -->
    <v-col lg="3">
      <v-card>
        <v-text-field 
          color="primary"
          :label="$t('weight')" 
          class="ma-1 px-2 pt-2" 
          v-model="object.weight"
          @keypress="filterNonNumeric(event)" 
          :hint="$tc('please_input', 2, { msg: 'Gewicht' })">
        </v-text-field>
      </v-card>
    </v-col>

    <!-- CARD 5 MATERIAL -->
    <v-col lg="6">
      <v-card>
        <v-combobox 
          hide-selected 
          color="primary" 
          :items="materialItemsSecondProp"
          persistent-hint
          :label="$t('material') + ' *'"
          class="ma-1 px-2 pt-2"
          :hint="$tc('please_input', 2, { msg: 'Material' })"
          v-model="object.material">

          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-title>
                {{ $t('noResults') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-combobox>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>

export default {
		
		props: {
			objectProp: Object,
      materialsProp: Array,
		},

    emits: ['dataToModelViewer'],

		data () {
			return {
        object: {
          material: null,
          weight: null,
          count: null,
        },
        materials: null,
			}
		},

    watch: {
      "object.material": {
        handler: function() {
          if ( this.object.material != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'material', this.object.material ]);
          }
        }
      },
      "object.weight": {
        handler: function() {
          if ( this.object.weight != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'weight', this.object.weight ]);
          }
        }
      },
      "object.count": {
        handler: function() {
          if ( this.object.count != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'count', this.object.count ]);
          }
        }
      },
      "materials": {
        handler: function() {
          if ( this.materials != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'materials', this.materials ]);
          }
        }
      }
    },

		async created() {
			this.materials = JSON.parse(import.meta.env.VITE_MATERIALS);
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
  
<style scoped>
</style>
  