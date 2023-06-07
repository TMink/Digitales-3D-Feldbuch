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
                <v-subheader v-if="artifacts.length === 0 && loading===false"> Bisher wurden dem Projekt keine Funde
                    hinzugefügt</v-subheader>
                <v-list>
                    <template v-for="(artifact, i) in artifacts">
                        <v-list-item v-on:click="modifyArtifact(artifact._id)">
                            <v-list-item-content>
                                <v-list-item-title> {{ "Fund Nr. " + artifact.number }} </v-list-item-title>
                                <v-list-item-subtitle> {{ artifact.description }} </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider v-if="i !== artifacts.length - 1"></v-divider>
                    </template>
                </v-list>
                <v-btn v-on:click="modifyArtifact('new')" color="primary"> Fund hinzufügen</v-btn>
        </v-form>
    </div>
    
</template>

<script>
import axios from 'axios';
import VueCookies from 'vue-cookies';
import Navigation from './Navigation.vue'


export default {
    name: 'ArtifactsOverview',
    components: {
        Navigation
    },
    
    methods: {
        getArtifacts() {
            var context = this;

            axios({
                method: 'get',
                url: '/artifacts/section_id/' + VueCookies.get('currentSection'),
                responseType: 'json'
            })
            .then(function (response) {
                for (let item of response.data) {
                    context.artifacts.push(item);
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
        modifyArtifact(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('currentArtifact', item_id)
            }
            this.$router.push({ name: 'ArtifactCreation', params: { artifact_id: item_id } })
        }
    },
    created() {
        this.getArtifacts()
    },
    data() {
        return {
            artifacts: [],
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
