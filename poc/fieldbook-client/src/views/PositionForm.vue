<template>
    <v-container fluid>
        <v-row>
            <v-col cols="2">
                <v-card rounded="0">
                    <v-tabs v-model="tab" direction="vertical" color="secondary">
                        <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
                        <v-tab value="two" rounded="0"> {{ $tc('picture', 2) }} </v-tab>
                        <v-tab value="three" rounded="0"> {{ $t('additional', { msg: $t('parameter') }) }} </v-tab>
                        <v-btn rounded="0" v-on:click="savePosition()" color="secondary">
                            {{ $t('save') }}
                        </v-btn>
                        <v-btn rounded="0" color="primary" v-on:click="confirmDeletion()">
                            {{ $t('delete') }}
                        </v-btn>
                        <v-btn rounded="0" v-on:click="goBack" color="primary">
                            {{ $t('cancel') }}
                        </v-btn>
                        <ConfirmDialog ref="confirm" />
                    </v-tabs>

                </v-card>
            </v-col>

            <v-col>
                <v-window v-model="tab">
                    <v-window-item value="one">
                        <v-card>
                            <v-form ref="form">
                                <v-text-field 
                                    :rules="is_required" 
                                    v-model="position.date" 
                                    :label="$t('dating')"
                                    hint="Format: dd.mm.yyyy">
                                </v-text-field>
                                <v-text-field 
                                    :rules="is_required" 
                                    v-model="position.description" 
                                    :label="$t('description')"
                                    :hint="$tc('please_input', 2, { msg: $t('description') })">
                                </v-text-field>
                            </v-form>
                        </v-card>
                    </v-window-item>

                    <v-window-item value="two">
                        <v-list-subheader v-if="position.images.length === 0">
                            {{ $t('not_created_yet', { object: $tc('picture', 2) }) }}
                        </v-list-subheader>
                        <template v-for="(image, i) in position.images" :key="image">
                            <v-list>
                                <v-list-item>
                                    <v-file-input 
                                        v-model="image.data" 
                                        accept="image/tiff, image/jpeg" 
                                        label="Bilddatei">
                                    </v-file-input>
                                    <v-btn 
                                        color="primary" 
                                        class="ml-2" 
                                        v-on:click="position.images.splice(i, 1)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-item>
                            </v-list>
                        </template>
                        <v-btn color="primary" v-on:click="addImage()">
                            {{ $t('add', { msg: $t('image') }) }}
                        </v-btn>
                    </v-window-item>


                    <v-window-item value="three">
                        <v-list-subheader v-if="position.texts.length === 0">
                            {{ $t('not_created_yet', { object: $t('additional', { msg: $tc('parameter', 2) }) }) }}
                        </v-list-subheader>
                        <template v-for="(text, i) in position.texts" :key="text">
                            <v-list>
                                <v-list-item>
                                    <v-textarea 
                                        v-model="text.content" 
                                        label="Textfeld"
                                        :hint="$tc('please_input', 2, { msg: $t('description') })">
                                    </v-textarea>
                                    <v-btn 
                                        color="primary" 
                                        class="ml-2" 
                                        v-on:click="position.texts.splice(i, 1)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </v-list-item>
                            </v-list>
                        </template>
                        <v-btn color="primary" v-on:click="addText()">
                            {{ $t('add', { msg: $t('text') }) }}
                        </v-btn>
                    </v-window-item>
                </v-window>
            </v-col>
        </v-row>
    </v-container>
    <v-alert
        closable
        type="error" 
        density="compact" 
        variant="outlined"
        v-model="error_dialog">
        {{ error_message }}
    </v-alert>
</template>
  
<script>
/**
 * Methods overview:
 *  updatePosition  - Updates existing presentation of the position
 *  updateImage     - Updates existing presentation of image
 *  updateText      - Updates existing presentation of text
 *  savePosition    - Saves the current processing status
 *  confirmDeletion - Opens the confirmation dialog
 *  deletePosition  - Deletes the currently selected position
 *  addImage        - Adds a new image to the list
 *  addText         - Adds a new text to the list
 *  goBack          - Goes back to PlaceForm
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue';

export default {
    name: 'PositionCreation',
    components: {
        ConfirmDialog
    },
    /**
     * Reactive Vue.js data
     */
    data() {
        return {
            position: {
                id: '',
                placeID: '',
                positionNumber: '',
                date: '',
                description: '',
                images: [],
                texts: []
            },
            images: null,
            texts: null,
            error_dialog: false,
            error_message: '',
            is_new: true,
            is_required: [v => !!v || 'Pflichtfeld'],
            dialog: false,
            tab: null
        }
    },
    /**
     * Initialize data from localDB to the reactive Vue.js data
     */
    async created() {
        await fromOfflineDB.syncLocalDBs();
        await this.updatePosition();
        await this.updateImages();
        await this.updateTexts();
    },
    methods: {
        /**
         * Update reactive Vue.js place data
         */
        async updatePosition() {
            /* Get id of selected place */
            const currentPosition = VueCookies.get("currentPosition")

            /* Get all data of selected place */
            if (this.$route.params.positionID != 'new') {
                const data = await fromOfflineDB.getObject(
                                    currentPosition, 'Positions', 'positions');
                this.position = data
            }
        },
        /**
         * Update reactive Vue.js positions data
         */
        async updateImages() {
            this.images = await fromOfflineDB.getAllObjectsWithID(
                            this.position.id, 'Position', 'Images', 'images');
        },
        /**
         * Update reactive Vue.js models data
         */
        async updateTexts() {
            this.texts = await fromOfflineDB.getAllObjectsWithID(
                            this.position.id, 'Position', 'Texts', 'positions');
        },
        /**
         * Save a Position to local storage for the current place
         */
        async savePosition() {
            if (!this.$refs.form.validate()) {
                this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
                this.error_dialog = true;
                return;
            }
            //convert from vue proxy to JSON object
            const inputPosition = JSON.parse(JSON.stringify(this.position));
            inputPosition.lastChanged = Date.now();

            await fromOfflineDB.updateObject(inputPosition, 'Positions', 'positions')
            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation", params:  { placeID: this.position.placeID } });
        },
        /**
         * Opens the confirmation dialog
         */
        async confirmDeletion() {
            if (
                await this.$refs.confirm.open(
                    "Confirm",
                    "Are you sure you want to delete the position " + this.position.positionNumber + "?"
                )
            ) {
                this.deletePosition();
            }
        },
        /**
         * Removes a position from the local storage and the cookies
         */
        deletePosition: async function () {

            // Remove the positionID from connected place
            const placeID = String(VueCookies.get('currentPlace'))
            var place = await fromOfflineDB.getObject(placeID, 'Places', 'places')
            var index = place.positions.indexOf(this.position.id.toString())

            place.positions.splice(index, 1)
            await fromOfflineDB.updateObject(place, 'Places', 'places');

            // Delete the position itself
            await fromOfflineDB.deleteObject(this.position, 'Positions', 'positions')
            VueCookies.remove('currentPosition');

            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation" });
        },
        /**
         * Adds a new image-placeholder to the images-array
         */
        addImage: function () {
            this.position.images.push({
                data: ''
            });
        },
        /**
         * Adds a new text-placeholder to the texts-array
         */
        addText: function () {
            this.position.texts.push({
                content: ''
            });
        },
        /**
         * Cancels the PositionForm and returns to the PlaceForm of current place
         */
        goBack: function () {
            const currentPlace = VueCookies.get("currentPlace");
            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation", params: { placeID: this.position.placeID } });
        },
    }
};
</script>
  
<style scoped></style>
  