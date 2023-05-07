<template>
    <div>
        <v-data-table 
        :headers="headers" 
        :items="dates_list" 
        v-model="selected_date" 
        item-key="id" 
        show-select
        hide-default-footer> </v-data-table>
        <v-btn color="primary" @click="dates_overlay = true"> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_date"> Entfernen </v-btn>
        <v-dialog v-model="dates_overlay" max-width="800" persistent>
            <v-card>
                <v-card-title>Datum hinzufügen </v-card-title>
                <v-card-text>
                    <v-date-picker v-model="new_date.date" :show-current="true" :full-width="true"></v-date-picker>
                    <v-text-field label="Titel" hint="Geben sie hier einen Titel für das Datum ein"
                        v-model="new_date.title"></v-text-field>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn v-on:click="add_date" color="secondary"> Hinzufügen </v-btn>
                    <v-btn color="primary" @click="dates_overlay = false"> Abbrechen </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "DocDates",
    data: function () {
        return {
            headers: [
                {
                    text: 'Title',
                    align: 'start',
                    sortable: false,
                    value: 'title',
                },
                { text: 'Date', value: 'date' },
                { text: 'ID', value: 'id' }

            ],
            dates_list: [],
            selected_date: [],
            new_date: { date_id: '', title: '', date: '' },
            dates_overlay: false
        }
    },
    props: {
        dateslist: Array
    },
    created: function() {
        this.get_doc();
    },
    methods: {
        get_doc: function() {
            var context = this;
            if (context.dateslist == undefined || context.dateslist.length == 0) {
                console.log("No dates added to excavation")
                return;
            }

            axios({
                method: "get",
                url: "/dates/" + context.dateslist.toString(),
                responseType: "json"
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var date = {
                        id: item.id,
                        title: item.title,
                        date: new Date(item.date._nanoseconds)
                    } 
                    context.dates_list.push(date);
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        remove_date: function () {
            var context = this;
            context.selected_date.forEach(item => {
                for(var i=0; i<context.dates_list.length; i++) {

                    if (context.dates_list[i].id === item.id) {
                        context.dates_list.splice(i, 1);
                        var index = context.dateslist.indexOf(item.id);
                        context.dateslist.splice(index, 1)
                    }
                }
            });
        },
        add_date: function () {
            this.dates_overlay = false
            var context = this;
            var myDate = context.new_date.date.split("-");
            var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/dates',
                data: {
                    title: context.new_date.title,
                    date: context.new_date.date,
                }
            })
            .then(function (res) {
                var newDateObject = {
                    id: res.data,
                    title: context.new_date.title,
                    date: newDate
                }
                context.dates_list.push(newDateObject);
                //add the new date.id to the excavation dates list
                context.$emit('addDate', res.data);
            })
            .catch(function (error) {
                console.log(error);
            });

        }
    }
}
</script>

<style scoped></style>
