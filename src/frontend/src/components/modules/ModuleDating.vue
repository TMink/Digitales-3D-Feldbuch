<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 22.10.2024 12:39:26
 * Modified By: Julian Hardtung
 * 
 * Description: `dating` input module for places/positions
 -->

<template>
		<v-card class="mb-2 mr-2 pb-2 px-4">
      <v-row no-gutters class="pt-2">
        <h2 class="text-h6 font-weight-medium pt-2">
          {{ $t('dating') }}
        </h2>
        
        <v-spacer></v-spacer>

        <!-- HIDE/SHOW MODULE BUTTON -->
        <v-btn variant="flat" icon v-on:click="showModule = !showModule">
          <v-icon v-if="showModule">mdi-eye-outline</v-icon>
          <v-icon v-else>mdi-eye-off-outline</v-icon>
        </v-btn>
      </v-row>

			<v-divider></v-divider>

			<v-combobox 
        v-if="showModule"
				persistent-hint
        :hint="getDatingHint()" 
        :rules="datingRules"
				color="primary"
        hide-selected
        class="pt-3"
				:items="filledDatingsList"
				:label="$t('dating') + ' *'"  
				v-model="dating">
				<template v-slot:no-data>
					<v-list-item>
						<v-list-item-title>
							{{ $t('noResults') }}
						</v-list-item-title>
					</v-list-item>
				</template>
			</v-combobox>
      <v-row v-else no-gutters style="padding-top:6px"></v-row>
		</v-card>
</template>

<script>
import { toRaw } from 'vue'

export default {
	props: {
		datingProp: String,
		datingItemsSecondProp: Array,
    showModuleProp: Boolean,
	},

	emits: ['dataToModuleViewer'],

  setup(props) {
    var propRaw = toRaw(props);
    
    var lvrDatings = JSON.parse(import.meta.env.VITE_DATINGS_FULL);
    var filledDatingsList = lvrDatings.concat(propRaw.datingItemsSecondProp);
    
    var datingRef = '';
    var foundDating = filledDatingsList.filter(function(item) {
      return item.title === propRaw.datingProp;
    });
    datingRef = foundDating[0]
    
    return {
      filledDatingsList,
      datingRef
    }

  },

	data() {
		return {
      datCode: '',
			dating: '',
			pathNames: null,
      showModule: true,

      datingRules: [
        /* value => {
          if (value != null) return true
          return this.$t('isMandatory', {msg: this.$t('dating')})
        } */
      ]
		}
	},

	watch: {
		"dating": {
			handler: function () {
				if (this.dating != null) {
					this.$emit("dataToModuleViewer", ['dating', this.dating]);
				}
			}
		},
    'showModule': {
      handler: function() {
        if (this.showModule != null) {
          this.$emit("dataToModuleViewer", [ 'modulePreset.dating', this.showModule ]);
        }
      }
    },
	},

  mounted() {
    this.dating = this.datingRef;
  },

  methods: {
    getDatingHint() {
      if (this.dating != undefined) {
        return this.$t('from') + ': ' + this.dating.start + ' ' + this.$t('to') + ': ' + this.dating.end;
      }
      return;
    },
  }
}

</script>