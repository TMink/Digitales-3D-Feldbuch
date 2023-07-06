<template>
  <div id="wrapper">
    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-2">
        <v-window color="background" v-if="!activity_open">

          <h2 class="text-center">AKTIVITÄTEN</h2>
          <v-list>
            <v-list-subheader v-if="activities.length === 0">
              {{ $t('not_created_yet', { object: $tc('activity', 2) }) }}
            </v-list-subheader>

            <!-- ACTIVITIES LIST-->
            <template v-for="(activity, i) in activities" :key="activity">
              <v-row no-gutters v-if="!activity.edit" class="align-center">

                <v-col cols="9">
                  <v-list-item 
                    class="pa-2 ma-2 text-center" 
                    v-on:click="setActivity(activity.id)">

                    <v-list-item-title class="ma-4 text-center">
                      {{ activity.activityNumber }}
                    </v-list-item-title>

                    {{ activity.places.length }} Stellen
                  </v-list-item>
                </v-col>

              </v-row>
              <v-divider v-if="i !== activities.length - 1"/>

              <!-- EXPORT DIALOG -->
              <v-dialog v-model="export_overlay" max-width="800" persistent>
                <v-card>
                  <v-card-title>Export to PDF </v-card-title>
                  <v-card-text>

                    <v-row class="align-center" hide-details>

                      <v-switch color="success" v-model="exportActivities" label="Activities"></v-switch>
                    </v-row>
                    <v-row v-if="exportActivities">
                      <v-col>
                        This will export {{ allActivitiesCount }} Activities
                      </v-col>
                    </v-row>

                    <v-divider/>

                    <v-row class="align-center" hide-details>
                      <v-switch color="success" v-model="exportPlaces" label="Places"></v-switch>
                    </v-row>
                    <v-row v-if="exportPlaces">
                      This will export {{ allPlacesCount }} Places
                      <v-checkbox label="Export Drawings"></v-checkbox>
                      <v-checkbox label="Export Models"></v-checkbox>
                    </v-row>

                    <v-divider/>

                    <v-row class="align-center" hide-details>
                      <v-switch color="success" v-model="exportPositions" label="Positions"></v-switch>
                    </v-row>
                    <v-row v-if="exportPositions">
                      This will export {{ allPositionsCount }} Positions

                      <v-checkbox label="Export Images"></v-checkbox>
                      <v-checkbox label="Export Models"></v-checkbox>
                      <!-- <v-checkbox label="Export additional Params"></v-checkbox> -->
                    
                    </v-row>

                  </v-card-text>

                  <v-card-actions class="justify-center">
                    <v-btn 
                      icon 
                      color="primary" 
                      v-on:click="createPDF()" 
                      :disabled="!exportActivities && !exportPlaces && !exportPositions">
                      <v-icon>mdi-content-save-all</v-icon>
                    </v-btn>
                    <v-btn icon color="error" @click="export_overlay = false">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </template>
            <ConfirmDialog ref="confirm" />
          </v-list>
        </v-window>

        <!-- PLACES LIST -->
        <v-window color="background" v-if="activity_open && !place_open">
          <v-btn 
            icon 
            color="decline" 
            @click="activity_open = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h2 class="text-center">STELLEN</h2>

          <v-list>
            <v-list-subheader v-if="places.length === 0">
              {{ $t('not_created_yet', { object: $tc('place', 2) }) }}
            </v-list-subheader>

            <!--Lists all locally saved places-->
            <template v-for="(place, i) in places" :key="place">
              <v-row no-gutters v-if="!place.edit" class="align-center">
                <v-col cols="9">
                  <v-list-item 
                    class="pa-2 ma-2 text-center" 
                    v-on:click="setPlace(place.id)">

                    <v-list-item-title class="ma-4 text-center">
                      {{ place.placeNumber }} 
                      {{ place.title.join("; ") }} 
                      {{ place.date }}
                    </v-list-item-title>

                    {{ place.positions.length }} Positionen
                  </v-list-item>
                </v-col>

                <v-btn 
                  class="ma-1" 
                  color="primary" 
                  v-on:click="export_overlay = true">
                  Export to PDF
                </v-btn>
              </v-row>

              <v-divider v-if="i !== places.length - 1"/>

            </template>
            <ConfirmDialog ref="confirm" />
          </v-list>
        </v-window>

    <!-- PLACES LIST -->
        <v-window color="background" v-if="place_open">

          <v-btn icon color="decline" @click="place_open = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h2 class="text-center">POSITIONEN</h2>
          <v-list>
            <v-list-subheader v-if="positions.length === 0">
              {{ $t('not_created_yet', { object: $tc('position', 2) }) }}
            </v-list-subheader>
            <!--Lists all locally saved positions-->
            <template v-for="(position, i) in positions" :key="position">
              <v-row no-gutters v-if="!position.edit" class="align-center">

                <v-col cols="9">
                  <v-list-item class="pa-2 ma-2 text-center">
                    <v-list-item-title class="ma-4 text-center">
                      {{ position.positionNumber }}
                    </v-list-item-title>
                    <!-- {{ position.positions.length }} Stellen -->
                  </v-list-item>
                </v-col>

              </v-row>
              <v-divider v-if="i !== positions.length - 1"/>

            </template>
            <ConfirmDialog ref="confirm" />
          </v-list>
        </v-window>

        <v-row no-gutters class="pa-1 justify-center">
          <v-btn 
            class="ma-1" 
            color="primary" 
            v-on:click="export_overlay = true">
            Export to PDF
          </v-btn>
        </v-row>

      </v-form>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>
  
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { toRaw } from 'vue'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'


