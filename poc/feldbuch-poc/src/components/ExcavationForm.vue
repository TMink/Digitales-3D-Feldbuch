<template>
  <v-form ref="form">

    <v-tabs vertical color="secondary">
      <v-tab> Allgemeine Daten </v-tab>
      <v-tab> Kontaktpersonen</v-tab>
      <v-tab> Kalenderdaten</v-tab>
      <v-tab> Schnitte</v-tab>

      <v-tab-item class="px-4">
        <v-text-field v-model="excavation_doc.title" label="Bezeichnung *"
          hint="Geben sie hier die Bezeichnung der Grabung an *(Pflichtfeld)" :rules="is_required"></v-text-field>
        <v-textarea v-model="excavation_doc.description" label="Beschreibung"
          hint="Geben sie hier eine kurze Beschreibung des Projektes an"></v-textarea>
        <v-text-field v-model="excavation_doc.organization" label="Grabungsbeauftragter"></v-text-field>
        <v-text-field v-model="excavation_doc.client" label="Beauftragende Organisation"></v-text-field>
        <v-text-field v-model="excavation_doc.location" label="Ort"></v-text-field>
        <v-text-field v-model="excavation_doc.focus" label="Grabungsfokus"></v-text-field>
        <v-text-field v-model="excavation_doc.length" label="Zeitliche Länge"></v-text-field>
        <v-select v-model="excavation_doc.project_id" :items="projects" item-text="title" item-value="_id"
          label="Zugehörige Grabung"> </v-select>
      </v-tab-item>

      <v-tab-item>
        TODO
      </v-tab-item>

      <v-tab-item>
        TODO
      </v-tab-item>

      <v-tab-item>
        TODO
      </v-tab-item>


      <v-btn v-on:click="logForm" color="primary" class="py-6" tile depressed> Speichern </v-btn>
      <v-btn v-on:click="goBack" color="secondary" class="py-6" tile depressed> Abbrechen</v-btn>

    </v-tabs>
    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>

<script>
import VueCookies from 'vue-cookies';
import axios from "axios";

export default {
  name: 'ExcavationForm',
  data() {
    return {
      excavation_doc: {
        description: '',
        title: '',
        organization: '',
        client: '',
        focus: '',
        location: '',
        length: '',
        project_id: '',
        dates: [],
        persons: []
      },
      excavation_id: '',
      project_id: '',
      projects: [],
      sections: [],
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld']
    }
  },
  created() {
    this.excavation_id = this.$route.params.excavation_id;
    this.project_id = VueCookies.get('currentProject');//this.$route.params.project_id
    this.get_doc();
  },
  methods: {
    //retrieve excavation if one exists
    get_doc: function() {
      var context = this;

      if (this.$route.params.excavation_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "http://127.0.0.1:3000/excavations/" + this.$route.params.excavation_id,
          responseType: "json"
        })
        .then(function (res) {
          context.excavation_doc = res.data;
          context.$emit("view", res.data.title + " bearbeiten");
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        context.$emit("view", "Neues Ausgrabung anlegen");
      }
    },
    //submit the form (either POST new excavation or PUT existing excavation)
    logForm: function () {
      // show error message if form is not valid
      if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      var context = this;
      var httpRequest = 'put';
      var requestURL = 'http://127.0.0.1:3000/excavations/' + this.$route.params.excavation_id;

      if (this.is_new == true) {
        httpRequest = 'post';
        requestURL = 'http://127.0.0.1:3000/excavations';
      }

      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          project_id: context.project_id,
          title: context.excavation_doc.title,
          description: context.excavation_doc.description,
          client: context.excavation_doc.client,
          focus: context.excavation_doc.focus,
          length: context.excavation_doc.length,
          location: context.excavation_doc.location,
          organization: context.excavation_doc.organization
        }
      })
      .then(function (res) {
        context.$emit("view", "Ausgrabungsübersicht");
        context.$router.push({ name: 'ExcavationsOverview' });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //go back to excavations overview
    goBack: function() {
      this.$emit("view", "Ausgrabungsübersicht");
      this.$router.push({ name: 'ExcavationsOverview'})
    }
  }
};
</script>

<style scoped></style>
