<template>
    <v-form ref="form">
        <v-tabs vertical color="secondary">

            <v-tab> Kontaktperson </v-tab>
            <v-tab-item class="px-4">
                   <v-text-field v-model="contact_doc.firstname" label="Vorname"
                        hint="Geben sie hier den Vornamen des Kontaktes an"></v-text-field>
                    <v-text-field v-model="contact_doc.surname" label="Nachname *"
                        hint="Geben sie hier den Nachnamen des Kontaktes an" :rules="is_required"></v-text-field>
                    <v-text-field v-model="contact_doc.role" label="Rolle"
                        hint="Geben sie hier die Rolle des Kontaktes an"></v-text-field>
                    <v-text-field v-model="contact_doc.mail" label="E-Mail-Adresse *"
                        hint="Geben sie hier die E-Mail-Adresse des Kontaktes an" :rules="is_required"></v-text-field>
                    <v-text-field v-model="contact_doc.phone" label="Telefonnmmer"
                        hint="Geben sie hier die Telefonnummer des Kontaktes an"></v-text-field>
            </v-tab-item>

            <v-btn v-on:click="logForm()" color="secondary" class="py-6" tile> Speichern </v-btn>
            <v-dialog v-model="dialog" max-width="290">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
                Löschen
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="text-h5">
                Do you really want to delete the contact <br> "{{ contact_doc.surname }}"?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="secondary" v-on:click="deleteContact()" @click="dialog = false">
                  Yes
                </v-btn>
                <v-btn color="primary" @click="dialog = false">
                  No
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
            <v-btn v-on:click="goBack" color="primary" class="py-6" tile> Abbrechen </v-btn>
        </v-tabs>

        <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
            {{ error_message }}
        </v-alert>
    </v-form>
</template>

<script>
import DocContacts from './DocContacts.vue';
import VueCookies from 'vue-cookies';
import axios from 'axios';

export default {
    name: "ContactCreation",
    components: { DocContacts },
    data() {
        return {
            contact_doc: {
                firstname: "",
                surname: "",
                role: "",
                mail: "",
                phone: "",
            },
            is_new: true,
            is_required: [v => !!v || "Pflichtfeld"],

            error_message: "",
            error_dialog: false,
            dialog: false
        };
    },
    created() {
        this.get_doc();
    },
    methods: {
        /** retrieve contact if one exists **/
        get_doc() {
            var context = this;

            if (this.$route.params.contact_id !== "new") {
                this.is_new = false;

                axios({
                    method: "get",
                    url: "/contacts/" + this.$route.params.contact_id,
                    responseType: "json"
                })
                .then(function (res) {
                    context.contact_doc = res.data;
                    context.$emit("view", res.data.surname + " bearbeiten");
                })
                .catch(function (error) {
                    console.log(error);
                });
            } else {
                context.$emit("view", "Neuen Kontakt anlegen");
            }
        },
        /** submit the form (either POST new contact or PUT existing contact) **/
        logForm() {
            // show error message if form is not valid
            if (!this.$refs.form.validate()) {
                this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
                this.error_dialog = true;
                return;
            }

            var context = this;
            var subdomain = this.$route.params.mode;
            var httpRequest = "put";
            var requestURL = "/contacts/" + context.$route.params.contact_id;

            if (this.is_new == true) {
                httpRequest = "post";
                requestURL = "/contacts/" + subdomain + "/" + context.$route.params.id;
            }

            // put/post request of edited/new contact
            axios({
                method: httpRequest,
                url: requestURL,
                data: {
                    firstname: context.contact_doc.firstname,
                    surname: context.contact_doc.surname,
                    role: context.contact_doc.role,
                    mail: context.contact_doc.mail,
                    phone: context.contact_doc.phone
                }
            })
            .then(function (res) {
                context.$router.push(VueCookies.get("LAST_ROUTE_KEY"));
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        deleteContact: function () {
            var context = this;
            var subdomain = context.$route.params.mode;

            // delete contact with 'id' (contact_id) from 'subdomain' (projects or excavations)
            // with 'id' (project_id or excavation_id)
            axios({
                method: 'delete',
                url: '/contacts/' + subdomain + '/' + context.$route.params.id + '/'+ context.$route.params.contact_id,
            })
            .then(function (res) {
                context.$emit("view", "Ausgrabungsübersicht");
                context.$router.push({ name: "ExcavationsOverview" });
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        //go back to previous page
        goBack() {
            this.$router.go(-1)
        }
    }
};
</script>
