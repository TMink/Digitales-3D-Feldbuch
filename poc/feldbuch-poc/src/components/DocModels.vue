<template>
    <div>
        <v-data-table :headers="headers" :items="models_list" v-model="selected_model" item-key="id" show-select
            hide-default-footer>
            <template v-slot:item.model="{ item }">
                <div class="p-2">
                    <v-img :src="item.model" :alt="item.name" :width="100"></v-img>
                </div>
            </template>
        </v-data-table>
        <v-btn color="primary" @click="models_overlay = true"> Hinzufügen </v-btn>
        <v-btn color="secondary" v-on:click="remove_model"> Entfernen </v-btn>

        <v-dialog v-model="models_overlay" max-width="800" persistent>
            <v-card>
                <v-card-title>Modell hinzufügen </v-card-title>
                <v-card-text>
                    <v-text-field label="Titel" hint="Geben sie hier einen Titel für das Bild ein"
                        v-model="new_model.title"></v-text-field>
                    <v-file-input
                            chips 
                            show-size
                            accept=".obj"  
                            label="Upload the model .obj-file here" 
                            v-model="new_model.model"></v-file-input>
                    <v-file-input
                            chips 
                            show-size 
                            accept="image/png, image/jpeg" 
                            prepend-icon="mdi-camera" 
                            label="Upload the texture-file here" 
                            v-model="new_model.texture"></v-file-input>
                    <v-textarea v-model="new_model.description" label="Beschreibung"
                        hint="Geben sie hier eine kurze Beschreibung des Bildes an"></v-textarea>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn v-on:click="add_model" color="secondary"> Hinzufügen </v-btn>
                    <v-btn color="primary" @click="models_overlay = false"> Abbrechen </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>

import axios from 'axios';
import ConnectionToOfflineDB from '../ConnectionToOfflineDB';

export default {
    name: "DocModels",
    data: function () {
        return {
            headers: [
                { text: 'Model', value: 'model' },
                { text: 'Title', value: 'title' },
                { text: 'Beschreibung', value: 'description' },

            ],
            models_list: [],
            selected_model: [],
            new_model: { title: '', description: '', model: [] },
            models_overlay: false
        }
    },
    props: {
        modelslist: Array
    },
    created: function () {
        this.get_doc();
    },
    methods: {
        get_doc: function () {
            var context = this;
            if (context.modelslist == undefined || context.modelslist.length == 0) {
                console.log("No models added to excavation")
                return;
            }

            axios({
                method: "get",
                url: "/models/list/" + context.modelslist.toString(),
                responseType: "json"
            })
                .then(function (res) {
                    res.data.forEach(item => {
                        var model = {
                            id: item.id,
                            title: item.title,
                            description: item.description,
                            model: item.model
                        }
                        context.models_list.push(model);
                    });
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        remove_model: function () {
            var context = this;
            context.selected_model.forEach(item => {
                for (var i = 0; i < context.models_list.length; i++) {

                    if (context.models_list[i].id === item.id) {
                        context.models_list.splice(i, 1);
                        var index = context.modelslist.indexOf(item.id);
                        context.modelslist.splice(index, 1)
                    }
                }
            });
        },
        add_model: function () {
            this.models_overlay = false
            const context = this;

            //post request of edited/new excavation
            axios({
                method: "post",
                url: '/models',
                data: {
                    title: context.new_model.title,
                    description: context.new_model.description
                }
            })
            .then((res) => {
                this.upload_modelOBJ(res.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        upload_modelOBJ: function(createdModel_id) {

            const context = this;
            axios({
                method: "post",
                url: '/models/upload/' + createdModel_id,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    model: context.new_model.model,
                    texture: context.new_model.texture
                }
            })
                .then(function (response) {
                    var newModelObject = {
                        id: createdModel_id,
                        title: context.new_model.title,
                        description: context.new_model.description,
                        model: URL.createObjectURL(context.new_model.model),
                        texture: URL.createObjectURL(context.new_model.texture)
                    }

                    console.log(response);
                    context.models_list.push(newModelObject);
                    //add the new model.id to the excavation models list
                    context.$emit('addModel', createdModel_id);
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        upload_modelTexture: function (createdModel_id) {

            axios({
                method: "post",
                url: '/models/upload/' + createdModel_id,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                data: {
                    upload: context.new_model.model
                }
            })
                .then(function (response) {
                    var newModelObject = {
                        id: createdModel_id,
                        title: context.new_model.title,
                        description: context.new_model.description,
                        model: URL.createObjectURL(context.new_model.model),
                        texture: URL.createObjectURL(context.new_model.texture)
                    }
                    context.models_list.push(newModelObject);
                    //add the new model.id to the excavation models list
                    context.$emit('addModel', createdModel_id);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
}
</script>

<style scoped></style>
