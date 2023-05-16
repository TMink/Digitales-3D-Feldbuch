<template>
    <div>
        <v-data-table :headers="headers" 
            :items="features_list" 
            v-model="selected_feature" 
            hide-default-footer> </v-data-table>
    <!--<v-btn color="primary" v-on:click='add_feature()'> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_feature"> Entfernen </v-btn> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "DocArtifacts",
    data: function () {
        return {
            headers: [
                {
                    text: 'Nr.',
                    align: 'start',
                    sortable: true,
                    value: 'number',
                },
                { text: 'Titel', value: 'title' },
                { text: 'Beschreibung', value: 'description' },

            ],
            features_list: [],
            selected_feature: [],
        }
    },
    props: {
        featureslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.featureslist == undefined || context.featureslist.length == 0) {
                console.log("No features added to project")
                return;
            }

            axios({
                method: 'get',
                url: '/features/list/' + context.featureslist.toString(),
                responseType: 'json'
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var feature = {
                        id: item.id,
                        number: item.number,
                        title: item.title,
                        description: item.description,
                        type_id: item.type_id,
                }
                    context.features_list.push(feature);
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
        },
    }
}
</script>

<style scoped></style>
