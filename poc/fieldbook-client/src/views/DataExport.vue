<template>
  <div id="wrapper">
    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-2">
        
        <!-- LIST ACTIVITIES -->
        <v-window color="background" v-if="!activity_open">
          <v-btn icon color="decline" disabled>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <h2 class="text-center pb-4">AKTIVITÄTEN</h2>

          <!--Lists all locally saved positions-->
          <div :style="getTableHeight">
            <v-data-table-virtual
              fixed-header
              :items="activities"
              @click:row="setActivity"
              :headers="activityHeaders"
              :height="windowHeight - 450">
            </v-data-table-virtual>
          </div>
        </v-window>

        <!-- PLACES LIST -->
        <v-window 
          color="background" 
          v-if="activity_open && !place_open">
          <v-btn 
            icon 
            @click="activity_open = false; 
            exportPlaces = true; 
            exportActivities = true">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <h2 class="text-center pb-4">STELLEN</h2>

          <!--Lists all locally saved places-->
          <div :style="getTableHeight">
            <v-data-table-virtual
              fixed-header
              :items="places"
              class="custom-table"
              @click:row="setPlace"
              :headers="placeHeaders">
            </v-data-table-virtual>
          </div>
        </v-window>
        
        <!-- PLACES LIST -->
        <v-window color="background" v-if="place_open">
          <v-btn 
            icon 
            color="decline" 
            @click="place_open = false; exportPlaces = true">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          
          <h2 class="text-center pb-4">POSITIONEN</h2>
          
          <!--Lists all locally saved positions-->
          <div :style="getTableHeight">
            <v-data-table-virtual
              fixed-header
              :items="positions"
              :headers="positionHeaders">
            </v-data-table-virtual>
          </div>
        </v-window>
        
        
        <!-- EXPORT DIALOG -->
        <v-dialog v-model="export_overlay" max-width="800" persistent>
          <v-card>
            <v-card-title>Export to PDF </v-card-title>
            <v-card-text>
              <v-row class="text-center">

              <!-- ACTIVITIES -->
              <v-col cols="4" class="align-center" hide-details>
                <v-switch 
                  hide-details 
                  color="success" 
                  label="Activities"
                  :disabled="activity_open" 
                  v-model="exportActivities">
                </v-switch>

                <v-col> 
                  <p v-if="exportActivities">
                    This will export {{ this.activities.length }} Activities
                  </p>
                  <p style="color:grey" v-if="!exportActivities">
                    This will export 0 Activities
                  </p>
                </v-col>
              </v-col>
            
              <v-divider vertical/>

              <!-- PLACES -->
              <v-col cols="4" class="align-center" >
                <v-switch 
                  hide-details 
                  color="success" 
                  label="Places"
                  v-model="exportPlaces"
                  :disabled="place_open && activity_open">
                </v-switch>
                <v-col>
                  <p v-if="exportPlaces">
                    This will export {{ this.places.length }} Places
                  </p>
                  <p style="color:grey" v-if="!exportPlaces">
                    This will export 0 Places
                  </p>
                  <v-checkbox 
                    hide-details 
                    class="pt-4" 
                    label="Export Drawings" 
                    :disabled="!exportPlaces">
                  </v-checkbox>

                  <v-checkbox 
                    hide-details 
                    label="Export Models" 
                    :disabled="!exportPlaces">
                  </v-checkbox>
                </v-col>
              </v-col>
            
              <v-divider vertical/>

              <!-- POSITIONS -->
              <v-col cols="4" class="align-center">
                <v-row no-gutters class="justify-center align-center">
                  <v-switch hide-details color="success" label="Positions"
                    v-model="exportPositions">
                  </v-switch>
                </v-row>
              
                <v-col>
                  <p v-if="exportPositions">
                    This will export {{ this.positions.length }} Positions
                  </p>
                  <p style="color:grey" v-if="!exportPositions">
                    This will export 0 Positions
                  </p>
                  <v-checkbox 
                    hide-details 
                    class="pt-4" 
                    label="Export Images" 
                    :disabled="!exportPositions">
                  </v-checkbox>
                  <v-checkbox 
                    hide-details 
                    label="Export Models" 
                    :disabled="!exportPositions">
                  </v-checkbox>
                </v-col>
              </v-col>
            </v-row>

            <v-divider class="mt-3"/>

            <v-row no-gutters class="justify-center align-center">
              <v-col cols="3" >

                <v-combobox 
                  class="pa-4" 
                  label="Dateiformat"
                  v-model="fileFormat"
                  :items="['.pdf', '.csv']">
                </v-combobox>
              </v-col>
              <v-col cols="4">

                <v-radio-group v-model="separator" class="ma-2" label="Separator" v-if="fileFormat == '.csv'">
                  <v-radio label="Comma separated" value=","></v-radio>
                  <v-radio label="Semicolon separated" value=";"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>

            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn icon color="primary" v-on:click="startExport()" 
                :disabled="!exportActivities && !exportPlaces && !exportPositions">
                <v-icon>mdi-content-save-all</v-icon>
              </v-btn>
              <v-btn icon color="error" @click="export_overlay = false">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row no-gutters class="pa-1 justify-center">
          <v-btn class="ma-1" color="primary" v-on:click="export_overlay = true">
            Export
          </v-btn>
        </v-row>

        <ConfirmDialog ref="confirm" />
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
import { useWindowSize } from 'vue-window-size';
import { saveAs } from 'file-saver';

