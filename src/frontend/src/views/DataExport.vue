<!--
 * Created Date: 26.06.2023 15:10:20
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.08.2024 15:06:42
 * Modified By: Julian Hardtung
 * 
 * Description: export all (or only specified) data to .pdf or .csv
 -->

<template>
  <Navigation />
  <div id="wrapper">
    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-2">

        <!-- LIST ACTIVITIES -->
        <v-window 
          color="background" 
          v-if="!activity_open">
          <v-btn 
            icon 
            color="decline" 
            disabled>
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <h2 class="text-center pb-4">
            {{ $tc('activity', 2).toUpperCase() }}
          </h2>

          <!--Lists all locally saved positions-->
          <v-data-table-virtual 
            fixed-header 
            :items="activities" 
            :height="getTableHeight" 
            @click:row="setActivity"
            :headers="activityHeaders">
          </v-data-table-virtual>
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

          <h2 class="text-center pb-2">
            {{ $tc('place', 2).toUpperCase() }}
          </h2>

          <v-card-title class="pb-2 pl-4">
            {{ selected_activity_number }}
          </v-card-title>

          <!--Lists all locally saved places-->
          <v-data-table-virtual 
            fixed-header 
            :items="places" 
            class="custom-table" 
            :height="getTableHeight"
            @click:row="setPlace" 
            :headers="placeHeaders">
          </v-data-table-virtual>
        </v-window>

        <!-- PLACES LIST -->
        <v-window 
          color="background" 
          v-if="place_open">
          <v-btn 
            icon 
            color="decline" 
            @click="place_open = false; exportPlaces = true">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <h2 class="text-center pb-2">
            {{ $tc('position', 2).toUpperCase() }}
          </h2>

          <v-card-title class="pb-2 pl-4">
            {{ selected_activity_number }} | {{ $tc('place', 1) + ' ' + selected_place_number }}
          </v-card-title>

          <!--Lists all locally saved positions-->
          <v-data-table-virtual 
            fixed-header 
            :items="positions" 
            :height="getTableHeight" 
            :headers="positionHeaders">
          </v-data-table-virtual>
        </v-window>


        <!-- EXPORT DIALOG -->
        <v-dialog 
          v-model="export_overlay" 
          max-width="800" 
          persistent>
          <v-card>
            <v-card-title> {{ $t('export') }} </v-card-title>
            <v-card-text>
              <v-row class="text-center">

                <!-- ACTIVITIES -->
                <v-col 
                  cols="4" 
                  class="align-center" 
                  hide-details>
                  <v-switch 
                    :label="$tc('activity', 2)" 
                    :disabled="activity_open" 
                    v-model="exportActivities" 
                    hide-details
                    color="success">
                  </v-switch>

                  <v-col>
                    <p v-if="exportActivities">
                      {{ this.activities.length + ' ' + $tc('activity', 2) }}
                    </p>
                  </v-col>
                </v-col>

                <v-divider vertical />

                <!-- PLACES -->
                <v-col cols="4" class="align-center">
                  <v-switch 
                    hide-details 
                    color="success" 
                    :label="$tc('place', 2)" 
                    v-model="exportPlaces"
                    :disabled="place_open && activity_open">
                  </v-switch>
                  <v-col>
                    <p v-if="exportPlaces">
                      {{ this.places.length + ' ' + $tc('place', 2) }}
                    </p>
                    <v-checkbox 
                      hide-details 
                      class="pt-4" 
                      v-model="exportPlaceImages"
                      :label="$t('exportObject', { object: $tc('image', 2) })" 
                      :disabled="!exportPlaces"
                      color="secondary">
                    </v-checkbox>

                    <v-checkbox 
                      hide-details 
                      v-model="exportPlaceModels"
                      :label="$t('exportObject', { object: $tc('model', 2) })" 
                      :disabled="!exportPlaces" 
                      color="secondary">
                    </v-checkbox>
                  </v-col>
                </v-col>

                <v-divider vertical />

                <!-- POSITIONS -->
                <v-col cols="4" class="align-center">
                  <v-row 
                    no-gutters 
                    class="justify-center align-center">
                    <v-switch 
                      hide-details 
                      color="success" 
                      :label="$tc('position', 2)" 
                      v-model="exportPositions">
                    </v-switch>
                  </v-row>

                  <v-col>
                    <p v-if="exportPositions">
                      {{ this.positions.length + ' ' + $tc('position', 2) }}
                    </p>
                    <v-checkbox 
                      hide-details 
                      class="pt-4" 
                      :label="$t('exportObject', { object: $tc('image', 2) })"
                      :disabled="!exportPositions" 
                      color="secondary">
                    </v-checkbox>
                    <v-checkbox 
                      hide-details 
                      :label="$t('exportObject', { object: $tc('model', 2) })"
                      :disabled="!exportPositions" 
                      color="secondary">
                    </v-checkbox>
                  </v-col>
                </v-col>
              </v-row>

              <v-divider class="mt-3" />

              <v-row 
                no-gutters 
                class="justify-center align-center">
                <v-col cols="3">

                  <v-combobox 
                    class="pa-4" 
                    :label="$t('dataFormat')" 
                    v-model="fileFormat" 
                    :items="['.pdf', '.csv']">
                  </v-combobox>
                </v-col>
                <v-col cols="4">

                  <v-radio-group 
                    v-model="separator" 
                    class="ma-2" 
                    :label="$t('separator')" 
                    v-if="fileFormat == '.csv'">
                    <v-radio :label="$t('objectSeparated', {
                      object: $t('comma')
                    })" value=",">
                    </v-radio>
                    <v-radio :label="$t('objectSeparated', {
                      object: $t('semicolon')
                    })" value=";">
                    </v-radio>
                  </v-radio-group>
                </v-col>
              </v-row>

            </v-card-text>

            <v-card-actions class="justify-center">
              <v-btn 
                icon 
                color="success" 
                v-on:click="startExport()"
                :disabled="!exportActivities && !exportPlaces && !exportPositions">
                <v-icon>mdi-content-save-all</v-icon>
              </v-btn>
              <v-btn 
                icon 
                color="primary" @click="export_overlay = false">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-row 
          no-gutters 
          class="pa-2 justify-center">
          <v-btn 
            class="ma-1" 
            color="primary" 
            v-on:click="export_overlay = true">
            <v-icon size="x-large">mdi-file-export</v-icon>
            {{ $t('export')}}
          </v-btn>
        </v-row>

        <ConfirmDialog ref="confirm" />
      </v-form>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { toRaw } from 'vue'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { useWindowSize } from 'vue-window-size';
