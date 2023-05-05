<template>
  <v-form ref="form">
    <v-tabs vertical color="secondary">

      <v-tab> Allgemeine Daten </v-tab>
      <v-tab-item class="px-4">
        <v-text-field v-model="project_doc.title" label="Bezeichnung *"
          hint="Geben sie hier die Bezeichnung des Projektes an *(Pflichtfeld)" :rules="is_required"></v-text-field>
        <v-textarea v-model="project_doc.description" label="Beschreibung"
          hint="Geben sie hier eine kurze Beschreibung des Projektes an (Ziele, Foki etc.)"></v-textarea>
      </v-tab-item>

      <v-tab> Grabungen</v-tab>
      <v-tab-item class="px-4">
        <v-subheader v-if="is_new">
          Grabungen können erst angelegt werden, wenn das Projekt gespeichert
          wurde
        </v-subheader>
        <DocExcavations :excavationslist="project_doc.excavations" />
      </v-tab-item>

      <v-tab> Kontaktpersonen </v-tab>
      <v-tab-item class="px-4">
        <DocContacts />
      </v-tab-item>

      <v-btn v-on:click="logForm()" color="secondary" class="py-6" tile > Speichern </v-btn>
      <v-dialog v-model="dialog" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
              Löschen
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5"> Do you really want to delete the project <br> "{{project_doc.title}}"? </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" v-on:click="deleteProject()" @click="dialog = false" > Yes </v-btn>
              <v-btn color="primary" @click="dialog = false"> No </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      <v-btn v-on:click="goBack" color="primary" class="py-6" tile > Abbrechen </v-btn>
    </v-tabs>

    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>

<script>
import DocExcavations from './DocExcavations.vue';
import DocContacts from './DocContacts.vue';
import axios from 'axios';
import VueCookies from 'vue-cookies';

export default {
  name: "ProjectCreation",
  components: { DocExcavations, DocContacts },
  data() {
    return {
      project_doc: {
        title: "",
        description: "",
        excavations: [],
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

      if (this.$route.params.project_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/projects/" + this.$route.params.project_id,
          responseType: "json"
        })
          .then(function (res) {
            context.project_doc = res.data;
            context.$emit("view", res.data.title + " bearbeiten");
          })
          .catch(function (error) {
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
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
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
          description: context.project_doc.description,
          excavations: context.project_doc.excavations
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
    deleteProject: function () {
      var context = this;
      var curProject = VueCookies.get('currentProject');

      axios({
        method: 'delete',
        url: '/projects/' + curProject,
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
