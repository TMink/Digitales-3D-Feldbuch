<template>
    <div>
        <v-data-table 
            :headers="colors_headers" 
            :items="colors_list" 
            v-model="selected_color" 
            item-key="id" 
            show-select
            :single-select="true" 
            hide-default-footer> </v-data-table>
        <v-btn v-on:click="colors_overlay = true" color="secondary"> Hinzufügen</v-btn>
        <v-btn v-on:click="remove_color" color="primary"> Entfernen </v-btn>

        <v-dialog v-model="colors_overlay" max-width="600" persistent>
            <v-card>
                <v-card-title> Farben bearbeiten</v-card-title>
                <v-card-text>
                    <v-color-picker v-model="new_color.color" class="justify-center" mode="rgba"></v-color-picker>
                    <v-text-field v-model="new_color.title" label="Bezeichnung"> </v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-on:click="add_color" color="secondary">Bestätigen</v-btn>
                    <v-btn @click="colors_overlay = false" color="primary">Abbrechen</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "DocColors",
    data: function () {
        return {
            colors_headers: [
                { text: 'Bezeichnung', value: 'title' },
                { text: 'HEXA', value: 'hexa' },
            ],
            colors_list: [],
            selected_color: [],
            new_color: { title: '', hexa: '', rgba: '', edit: false },
            colors_overlay: false
        }
    },
    props: {
        colorslist: Array
    },
    created: function() {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.colorslist == undefined) {
                console.log("No colors added to excavation")
                return;
            }

            axios({
                method: "get",
                url: "/colors/" + context.colorslist.toString(),
                responseType: "json"
            })
                .then(function (res) {
                    res.data.forEach(item => {
                        console.log(item)
                        var color = {
                            id: item.id,
                            title: item.title,
                            hexa: item.hexa,
                            rgba_r: item.rgba_r,
                            rgba_g: item.rgba_g,
                            rgba_b: item.rgba_b,
                            rgba_a: item.rgba_a
                        }
                        context.colors_list.push(color);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        add_color: function () {
            this.colors_overlay = false
            var context = this;
            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/colors',
                data: {
                    title: context.new_color.title,
                    hexa: context.new_color.color.hexa,
                    rgba_r: context.new_color.color.rgba.r,
                    rgba_g: context.new_color.color.rgba.g,
                    rgba_b: context.new_color.color.rgba.b,
                    rgba_a: context.new_color.color.rgba.a
                }
            })
            .then(function (res) {
                var newColorObject = {
                    id: res.data,
                    title: context.new_color.title,
                    hexa: context.new_color.color.hexa,
                    rgba_r: context.new_color.color.rgba.r,
                    rgba_g: context.new_color.color.rgba.g,
                    rgba_b: context.new_color.color.rgba.b,
                    rgba_a: context.new_color.color.rgba.a,
                }
                context.colors_list.push(newColorObject);
                //add the new color.id to the colors list
                context.$emit('addColor', res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        remove_color: function () {
            console.log(this.selected_color)
            var context = this;
            context.selected_color.forEach(item => {
                for (var i = 0; i < context.colors_list.length; i++) {

                    if (context.colors_list[i].id === item.id) {
                        context.colors_list.splice(i, 1);
                        var index = context.colorslist.indexOf(item.id);
                        context.colorslist.splice(index, 1)
                    }
                }
            });
        },
    }
}
</script>

<style scoped></style>
