<template>
	<v-col lg="6" class="pt-0 pl-0 pr-0">
		<v-card class="pa-4">
		<v-card-text>
          <h2 class="text-h6 font-weight-medium pb-2">
            {{ $t('dating') }}
          </h2>
        </v-card-text>
			<v-combobox
            hide-selected
            color="primary" 
            persistent-hint
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

	emits: ['dataToModelViewer'],

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
					/* Send data back to ModelViewer.vue */
					this.$emit("dataToModelViewer", ['dating', this.dating]);
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