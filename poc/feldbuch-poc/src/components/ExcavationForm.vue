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
      </v-tab-item>

      <v-tab-item>
        <DocContacts />
      </v-tab-item>

      <v-tab-item>
        <DocDates :dateslist="excavation_doc.dates" @addDate="addDate($event)" />
      </v-tab-item>

      <v-tab-item class="px-4">
        <v-subheader v-if="is_new">
          Schnitte können erst angelegt werden, wenn das Projekt gespeichert
          wurde
        </v-subheader>
        <DocSections :sectionslist="excavation_doc.sections" />
      </v-tab-item>

      <v-btn v-on:click="logForm" color="secondary" class="py-6" tile> Speichern </v-btn>
      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
            Löschen
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            Do you really want to delete the excavation <br> "{{excavation_doc.title}}"?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" v-on:click="deleteExcavation()" @click="dialog = false">
              Yes
            </v-btn>
            <v-btn color="primary" @click="dialog = false">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn v-on:click="goBack" color="primary" class="py-6" tile> Abbrechen</v-btn>

    </v-tabs>
    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>

<script>
import DocContacts from './DocContacts.vue';
import DocDates from './DocDates.vue';
import DocSections from './DocSections.vue';
import VueCookies from 'vue-cookies';
import axios from 'axios';

export default {
  name: 'ExcavationForm',
  components: { DocContacts, DocDates, DocSections },
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
        persons: [],
        sections: []
      },
      excavation_id: '',
      project_id: '',
      projects: [],
      sections: [],
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false
    }
  },
  created() {
    this.excavation_id = this.$route.params.excavation_id;
    this.project_id = this.$route.params.project_id
    this.get_doc();
  },
  methods: {
    //retrieve excavation if one exists
    get_doc: function () {
      var context = this;

      if (this.$route.params.excavation_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/excavations/" + this.$route.params.excavation_id,
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
    addDate: function (date_id) {
      var context = this;

      if (context.excavation_doc.dates == undefined) {
        context.excavation_doc.dates = [date_id];
      } else {
        context.excavation_doc.dates.push(date_id);
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
      var requestURL = '/excavations/' + this.$route.params.excavation_id;

      if (this.is_new == true) {
        httpRequest = 'post';
        requestURL = '/excavations/' + VueCookies.get('currentProject');
      }
      //put/post request of edited/new excavation
      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          title: context.excavation_doc.title,
          description: context.excavation_doc.description,
          client: context.excavation_doc.client,
          focus: context.excavation_doc.focus,
          length: context.excavation_doc.length,
          location: context.excavation_doc.location,
          organization: context.excavation_doc.organization,
          dates: context.excavation_doc.dates
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
    deleteExcavation: function () {
      var context = this;
      var curProject = VueCookies.get('currentProject');
      var curExcavation = VueCookies.get('currentExcavation');

      axios({
        method: 'delete',
        url: '/excavations/' + curProject + '/' + curExcavation,
      })
        .then(function (res) {
          context.$emit("view", "Ausgrabungsübersicht");
          context.$router.push({ name: "ExcavationsOverview" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //go back to excavations overview
    goBack: function () {
      this.$emit("view", "Ausgrabungsübersicht");
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped></style>
