<template>
    <v-form ref="form">
  
      <v-tabs vertical color="secondary">
        <v-tab> Allgemeine Daten </v-tab>
        <v-tab> Befundtyp</v-tab>
        <v-tab> Zugehöriger Schnitt</v-tab>
        <v-tab> Zugehörige Funde</v-tab>
  
        <v-tab-item class="px-4">
          <v-text-field v-model="feature_doc.title" label="Titel *" hint="Geben sie hier den Befundtitel ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-text-field v-model="feature_doc.featurenumber" label="Befundnummer *" hint="Geben sie hier die Befundnummer ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
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
  
  
        <v-btn v-on:click="logForm" color="primary" class="py-6" tile> Speichern </v-btn>
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
              <v-btn text v-on:click="deleteArtifact()" @click="dialog = false">
                Yes
              </v-btn>
              <v-btn text @click="dialog = false">
                No
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn v-on:click="goBack" color="secondary" class="py-6" tile> Abbrechen</v-btn>
  
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
  name: 'FeatureCreation',
  //components: { ExcavationsOverview, DocContacts},
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

      //feature_id: '',
      //project_id: '',
      //projects: [],
      //sections: [],
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false
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

      if (this.$route.params.feature_id !== "new") {
        this.is_new = false;

        axios({
          method: "get",
          url: "/features/" + this.$route.params.feature_id,
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
          //project_id: context.project_id,
          title: context.feature_doc.title,
          description: context.feature_doc.description,
          short: context.feature_doc.short,
          location: context.feature_doc.location,
          interpretation: context.feature_doc.interpretation,
          featureType: context.feature_doc.featureType,
          sections: context.feature_doc.sections,
          finds: context.feature_doc.finds
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
    deleteFeature: function () {
      var context = this;
      var curFeature = VueCookies.get('currentFeature');
      axios({
        method: 'delete',
        url: '/features/' + curFeature,
      })
      .then(function (res) {
        context.$emit("view", "Befundübersicht");
        context.$router.push({ name: "FeaturesOverview" });
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
