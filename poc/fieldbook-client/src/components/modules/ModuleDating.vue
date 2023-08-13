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
        style="padding-top:46px"
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
		this.dating = this.datingProp;
	},

}

</script>