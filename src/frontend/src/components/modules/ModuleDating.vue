<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 04.04.2024 14:02:07
 * Modified By: Julian Hardtung
 * 
 * Description: `dating` input module for places/positions
 -->

<template>
		<v-card class="mb-4 mr-2 pb-4 px-4">
      <v-row no-gutters class="pt-2">
        <h2 class="text-h6 font-weight-medium pt-2">
          {{ $t('dating') }}
        </h2>
        
        <v-spacer></v-spacer>

        <!-- HIDE/SHOW MODULE BUTTON -->
        <v-btn flat icon v-on:click="showModule = !showModule">
          <v-icon v-if="showModule">mdi-eye-outline</v-icon>
          <v-icon v-else>mdi-eye-off-outline</v-icon>
        </v-btn>
      </v-row>

			<v-divider></v-divider>

			<v-combobox 
        v-if="showModule"
				hide-details 
				counter 
				color="primary" 
				style="padding-top: 45px" 
				:items="datings"
				:label="$t('dating')" 
				:hide-no-data="false" 
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

export default {
	props: {
		datingProp: String,
		datingItemsSecondProp: Array,
    showModuleProp: Boolean,
	},

	emits: ['dataToModuleViewer'],

	data() {
		return {
			datings: [],
			dating: null,
			pathNames: null,
      showModule: true,
		}
	},

	watch: {
    showModuleProp: function(showModuleBool) {
      this.showModule = showModuleBool;
    },
    datingProp: function(datingPropData) {
        this.dating = datingPropData;
    },
    datingItemsSecondProp: function(datings) {
      var lvrDatings = JSON.parse(import.meta.env.VITE_DATINGS);
      this.datings = lvrDatings.concat(datings);
    },
		"dating": {
			handler: function () {
				if (this.dating != null) {
					/* Send data back to ModuleViewer.vue */
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

	async created() {
		//this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
		this.dating = this.datingProp;
    this.showModule = this.showModuleProp;
	},

}

</script>