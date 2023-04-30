<template>
    <v-form ref="form">
  
      <v-tabs vertical color="secondary">
        <v-tab> Allgemeine Daten </v-tab>
        <v-tab> Messpunkte</v-tab>
        <v-tab> Abmessungen</v-tab>
        <v-tab> Interpretation</v-tab>
        <v-tab> Kalenderdaten</v-tab>
  
        <v-tab-item class="px-4">
            <v-text-field v-model="artifact_doc.title" label="Nummer *" hint="Geben sie hier die Fundnummer ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-textarea v-model="artifact_doc.description" label="Beschreibung" hint="Geben sie hier eine kurze Beschreibung des Fundes an"></v-textarea>
            <v-textarea v-model="artifact_doc.state" label="Erhaltungszustand" hint="Geben sie hier den Erhaltungszustand des Fundes an"></v-textarea>
            <v-select v-model="artifact_doc.excavation" label="Zugehörige Grabung *" :items="availableExcavations" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
            <v-select v-model="artifact_doc.sections" label="Zugehörige Schnitte *" :items="availableSections" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
            <v-select v-model="artifact_doc.feature" label="Zugehöriger Befund *" :items="availableFeatures" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
        </v-tab-item>
  
        <v-tab-item class="px-4">
            <v-text-field v-model="artifact_doc.tachymeter" label="Tachymeter ID *" hint="Geben sie hier die Tachymeter ID ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-text-field v-model="artifact_doc.comment" label="Kommentar *" hint="Geben Sie einen Kommentar an" :rules="is_required"></v-text-field>
            <v-textarea v-model="artifact_doc.east" label="Ostwert" hint="Geben sie den Ostwert an"></v-textarea>
            <v-textarea v-model="artifact_doc.north" label="Nordwert" hint="Geben sie hier den Nordwert an"></v-textarea>
            <v-textarea v-model="artifact_doc.height" label="Höhenwert" hint="Geben sie hier den Höhenwert an"></v-textarea>
        </v-tab-item>
  
        <v-tab-item class="px-4">
            <v-text-field v-model="artifact_doc.dimension" label="Dimension" hint="Geben sie hier die die Beschreibung der Dimension an"></v-text-field>
            <v-text-field v-model="artifact_doc.accuracy" label="Genauigkeit" hint="Geben Sie hier die Genauigkeit an"></v-text-field>
            <v-textarea v-model="artifact_doc.min" label="Von" hint="Geben sie das Minimum des Messwertes an"></v-textarea>
            <v-textarea v-model="artifact_doc.max" label="Bis" hint="Geben sie das Maximum des Messwertes"></v-textarea>
            <v-textarea v-model="artifact_doc.unit" label="Einheit" hint="Geben sie hier die gemessene Einheit an"></v-textarea>
        </v-tab-item>
  
        <v-tab-item class="px-4">
          <v-textarea v-model="artifact_doc.interpretation" label="Interpretation" hint="Geben sie hier die Interpretation an"></v-textarea>
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
import ExcavationsOverview from "./ExcavationsOverview";
import DocContacts from './DocContacts.vue';
import axios from "axios";
import { del } from 'vue';

export default {
  name: 'ArtifactCreation',
  //components: { ExcavationsOverview, DocContacts},
  data() {
    return {
      artifact_doc: {
        description: '',
        number: '',
        state: '',
        excavation_id: '',
        sections: [],
        features: '',
        tachymeter: '',
        comment: '',
        east:'',
        north:'',
        height:'',
        dimension:'',
        accuracy:'',
        min:'',
        max:'',
        unit:'',
        interpretation:'',
      },

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
    //this.artifact_id = this.$route.params.artifact_id;
    //this.project_id = this.$route.params.project_id
    this.get_doc();
  },
  methods: {
    //retrieve artifact if one exists
    get_doc() {
      var context = this;

      if (this.$route.params.artifact_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/artifacts/" + this.$route.params.artifact_id,
          responseType: "json"
        })
        .then(function(res) {
          context.artifact_doc = res.data;
          context.$emit("view", "Schnitt Nr. " + res.data.number + " bearbeiten");
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        context.$emit("view", "Neuen Fund anlegen");
      }
    },
    //submit the form (either POST new artifacts or PUT existing artifacts)
    logForm() {
      // show error message if form is not valid
      if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      var context = this;
      var httpRequest = 'put';
      var requestURL = '/artifacts/' + this.$route.params.artifact_id;

      if (this.is_new == true) {
        httpRequest = 'post';
        requestURL = '/artifacts';
      }
      //put/post request of edited/new artifact
      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          number: context.artifact_doc.number,
          description: context.artifact_doc.description,
          excavation_id: VueCookies.get('currentExcavation'),
          state: context.artifact_doc.state,
          tachymeter: context.artifact_doc.tachymeter,
          comment: context.artifact_doc.comment,
          east: context.artifact_doc.east,
          north: context.artifact_doc.north,
          height: context.artifact_doc.height,
          dimension: context.artifact_doc.dimension,
          accuracy: context.artifact_doc.accuracy,
          min: context.artifact_doc.min,
          max: context.artifact_doc.max,
          unit: context.artifact_doc.unit,
          interpretation: context.artifact_doc.interpretation,
          sections: context.artifact_doc.sections,
          features: context.artifact_doc.features

        }
      })
      .then(function (res) {
        context.$emit("view", "Fundübersicht");
        context.$router.push({ name: 'artifactsOverview' });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //go back to artifacts overview
    goBack: function() {
      this.$emit("view", "Fundübersicht");
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped></style>
