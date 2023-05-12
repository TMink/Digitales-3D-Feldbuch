<template>
    <div>
        <v-data-table 
            :headers="utm_headers" 
            :items="utmPoints_list" 
            v-model="selected_utmPoint" 
            item-key="id"
            show-select
            hide-default-footer> </v-data-table>
        <v-btn v-on:click="utms_overlay = true" color="secondary"> Hinzufügen</v-btn>
        <v-btn v-on:click="remove_utmPoint" color="primary"> Entfernen </v-btn>

        <v-dialog v-model="utms_overlay" max-width="600" persistent>
            <v-card>
                <v-text-field v-model="new_utm.id" label="Tachymeter ID *"
                hint="Geben sie hier die Tachymeter ID ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
                <v-text-field v-model="new_utm.title" label="Name *"
                    hint="Geben sie hier den Namen des Messpunktes an *(Pflichtfeld)" :rules="is_required"></v-text-field>
                <v-text-field v-model="new_utm.description" label="Kommentar *" hint="Geben Sie einen Kommentar an"
                :rules="is_required"></v-text-field>
                <v-text-field v-model="new_utm.eastvalue" label="Ostwert" hint="Geben sie den Ostwert an"></v-text-field>
                <v-text-field v-model="new_utm.northvalue" label="Nordwert" hint="Geben sie hier den Nordwert an"></v-text-field>
                <v-text-field v-model="new_utm.heightvalue" label="Höhenwert" hint="Geben sie hier den Höhenwert an"></v-text-field>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="add_utmPoint" color="secondary">Bestätigen</v-btn>
                    <v-btn @click="utms_overlay = false" color="primary">Abbrechen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "DocMeasuringPoints",
    data: function () {
        return {
            utm_headers: [
                { text: 'Tachymeter ID', value: 'title' },
                { text: 'Beschreibung', value: 'description' },
            ],
            utmPoints_list: [],
            selected_utmPoint: [],
            new_utm: { title: '', hexa: '', rgba: '', edit: false },
            utms_overlay: false,

            is_required: [v => !!v || 'Pflichtfeld'],
        }
    },
    props: {
        utmPoints: Array
    },
    created: function() {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.utmPoints == undefined || context.utmPoints.length == 0) {
                console.log("No UTM measuring points added to artifact")
                return;
            }

            axios({
                method: "get",
                url: "/utmPoints/" + context.utmPoints.toString(),
                responseType: "json"
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var utmPoint = {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        eastvalue: item.eastvalue,
                        northvalue: item.northvalue,
                        heightvalue: item.heightvalue
                    }
                    context.utmPoints_list.push(utmPoint);
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        add_utmPoint: function () {
            this.utms_overlay = false
            var context = this;
            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/utmPoints',
                data: {
                    title: context.new_utm.title,
                    description: context.new_utm.description,
                    eastvalue: context.new_utm.eastvalue,
                    northvalue: context.new_utm.northvalue,
                    heightvalue: context.new_utm.heightvalue
                }
            })
            .then(function (res) {
                var newUTMObject = {
                    id: res.data,
                    title: context.new_utm.title,
                    description: context.new_utm.description,
                    eastvalue: context.new_utm.eastvalue,
                    northvalue: context.new_utm.northvalue,
                    heightvalue: context.new_utm.heightvalue
                }
                context.utmPoints_list.push(newUTMObject);
                //add the new utmPoint.id to the utmPoints list
                context.$emit('addUtmPoint', res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        remove_utmPoint: function () {
            var context = this;
            context.selected_utmPoint.forEach(item => {
                for (var i = 0; i < context.utmPoints_list.length; i++) {

                    if (context.utmPoints_list[i].id === item.id) {
                        context.utmPoints_list.splice(i, 1);
                        var index = context.utmPoints.indexOf(item.id);
                        context.utmPoints.splice(index, 1)
                    }
                }
            });
        },
    }
}
</script>

<style scoped></style>