export default {
  name: 'DataExport',
  components: {
    ConfirmDialog,
  },
  emits: ['view'],
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  data() {
    return {
      activities: [],
      places: [],
      positions: [],
      selected_activity: '',
      selected_place: '',
      activity_open: false,
      place_open: false,
      separator: ';',
      fileFormat: '.pdf',
      export_overlay: false,
      exportActivities: true,
      exportPlaces: true,
      exportPositions: true,
      rules: {
        required: value => !!value || 'Required.',
      },
      allActivitiesCount: '',
      allPlacesCount: '',
      allPositionsCount: '',
      activityHeaders: [
        [
          { title: 'Außenstelle', align: 'start', key: 'branchOffice' },
          { title: 'Jahr', align: 'start', key: 'year' },
          { title: 'Nr.', align: 'start', key: 'number' },
          { title: 'Places', align: 'start', key: 'places.length' },
        ],
      ],
      placeHeaders: [
        [
          { title: 'Nr.', align: 'start', key: 'placeNumber'},
          { title: 'Ansprache', align: 'start', key: 'title' },
          { title: 'Datum', align: 'start', key: 'date' },
          { title: 'Images', align: 'start', key: 'images.length' },
          { title: 'Models', align: 'start', key: 'models.length' },
          { title: 'Positions', align: 'start', key: 'positions.length' },
        ],
      ],
      positionHeaders: [
        [
          { title: 'Nr.', align: 'start', key: 'positionNumber' },
          { title: 'SubNr.', align: 'start', key: 'subNumber' },
          { title: 'Ansprache', align: 'start', key: 'title' },
          { title: 'Datierung', align: 'start', key: 'dating' },
          { title: 'Datum', align: 'start', key: 'date' },
          { title: 'Images', align: 'start', key: 'images.length' },
          { title: 'Models', align: 'start', key: 'models.length' },
        ],
      ],
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

  computed: {
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.activities.length;
      const headerHeight = 56;
      const rowHeight = 48;

      const totalTableHeight = headerHeight + numberOfRows * rowHeight + 10;
      return { height: totalTableHeight + 'px' };
    },
  },
  methods: {
    applyRowColors(item, index) {
      // This method dynamically sets the CSS class for each row
      return index % 2 === 0 ? 'even-row' : 'odd-row';
    },
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
      this.places = await fromOfflineDB.getAllObjects('Places', 'places');
      var activityId = '';
      var activityNumber = '';

      for (var place of this.places) {

        if (activityId != place.acivityID) {
          activityId = place.activityID
          activityNumber = await fromOfflineDB.getObject(activityId, 'Activities', 'activities')
          activityNumber = activityNumber.activityNumber;
        }
        place.activity = activityNumber;
      }

    },
    /**
     * Get all places from IndexedDb
     */
    async updatePositions() {
      /* Receive all IDs in store */
      this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');

      var activityId = '';
      var activityNumber = '';
      var placeId = '';
      var placeNumber = '';

      for (var position of this.positions) {
        // get and set the placeNumber of the current Position
        if (placeId != position.placeID) {
          placeId = position.placeID;
          var tempPlace = await fromOfflineDB.getObject(placeId, 'Places', 'places');
          placeNumber = tempPlace.placeNumber;

          // get and set the activityNumber of the current Position
          if (activityId != tempPlace.activityID) {
            activityId = tempPlace.activityID;
            var tempActivity = await fromOfflineDB.getObject(activityId, 'Activities', 'activities');
            activityNumber = tempActivity.activityNumber;
          }
        }
        position.place = placeNumber;
        position.activity = activityNumber;
      }
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
     * Sets the active activity and filters places + positions accordingly
     * @param {String} activity_id 
     */
    async setActivity(e, { item }) {
      var activity_id = item.raw.id;

      // don't move to places list if there are none
      if (item.raw.places.length == 0) {
        return;
      }

      this.places = await fromOfflineDB.getAllObjectsWithID(
        activity_id, 'Activity', 'Places', 'places');

      // set positions to only include positions from the current activity
      var tempPositions = [];
      for (var i=0; i< this.places.length; i++) {
        var tempPos = await fromOfflineDB.getAllObjectsWithID(
            this.places[i].id, 'Place', 'Positions', 'positions');
        tempPositions = tempPositions.concat(tempPos);   
      }
      this.positions = tempPositions;
      
      this.activity_open = true;
      this.selected_activity = activity_id;

      this.exportActivities = false;
      this.exportPlaces = true;
      this.exportPositions = true;
    },
    /**
     *  Sets the active activity and filters positions accordingly
     * @param {*} place_id 
     */
    async setPlace(e, { item }) {

      // don't move to positions list if there are none
      if (item.raw.positions.length == 0) {
        return;
      }

      var place_id = item.raw.id;
      this.positions = await fromOfflineDB.getAllObjectsWithID(
        place_id, 'Place', 'Positions', 'positions');
      this.place_open = true;
      this.selected_place = place_id;

      this.exportActivities = false;
      this.exportPlaces = false;
      this.exportPositions = true;
    },
    /**
     * Starts the export process and checks 
     * which data format has to be exported
     */
    startExport() {
      if (this.fileFormat == '.pdf') {
        this.startPDFExport();
      } else if (this.fileFormat == '.csv') {
        this.startCSVExport();
      }
    },
    /**
     * Starts the CSV export process
     */
    async startCSVExport() {
      // TODO: create one function das dynamically exports 
      // activities/places/positions depending on input parameters

      if (this.exportActivities) {
        this.createCSV(this.activities, "activitylist");
      }

      if (this.exportPlaces) {
        this.createCSV(this.places, "placeslist");
      }

      if (this.exportPositions) {
        this.createCSV(this.positions, "positionslist");
      }
    },
    /**
     * Creates and saves a .csv file
     * @param {[ProxyObject]} data 
     * @param {String} filename 
     */
    createCSV(data, filename) {
      const items = toRaw(data);
      const replacer = (key, value) => value === null ? '' : value;
      const header = Object.keys(items[0]);

      // remove unwanted fields
      let index = header.indexOf("lastSync");
      header.splice(index, 1);
      index = header.indexOf("lastChanged");
      header.splice(index, 1);
      index = header.indexOf("id");
      header.splice(index, 1);

      // TODO: reformat the export output of fields 
      //    - boolean fields should show `x` or `` instead of `true` and `false`
      //    - arrays should be shortened to a `(not sure yet)` separated string of the IDs

      // build ',' or ';' separated string
      const csv = [header.join(this.separator), ...items.map(row => 
        header.map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(this.separator))
      ].join('\r\n')

      // create ',' or ';' separated blob
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      // save .csv file
      saveAs(blob, filename + ".csv");
    },
    
    /**
     * Starts the PDF export process
     */
    startPDFExport() {
      // TODO: create one function das dynamically exports 
      // activities/places/positions depending on input parameters
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

      // create the activities table
      autoTable(doc, {
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

      // save the .pdf file
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
      var allPlaces = toRaw(this.places);

      // create the places table
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

      // save the .pdf file
      doc.save(filename + ".pdf");
    },
    /**
     * Creates and saves a pdf file of all positions
     */
    async createPositionsPDF() {
      const doc = new jsPDF({
        orientation: "landscape",
      });
      let date = new Date().toLocaleDateString("de-DE");
      let filename = "positionslist_" + date;
      doc.text("Positionenliste - Stand: " + date, 20, 10);
      var allPositions = toRaw(this.positions)

      // create the positions table
      autoTable(doc, {
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

      // save the .pdf file
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
  
<style scoped>
.v-switch__thumb {
  color: red;
}
</style>