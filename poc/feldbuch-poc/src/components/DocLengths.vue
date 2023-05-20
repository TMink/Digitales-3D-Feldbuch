<template>
    <div>
        <v-data-table
            :headers="length_headers"
            :items="lengths_list"
            v-model="selected_length"
            item-key="id"
            show-select
            hide-default-footer> </v-data-table>
        <v-btn v-on:click="lengths_overlay = true" color="secondary"> Hinzufügen</v-btn>
        <v-btn v-on:click="remove_length" color="primary"> Entfernen </v-btn>

        <v-dialog v-model="lengths_overlay" max-width="600" persistent>
            <v-card>
              <v-textarea v-model="new_length.designation" label="Dimension"
              hint="Geben sie hier die die Beschreibung der Dimension an"></v-textarea>
              <v-text-field v-model="new_length.accuracy" label="Genauigkeit"
              hint="Geben Sie hier die Genauigkeit an"></v-text-field>
              <v-text-field v-model="new_length.from" label="Von" hint="Geben sie das Minimum des Messwertes an"></v-text-field>
              <v-text-field v-model="new_length.to" label="Bis" hint="Geben sie das Maximum des Messwertesn an"></v-text-field>
              <v-text-field v-model="new_length.unit" label="Einheit"
              hint="Geben sie hier die gemessene Einheit an"></v-text-field>
              <v-card-actions>
                 <v-spacer></v-spacer>
                 <v-btn v-on:click="add_length" color="secondary">Bestätigen</v-btn>
                 <v-btn @click="lengths_overlay = false" color="primary">Abbrechen</v-btn>
              </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "DocLengths",
    data: function () {
        return {
            length_headers: [
                { text: 'Beschreibung', value: 'designation' },
                { text: 'Genauigkeit', value: 'accuracy' },
                { text: 'Von', value: 'from' },
                { text: 'Bis', value: 'to' },
                { text: 'Einheit', value: 'unit' },
            ],
            lengths_list: [],
            selected_length: [],
            new_length: {
              designation: '',
              accuracy: '',
              from: '',
              to: '',
              unit: ''},
            lengths_overlay: false,

            is_required: [v => !!v || 'Pflichtfeld'],
        }
    },
    props: {
        lengths: Array
    },
    created: function() {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.lengths == undefined || context.lengths.length == 0) {
                console.log("No lengths added to artifact")
                return;
            }

            axios({
                method: "get",
                url: "/lengths/" + context.lengths.toString(),
                responseType: "json"
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var length = {
                        id: item.id,
                        designation: item.designation,
                        accuracy: item.accuracy,
                        from: item.from,
                        to: item.to,
                        unit: item.unit
                    }
                    context.lengths_list.push(length);
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        add_length: function () {
            this.lengths_overlay = false
            var context = this;
            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/lengths',
                data: {
                    designation: context.new_length.designation,
                    accuracy: context.new_length.accuracy,
                    from: context.new_length.from,
                    to: context.new_length.to,
                    unit: context.new_length.unit
                }
            })
            .then(function (res) {
                var newLengthObject = {
                    id: res.data,
                    designation: context.new_length.designation,
                    accuracy: context.new_length.accuracy,
                    from: context.new_length.from,
                    to: context.new_length.to,
                    unit: context.new_length.unit
                }
                context.lengths_list.push(newLengthObject);
                //add the new length.id to the lengths list
                context.$emit('addLength', res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        remove_length: function () {
            var context = this;
            context.selected_length.forEach(item => {
                for (var i = 0; i < context.lengths_list.length; i++) {

                    if (context.lengths_list[i].id === item.id) {
                        context.lengths_list.splice(i, 1);
                        var index = context.lengths.indexOf(item.id);
                        context.lengths.splice(index, 1)
                    }
                }
            });
        },
    }
}
</script>

<style scoped></style>
