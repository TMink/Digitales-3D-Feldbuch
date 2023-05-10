<template>
    <div>
        <v-data-table :headers="headers" :items="images_list" v-model="selected_image" item-key="id" show-select
            hide-default-footer>
            <template v-slot:item.image="{ item }">
                <div class="p-2">
                  <v-img :src="item.image" :alt="item.name" :width="100"></v-img>
                </div>
            </template>
        </v-data-table>
        <v-btn color="primary" @click="images_overlay = true"> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_image"> Entfernen </v-btn>

        <v-dialog v-model="images_overlay" max-width="800" persistent>
            <v-card>
                <v-card-title>Bild hinzufügen </v-card-title>
                <v-card-text>
                    <v-text-field label="Titel" hint="Geben sie hier einen Titel für das Bild ein"
                        v-model="new_image.title"></v-text-field>
                    <v-file-input v-model="new_image.image"></v-file-input>
                    <v-textarea v-model="new_image.description" label="Beschreibung"
                            hint="Geben sie hier eine kurze Beschreibung des Bildes an"></v-textarea>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn v-on:click="add_image" color="secondary"> Hinzufügen </v-btn>
                    <v-btn color="primary" @click="images_overlay = false"> Abbrechen </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "DocImages",
    data: function () {
        return {
            headers: [
                { text: 'Image', value: 'image' },
                { text: 'Title', value: 'title'},                
                { text: 'Beschreibung', value: 'description'},

            ],
            images_list: [],
            selected_image: [],
            new_image: { title: '', description: '', image: [] },
            images_overlay: false
        }
    },
    props: {
        imageslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.imageslist == undefined || context.imageslist.length == 0) {
                console.log("No images added to excavation")
                return;
            }

            axios({
                method: "get",
                url: "/images/list/" + context.imageslist.toString(),
                responseType: "json"
            })
            .then(function (res) {
                res.data.forEach(item => {
                    var image = {
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        image: item.image
                    }
                    context.images_list.push(image);
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        remove_image: function () {
            var context = this;
            context.selected_image.forEach(item => {
                for (var i = 0; i < context.images_list.length; i++) {

                    if (context.images_list[i].id === item.id) {
                        context.images_list.splice(i, 1);
                        var index = context.imageslist.indexOf(item.id);
                        context.imageslist.splice(index, 1)
                    }
                }
            });
        },
        add_image: function () {
            this.images_overlay = false
            var context = this;

            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/images',
                data: {
                    title: context.new_image.title,
                    description: context.new_image.description
                }
            })
            .then(function (res) {
                axios({
                    method: "post",
                    url: '/images/upload/' + res.data,
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    },
                    data: {
                        upload: context.new_image.image
                    }
                })
                .then(function (response) {
                    var newImageObject = {
                        id: res.data,
                        title: context.new_image.title,
                        description: context.new_image.description,
                        image: URL.createObjectURL(context.new_image.image)
                    }
                    context.images_list.push(newImageObject);
                    //add the new image.id to the excavation images list
                    context.$emit('addImage', res.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
            })
            .catch(function (error) {
                console.log(error);
            });



        }
    }
}
</script>

<style scoped></style>
