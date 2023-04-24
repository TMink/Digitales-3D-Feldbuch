<template>
    <div id="wrapper">
        <Navigation/>

        <v-form>
            <div>
                <v-subheader v-if="excavations.length === 0"> Bisher wurden dem Projekt keine Grabungen
                    hinzugefügt</v-subheader>
                <v-subheader v-else>Zugehörige Grabungen</v-subheader> 
                <v-list>
                    <template v-for="(excavation, i) in excavations">
                        <v-list-item v-on:click="modifyExcavation(excavation.id)">
                            <v-list-item-content>
                                <v-list-item-title> {{ excavation.title }} </v-list-item-title>
                                <v-list-item-subtitle> {{ excavation.description }} </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                        <v-divider></v-divider>
                    </template>
                </v-list>
                <v-btn v-on:click="modifyExcavation('new')" color="secondary"> Grabung hinzufügen</v-btn>
            </div>
        </v-form>
    </div>
    
</template>

<script>
import Navigation from './Navigation.vue'
import axios from 'axios';
import VueCookies from 'vue-cookies';



export default {
    name: 'ExcavationsOverview',
    components: {
        Navigation
    },
    created() {
        var context = this;
        context.project_id = VueCookies.get('currentProject');
    },
    methods: {
        getExcavations() {
            var context = this;

            axios({
                method: 'get',
                url: '/excavations',
                responseType: 'json'
            })
            .then(function (response) {
                for (let item of response.data) {
                    
                    if (context.project_id === item.project_id.trim()) {
                        context.excavations.push(item)
                        
                    }
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
        modifyExcavation(item_id) {
            if (item_id !== 'new') {
                VueCookies.set('currentExcavation', item_id)
            }
            this.$router.push({ name: 'ExcavationCreation', params: { excavation_id: item_id } })
        }
    },
    beforeMount() {
        this.getExcavations()
    },
    data: function () {
        return {
            excavations: [],
            new_excavation: false,
            project_id: ''
        }
    }

}

</script>

<style scoped>
    #wrapper {
        height: 100%;
    }
</style>
