<template>
    <v-form ref="form">
  
      <v-tabs vertical color="secondary">
        <v-tab> Allgemeine Daten </v-tab>
        <v-tab> Befundtyp</v-tab>
        <v-tab> Zugehöriger Schnitt</v-tab>
        <v-tab> Zugehörige Funde</v-tab>
  
        <v-tab-item class="px-4">
            <v-text-field v-model="feature.featurenumber" label="Befundnummer *" hint="Geben sie hier die Befundnummer ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-textarea v-model="feature_doc.description" label="Beschreibung" hint="Geben sie hier eine kurze Beschreibung des Befunds an"></v-textarea>
            <v-select v-model="feature_doc.short" label="Kurzansprache" :items="availableConditions" hint="Geben sie hier die Kurzansprache des Befunds ein"></v-select>
            <v-select v-model="feature_doc.localisation" label="Lokalisierung" :items="availableExcavations" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
            <v-select v-model="feature_doc.interpretation" label="Interpretation" :items="availableSections" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
            <v-select v-model="feature_doc.connectedfeatures" label="Zugehöriger Befund *" :items="availableStructures" item-value="_id" item-text="structurenumber" :rules="is_required" hint="Zugehörigen Befund oder Streufund angeben *(Pflichtfeld)"> </v-select>
            <v-select v-model="feature_doc.featureType" label="Befundtyp *" > </v-select>
            <v-select v-model="feature_doc.sections" label="Zugehörige Schnitte *" :items="availableSections" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>
            <v-select v-model="feature_doc.find" label="Zugehörige Funde" :items="availableFinds" item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-select>

        </v-tab-item>
  
        <v-tab-item>
          <DocContacts/>
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
import ExcavationsOverview from "./ExcavationsOverview";
import DocContacts from './DocContacts.vue';
import axios from "axios";

export default {
  name: 'featureCreation',
  components: { ExcavationsOverview, DocContacts},
  data() {
    return {
      feature_doc: {
        description: '',
        title: '',
        short: '',
        location: '',
        interpretation: '',
        featureType: '',
        sections: [],
        finds: [],
        persons: []
      },

      availableFeatureTypes: [
        'Überreste',
        'Stratigrafische Einheit',
        'Baulicher Bestand'
      ],

      feature_id: '',
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
    //this.feature_id = this.$route.params.feature_id;
    //this.project_id = this.$route.params.project_id
    this.get_doc();
  },
  methods: {
    //retrieve feature if one exists
    get_doc() {
      var context = this;

      if (this.$route.params.project_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/features/" + this.$route.params.project_id,
          responseType: "json"
        })
        .then(function(res) {
          context.feature_doc = res.data;
          context.$emit("view", res.data.title + " bearbeiten");
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        context.$emit("view", "Neuen Befund anlegen");
      }
    },
    //submit the form (either POST new features or PUT existing features)
    logForm() {
      // show error message if form is not valid
      if (!this.$refs.form.validate()) {
        this.error_message = "Bitte alle Pflichtfelder vor dem Speichern ausfüllen";
        this.error_dialog = true;
        return;
      }

      var context = this;
      var httpRequest = 'put';
      var requestURL = '/features/' + this.$route.params.feature_id;

      if (this.is_new == true) {
        httpRequest = 'post';
        requestURL = '/features';
      }
      //put/post request of edited/new feature
      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          project_id: context.project_id,
          title: context.features_doc.title,
          description: context.features_doc.description,
          short: context.features_doc.short,
          location: context.features_doc.location,
          interpretation: context.features_doc.interpretation,
          featureType: context.features_doc.featureType,
          sections: context.features_doc.sections,
          finds: context.features_doc.finds
        }
      })
      .then(function (res) {
        context.$emit("view", "Befundübersicht");
        context.$router.push({ name: 'FeaturesOverview' });
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    //go back to features overview
    goBack: function() {
      this.$emit("view", "Befundübersicht");
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped></style>
