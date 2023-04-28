<template>
    <div>
        <v-data-table :headers="headers" 
            :items="excavations_list" 
            v-model="selected_excavation" 
            hide-default-footer> </v-data-table>
    <!--<v-btn color="primary" v-on:click='add_excavation()'> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_excavation"> Entfernen </v-btn> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "DocExcavations",
    data: function () {
        return {
            headers: [
                {
                    text: 'Title',
                    align: 'start',
                    sortable: true,
                    value: 'title',
                },
                { text: 'Beschreibung', value: 'description' },
                { text: 'Ort', value: 'location' },

            ],
            excavations_list: [],
            selected_excavation: [],
        }
    },
    props: {
        excavationslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.excavationslist == undefined) {
                console.log("No excavations added to project")
                return;
            }

            axios({
                method: 'get',
                url: '/excavations/list/' + context.excavationslist.toString(),
                responseType: 'json'
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var excavation = {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        client: item.client,
                        focus: item.focus,
                        length: item.length,
                        location: item.location,
                        organization: item.organization,
                        dates: item.dates
                }
                    context.excavations_list.push(excavation);
                });
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
        }
    }
}
</script>

<style scoped></style>
