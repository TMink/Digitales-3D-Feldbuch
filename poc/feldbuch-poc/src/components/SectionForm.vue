<template>
  <v-form ref="form">
    <v-tabs vertical color="secondary">

      <v-tab> Allgemeine Daten </v-tab>
      <v-tab-item class="px-4">
        <v-text-field v-model="section_doc.title" label="Bezeichnung *"
          hint="Geben sie hier die Bezeichnung des Schnittes an *(Pflichtfeld)" :rules="is_required"></v-text-field>
        <v-textarea v-model="section_doc.description" label="Beschreibung"
          hint="Geben sie hier eine kurze Beschreibung des Schnittes an (Ziele, Foki etc.)"></v-textarea>
        <v-text-field v-model="section_doc.startLevel" label="Startniveau"
          hint="Geben sie hier das Starnievau des Schnittes an"></v-text-field>
        <v-text-field v-model="section_doc.endLevel" label="Endniveau"
          hint="Geben sie hier das Endnievau des Schnittes an"></v-text-field>
      </v-tab-item>

      <v-tab> Kontaktpersonen </v-tab>
      <v-tab-item class="px-4">
        <DocContacts />
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
            Do you really want to delete the feature?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text v-on:click="deleteSection()" @click="dialog = false">
              Yes
            </v-btn>
            <v-btn text @click="dialog = false">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog> 
      <v-btn v-on:click="goBack()" color="primary" class="py-6" tile> Abbrechen </v-btn>
    </v-tabs>

    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>
  
<script>
import ExcavationsOverview from "./ExcavationsOverview";
import DocContacts from './DocContacts.vue';
import VueCookies from 'vue-cookies'
import axios from "axios";

export default {
  name: "SectionCreation",
  components: { ExcavationsOverview, DocContacts },
  data() {
    return {
      section_doc: {
        title: "",
        description: "",
        persons: []
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
    // retrieve project if one exists
    get_doc() {
      var context = this;

      if (this.$route.params.section_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/sections/" + this.$route.params.section_id,
          responseType: "json"
        })
          .then(function (res) {
            context.section_doc = res.data;
            context.$emit("view", res.data.title + " bearbeiten");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        context.$emit("view", "Neuen Schnitt anlegen");
      }
    },
    //submit the form (either POST new project or PUT existing project)
    logForm() {
      // show error message if form is not valid
      if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      var context = this;
      var httpRequest = "put";
      var requestURL = "/sections/" + this.$route.params.section_id;

      if (this.is_new == true) {
        httpRequest = "post";
        requestURL = "/sections/" + VueCookies.get('currentExcavation');
      }

      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          title: context.section_doc.title,
          description: context.section_doc.description,
          startLevel: context.section_doc.startLevel,
          endLevel: context.section_doc.endLevel,
        }
      })
        .then(function (res) {
          context.$emit("view", "Schnittübersicht");
          context.$router.push({ name: "SectionsOverview" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteSection: function () {
      var context = this;
      var curExcavation = VueCookies.get('currentExcavation');
      var curSection = VueCookies.get('currentSection');

      axios({
        method: 'delete',
        url: '/sections/' + curExcavation + '/' + curSection,
      })
        .then(function (res) {
          context.$emit("view", "Schnittübersicht");
          context.$router.push({ name: "SectionsOverview" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //go back to project overview
    goBack() {
      this.$emit("view", "Schnittübersicht");
      this.$router.push({ name: "SectionsOverview" });
    }
  }
};
</script>
  