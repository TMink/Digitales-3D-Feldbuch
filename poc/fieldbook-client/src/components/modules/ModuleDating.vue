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
            console.log("Hey")
            this.$emit("dataToModelViewer", [ 'dating', this.dating ]);
          }
        }
      }
    },

		async created() {
			this.datings = JSON.parse(import.meta.env.VITE_DATINGS);
		},
    
		mounted() {
      this.dating = this.datingProp;
      this.updatePlace();
		},
    
    methods: {
      async updatePlace() {
        console.log("Test")
      },

    }
		
	}

</script>