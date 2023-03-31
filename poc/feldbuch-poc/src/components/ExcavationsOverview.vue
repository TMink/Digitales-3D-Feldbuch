<template>
    <v-form>
        <div>
            <!-- <v-subheader v-if="excavations.length === 0"> Bisher wurden dem Projekt keine Grabungen
                hinzugefügt</v-subheader>
            <v-subheader v-else>Zugehörige Grabungen</v-subheader> 
            TODO: check if loaded excavations are part of the currently active project -->
            <v-list>
                <template v-for="(excavation, i) in excavations">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title> {{ excavation.value.name }} </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                </template>
            </v-list>
            <v-btn color="secondary"> Grabung hinzufügen</v-btn>
        </div>
    </v-form>
</template>

<script>
import axios from 'axios';


export default {
    name: 'ExcavationsOverview',
    methods: {
        getExcavations: function () {
            var context = this;

            axios({
                method: 'get',
                url: 'http://127.0.0.1:3000/excavations',
                responseType: 'json'
            })
            .then(function (response) {
                console.log(response.data.rows)
                for (let item of response.data.rows) {
                    //TODO: check if the loaded excavations are part of the currently active project
                    //if (item.value.project_id === context.project_id) 
                    context.excavations.push(item)
                }
            })
            .catch(error => {
                if (!error.response) {
                    this.errorStatus = 'Error: Network Error';
                } else {
                    this.errorStatus = error.response.data.message;
                }
            });
        }
    },
    beforeMount() {
        //this.project_id = this.$route.params.project_id
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

<style scoped></style>
