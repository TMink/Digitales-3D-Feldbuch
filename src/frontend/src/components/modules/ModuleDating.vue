<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 08.12.2023 14:21:59
 * Modified By: Julian Hardtung
 * 
 * Description: `dating` input module for places/positions
 -->

<template>
	<v-col lg="6">
		<v-card class="pa-4">
			<h2 class="text-h6 font-weight-medium pb-1">
				{{ $t('dating') }}
			</h2>
			<v-divider></v-divider>
			<v-combobox 
				hide-details 
				counter 
				color="primary" 
				style="padding-top: 46px" 
				:items="datingItemsSecondProp"
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
		</v-card>
	</v-col>
</template>

<script>

export default {
	props: {
		datingProp: String,
		datingItemsSecondProp: Array,
	},

	emits: ['dataToModuleViewer'],

	data() {
		return {
			datings: null,
			dating: null,
			pathNames: null,

		}
	},

	watch: {
		"dating": {
			handler: function () {
				if (this.dating != null) {
					/* Send data back to ModuleViewer.vue */
					this.$emit("dataToModuleViewer", ['dating', this.dating]);
				}
			}
		}
	},

	async created() {
		//this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
		this.dating = this.datingProp;
	},

}

</script>