import { saveAs } from 'file-saver';

export default {
  name: 'DataExport',
  components: {
    Navigation,
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
      selected_activity_number: '',
      selected_place: '',
      activity_open: false,
      place_open: false,
      separator: ';',
      fileFormat: '.pdf',
      export_overlay: false,
      exportActivities: true,
      exportPlaces: true,
      exportPositions: true,
      exportPlaceImages: false,
      exportPlaceModels: false,
      exportPositionImages: false,
      exportPositionModels: false,
      allPlacesOfOneActivity: [],
      allPositionsOfOnePlace: [],
      rules: {
        required: value => !!value || 'Required.',
      },
      allActivitiesCount: '',
      allPlacesCount: '',
      allPositionsCount: '',
      activityHeaders: [
        [
          { title: this.$t('branchOffice'), align: 'start', key: 'branchOffice' },
          { title: this.$t('year'), align: 'start', key: 'year' },
          { title: this.$tc('number', 2), align: 'start', key: 'number' },
          { title: this.$tc('place', 2), align: 'start', key: 'places.length' },
        ],
      ],
      placeHeaders: [
        [
          { title: this.$tc('number', 2), align: 'start', key: 'placeNumber'},
          { title: this.$tc('title', 2), align: 'start', key: 'title' },
          { title: this.$t('date'), align: 'start', key: 'date' },
          { title: this.$tc('image', 2), align: 'start', key: 'images.length' },
          { title: this.$tc('model', 2), align: 'start', key: 'models.length' },
          { title: this.$tc('position', 2), align: 'start', key: 'positions.length' },
        ],
      ],
      positionHeaders: [
        [
          { title: this.$tc('number', 2), align: 'start', key: 'positionNumber' },
          { title: this.$tc('subNumber', 2), align: 'start', key: 'subNumber' },
          { title: this.$tc('title', 2), align: 'start', key: 'title' },
          { title: this.$t('dating'), align: 'start', key: 'dating' },
          { title: this.$t('date'), align: 'start', key: 'date' },
          { title: this.$tc('image', 2), align: 'start', key: 'images.length' },
          { title: this.$tc('model', 2), align: 'start', key: 'models.length' },
        ],
      ],
    };
  },
  async created() {
    this.$emit("view", this.$t('pdf_export'));
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));

    this.allActivitiesCount = await fromOfflineDB
      .getStoreCount('Activities', 'activities')
      .catch(err => console.error(err));
    this.allPlacesCount = await fromOfflineDB
      .getStoreCount('Places', 'places')
      .catch(err => console.error(err));
    this.allPositionsCount = await fromOfflineDB
      .getStoreCount('Positions', 'positions')
      .catch(err => console.error(err));

    await this.updateActivities()
      .catch(err => console.error(err));
    await this.updatePlaces()
      .catch(err => console.error(err));
    await this.updatePositions()
      .catch(err => console.error(err));
    this.preparePlaceCard();
  },

  computed: {
    getTableHeight() {
      // Calculate the required table height based on the number of items
      var numberOfRows = this.activities.length;
      const headerHeight = 56;
      const rowHeight = 52;

      if (this.activity_open) {
        if (this.place_open) {
          numberOfRows = this.positions.length;
        } else {
          numberOfRows = this.places.length;
        }
      }

      const totalTableHeight = headerHeight + numberOfRows * rowHeight;

      if (totalTableHeight > (this.windowHeight - 385)) {
        return this.windowHeight - 385;
      }

      return totalTableHeight + 'px';
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
      this.activities = await fromOfflineDB
        .getAllObjects('Activities', 'activities')
        .catch(err => console.error(err));
      this.activities = this.activities.sort((a, b) => {
        return a.number - b.number;
      });
    },

    /**
     * Get all places from IndexedDb
     */
    async updatePlaces() {
      /* Receive all IDs in store */
      this.places = await fromOfflineDB.getAllObjects('Places', 'places')
        .catch(err => console.error(err));
      var activityId = '';
      var activityNumber = '';

      for (var place of this.places) {

        if (activityId != place.acivityID) {
          activityId = place.activityID
          activityNumber = await fromOfflineDB
            .getObject(activityId, 'Activities', 'activities')
            .catch(err => console.error(err));
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
      this.positions = await fromOfflineDB
        .getAllObjects('Positions', 'positions')
        .catch(err => console.error(err));

      var activityId = '';
      var activityNumber = '';
      var placeId = '';
      var placeNumber = '';

      for (var position of this.positions) {
        // get and set the placeNumber of the current Position
        if (placeId != position.placeID) {
          placeId = position.placeID;
          var tempPlace = await fromOfflineDB
            .getObject(placeId, 'Places', 'places')
            .catch(err => console.error(err));
          if ( tempPlace == undefined ) {
            continue
          }
          placeNumber = tempPlace.placeNumber;


          // get and set the activityNumber of the current Position
          if (activityId != tempPlace.activityID) {
            activityId = tempPlace.activityID;
            var tempActivity = await fromOfflineDB
              .getObject(activityId, 'Activities', 'activities')
              .catch(err => console.error(err));
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
        ).catch(err => console.error(err))
      ) {
        this.exportActivity(activity);
      }
    },

    /**
     * Sets the active activity and filters places + positions accordingly
     * @param {String} activity_id 
     */
    async setActivity(e, { item }) {
      var activity_id = item._id;

      // don't move to places list if there are none
      if (item.places.length == 0) {
        return;
      }

      this.places = await fromOfflineDB
        .getAllObjectsWithID(activity_id, 'Activity', 'Places', 'places')
        .catch(err => console.error(err));

      // set positions to only include positions from the current activity
      var tempPositions = [];
      for (var i=0; i< this.places.length; i++) {
        var tempPos = await fromOfflineDB
          .getAllObjectsWithID(this.places[i]._id, 'Place', 'Positions', 'positions')
          .catch(err => console.error(err));
        tempPositions = tempPositions.concat(tempPos);   
      }
      this.positions = tempPositions;
      
      this.activity_open = true;
      this.selected_activity = activity_id;
      this.selected_activity_number = item.activityNumber;

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
      if (item.positions.length == 0) {
        return;
      }

      var place_id = item._id;
      this.positions = await fromOfflineDB
        .getAllObjectsWithID(place_id, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));
      this.place_open = true;
      this.selected_place = place_id;
      this.selected_place_number = item.placeNumber;

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

    // /**
    //  * Creates and saves a .csv file
    //  * @param {[ProxyObject]} data 
    //  * @param {String} filename 
    //  */
    // createCSV(data, filename) {
    //   const items = toRaw(data);
    //   const replacer = (key, value) => value === null ? '' : value;
    //   const header = Object.keys(items[0]);

    //   // remove unwanted fields
    //   let index = header.indexOf("lastSync");
    //   header.splice(index, 1);
    //   index = header.indexOf("lastChanged");
    //   header.splice(index, 1);
    //   index = header.indexOf("_id");
    //   header.splice(index, 1);

    //   // TODO: reformat the export output of fields 
    //   //    - boolean fields should show `x` or `` instead of `true` and `false`
    //   //    - arrays should be shortened to a `(not sure yet)` separated string of the IDs

    //   // build ',' or ';' separated string
    //   const csv = [header.join(this.separator), ...items.map(row => 
    //     header.map(fieldName => JSON.stringify(row[fieldName], replacer))
    //       .join(this.separator))
    //   ].join('\r\n')

    //   // create ',' or ';' separated blob
    //   var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    //   // save .csv file
    //   saveAs(blob, filename + ".csv");
    // },

    /**
     * Creates and saves a .csv file
     * @param {[ProxyObject]} data 
     * @param {String} filename 
     */
     createCSV(data, filename) {
      const items = toRaw(data);
      const replacer = (key, value) => value === null ? '' : value;
      const cursor = Object.keys(items[0]);
      let header = null;

      console.log(items)

      // remove unwanted fields
      let index = cursor.indexOf("lastSync");
      cursor.splice(index, 1);
      index = cursor.indexOf("lastChanged");
      cursor.splice(index, 1);
      index = cursor.indexOf("_id");
      cursor.splice(index, 1);
      if( filename == "activitylist" ) {
        index = cursor.indexOf("camera");
        cursor.splice(index, 1);

        header = JSON.parse(JSON.stringify(cursor))
        let index2 = header.indexOf( "activityNumber" )
        header[ index2 ] = "activity"
      }
      if( filename == "placeslist" ) {
        index = cursor.indexOf("activity");
        cursor.splice(index, 1);
        index = cursor.indexOf("modulePreset");
        cursor.splice(index, 1);
        index = cursor.indexOf("activityID");
        cursor[index] = "activity"

        header = JSON.parse(JSON.stringify(cursor))
        let index2 = header.indexOf( "acitivityID" )
        header[ index2 ] = "activity"
        index2 = header.indexOf( "placeNumber" )
        header[ index2 ] = "place"
      }
      if( filename == "positionslist" ) {
        index = cursor.indexOf("activity");
        cursor.splice(index, 1);
        index = cursor.indexOf("place");
        cursor.splice(index, 1);
        index = cursor.indexOf("placeID");
        cursor.splice(index, 1);
        index = cursor.indexOf("modulePreset");
        cursor.splice(index, 1);

        cursor.unshift("activity", "place")

        header = JSON.parse(JSON.stringify(cursor))
        let index2 = header.indexOf( "positionNumber" )
        header[ index2 ] = "position"
      }

      // TODO: reformat the export output of fields 
      //    - boolean fields should show `x` or `` instead of `true` and `false`
      //    - arrays should be shortened to a `(not sure yet)` separated string of the IDs

      // build ',' or ';' separated string
      const csv = [header.join(this.separator), ...items.map(row => 
        cursor.map(fieldName => JSON.stringify(row[fieldName], replacer))
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
        this.createActivitiesPDF2();
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
     * Prepares data and layout for the placeCard export
     */
    preparePlaceCard() {
      // Get all places with same activityID
      // save as: Array [ [0: activity1(object), 1: place(object), 2: place(object), ...]
      //                  [0: activity2(object), 1: place(object), 2: place(object), ...] ]
      const allPlaces = toRaw(this.places)
      allPlaces.forEach( elem => {
        if ( elem.noFinding == true ) {
          elem.noFinding = '+'
        } else {
          elem.noFinding = ''
        }

        if ( elem.restFinding == true ) {
          elem.restFinding = '+'
        } else {
          elem.restFinding = ''
        }
      })
      const allActivitys = toRaw(this.activities)
      
      const allActivityIDs = []
      allActivitys.forEach( elem => {
        allActivityIDs.push( elem._id )
      })
      
      allActivityIDs.forEach( aIds => {
        const placeArr = []
        const activity = this.activities.filter( activity => {
          return activity._id == aIds
        } )
        placeArr.push(toRaw(activity[0]))
        allPlaces.forEach( elem => {
          if ( elem.activityID == aIds  ) {
            placeArr.push(elem)
          }
        } )
        this.allPlacesOfOneActivity.push( placeArr )
        console.log(this.allPlacesOfOneActivity)
      })

      // Get all places with same activityID
      // save as: Array [ [0: place1(object), 1: position(object), 2: position(object), ...]
      //                  [0: place2(object), 1: position(object), 2: position(object), ...] ]
      const allPositions = toRaw(this.positions)
      
      const allPlaceIds = []
      allPlaces.forEach( elem => {
        allPlaceIds.push( elem._id )
      })
      
      allPlaceIds.forEach( pIds => {
        const positionArr = []
        const place = this.places.filter( place => {
          return place._id == pIds
        } )
        positionArr.push(toRaw(place[0]))
        allPositions.forEach( elem => {
          if ( elem.placeID == pIds  ) {
            positionArr.push(elem)
          }
        } )
        this.allPositionsOfOnePlace.push( positionArr )
      })

    },

    /**
     * Creates and saves a pdf file of all activities
     */
    createActivitiesPDF2( ) {

      const doc = new jsPDF('landscape');
      let date = new Date().toLocaleDateString("de-DE");
      let filename = "activitylist_" + date;
      doc.setFontSize(2)

      this.allPlacesOfOneActivity.forEach(placesOfOneActivity => {

        var activityToBePrinted = placesOfOneActivity;
        var activity = activityToBePrinted[0]

        activityToBePrinted.splice(0,1)
        autoTable(doc, {
          pageBreak: 'always',
          border: { top: 10 },
          margin: { top: 10 },
          styles: { fontSize: 7 },
          head: [
            [
              { content: activity.activityNumber, colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 },
              { content: '', colSpan: 1 }
            ],
            [
              { content: 'StellenNr' },
              { content: 'Datum' },
              { content: 'Ansprache' },
              { content: 'Bearbeiter' },
              { content: 'Beschreibung' },
              { content: 'Datierung' },
              { content: 'KeinBefund' },
              { content: 'RestBefund' },
              { content: 'Rechts' },
              { content: 'Rechts bis' },
              { content: 'Hoch' },
              { content: 'Hoch bis' },
              { content: 'TiefeOK' },
              { content: 'TiefeUK' },
              { content: 'Planum' },
              { content: 'Profil' },
              { content: 'Sichtbarkeit' }
            ]
          ],
          columns: [
            { header: 'StellenNr', dataKey: 'placeNumber' },
            { header: 'Datum', dataKey: 'date' },
            { header: 'Ansprache', dataKey: 'title' },
            { header: 'Bearbeiter', dataKey: 'editor' },
            { header: 'Beschreibung', dataKey: 'description' },
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
            { header: 'Sichtbarkeit', dataKey: 'visibility' },
          ],
          body: 
            activityToBePrinted
        });

        const placeToBePrinted = this.allPositionsOfOnePlace
        
        placeToBePrinted.forEach( place => {
          if (place.length == 0) {
            return;
          }

          const placeShift = place[0];

          if (activity.activityNumber == placeShift.activity) {
            const activityNumber = toRaw(activity).activityNumber
            
            place.splice(0,1);
            autoTable(doc, {
              pageBreak: 'always',
              border: { top: 10 },
              margin: { top: 10 },
              styles: { fontSize: 7 },
              head: [
                [
                  { content: activityNumber, colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: '', colSpan: 1 },
                  { content: 'Stelle:' + placeShift.placeNumber + ' - ' + placeShift.title, colSpan: 2 },
                ],
                [
                  { content: 'PositionsNr' },
                  { content: 'Datum' },
                  { content: 'Ansprache'},
                  { content: 'Bearbeiter' },
                  { content: 'Beschreibung' },
                  { content: 'Rechts' },
                  { content: 'Hoch' },
                  { content: 'Höhe' },
                  { content: 'Datierung' },
                  { content: 'Anzahl' },
                  { content: 'Gewicht' },
                  { content: 'Material' },
                ]
              ],
              columns: [
                { header: 'PositionsNr', dataKey: 'positionNumber' },
                { header: 'Datum', dataKey: 'date' },
                { header: 'Ansprache', dataKey: 'title' },
                { header: 'Bearbeiter', dataKey: 'editor' },
                { header: 'Beschreibung', dataKey: 'description' },
                { header: 'Rechts', dataKey: 'right' },
                { header: 'Hoch', dataKey: 'up' },
                { header: 'Höhe', dataKey: 'height' },
                { header: 'Datierung', dataKey: 'dating' },
                { header: 'Anzahl', dataKey: 'count' },
                { header: 'Gewicht', dataKey: 'weight' },
                { header: 'Material', dataKey: 'material' },
              ],
              body: 
                place
          });
          }
        })

      });
      doc.deletePage(1)
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
          { header: 'Ansprache von', dataKey: 'editor' },
          { header: 'Datum', dataKey: 'date' },
          { header: 'Getrennt', dataKey: 'isSeparate' },
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