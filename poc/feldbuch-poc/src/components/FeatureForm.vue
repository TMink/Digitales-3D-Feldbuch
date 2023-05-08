<template>
    <v-form ref="form">
  
      <v-tabs vertical color="secondary">
        <v-tab> Allgemeine Daten </v-tab>
        <v-tab> Befundtyp</v-tab>
        <v-tab> Zugehörige Funde</v-tab>
  
        <v-tab-item class="px-4">
          <v-text-field v-model="feature_doc.title" label="Titel *" hint="Geben Sie hier den Befundtitel ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-text-field v-model="feature_doc.number" label="Befundnummer *" hint="Geben Sie hier die Befundnummer ein *(Pflichtfeld)" :rules="is_required"></v-text-field>
            <v-textarea v-model="feature_doc.description" label="Beschreibung" hint="Geben Sie hier eine kurze Beschreibung des Befunds an"></v-textarea>
            <v-text-field v-model="feature_doc.rel_localization" label="Lokalisierung" item-value="_id" item-text="title"  hint=" *(Pflichtfeld)"> </v-text-field>
            <v-textarea v-model="feature_doc.interpretation" label="Interpretation" item-value="_id" item-text="title"  hint=" *(Pflichtfeld)"> </v-textarea>
            <v-select v-model="feature_doc.type" label="Befundtyp *" :items="['Überreste', 'Stratigrafische Einheit', 'Baulicher Bestand']"></v-select>
           
        </v-tab-item>

        <v-tab-item class="px-4">
          <v-subheader v-if="feature_doc.type !== 'Baulicher Bestand' && feature_doc.type !== 'Überreste' && 
          feature_doc.type !== 'Stratigrafische Einheit'"> Bisher wurde kein Befundtyp angegeben</v-subheader>
          <template v-if="feature_doc.type === 'Überreste'">
            <v-text-field v-model="feature_doc.age" label="Alter" hint="Geben Sie das Alter an"></v-text-field>
            <v-text-field v-model="feature_doc.gender" label="Geschlecht" hint="Geben Sie das Geschlecht an"></v-text-field>
            <v-text-field v-model="feature_doc.pathology" label="Pathologie" hint="Geben Sie die Pathologie an"></v-text-field>
            <v-text-field v-model="feature_doc.preserved_bones" label="Erhaltene Knochen" hint="Geben Sie an, welche Knochen erhalten sind"></v-text-field>
            <v-text-field v-model="feature_doc.burial_type" label="Bestattungsart" hint="Geben Sie die Bestattungsart an"></v-text-field>
            <v-text-field v-model="feature_doc.funeral_type" label="Grabtyp" hint="Geben Sie den Grabtyp an"></v-text-field>
            <v-text-field v-model="feature_doc.burial_construction" label="Grabkonstruktion" hint="Geben Sie die Grabkonstruktion an)"></v-text-field>
          </template>
          <template v-if="feature_doc.type === 'Baulicher Bestand'">
            <v-text-field v-model="feature_doc.construction" label="Bauart" hint="Geben Sie die Bauart an"></v-text-field>
            <v-text-field v-model="feature_doc.masonry" label="Mauerwert" hint="Geben Sie das Mauerwerk an"></v-text-field>
            <v-text-field v-model="feature_doc.structure" label="Struktur" hint="Geben Sie die Struktur an"></v-text-field>
            <v-text-field v-model="feature_doc.style_features" label="Stilmerkmale" hint="Geben Sie die Stilmerkmale"></v-text-field>
            <v-text-field v-model="feature_doc.material" label="Material" hint="Geben Sie das Material an"></v-text-field>
            <v-text-field v-model="feature_doc.stone_material" label="Steingröße" hint="Geben Sie die Steingröße an"></v-text-field>
            <v-text-field v-model="feature_doc.stone_processing" label="Steinbearbeitung" hint="Geben Sie die Steinbearbeitung an"></v-text-field>
            <v-text-field v-model="feature_doc.spolia" label="Spolien" hint="Geben Sie Spolien an"></v-text-field>
            <v-text-field v-model="feature_doc.brick_type" label="Ziegelart" hint="Geben Sie die Ziegelart an"></v-text-field>
            <v-text-field v-model="feature_doc.brick_size" label="Ziegelgröße" hint="Geben Sie die Ziegelgröße an"></v-text-field>
            <v-text-field v-model="feature_doc.production_characteristics" label="Herstellungsmerkmale" hint="Geben Sie die Herstellungsmerkmale an"></v-text-field>
            <v-text-field v-model="feature_doc.binding" label="Bindung" hint="Geben Sie die Bindung an"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_composition" label="Zusammensetzung" hint="Geben Sie die Zusammensetzung an"></v-text-field>
            <v-text-field v-model="feature_doc.grain_size" label="Korngröße" hint="Geben Sie die Korngröße an"></v-text-field>
            <v-text-field v-model="feature_doc.bond_consistency" label="Bindungskonsistenz" hint="Geben Sie die Bindungskonsistenz an"></v-text-field>
            <v-text-field v-model="feature_doc.joint_pattern" label="Fugenbild" hint="Geben Sie das Fugenbild an"></v-text-field>
            <v-text-field v-model="feature_doc.joint_dimensions" label="Fugendimension" hint="Geben Sie die Fugendimension an"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_surface_design" label="Oberflächengestaltung" hint="Geben Sie die Oberflächengestaltung"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_thickness" label="Stärke" hint="Geben Sie die Stärke an"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_expansion" label="Ausdehnung" hint="Geben Sie die Ausdehnung"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_consistency" label="Verputzungskonsistenz" hint="Geben Sie die VErputzungskonsistenz an"></v-text-field>
            <v-text-field v-model="feature_doc.plaster_aggregates" label="Zuschlagstoffe" hint="Geben Sie das Alter an"></v-text-field>
            <v-text-field v-model="feature_doc.multilayer" label="Mehrlagigkeit" hint="Geben Sie die Mehrlagigkeit an"></v-text-field>
            
          </template>
          <template v-if="feature_doc.type === 'Stratigrafische Einheit'">
            <v-text-field v-model="feature_doc.expansion" label="Ausdehnung" hint="Geben Sie die Ausdehnung an"></v-text-field>
            <v-text-field v-model="feature_doc.consistency_in" label="Konistenz Schichtinneres" hint="Geben Sie die innere Schichtkonsistenz an"></v-text-field>
            <v-text-field v-model="feature_doc.consistency_out" label="Konsistenz Schichtäußeres" hint="Geben Sie die äußere Schichtkonsistenz an"></v-text-field>
            <v-text-field v-model="feature_doc.height_values" label="Niveau" hint="Geben Sie das Niveau an"></v-text-field>
          </template>
        </v-tab-item>

  
        <v-tab-item class="px-4">
          <DocArtifacts :artifactslist="feature_doc.artifacts"/>
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
              Do you really want to delete the feature <br> "{{ feature_doc.title }}"?
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" v-on:click="deleteFeature()" @click="dialog = false">
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
import DocArtifacts from './DocArtifacts.vue';
import DocSections from './DocSections.vue';
import DocFeatures from './DocFeatures.vue';
import VueCookies from 'vue-cookies';
import axios from "axios";

