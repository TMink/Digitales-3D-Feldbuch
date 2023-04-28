<template>
    <div>
        <v-data-table :headers="headers" 
            :items="sections_list" 
            v-model="selected_section" 
            hide-default-footer> </v-data-table>
    <!--<v-btn color="primary" v-on:click='add_section()'> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_section"> Entfernen </v-btn> -->
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "DocSections",
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
            sections_list: [],
            selected_section: [],
        }
    },
    props: {
        sectionslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.sectionslist == undefined) {
                console.log("No sections added to project")
                return;
            }

            axios({
                method: 'get',
                url: '/sections/list/' + context.sectionslist.toString(),
                responseType: 'json'
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var section = {
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
                    context.sections_list.push(section);
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
