<template>
    <v-form ref="form">

        <v-tabs vertical color="secondary">
            <v-tab> Allgemein </v-tab>

            <v-tab-item class="px-4">
                <v-text-field v-model="position.positionNumber" label="PositionsNr"
                    hint="Geben Sie hier eine Positionsnummer ein"></v-text-field>
                <v-text-field v-model="position.date" label="Datierung" hint="Format: dd.mm.yyyy"></v-text-field>
                <v-text-field v-model="position.description" label="Beschreibung"
                    hint="Geben Sie hier eine Beschreibung an:"></v-text-field>
            </v-tab-item>

            <v-btn v-on:click="savePlace()" color="secondary" class="py-6" tile> Speichern </v-btn>
            <v-dialog v-model="dialog" max-width="290">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
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
            <v-btn v-on:click="goBack" color="primary" class="py-6" tile> Cancel</v-btn>

        </v-tabs>
        <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
            {{ error_message }}
        </v-alert>
    </v-form>
</template>
  
<script>
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
    name: 'PlaceCreation',
    data() {

        return {
            position: {
                id: '',
                place_id: '',
                positionNumber: '',
                date: '',
                description: ''
            },
            error_dialog: false,
            error_message: '',
            is_new: true,
            is_required: [v => !!v || 'Pflichtfeld'],
            dialog: false
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
            if (this.$route.params.position_id != 'new') {
                const data = await fromOfflineDB.getObject(currentPosition, 'Positions', 'positions');
                this.position = data.result
            }

        },
        savePlace: async function () {

            const currentPlace = VueCookies.get("currentPlace");
            //await fromOfflineDB.deleteObject(this.position.id, 'Positions', 'positions')
            if (this.$route.params.position_id === 'new') {
                this.position.id = "agrfuzgeuzgfueggf" + parseInt(Math.random() * 100 + 1);
                this.position.place_id = currentPlace;

            }
            await fromOfflineDB.deleteObject(this.position.id, 'Positions', 'positions')
            await fromOfflineDB.addObject(this.position, 'Positions', 'positions')
            this.$emit("view", "bearbeite " + currentPlace);
            this.$router.push({ name: "PlaceCreation" });

        },
        /* Delete the selected place */
        deletePlace: async function () {

            await fromOfflineDB.deleteObject(this.position.id, 'Positions', 'positions')
            const currentPlace = VueCookies.get("currentPlace");
            this.$emit("view", "bearbeite " + currentPlace);
            this.$router.push({ name: "PlaceCreation" });

        },
        /* Go back to PlacesOverview */
        goBack: function () {
            const currentPlace = VueCookies.get("currentPlace");
            this.$emit("view", "bearbeite " + currentPlace);
            this.$router.push({ name: "PlaceCreation" });

        }
    }
};
</script>
  
<style scoped>

</style>
  