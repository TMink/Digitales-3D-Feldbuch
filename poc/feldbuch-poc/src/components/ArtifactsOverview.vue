<template>
    <div id="wrapper">
        <Navigation/>
        <v-form>
                <v-subheader v-if="artifacts.length === 0"> Bisher wurden dem Projekt keine Funde
                    hinzugefügt</v-subheader>
                <v-subheader v-else>Zugehörige Funde</v-subheader> 
                <v-list>
                    <template v-for="(artifact, i) in artifacts">
                        <v-list-item v-on:click="modifyArtifact(artifact.id)">
                            <v-list-item-content>
                                <v-list-item-title> {{ artifact.title }} </v-list-item-title>
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
                url: '/artifacts',
                responseType: 'json'
            })
            .then(function (response) {
                for (let item of response.data) {
                    context.artifacts.push(item);
                }
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
            artifacts: []
        };
    }

}

</script>

<style scoped>
    #wrapper {
        height: 100%;
    }
</style>
