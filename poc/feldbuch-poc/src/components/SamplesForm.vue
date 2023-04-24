<template>
    <v-form ref="form">
        <v-tabs vertical color="secondary">

            <v-tab> Allgemeine Daten </v-tab>
            <v-tab-item class="px-4">
                <v-text-field v-model="sample_doc.type" label="Typ *"
                    hint="Geben sie hier den Typen der Probe an *(Pflichtfeld)" :rules="is_required"></v-text-field>
                <v-textarea v-model="sample_doc.description" label="Beschreibung"
                    hint="Geben sie hier eine kurze Beschreibung der Probe an."></v-textarea>
            </v-tab-item>

            <v-btn v-on:click="logForm()" color="secondary" class="py-6" tile depressed>
                Speichern
            </v-btn>
            <v-btn v-on:click="deleteSample()" color="secondary" class="py-6" tile depressed>
                Löschen
            </v-btn>
            <v-btn v-on:click="goBack" color="primary" class="py-6" tile depressed>
                Abbrechen
            </v-btn>
        </v-tabs>

        <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
            {{ error_message }}
        </v-alert>
    </v-form>
</template>
  
<script>
import axios from 'axios';
import { del } from 'vue';

export default {
    name: "SampleCreation",
    data() {
        return {
            sample_doc: {
                type: "",
                description: "",
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
        // retrieve sample if one exists
        get_doc() {
            var context = this;

            if (this.$route.params.sample_id !== "new") {
                this.is_new = false;

                axios({
                    method: "get",
                    url: "/samples/" + this.$route.params.sample_id,
                    responseType: "json"
                })
                    .then(function (res) {
                        context.sample_doc = res.data;
                        context.$emit("view", res.data.type + " bearbeiten");
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                context.$emit("view", "Neue Probe anlegen");
            }
        },
        //submit the form (either POST new sample or PUT existing sample)
        logForm() {
            // show error message if form is not valid
            if (!this.$refs.form.validate()) {
                this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
                this.error_dialog = true;
                return;
            }

            var context = this;
            var httpRequest = "put";
            var requestURL = "/samples/" + this.$route.params.sample_id;

            if (this.is_new == true) {
                httpRequest = "post";
                requestURL = "/samples";
            }

            axios({
                method: httpRequest,
                url: requestURL,
                data: {
                    type: context.sample_doc.type,
                    description: context.sample_doc.description
                }
            })
                .then(function (res) {
                    context.$emit("view", "Probenübersicht");
                    context.$router.push({ name: "SamplesOverview" });
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //deletes current sample
        deleteSample() {
            var context = this;
            axios({
                method: "delete",
                url: "/samples/" + this.$route.params.sample_id,
                data: {
                }
            })
                .then(function (res) {
                    context.$emit("view", "Probenübersicht");
                    context.$router.push({ name: "SamplesOverview" });
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //go back to sample overview
        goBack() {
            this.$emit("view", "Probenübersicht");
            this.$router.push({ name: "SamplesOverview" });
        },
    }
};
</script>
  