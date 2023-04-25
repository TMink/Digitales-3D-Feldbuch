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
            <v-list>
                <v-list-item class="mt-5" v-if="current_excavation.id !== undefined" v-on:click="modifyExcavation(current_excavation.id)">
                      <v-chip>
                        Derzeit ausgewählt
                      </v-chip>      
                      <v-list-item-content>
                          <v-list-item-title> {{ current_excavation.title }} </v-list-item-title>
                          <v-list-item-subtitle>  {{ current_excavation.description }} </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-chip variant="elevated">
                        Derzeit ausgewählt
                      </v-chip>
                </v-list-item>
                <v-divider></v-divider>
                <v-subheader v-if="excavations.length === 0 && loading===false"> Bisher wurden dem Projekt keine Grabungen
                    hinzugefügt</v-subheader>
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
                        //if the excavation id is saved in cookies => mark is as current excavation
                        if (VueCookies.get('currentExcavation') === item.id.trim()) {
                            context.current_excavation = item;
                        } else {
                            context.excavations.push(item)
                        }
                    }
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
            current_excavation: {},
            new_excavation: false,
            project_id: '',
            loading: true
        }
    }
}

</script>

<style scoped>
    #wrapper {
        height: 100%;
    }
</style>
