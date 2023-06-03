<template>

    <v-container fluid>
        <v-row>
          <v-col cols="2">
            <v-card rounded="0">
              <v-tabs v-model="tab" direction="vertical" color="secondary" >
                <v-tab value="one" rounded="0"> Allgemein </v-tab>
                <v-tab value="two" rounded="0"> Bilder </v-tab>
                <v-tab value="three" rounded="0"> Zusätzliche Angaben </v-tab>
                <v-btn rounded="0" v-on:click="savePosition()" color="secondary"> Speichern </v-btn>
                <v-dialog
            v-model="dialog"
            persistent
            width="auto"
          >
            <template v-slot:activator="{ props }">
              <v-btn rounded="0" color="primary" v-bind="props"> Löschen </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">
                 Position Löschen!
              </v-card-title>
              <v-card-text>Wollen Sie die Position "{{ position.positionNumber }}" wirklich löschen?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  v-on:click="deletePosition()"
                  @click="dialog = false">
                  Ja
                </v-btn>
                <v-btn
                  color="primary"
                  variant="outlined"
                  @click="dialog = false">
                  Nein
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
            <v-btn rounded="0" v-on:click="goBack" color="primary"> 
              Abbrechen
            </v-btn>
              </v-tabs>

            </v-card>
            </v-col>

                <v-col>
                  <v-window v-model="tab">
              <v-window-item value="one">
                <v-card>
                  <v-form ref="form">
                    <v-text-field v-model="position.date" label="Datierung" hint="Format: dd.mm.yyyy"
                            :rules="is_required"></v-text-field>
                    <v-text-field v-model="position.description" label="Beschreibung"
                            hint="Geben Sie hier eine Beschreibung an:" :rules="is_required"></v-text-field>
                  </v-form>
                </v-card>
              </v-window-item>

              <v-window-item value="two">
                <v-list-subheader v-if="position.images.length === 0">
                        Bisher wurden bisher keine Bilder hinzufügt.
                    </v-list-subheader>
                    <template v-for="(image, i) in position.images" :key="image">
                        <v-list>
                            <v-list-item>
                                <v-file-input v-model="image.data" accept="image/tiff, image/jpeg"
                                    label="Bilddatei"></v-file-input>
                                <v-btn color="primary" class="ml-2"
                                    v-on:click="position.images.splice(i, 1)"><v-icon>mdi-delete</v-icon></v-btn>
                            </v-list-item>
                        </v-list>
                    </template>
                    <v-btn color="primary" v-on:click="addImage()">Add Image</v-btn>
              </v-window-item>


              <v-window-item value="three">
                <v--list-subheader v-if="position.texts.length === 0">
                        Bisher wurde keine zusätzlichen Parameter hinzufügt.
                    </v--list-subheader>
                    <template v-for="(text, i) in position.texts" :key="text">
                        <v-list>
                            <v-list-item>
                                <v-textarea v-model="text.content" hint="Geben Sie hier ihre neue Beschreibung ein"
                                    label="Textfeld"></v-textarea>
                                <v-btn color="primary" class="ml-2"
                                    v-on:click="position.texts.splice(i, 1)"><v-icon>mdi-delete</v-icon></v-btn>
                            </v-list-item>
                        </v-list>
                    </template>
                    <v-btn color="primary" v-on:click="addText()">Add Text</v-btn>
              </v-window-item>
            </v-window>
          </v-col>
        </v-row>
      </v-container>
    <!-- <v-form ref="form">

        <v-tabs direction="vertical" color="secondary">
            <v-tab> Allgemein </v-tab>
            <v-tab> Bilder </v-tab>
            <v-tab> Zusätzliche Angaben </v-tab>

            <v-tab-item class="px-4">
                <v-text-field v-model="position.date" label="Datierung" hint="Format: dd.mm.yyyy"
                    :rules="is_required"></v-text-field>
                <v-text-field v-model="position.description" label="Beschreibung"
                    hint="Geben Sie hier eine Beschreibung an:" :rules="is_required"></v-text-field>
            </v-tab-item>

            <v-tab-item>
                <v-list-subheader v-if="position.images.length === 0">
                    Bisher wurden bisher keine Bilder hinzufügt.
                </v-list-subheader>
                <template v-for="(image, i) in position.images" :key="image">
                    <v-list>
                        <v-list-item>
                            <v-file-input v-model="image.data" accept="image/tiff, image/jpeg"
                                label="Bilddatei"></v-file-input>
                            <v-btn color="primary" class="ml-2"
                                v-on:click="position.images.splice(i, 1)"><v-icon>mdi-delete</v-icon></v-btn>
                        </v-list-item>
                    </v-list>
                </template>
                <v-btn color="primary" v-on:click="addImage()">Add Image</v-btn>
            </v-tab-item>

            <v-tab-item>
                <v--list-subheader v-if="position.texts.length === 0">
                    Bisher wurde keine zusätzlichen Parameter hinzufügt.
                </v--list-subheader>
                <template v-for="(text, i) in position.texts" :key="text">
                    <v-list>
                        <v-list-item>
                            <v-textarea v-model="text.content" hint="Geben Sie hier ihre neue Beschreibung ein"
                                label="Textfeld"></v-textarea>
                            <v-btn color="primary" class="ml-2"
                                v-on:click="position.texts.splice(i, 1)"><v-icon>mdi-delete</v-icon></v-btn>
                        </v-list-item>
                    </v-list>
                </template>
                <v-btn color="primary" v-on:click="addText()">Add Text</v-btn>
            </v-tab-item>

            <v-btn v-on:click="savePlace()" color="secondary" class="py-6"> Speichern </v-btn>
            <v-dialog v-model="dialog" max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" class="py-6" v-bind="attrs" v-on="on">
                        Delete
                    </v-btn>
                </template>
                <v-card>
                    <v-card-title class="text-h5">
                        Do you really want to delete the position: <br> "{{ position.id }}"?
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" v-on:click="deletePlace()" @click="dialog = false">
                            Yes
                        </v-btn>
                        <v-btn color="primary" @click="dialog = false">
                            No
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-btn v-on:click="goBack" color="primary" class="py-6"> Cancel</v-btn>

        </v-tabs>
        <v-alert v-model="error_dialog" type="error" density="compact" variant="outlined" closable>
            {{ error_message }}
        </v-alert>
    </v-form> -->
