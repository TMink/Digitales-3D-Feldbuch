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
            error_dialog: false
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
        //go back to previous page
        goBack() {
            this.$router.go(-1)
        }
    }
};
</script>
