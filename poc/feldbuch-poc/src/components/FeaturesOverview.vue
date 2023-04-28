<template>
    <div id="wrapper">
        <Navigation/>
        <div class="ma-10" v-if="loading === true">
              <v-progress-circular d-flex 
                    color="primary" 
                    :active="loading"          
                    :indeterminate="loading" 
                    :size="86"
                    :width="8">
                </v-progress-circular>
            </div>  
        <v-form>
                <v-subheader v-if="features.length === 0 && loading==false"> Bisher wurden dem Projekt keine Befunde
                    hinzugefügt</v-subheader>
                <v-list>
                    <template v-for="(feature, i) in features">
                        <v-list-item v-on:click="modifyFeature(feature.id)">
                            <v-list-item-content>
                                <v-list-item-title> {{ feature.title }} </v-list-item-title>
                                <v-list-item-subtitle> {{ feature.description }} </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider v-if="i !== features.length - 1"></v-divider>
                    </template>
                </v-list>
                <v-btn v-on:click="modifyFeature('new')" color="primary"> Befund hinzufügen</v-btn>
        </v-form>
    </div>
    
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import Navigation from './Navigation.vue'


export default {
    name: 'FeaturesOverview',
    components: {
        Navigation
    },
    //created() {
    //    var context = this;
    //    context.project_id = VueCookies.get('currentFeatures');
    //},
    methods: {
        getFeatures() {
            var context = this;

            axios({
                method: 'get',
                url: '/features',
                responseType: 'json'
            })
            .then(function (response) {
                for (let item of response.data) {
                    context.features.push(item);
                }
                //hide the loading circle
                context.loading = false;
            })
            .catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        },
        modifyFeature(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('currentFeature', item_id)
            }
            this.$router.push({ name: 'FeatureCreation', params: { feature_id: item_id } })
        }
    },
    created() {
        this.getFeatures()
    },
    data() {
        return {
            features: [],
            loading: true
        };
    }

}

</script>

<style scoped>
    #wrapper {
        height: 100%;
    }
</style>
