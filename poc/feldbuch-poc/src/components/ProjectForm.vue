<template>
  <v-form ref="form">
    <v-tabs vertical color="secondary">

      <v-tab> Allgemeine Daten </v-tab>
      <v-tab-item class="px-4">
        <v-text-field
          v-model="project_doc.title"
          label="Bezeichnung *"
          hint="Geben sie hier die Bezeichnung des Projektes an *(Pflichtfeld)"
          :rules="is_required"
        ></v-text-field>
        <v-textarea
          v-model="project_doc.description"
          label="Beschreibung"
          hint="Geben sie hier eine kurze Beschreibung des Projektes an (Ziele, Foki etc.)"
        ></v-textarea>
      </v-tab-item>

      <v-tab> Grabungen</v-tab>
      <v-tab-item class="px-4">
        <v-subheader v-if="is_new">
          Grabungen können erst angelegt werden, wenn das Projekt gespeichert
          wurde
        </v-subheader>
        <ExcavationsOverview v-else v-on:save_excavation="logForm(false)" />
      </v-tab-item>

      <v-tab> Kontaktpersonen </v-tab>
      <v-tab-item class="px-4">
        <DocContacts/>
      </v-tab-item>

      <v-btn 
        v-on:click="logForm()" 
        color="secondary" 
        class="py-6" 
        tile depressed>
        Speichern
      </v-btn>
      <v-btn 
        v-on:click="goBack" 
        color="primary" 
        class="py-6" 
        tile depressed>
        Abbrechen
      </v-btn>
    </v-tabs>

    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>

<script>
import ExcavationsOverview from './ExcavationsOverview';
import DocContacts from './DocContacts.vue';
import axios from 'axios';

export default {
  name: "ProjectCreation",
  components: { ExcavationsOverview, DocContacts },
  data() {
    return {
      project_doc: {
        title: "",
        description: "",
        persons: []
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
    // retrieve project if one exists
    get_doc() {
      var context = this;

      if (this.$route.params.project_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/projects/" + this.$route.params.project_id,
          responseType: "json"
        })
        .then(function(res) {
          context.project_doc = res.data;
          context.$emit("view", res.data.title + " bearbeiten");
        })
        .catch(function(error) {
          console.log(error);
        });
      } else {
        context.$emit("view", "Neues Projekt anlegen");
      }
    },
    //submit the form (either POST new project or PUT existing project)
    logForm() {
      // show error message if form is not valid
      if (!this.$refs.form.validate()) {
        this.error_message ="Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      var context = this;
      var httpRequest = "put";
      var requestURL = "/projects/" + this.$route.params.project_id;

      if (this.is_new == true) {
        httpRequest = "post";
        requestURL = "/projects";
      }

      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          title: context.project_doc.title,
          description: context.project_doc.description
        }
      })
      .then(function (res) {
        context.$emit("view", "Projektübersicht");
        context.$router.push({ name: "ProjectsOverview" });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //go back to project overview
    goBack() {
      this.$emit("view", "Projektübersicht");
      this.$router.push({ name: "ProjectsOverview" });
    }
  }
};
</script>
