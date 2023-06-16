<template>
    <v-container fluid>
        <v-row>
          <v-col cols="2">
            <v-card rounded="0">
              <v-tabs v-model="tab" direction="vertical" color="primary" >
                <v-tab value="one" rounded="0"> {{ $t('general')}} </v-tab>
                <v-tab value="two" rounded="0"> {{ $tc('picture', 2)}} </v-tab>
                <v-tab value="three" rounded="0"> {{ $t('additional', {msg: $t('parameter')}) }} </v-tab>
                <v-btn 
                    rounded="0" 
                    v-on:click="savePosition()" 
                    color="edit"> 
                    {{ $t('save') }} 
                </v-btn>
                <v-btn 
                    rounded="0" 
                    color="decline" 
                    v-on:click="confirmDeletion()"> 
                    {{ $t('delete') }} 
                </v-btn>
                <v-btn 
                    rounded="0" 
                    v-on:click="goBack" 
                    color="cancel"> 
                    {{ $t('cancel')}}
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

            <!-- Tab item 'images' -->
            <v-window-item value="two">
                <v-list>
                  <v-list-subheader v-if="images.length === 0">
                    {{ $t('not_created_yet', { object: $tc('model', 2) }) }}
                  </v-list-subheader>

                  <template v-for="(image, i) in images" :key="image">
                    <v-card class="imageItem mt-3 d-flex align-center" >
                        <v-card-title>Nr. {{ image.imageNumber }}</v-card-title>
                        <v-card-subtitle>{{ image.title }}</v-card-subtitle>
                        <v-img height="150" :src=image.image></v-img>
                        <v-btn 
                            color="decline" 
                            class="ml-2"
                            v-on:click="deleteImage(image)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </v-card>

                    <v-divider v-if="i !== image.length - 1"></v-divider>
                  </template>
                </v-list>

                <v-btn
                  color="add"
                  class="mr-16 mt-3"
                  @click="images_overlay = true">
                  <v-icon>mdi-plus-box-multiple</v-icon>
                </v-btn>

                <!-- Image Creation dialog -->
                <v-dialog v-model="images_overlay" max-width="800" persistent>
                  <v-card>
                    <v-card-title>{{ $t('add', { msg: $t('image') }) }} </v-card-title>
                    <v-card-text>

                      <v-text-field
                        disabled
                        v-model="position.id"
                        :label="$t('position_id')">
                      </v-text-field>

                      <v-text-field
                        v-model="image.title" 
                        :label="$t('title')" 
                        :hint="$t('please_input', { msg: $t('title_of', {msg: $t('image')}) })">
                      </v-text-field>

                      <v-file-input
                        show-size
                        v-model="image.image"
                        prepend-icon="mdi-camera" 
                        accept="image/png, image/jpeg, image/bmp">
                      </v-file-input>
                    </v-card-text>

                    <v-card-actions class="justify-center">
                      <v-btn
                        icon 
                        color="edit" 
                        v-on:click="addImage()">
                        <v-icon>mdi-content-save-all</v-icon>
                      </v-btn>
                      <v-btn 
                        icon 
                        color="decline" 
                        @click="images_overlay = false">
                        <v-icon>mdi-close-circle</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-window-item>


              <v-window-item value="three">
                <v-list-subheader v-if="position.texts.length === 0">
                        {{ $t('not_created_yet', { object: $t('additional', {msg: $tc('parameter', 2)}) }) }}
                    </v-list-subheader>
                    <template v-for="(text, i) in position.texts" :key="text">
                        <v-list>
                            <v-list-item>
                                <v-textarea 
                                    v-model="text.content" 
                                    :hint="$tc('please_input', 2, {msg: $t('description')} )"
                                    :label="$t('textfield')">
                                </v-textarea>
                                <v-btn 
                                    color="decline" 
                                    class="ml-2"
                                    v-on:click="position.texts.splice(i, 1)">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </v-list-item>
                        </v-list>
                    </template>
                    <v-btn 
                        color="add" 
                        v-on:click="addText()">
                       <v-icon>mdi-plus-box-multiple</v-icon>
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
import { toRaw } from 'vue';

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
            image: {
                id: '',
                positionID: '',
                title: '',
                image: [],
            },
            images: [],
            texts: [],
            error_dialog: false,
            error_message: '',
            is_new: true,
            is_required: [v => !!v || 'Pflichtfeld'],
            dialog: false,
            tab: null,
            images_overlay: false,
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
        async deletePosition() {

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
        async addImage() {
            // Add imageID to the position array of all images
            const positionID = String(VueCookies.get('currentPosition'))
            var newImageID = String(Date.now())
            var position = await fromOfflineDB.getObject(positionID, 'Positions', 'positions')

            position.images.push(newImageID)
            position.lastChanged = Date.now()

            const newImage = {
                id: newImageID,
                imageNumber: null,
                positionID: this.position.id,
                title: this.image.title,
                image: await this.textureToBase64(toRaw(this.image.image)),
                lastChanged: Date.now(),
                lastSync: ''
            };

            if (this.images.length == 0) {
                newImage.imageNumber = 1;
            } else {
                this.updateImages();
                const imageNumber = Math.max(...this.images.map(o => o.imageNumber));
                const newImageNumber = imageNumber + 1;
                newImage.imageNumber = newImageNumber;
            }

            this.images_overlay = false;
            await fromOfflineDB.updateObject(position, 'Positions', 'positions')
            var posID = await fromOfflineDB.addObject(newImage, "Images", "images");
            await fromOfflineDB.addObject({ id: posID, object: 'images' }, 'Changes', 'created');
            await this.updateImages(newImage.id);
        },
        async deleteImage(image) {
            // Remove the imageID from connected position
            var index = this.position.images.indexOf(image.id.toString())

            this.position.images.splice(index, 1)
            await fromOfflineDB.updateObject(toRaw(this.position), 'Positions', 'positions');

            // Delete the image itself
            await fromOfflineDB.deleteObject(image, 'Images', 'images');
            VueCookies.remove('currentImage');

            await this.updateImages();
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
         * Change texture data to base64
         * @param {*} rawData 
         */
        async textureToBase64(rawData) {

            const output = await new Promise((resolve) => {

                let reader = new FileReader();
                let f = rawData[0];
                reader.onload = e => {
                    const b64 = e.target.result
                    resolve(b64)
                }

                reader.readAsDataURL(f);

            });
            return output;

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
  