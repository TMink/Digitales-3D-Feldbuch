<template>
    <div>
        <v-data-table :headers="headers" 
            :items="artifacts_list" 
            v-model="selected_artifact" 
            hide-default-footer> </v-data-table>
    <!--<v-btn color="primary" v-on:click='add_artifact()'> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_artifact"> Entfernen </v-btn> -->
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
                { text: 'Typ', value: 'type' },
                { text: 'Beschreibung', value: 'description' },

            ],
            artifacts_list: [],
            selected_artifact: [],
        }
    },
    props: {
        artifactslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.artifactslist == undefined) {
                console.log("No artifacts added to project")
                return;
            }

            axios({
                method: 'get',
                url: '/artifacts/list/' + context.artifactslist.toString(),
                responseType: 'json'
            })
            .then(function (res) {
                res.data.forEach(item => {

                    var artifact = {
                        id: item.id,
                        number: item.number,
                        description: item.description,
                        state: item.state,
                        inscriptions: item.inscriptions,
                        producer: item.producer,
                        literature: item.literature,
                        material: item.material,
                        type: item.type
                }
                    context.artifacts_list.push(artifact);
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
