<template>
	<v-col lg="6">
		<!-- CARD 3 DATINGS -->
		<v-card class="pa-4">
			<v-combobox counter class="pt-4" color="primary" :items="datings" :label="$t('dating')" v-model="dating">
			</v-combobox>
		</v-card>
	</v-col>
</template>

<script>

	export default {
		
		props: {
			dating_prop: String,
		},

		data () {
			return {
				datings: [],
				dating: null,
			}
		},

		watch: {
			'dating': {
				handler: function() { 
					this.$emit("dating");
				}
			}
		},

		async created() {
			this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
			dating = dating_prop;

			await this.updatePlace();
		},

		mounted: {
			/**
     	* Update reactive Vue.js place data
     	*/
		 	async updatePlace() {
     	 	const currentPlace = VueCookies.get('currentPlace');
     	 	const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
     	 	this.place = data;
    	},
		}
		
	}

</script>