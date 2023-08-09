<template>
	<v-col lg="6" class="pt-0 pl-0 pr-0">
		<v-card class="pa-4">
		<v-card-text>
          <h2 class="text-h6 font-weight-medium pb-2">
            {{ $t('dating') }}
          </h2>
        </v-card-text>
			<v-combobox 
				hide-details 
				counter 
				class="pt-0" 
				color="primary" 
				:items="datings" 
				:label="$t('dating')"
				v-model="dating">
			</v-combobox>
		</v-card>
	</v-col>
</template>

<script>

export default {
	props: {
		datingProp: String,
	},

	emits: ['dataToModelViewer'],

	data() {
		return {
			datings: [],
			dating: null,
			pathNames: null,

		}
	},

	watch: {
		"dating": {
			handler: function () {
				if (this.dating != null) {
					/* Send data back to ModelViewer.vue */
					this.$emit("dataToModelViewer", ['dating', this.dating]);
				}
			}
		}
	},

	async created() {
		this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
	},

	updated() {
		this.dating = this.datingProp;
	},

}

</script>