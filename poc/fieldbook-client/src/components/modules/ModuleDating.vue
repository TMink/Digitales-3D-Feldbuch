<template>
	<v-card class="pa-2">
		<v-combobox hide-details counter class="pt-0" color="primary" :items="datings" :label="$t('dating')" v-model="dating">
		</v-combobox>
	</v-card>
</template>

<script>

	export default {
		
		props: {
			datingProp: String,
		},

    emits: ['dataToModelViewer'],

		data () {
			return {
				datings: [],
				dating: null,
        pathNames: null,

			}
		},

    watch: {
      "dating": {
        handler: function() {
          if ( this.dating != null ) {
            /* Send data back to ModelViewer.vue */
            this.$emit("dataToModelViewer", [ 'dating', this.dating ]);
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