</template>
  
<script>
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
    name: 'PositionCreation',
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
            error_dialog: false,
            error_message: '',
            is_new: true,
            is_required: [v => !!v || 'Pflichtfeld'],
            dialog: false,
            tab: null
        }

    },
    async created() {

        await fromOfflineDB.syncLocalDBs();
        await this.updateData();

    },
    methods: {
        /* Update existing data */
        async updateData() {

            /* Get id of selected place */
            const currentPosition = VueCookies.get("currentPosition")

            /* Get all data of selected place */
            if (this.$route.params.positionID != 'new') {
                const data = await fromOfflineDB.getObject(currentPosition, 'Positions', 'positions');
                this.position = data.result
            }

        },
        savePosition: async function () {

            if (!this.$refs.form.validate()) {
                this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
                this.error_dialog = true;
                return;
            }

            //convert from vue proxy to JSON object
            const inputPosition = JSON.parse(JSON.stringify(this.position))

            await fromOfflineDB.deleteObject(inputPosition.id, 'Positions', 'positions')
            await fromOfflineDB.addObject(inputPosition, 'Positions', 'positions')
            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation", params:  { placeID: this.position.placeID } });

        },
        /* Delete the selected position */
        deletePosition: async function () {

            await fromOfflineDB.deleteObject(this.position.id, 'Positions', 'positions')
            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation" });

        },
        /* Go back to PlacesOverview */
        goBack: function () {
            const currentPlace = VueCookies.get("currentPlace");
            this.$emit("view", "Stellenbearbeitung");
            this.$router.push({ name: "PlaceCreation", params: { placeID: this.position.placeID } });

        },
        /* Adds a new image-placeholder to the images-array*/
        addImage: function () {

            this.position.images.push({
                data: ''
            });

        },
        /* Adds a new text-placeholder to the texts-array*/
        addText: function () {

            this.position.texts.push({
                content: ''
            });

        }
    }
};
</script>
  
<style scoped></style>
  