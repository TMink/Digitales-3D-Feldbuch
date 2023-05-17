<template>
  <v-form ref="form">

    <v-tabs vertical color="secondary">
      <v-tab> Allgemeine Daten </v-tab>
      <v-tab> Messpunkte </v-tab>
      <v-tab> Abmessungen </v-tab>
      <v-tab> Kalenderdaten </v-tab>
      <v-tab> Bilder </v-tab>
      <v-tab> Farbwerte </v-tab>
      <v-tab> Datierungen </v-tab>
      
      <v-tab-item class="px-4">
        <v-text-field v-model="artifact_doc.number" label="Nummer *"
          hint="Geben sie hier die Fundnummer ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
        <v-textarea v-model="artifact_doc.description" label="Beschreibung"
          hint="Geben sie hier eine kurze Beschreibung des Fundes an"></v-textarea>
        <v-textarea v-model="artifact_doc.inscriptions" label="Inschriften"
          hint="Geben sie hier die Inschriften des Fundes an"></v-textarea>
        <v-text-field v-model="artifact_doc.literature" label="Zugehörige Literatur"> </v-text-field>
        <v-text-field v-model="artifact_doc.material" label="Material"> </v-text-field>
        <v-text-field v-model="artifact_doc.producer" label="Erzeuger"> </v-text-field>
        <v-text-field v-model="artifact_doc.state" label="Erhaltungszustand"> </v-text-field>
        <v-text-field v-model="artifact_doc.type" label="Typ"> </v-text-field>
        <!-- <v-text-field v-model="artifact_doc.section_id" label="Zugehörige Schnitte *" :items="availableSections"
          item-value="_id" item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-text-field>
        <v-text-field v-model="artifact_doc.feature_id" label="Zugehöriger Befund *" :items="availableFeatures" item-value="_id"
          item-text="title" :rules="is_required" hint=" *(Pflichtfeld)"> </v-text-field> -->
      </v-tab-item>

      <v-tab-item class="px-4">
        <DocUtmPoints :utmPoints="artifact_doc.utmPoints" @addUtmPoint="addUtmPoint($event)"/>
      </v-tab-item>

      <v-tab-item class="px-4">
        Abmessungen TODO
        <!-- <v-text-field v-model="artifact_doc.designation" label="Dimension"
          hint="Geben sie hier die die Beschreibung der Dimension an"></v-text-field>
        <v-text-field v-model="artifact_doc.accuracy" label="Genauigkeit"
          hint="Geben Sie hier die Genauigkeit an"></v-text-field>
        <v-textarea v-model="artifact_doc.from" label="Von" hint="Geben sie das Minimum des Messwertes an"></v-textarea>
        <v-textarea v-model="artifact_doc.to" label="Bis" hint="Geben sie das Maximum des Messwertes"></v-textarea>
        <v-textarea v-model="artifact_doc.unit" label="Einheit"
          hint="Geben sie hier die gemessene Einheit an"></v-textarea> -->
      </v-tab-item>

      <v-tab-item class="px-4">
        <DocDates :dateslist="artifact_doc.dates" @addDate="addDate($event)" />
      </v-tab-item>

      <v-tab-item>
        <DocImages :imageslist="artifact_doc.images" @addImage="addImage($event)"/>
      </v-tab-item>

      <v-tab-item>
        <DocColors :colorslist="artifact_doc.colors"/>
        <!-- <v-textarea v-model="artifact_doc.interpretation" label="Interpretation"
        hint="Geben sie hier die Interpretation an"></v-textarea> -->
      </v-tab-item>

      <v-tab-item>
        Datierungen TODO
        <!-- <v-textarea v-model="artifact_doc.interpretation" label="Interpretation"
        hint="Geben sie hier die Interpretation an"></v-textarea> -->
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
            Do you really want to delete the artifact <br> "Fund Nr.{{ artifact_doc.number }}"?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" v-on:click="deleteArtifact()" @click="dialog = false">
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