export default {
  name: 'FeatureCreation',
  components: {DocArtifacts, DocSections, DocFeatures},
  data() {
    return {
      feature_doc: {
        description: '',
        title: '',
        number: '',
        rel_localization: '',
        interpretation: '',
        type: '',
        artifacts: [],

        age: '',
        gender: '',
        pathology: '',
        preserved_bones: '',
        burial_type: '',
        funeral_type: '',
        burial_construction: '',

        construction: '',
        masonry: '',
        structure: '',
        style_features: '',
        material: '',
        stone_material: '',
        stone_processing: '',
        spolia: '',
        brick_type: '',
        brick_size: '',
        production_characteristics: '',
        binding: '',
        plaster_composition: '',
        grain_size: '',
        bond_consistency: '',
        joint_pattern: '',
        joint_dimensions: '',
        plaster_surface_design: '',
        plaster_thickness: '',
        plaster_expansion: '',
        plaster_consistency: '',
        plaster_aggregates: '',
        multilayer: '',

        expansion: '',
        consistency_in: '',
        consistency_out: '',
        height_values: ''
      },

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

      var newFeature = {
        title: context.feature_doc.title,
        description: context.feature_doc.description,
        number: context.feature_doc.number,
        rel_localization: context.feature_doc.rel_localization,
        interpretation: context.feature_doc.interpretation,
        type_id: context.feature_doc.type_id,
        artifacts: context.feature_doc.artifacts
      }

      if (context.feature_doc.type == 'Überreste'){
          newFeature.type = context.feature_doc.type;
          newFeature.age = context.feature_doc.age;
          newFeature.gender = context.feature_doc.gender;
          newFeature.pathology = context.feature_doc.pathology;
          newFeature.preserved_bones = context.feature_doc.preserved_bones;
          newFeature.burial_construction = context.feature_doc.burial_construction;
          newFeature.burial_type = context.feature_doc.burial_type;
          newFeature.funeral_type = context.feature_doc.funeral_type;

      } else if (context.feature_doc.type == 'Stratigrafische Einheit'){
          newFeature.type = context.feature_doc.type;
          newFeature.expansion = context.feature_doc.expansion;
          newFeature.consistency_in = context.feature_doc.consistency_in;
          newFeature.consistency_out = context.feature_doc.consistency_out;
          newFeature.height_values = context.feature_doc.height_values;

      } else if (context.feature_doc.type == 'Baulicher Bestand'){
          newFeature.type = context.feature_doc.type;
          newFeature.construction = context.feature_doc.construction;
          newFeature.masonry = context.feature_doc.masonry;
          newFeature.structure = context.feature_doc.structure;
          newFeature.style_features = context.feature_doc.style_features;
          newFeature.material = context.feature_doc.material;
          newFeature.stone_material = context.feature_doc.stone_material;
          newFeature.stone_processing = context.feature_doc.stone_processing;
          newFeature.spolia = context.feature_doc.spolia;
          newFeature.brick_type = context.feature_doc.brick_type;
          newFeature.brick_size = context.feature_doc.brick_size;
          newFeature.production_characteristics = context.feature_doc.production_characteristics;
          newFeature.binding = context.feature_doc.binding;
          newFeature.plaster_composition = context.feature_doc.plaster_composition;
          newFeature.grain_size = context.feature_doc.grain_size;
          newFeature.bond_consistency = context.feature_doc.bond_consistency;
          newFeature.joint_pattern = context.feature_doc.joint_pattern;
          newFeature.joint_dimensions = context.feature_doc.joint_dimensions;
          newFeature.plaster_surface_design = context.feature_doc.plaster_surface_design;
          newFeature.plaster_thickness = context.feature_doc.plaster_thickness;
          newFeature.plaster_expansion = context.feature_doc.plaster_expansion;
          newFeature.plaster_consistency = context.feature_doc.plaster_consistency;
          newFeature.plaster_aggregates = context.feature_doc.plaster_aggregates;
          newFeature.multilayer = context.feature_doc.multilayer;
    }

      //put/post request of edited/new feature
      axios({
        method: httpRequest,
        url: requestURL,
        data: newFeature,
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
      var curFeature_type_id = context.feature_doc.type_id;
      axios({
        method: 'delete',
        url: '/features/' + curFeature + '/' + curFeature_type_id,
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
      this.$router.push({ name: "FeaturesOverview" });
    }
  }
};
</script>

<style scoped></style>