export default {
  name: 'PDFExport',
  components: {
    ConfirmDialog,
  },
  data() {
    return {
      activities: [],
      places: [],
      positions: [],
      activity_open: false,
      place_open: false,
      export_overlay: false,
      exportActivities: false,
      exportPlaces: false,
      exportPositions: false,
      rules: {
        required: value => !!value || 'Required.',
      },
      allActivitiesCount: '',
      allPlacesCount: '',
      allPositionsCount: '',
    };
  },
  async created() {
    this.$emit("view", this.$t('pdf_export'));
    await fromOfflineDB.syncLocalDBs();

    this.allActivitiesCount = await fromOfflineDB.getStoreCount('Activities', 'activities');
    this.allPlacesCount = await fromOfflineDB.getStoreCount('Places', 'places');
    this.allPositionsCount = await fromOfflineDB.getStoreCount('Positions', 'positions');

    await this.updateActivities();
    await this.updatePlaces();
    await this.updatePositions();
  },
  methods: {
    /**
     * Get all activities from IndexedDb
     */
    async updateActivities() {
      /* Receive all IDs in store */
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities')
    },
    /**
     * Get all places from IndexedDb
     */
    async updatePlaces() {
      /* Receive all IDs in store */
      this.places = await fromOfflineDB.getAllObjects('Places', 'places')
    },
    /**
     * Get all places from IndexedDb
     */
    async updatePositions() {
      /* Receive all IDs in store */
      this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions')
    },
    /**
    * Opens the confirmation dialog for export
    * @param {*} activity 
    */
    async confirmExport(activity) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Do you really want to export this activity to pdf? "
          + activity.activityNumber + "?"
        )
      ) {
        this.exportActivity(activity);
      }
    },
    /**
     * Sets the active activity and filters places accordingly
     * @param {String} activity_id 
     */
    async setActivity(activity_id) {
      this.places = await fromOfflineDB.getAllObjectsWithID(
        activity_id, 'Activity', 'Places', 'places');
      /* this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1) */
      this.activity_open = true;
      console.log(this.places);
    },
    /**
     *  Sets the active activity and filters positions accordingly
     * @param {*} place_id 
     */
    async setPlace(place_id) {
      this.positions = await fromOfflineDB.getAllObjectsWithID(
        place_id, 'Place', 'Positions', 'positions');
      /* this.places.sort((a, b) => (a.placeNumber > b.placeNumber) ? 1 : -1) */
      this.place_open = true;
    },
    /**
     * Starts the PDF export process
     */
    createPDF() {

      if (this.exportActivities) {
        this.createActivitiesPDF();
      }

      if (this.exportPlaces) {
        this.createPlacesPDF();
      }

      if (this.exportPositions) {
        this.createPositionsPDF();
      }
    },
    /**
     * Creates and saves a pdf file of all activities
     */
    createActivitiesPDF() {

      const doc = new jsPDF();
      let date = new Date().toLocaleDateString("de-DE");
      let filename = "activitylist_" + date;
      doc.text("Aktivitätenliste - Stand: " + date, 20, 10);

      autoTable(doc, {
        //styles: { fillColor: [58, 58, 71] },

        startY: 20,
        border: { top: 10 },
        margin: { top: 10 },
        columns: [
          { header: 'Außenstelle', dataKey: 'branchOffice' },
          { header: 'Jahr', dataKey: 'year' },
          { header: 'Nummer', dataKey: 'number' },
          { header: 'ID', dataKey: 'id' },
        ],
        body:
          toRaw(this.activities)
      });

      doc.save(filename + ".pdf");
    },
    /**
     * Creates and saves a pdf file of all places
     */
    async createPlacesPDF() {
      const doc = new jsPDF({
        orientation: "landscape",
      });
      let date = new Date().toLocaleDateString("de-DE");
      let filename = "placeslist_" + date;
      doc.text("Stellenliste - Stand: " + date, 20, 10);
      var allPlaces = toRaw(this.places)

      var activityId = '';
      var activityNumber = '';

      for (var place of allPlaces) {

        if (activityId != place.acivityID) {
          activityId = place.activityID
          activityNumber = await fromOfflineDB.getObject(activityId, 'Activities', 'activities')
          activityNumber = activityNumber.activityNumber;
        }
        place.activity = activityNumber;
      }
      autoTable(doc, {
        //styles: { fillColor: [58, 58, 71] },
        styles: {
          fontSize: 5,
        },
        startY: 20,
        border: { top: 10 },
        margin: { top: 10 },
        columns: [
          { header: 'Aktivität', dataKey: 'activity' },
          { header: 'Stellennr', dataKey: 'placeNumber' },
          { header: 'BefAnsprac', dataKey: 'title' },
          { header: 'Datierung', dataKey: 'dating' },
          { header: 'KeinBefund', dataKey: 'noFinding' },
          { header: 'RestBefund', dataKey: 'restFinding' },
          { header: 'Rechts', dataKey: 'right' },
          { header: 'Rechts bis', dataKey: 'rightTo' },
          { header: 'Hoch', dataKey: 'up' },
          { header: 'Hoch bis', dataKey: 'upTo' },
          { header: 'TiefeOK', dataKey: 'depthTop' },
          { header: 'TiefeUK', dataKey: 'depthBot' },
          { header: 'Planum', dataKey: 'plane' },
          { header: 'Profil', dataKey: 'profile' },
          { header: 'Sichtbar', dataKey: 'visibility' },
          { header: 'Zeichnung', dataKey: 'drawing' },
          { header: 'Kommentar', dataKey: 'description' },
          { header: 'Bearbeiter', dataKey: 'editor' },
          { header: 'Datum', dataKey: 'date' },

        ],
        body:
          allPlaces
      });

      doc.save(filename + ".pdf");
    },
    /**
     * Creates and saves a pdf file of all positions
     */
    async createPositionsPDF() {
      console.log("POSITIONS PDF");

      const doc = new jsPDF({
        orientation: "landscape",
      });
      let date = new Date().toLocaleDateString("de-DE");
      let filename = "positionslist_" + date;
      doc.text("Positionenliste - Stand: " + date, 20, 10);
      var allPositions = toRaw(this.positions)

      var activityId = '';
      var activityNumber = '';
      var placeId = '';
      var placeNumber = '';

      for (var position of allPositions) {

        if (placeId != position.placeID) {
          placeId = position.placeID;
          var tempPlace = await fromOfflineDB.getObject(placeId, 'Places', 'places');
          placeNumber = tempPlace.placeNumber;

          if (activityId != tempPlace.activityID) {
            activityId = tempPlace.activityID;
            console.log(activityId)
            var tempActivity = await fromOfflineDB.getObject(activityId, 'Activities', 'activities');
            activityNumber = tempActivity.activityNumber;
          }
        }
        position.place = placeNumber;
        position.activity = activityNumber;
      }

      autoTable(doc, {
        //styles: { fillColor: [58, 58, 71] },
        styles: {
          fontSize: 5,
        },
        startY: 20,
        border: { top: 10 },
        margin: { top: 10 },
        columns: [
          { header: 'Aktivität', dataKey: 'activity' },
          { header: 'Stellennr', dataKey: 'placeNumber' },
          { header: 'Posnr', dataKey: 'positionNumber' },
          { header: 'Unternr', dataKey: 'subNumber' },
          { header: 'Rechts', dataKey: 'right' },
          { header: 'Hoch', dataKey: 'up' },
          { header: 'Hoehe', dataKey: 'height' },
          { header: 'Anzahl', dataKey: 'count' },
          { header: 'Gewicht', dataKey: 'weight' },
          { header: 'Material', dataKey: 'material' },
          { header: 'Ansprache', dataKey: 'title' },
          { header: 'Kommentar', dataKey: 'description' },
          { header: 'Datierung', dataKey: 'dating' },
          { header: 'Ansprache von', dataKey: 'addressOf' },
          { header: 'Datum', dataKey: 'date' },
          { header: 'Getrennt', dataKey: 'isSeperate' },
        ],
        body:
          allPositions
      });

      doc.save(filename + ".pdf");
    },
    /**
     * Creates and saves a pdf file of all images
     */
    createImageListPDF() {
      console.log("IMAGES PDF");
    },
  }
}
</script>
  
<style>
.v-switch__thumb {
  color: red;
}
</style>