import VueCookies from 'vue-cookies';
import DocDates from './DocDates.vue';
import DocExcavations from './DocExcavations.vue';
import DocFeatures from './DocFeatures.vue';
import DocUtmPoints from './DocUtmPoints';
import DocImages from './DocImages';
import DocColors from './DocColors';
import axios from 'axios';

export default {
  name: 'ArtifactCreation',
  components: { DocDates, 
    DocFeatures, 
    DocExcavations, 
    DocUtmPoints, 
    DocImages, 
    DocColors },
  data() {
    return {
      artifact_doc: {
        title: '',
        description: '',
        number: '',
        state: '',
        material: '',
        producer: '',
        type: '',
        inscriptions: '',
        features: [],
        images: [],
        colors: [],
        utmPoints: [],

        tachymeter: '',
        comment: '',
        east: '',
        north: '',
        height: '',

        designation: '',
        accuracy: '',
        from: '',
        to: '',
        unit: '',

        interpretation: '',

        dates: [],
      },

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
          .then(function (res) {
            context.artifact_doc = res.data;
            context.$emit("view", "Fund Nr. " + res.data.number + " bearbeiten");
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        context.$emit("view", "Neuen Fund anlegen");
      }
    },
    addDate: function (date_id) {
      var context = this;

      if (context.artifact_doc.dates == undefined) {
        context.artifact_doc.dates = [date_id];
      } else {
        context.artifact_doc.dates.push(date_id);
      }
    },
    addImage: function (image_id) {
      var context = this;

      if (context.artifact_doc.images == undefined) {
        context.artifact_doc.images = [image_id];
      } else {
        context.artifact_doc.images.push(image_id);
      }
    },
    addColor: function (color_id) {
      var context = this;

      if (context.artifact_doc.colors == undefined) {
        context.artifact_doc.colors = [color_id];
      } else {
        context.artifact_doc.colors.push(color_id);
      }
    },
    addUtmPoint: function (utmPoint_id) {
      var context = this;

      if (context.artifact_doc.utmPoints == undefined) {
        context.artifact_doc.utmPoints = [utmPoint_id];
      } else {
        context.artifact_doc.utmPoints.push(utmPoint_id);
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
        requestURL = '/artifacts/' + VueCookies.get('currentSection');
      }
      //put/post request of edited/new artifact
      axios({
        method: httpRequest,
        url: requestURL,
        data: {
          number: context.artifact_doc.number,
          title: context.artifact_doc.title,
          description: context.artifact_doc.description,
          state: context.artifact_doc.state,
          literature: context.artifact_doc.literature,
          inscriptions: context.artifact_doc.inscriptions,
          producer: context.artifact_doc.producer,
          type: context.artifact_doc.type,
          material: context.artifact_doc.material,

          tachymeter: context.artifact_doc.tachymeter,
          comment: context.artifact_doc.comment,
          east: context.artifact_doc.east,
          north: context.artifact_doc.north,
          height: context.artifact_doc.height,

          designation: context.artifact_doc.designation,
          accuracy: context.artifact_doc.accuracy,
          from: context.artifact_doc.from,
          to: context.artifact_doc.to,
          unit: context.artifact_doc.unit,

          interpretation: context.artifact_doc.interpretation,

          features: context.artifact_doc.features,
          dates: context.artifact_doc.dates,
          images: context.artifact_doc.images,
          colors: context.artifact_doc.colors,
          utmPoints: context.artifact_doc.utmPoints

        }
      })
        .then(function (res) {
          context.$emit("view", "Fundübersicht");
          context.$router.push({ name: 'ArtifactsOverview' });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    deleteArtifact: function () {
      var context = this;
      var curSection = VueCookies.get('currentSection');
      var curArtifact = VueCookies.get('currentArtifact');

      axios({
        method: 'delete',
        url: '/artifacts/' + curSection + "/" + curArtifact,
      })
        .then(function (res) {
          context.$emit("view", "Fundübersicht");
          context.$router.push({ name: "ArtifactsOverview" });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //go back to artifacts overview
    goBack: function () {
      this.$emit("view", "Fundübersicht");
      this.$router.push({ name: "ArtifactsOverview" });
    }
  }
};
</script>

<style scoped></style>
