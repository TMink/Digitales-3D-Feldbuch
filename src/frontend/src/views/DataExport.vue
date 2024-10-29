<!--
 * Created Date: 26.06.2023 15:10:20
 * Author: Julian Hardtung
 * 
 * Last Modified: 28.10.2024 19:00:16
 * Modified By: Julian Hardtung
 * 
 * Description: export all (or only specified) data to .pdf or .csv
 -->

<template>
  <Navigation ref="navigationRef"/>

  <v-row no-gutters class="py-2">

    <v-spacer></v-spacer>
    <v-col cols="4">

      <v-stepper next-text="Weiter" prev-text="Zurück" :items="['Schritt 1', 'Schritt 2', 'Schritt 3']">
        <template v-slot:item.1>
          <v-card class="text-center pa-2">
            <v-card-title>BODEON DATENEXPORT</v-card-title>     
            <v-spacer/>
            <v-row no-gutters class="justify-center py-2">
              <v-card-subtitle class="text-wrap pb-2">Wähle die Daten aus, die exportiert werden sollen</v-card-subtitle>
              <v-col cols="6">
                <v-card variant="outlined" style="border: 1px; border-style: solid; border-color:darkgrey">
                  <v-btn-toggle v-model="toggle" divided multiple                    
                    class=" vertical-toggle"
                    style="height:200px">
                    <v-btn class=" btn-toggle" style="height: 50px" variant="outlined" base-color="secondary" color="success">
                      {{ $t('placesCatalog') }}
                    </v-btn>
                    <v-btn class=" btn-toggle" style="height: 50px" variant="outlined" base-color="secondary" color="success">
                      {{ $t('photoList') }}
                    </v-btn>
                    <v-btn class=" btn-toggle" style="height: 50px" variant="outlined" base-color="secondary" color="success">
                      {{ $t('photoDirectory') }}
                    </v-btn>
                    <v-btn class=" btn-toggle" style="height: 50px" variant="outlined" base-color="secondary" color="success">
                      {{ $t('findingSampleData') }}
                    </v-btn>
                  </v-btn-toggle>
                </v-card>

                <!-- <v-btn class="mt-4" color="secondary" @click="allDialog = true"> {{ $t('export') }}</v-btn> -->
              </v-col>
            </v-row>
            <v-spacer/>
          </v-card>
        </template>

        <template v-slot:item.2>
          <v-card class="align-center">
            <v-card-title>{{ $t('Aktivitätenliste') }}</v-card-title>
            <v-card-subtitle>Wähle alle Aktivitäten aus, die exportiert werden sollen</v-card-subtitle>
            
            <v-data-table-virtual 
              :headers="activityHeaders" 
              :items="activities" 
              v-model="selectedActivities" 
              return-object 
              height="300" 
              show-select>
            </v-data-table-virtual>
          </v-card>
        </template>

        <template v-slot:item.3>
          <v-card class="align-center text-center">
            <v-card-title>{{ $t('Export bestätigen') }}</v-card-title>
            <v-card-subtitle>Wähle alle Aktivitäten aus, die exportiert werden sollen</v-card-subtitle>
            
            <v-btn class="ma-2" variant="outlined" color="secondary" @click="exportBodeonData()">
              {{ $t('exportObject', {msg: $t('data')}) }}
            </v-btn>
          </v-card>
        </template>
      </v-stepper>


      <v-card class="text-center pa-2 mt-4">

        <v-card-title>EXPORT VON ROHDATEN</v-card-title>     
          <v-spacer/>
          <v-row no-gutters class="justify-center py-2">
            <v-card-subtitle class="text-wrap pb-2">Wähle die Daten aus, die exportiert werden sollen</v-card-subtitle>
            <v-col cols="6">

                <v-btn class="mt-4" color="secondary" @click="allDialog = true"> {{ $t('export') }}</v-btn>
            </v-col>
          </v-row>
          <v-spacer/>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
  </v-row>



  <!-- PLACE CATALOG --> 
  <v-dialog :width="windowWidth/3" v-model="placeCatalogDialog">
    <v-card :title="$t('placesCatalog')" :subtitle="$t('placesCatalogExportDescr')">      
      <v-data-table-virtual 
        :headers="activityHeaders" 
        :items="activities" 
        v-model="selectedActivities" 
        return-object 
        height="400" 
        show-select>
      </v-data-table-virtual>
      
      <v-btn class="ma-2" variant="outlined" color="secondary" @click="exportPlacesCatalog()">
        {{ $t('exportObject', {msg: $t('placesCatalog')}) }}
      </v-btn>
    </v-card>
  </v-dialog>

  <!-- PHOTOLIST --> 
  <v-dialog :width="windowWidth/3" v-model="photoListDialog">
    <v-card class="align-center">
      <v-card-title>{{ $t('photoList') }}</v-card-title>
      
      <v-data-table-virtual 
        :headers="activityHeaders" 
        :items="activities" 
        v-model="selectedActivities" 
        return-object 
        height="400" 
        show-select>
      </v-data-table-virtual>
      
      <v-btn class="ma-2" variant="outlined" color="secondary" @click="exportPhotoList()">
        {{ $t('exportObject', {msg: $t('photoList')}) }}
      </v-btn>
    </v-card>
  </v-dialog>

  <!-- PHOTO DIRECTORY -->
  <v-dialog :width="windowWidth/3" v-model="photoDirectoryDialog">
    <v-card class="align-center">
      <v-card-title>{{ $t('photoDirectory') }}</v-card-title>
      
      <v-data-table-virtual 
        :headers="activityHeaders" 
        :items="activities" 
        v-model="selectedActivities" 
        return-object 
        height="400" 
        show-select>
      </v-data-table-virtual>
      
      <v-btn class="ma-2" variant="outlined" color="secondary" @click="exportPhotoDirectory()">
        {{ $t('exportObject', {msg: $t('photoDirectory')}) }}
      </v-btn>
    </v-card>
  </v-dialog>

  <!-- FINDING SAMPLE DATA -->
  <v-dialog :width="windowWidth/3" v-model="findingDampleDataDialog">
    <v-card class="align-center">
      <v-card-title>{{ $t('findingSampleData') }}</v-card-title>
      
      <v-data-table-virtual 
        :headers="activityHeaders" 
        :items="activities" 
        v-model="selectedActivities" 
        return-object 
        height="400" 
        show-select>
      </v-data-table-virtual>
      
      <v-btn class="ma-2" variant="outlined" color="secondary" @click="exportFindingSampleData()">
        {{ $t('exportObject', {msg: $t('findingSampleData')}) }}
      </v-btn>
    </v-card>
  </v-dialog>

  <v-dialog 
  v-model="confirmDialog" 
  :max-width="windowWidth/2.5" style="z-index: 3;" 
  @keydown.esc="cancel"
  @afterLeave="onExportDialogClosed">
    <v-card>
        <v-toolbar dark color="warning" dense flat>
            <v-toolbar-title>Exportfehler</v-toolbar-title>
        </v-toolbar>
        <v-card-subtitle class="text-wrap pa-4">
          Bei den exportierten Daten sind ein oder mehrere Pflichtfelder nicht ausgefüllt.<br> Soll der Export vortgesetzt werden, obwohl die resultierenden Daten nicht valide für einen Bodeon-Import sind?
        </v-card-subtitle>

         <v-list>
          <v-list-item style="padding-left: 0px"
            v-for="item in errorMessageArray"
            :key="item.title">
            <v-row style="padding-left: 0px" no-gutters>
              <v-row no-gutters class="justify-start align-center">
                  <v-col cols="9">
                <v-card variant="tonal">
                  <v-row no-gutters class="justify-start align-center">
                    <v-card-text class="pr-0">
                      {{ $t(item.objectType)}}
                    </v-card-text>
                    <v-card-text class="px-0 mx-0">
                      {{ item.title }}
                    </v-card-text>
                    <v-spacer></v-spacer>
                    <v-card-subtitle>
                      {{ item.subtitle }}
                    </v-card-subtitle>
                  </v-row>
                </v-card>
              </v-col>
                <v-btn v-if="item.errType == 'warn'" @click="openObject(item.objectID, item.objectType)" 
                  variant="outlined" color="secondary" class="ml-4"> 
                  {{ $t('open') }}
                  <v-icon class="pl-1">mdi-open-in-new</v-icon>
                </v-btn>
              </v-row>
            </v-row>
            <template v-slot:prepend>
              <v-btn icon flat v-if="item.errType == 'notify'" >
                <v-icon>mdi-help-circle</v-icon>
                  <v-tooltip activator="parent" location="bottom"
                  text="Ein Problem beim Export, aber kann so in BODEON importiert werden.">
                </v-tooltip>
            </v-btn>
            <v-btn icon flat v-if="item.errType == 'warn'" >
              <v-icon color="warning">mdi-alert-circle</v-icon>
                <v-tooltip activator="parent" location="bottom"
                text="Diese Daten können so nicht in BODEON importiert werden.">
              </v-tooltip>
            </v-btn>
          </template>
          </v-list-item>
        </v-list>
        <v-card-actions class="pt-0">
            <v-spacer></v-spacer>
            <v-btn icon color="success"  @click="agree"><v-icon>mdi-check-circle</v-icon></v-btn>
            <v-btn icon color="error" @click="cancel"><v-icon>mdi-close-circle</v-icon></v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>



</template>
  
<script>
import Navigation from '../components/Navigation.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { toRaw } from 'vue'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import { useWindowSize } from 'vue-window-size';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

export default {
  name: 'DataExport',
  components: {
    Navigation,
  },
  
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },

  data() {
    return {
      toggle: [],
      activities: [],
      places: [],
      positions: [],
      selectedActivities: [],
      selected_activity: '',
      selected_activity_number: '',
      selected_place: '',
      activity_open: false,
      place_open: false,
      separator: ';',
      fileFormat: '.pdf',
      export_overlay: false,
      exportActivities: true,
      skipEmpty: true,
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

      placeCatalogDialog: false,
      photoListDialog: false,
      photoDirectoryDialog: false,
      findingDampleDataDialog: false,

      allDialog: false,

      resolve: null,
      reject: null,
      confirmDialog: false,

      errorMessageArray: [],

      activityHeaders: 
      [
        { title: this.$t('branchOffice'), align: 'start', key: 'branchOffice' },
        { title: this.$t('year'), align: 'start', key: 'year' },
        { title: this.$tc('number', 2), align: 'start', key: 'number' },
        { title: this.$tc('place', 2), align: 'start', key: 'places.length' },
      ],
      placeHeaders: 
      [
        { title: this.$tc('number', 2), align: 'start', key: 'placeNumber'},
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date' },
        { title: this.$tc('image', 2), align: 'start', key: 'images.length' },
        { title: this.$tc('model', 2), align: 'start', key: 'models.length' },
        { title: this.$tc('position', 2), align: 'start', key: 'positions.length' },
      ],
      positionHeaders: 
      [
        { title: this.$tc('number', 2), align: 'start', key: 'positionNumber' },
        { title: this.$tc('subNumber', 2), align: 'start', key: 'subNumber' },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('dating'), align: 'start', key: 'dating' },
        { title: this.$t('date'), align: 'start', key: 'date' },
        { title: this.$tc('image', 2), align: 'start', key: 'images.length' },
        { title: this.$tc('model', 2), align: 'start', key: 'models.length' },
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

  mounted() {
      this.$refs.navigationRef.onViewChange(this.$t('data_export'));
  },

  computed: {

    /**
     * Calculates the required table height based on the number of items
     */
    getTableHeight() {
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
    
    /**
     * Dynamically sets the CSS class for a table row
     * @param item 
     * @param index 
     */
    applyRowColors(item, index) {
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

        if (place.coordinates != '') {
          var fullCoordinates = await fromOfflineDB
            .getObject(place.coordinates, 'Coordinates', 'coordinates')
            .catch(err => console.error(err));

          place.coordinates = fullCoordinates.coords;
          //place.coordinates = JSON.parse(fullCoordinates.coords);
        } 
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
        
        // get and set the coordinatesCount of the current Position
        if (position.posType == 'position' && position.coordinates != '') {
          var fullCoordinates = await fromOfflineDB
            .getObject(position.coordinates, 'Coordinates', 'coordinates')
            .catch(err => console.error(err));
          
          position.coordinates = fullCoordinates.coords;
          /* position.coordinates = fullCoordinates.coords.length.toString() 
                                  + " " + this.$t('coordinates'); */
        } 
        
        position.place = placeNumber;
        position.activity = activityNumber;
      }
    },


    /**
     * Exports Bodeon data depending on what activities where chosen 
     * and which files should be exported
     */
    async exportBodeonData() {
      const zip = new JSZip();
      var hasError = false;

      for (let i=0; i<this.toggle.length; i++) {
        switch (this.toggle[i]) {
          case 0:
            await this.exportPlacesCatalog(zip).catch(err => {
              hasError = true;
            });
            break;
          case 1:
            await this.exportPhotoList(zip);
            break;
          case 2:
            await this.exportPhotoDirectory(zip);
            break;
          case 3:
            await this.exportFindingSampleData(zip);
            break;
          default:
            break;
        }
      }

      // stop the export if the zip is empty
      if (Object.keys(zip.files).length === 0) {
        this.$root.vtoast.show({ message: 
          'The selection you are trying to export is empty', color: 'warning' });
        return;
      }
      
      // check if there were validation errors
      if (this.errorMessageArray.length > 0) {
        await this.confirmContinueExport(zip);
      } else if (!hasError) {
        this.downloadExportedData(zip)
      }
    },

    /**
     * Takes the exported content and downloads it as a `.zip`-file
     * @param zip 
     */
    async downloadExportedData(zip) {
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'ALL.zip');
      this.$root.vtoast.show({ message: 'Export successfull', color: 'success' });
    },


    /* #################################################
    ############### PLACES CATALOG #####################
    #################################################### */

    /**
     * Exports the places Catalog for all selected Activities.
     * This will create a .zip-folder which contains 
     * .csv-files for each exported activity.
     * @param zip 
     */
    async exportPlacesCatalog(zip) {
      // retrieve
      let placesToExport = await this.getPlacesToExport();

      if (placesToExport.length == 0) {
        this.$root.vtoast.show({ message: 'No places to export', color: 'error' });
        throw new Error("No places to export");
      }

      // prepare
      var translatedItems = this.translatePlacesArray(placesToExport);
      const replacer = (key, value) => value === null ? '' : value;
      const cursor = Object.keys(translatedItems[0][0]);
      let header = JSON.parse(JSON.stringify(cursor));
      const numberOfFiles = translatedItems.length;

      // export
      for (let i=0; i< numberOfFiles; i++) {
        const csv = [header.join(this.separator), ...translatedItems[i].map(row => 
          cursor.map(fieldName => JSON.stringify(row[fieldName], replacer))
            .join(this.separator))
        ].join('\r\n');

        const activityFileName = this.getActivityFileName(translatedItems[i][0].Aktivitaet);
        const placeFileName = this.getPlaceFileName(translatedItems[i][0].Aktivitaet, translatedItems[i][0].StellenNR);
        zip.file(activityFileName + "/" + placeFileName + "/" + placeFileName + "_stellenkatalog.csv", csv);
      }
    },


    /**
     * Takes the selected Activities and retrieves all 
     * connected places from OfflineDB
     * @returns {[[],...[]]} an Array containing an Array of places for each activity 
     */
    async getPlacesToExport() {
      const rawActivitiesToExport = toRaw(this.selectedActivities);
      var placesToExport = []

      for (var i=0; i<rawActivitiesToExport.length; i++) {
        var placesOfOneActivity = 
          await fromOfflineDB.getAllObjectsFromArray(rawActivitiesToExport[i].places, 'Places', 'places');

        if (placesOfOneActivity.length == 0) {
          this.addErrorMessage( rawActivitiesToExport[i].activityNumber,
            "This activity has no places to export.",
            rawActivitiesToExport[i].activityNumber, "activity", "notify");
        } else {
          placesToExport.push(this.addActivityNumberToPlaces(
            placesOfOneActivity, rawActivitiesToExport[i].activityNumber))
        }
      }
      return placesToExport;
    },


    /**
     * Translates the data headers of all places of one or more activities 
     * to be BODEON compatible
     * @param {[[], ...[]]} placesArrayEng 
     * @returns {[[], ...[]]} placesArrayGer
     */
    translatePlacesArray(placesArrayEng) {
      var placesArrayGer = [];
      const placesArrayLength = placesArrayEng.length;
      
      // go through all activities
      for (let i=0; i<placesArrayLength; i++) {
        var translatedPlacesOfActivity = [];
        const placesArrayILength = placesArrayEng[i].length;

        // translate all places within each activity
        for (let j=0; j<placesArrayILength; j++) {
          const translatedPlace = this.translatePlaceHeadersToBODEON(placesArrayEng[i][j]);
          
          if (translatedPlace == undefined) {
            this.addErrorMessage(
              placesArrayEng[i][j].activityNumber + " " + 
              placesArrayEng[i][j].placeNumber,
              "One or more required fieldd are not filled",
              placesArrayEng[i][j]._id, "place", "warn");
          } else {
            translatedPlacesOfActivity.push(translatedPlace)
          }
        }
        placesArrayGer.push(translatedPlacesOfActivity);
      }

      return placesArrayGer;
    },

    /**
     * Translates our internal dataHeaders to the german terms for BODEON import
     * @param placeENG a single place with english headers
     */
    translatePlaceHeadersToBODEON(placeENG) {
      if (placeENG.title.length == 0) {
        this.addErrorMessage(
          placeENG.activityNumber + " " + placeENG.placeNumber,
          "Required field `title` is not filled",
          placeENG._id, "place", "warn");
      }

      if (placeENG.dating.length == 0) {
        this.addErrorMessage(
          placeENG.activityNumber + " " + placeENG.placeNumber,
          "Required field `dating` is not filled",
          placeENG._id, "place", "warn");
      }
      
      var placeGer = {
        Aktivitaet: placeENG.activityNumber,
        StellenNR: placeENG.placeNumber,
        Befundkode: '',
        BefAnsprac: placeENG.title.join('; '),
        Datkode: '',
        Datierung: placeENG.dating,
        KeinBefund: '',
        RestBefund: '',
        Rechts: placeENG.right,
        Rechtsbis: placeENG.rightTo,
        Hoch: placeENG.height,
        Hochbis: placeENG.heightTo,
        TiefeOK: placeENG.depth,
        TiefeUK: placeENG.depthTo,
        Planum: placeENG.plane,
        Profil: placeENG.profile,
        Sichtbar: placeENG.visibility,
        Zeichnung: '',
        Kommentar: placeENG.comment,
        Bearbeiter: placeENG.editor,
        Datum: placeENG.date,
      }

      if (placeENG.noFinding) {
        placeGer.KeinBefund = 'X';
      }
      
      if (placeENG.restFinding) {
        placeGer.RestBefund = 'X';
      }

      switch (placeENG.visibility) {
        case 0:
          placeGer.Sichtbar = 'schlecht';
          break;
        case 1: 
          placeGer.Sichtbar = 'mäßig';
          break;
        case 2:
          placeGer.Sichtbar = 'gut';
          break;
        case 3:
          placeGer.Sichtbar = 'sehr gut';
      }

      return placeGer;
    },

    /**
     * Adds the activityNumber to each place in a placeArray
     * @param {[]} places 
     * @param {String} activityNumber 
     */
    addActivityNumberToPlaces(places, activityNumber) {
      var filledPlaces = [];

      for (let i=0; i<places.length; i++) {
        places[i].activityNumber = activityNumber;
        filledPlaces.push(places[i]);
      }
      
      return filledPlaces;
    },


    /* #################################################
    ############## PHOTO LIST (PLACES) #################
    #################################################### */

    /**
     * Exports the photo list for all selected Activities.
     * This will create a .zip-folder which contains 
     * .csv-files for each exported place of each activity.
     * @param zip 
     */
    async exportPhotoList(zip) {
      const placesToExport = await this.getPlacesToExport();
      const activitiesCount = placesToExport.length;
      
      // go through all activities
      for (let i=0; i<activitiesCount; i++) {
        const placesCount = placesToExport[i].length;
        
        // go through all places within each activity
        for (let j=0; j<placesCount; j++) {
          //go through all positions and retrieve the images from those positions
          const imagesOfPlace = await this.getImagesFromPlace(placesToExport[i][j]);

          // skip if there ar no images in this place
          if (imagesOfPlace == undefined) {
            continue;
          }

          // translate all images
          const translatedImages = this.translatePhotosArray(imagesOfPlace, 
                                          placesToExport[i][j].activityNumber, 
                                          placesToExport[i][j].placeNumber);

          this.addPhotoListDataToZip(zip, translatedImages);
        }
      }
    },

    /**
     * Adds data to a zip container
     * @param zip 
     * @param imagesOfPlace 
     */
    addPhotoListDataToZip(zip, imagesOfPlace) {
      const replacer = (key, value) => value === null ? '' : value;
      const cursor = Object.keys(imagesOfPlace[0]);
      const header = JSON.parse(JSON.stringify(cursor));  

      // prepare file data
      const csv = [header.join(this.separator), ...imagesOfPlace.map(row => 
        cursor.map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(this.separator))
      ].join('\r\n')

      //prepare filename
      const activityNumber = imagesOfPlace[0].Aktivitaet;
      const placeNumber = imagesOfPlace[0].StellenNR;
      const activityFileName = this.getActivityFileName(activityNumber);
      const placeFileName = this.getPlaceFileName(activityNumber, placeNumber);
      const photoListFilename = activityFileName + '/' + placeFileName + '/' + placeFileName + "_fotoliste.csv";

      //add to zip
      zip.file(photoListFilename, csv);
    },

    /**
     * Get all imagePositions of a place
     * @param place 
     * @returns {[Images]} imagePositions
     */
    async getImagesFromPlace(place) {
      if (place.positions.length == 0) {
        this.addErrorMessage(
            place.activityNumber + " " + place.placeNumber,
            "This place has no positions to export.",
            place._id, "place", "notify");
        return;
      }

      //get all positions in this place
      const positionsOfPlace = await fromOfflineDB
        .getAllObjectsFromArray(place.positions, 'Positions', 'positions')
        .catch((err) => console.error(err));
        
      //filter out all positions that are not images
      const imagePositions = positionsOfPlace.filter((position) => position.posType == 'image');
      
      if (imagePositions.length == 0) {
        this.addErrorMessage(
          place.activityNumber + " " + place.placeNumber,
          "This place has no images to export.",
          place._id, "place", "notify");
        return;
      }
      
      return imagePositions;
    },

    /**
     * Adds activityNumber and placeNumber to positions
     * @param {[position]} positions 
     * @param {} place 
     */
    addActivityAndPlaceNumberToPositions(positions, place) {
      positions.forEach(curPos => {
        curPos.activityNumber = place.activityNumber;
        curPos.placeNumber = place.placeNumber;
      });

      return positions;
    },

    /**
     * Translates the data headers of all images of one or more places
     * @param {[]} photosArrayEng 
     * @returns {[[], ...[]]} photosArrayGer
     */
    translatePhotosArray(photosArrayEng, activityNumber, placeNumber) {
      var photosArrayGer = [];

      photosArrayEng.forEach(curPhotosOfPlace => {
        const translatedPhoto = this.translatePhotoHeadersToBODEON(curPhotosOfPlace, activityNumber, placeNumber);
        if (translatedPhoto != undefined) {
          photosArrayGer.push(translatedPhoto)
        } 
      })

      return photosArrayGer;
    },

    /**
     * Translates our internal dataHeaders to the german terms for BODEON import
     * @param {Object} photoENG a single photo with english headers
     * @param {String} photoENG.positionNumber
     * @param {String} photoENG.editor
     * @param {String} photoENG.date
     * @param {String} photoENG.comment
     * @param {String} activityNumber
     * @param {String} placeNumber
     * @returns photoGer
     */
    translatePhotoHeadersToBODEON(photoENG, activityNumber, placeNumber) {
      //check if all BODEON required fields are filled
      if (activityNumber.length == 0
        || placeNumber == 0
        || photoENG.positionNumber == 0
        || photoENG.editor.length == 0
        || photoENG.date.length == 0
        || photoENG.comment == 0
      ) {
        this.addErrorMessage(activityNumber + " " + placeNumber + " " + photoENG.positionNumber,
          "Required field for this image is not filled",
          photoENG._id, "position", "warn");
        return;
      }
      
      //translate headers to the german BODEON terms
      var photoGer = {
        Aktivitaet: activityNumber,
        StellenNR: placeNumber,
        PosNr: photoENG.positionNumber,
        Fotograf: photoENG.editor,
        FotoDatum: photoENG.date,
        Kommentar: photoENG.comment,
      }

      return photoGer;
    },



  /* ###############################################
  ############### FOTO DIRECTORY ###################
  ################################################## */

    /**
     * Exports the places directory for all selected Activities.
     * This will create a .zip-folder which contains a `Fotos`-folder
     * for each place whith the imagefiles for each exported place
     * in each activity.
     * @param zip 
     */
    async exportPhotoDirectory(zip) {
      const placesToExport = await this.getPlacesToExport();
      const activitiesCount = placesToExport.length
      
      // go through all activities
      for (let i=0; i<activitiesCount; i++) {
        const placesCount = placesToExport[i].length;
        const activityNumber = placesToExport[i][0].activityNumber;
        
        // go through all places within each activity
        for (let j=0; j<placesCount; j++) {
          const placeNumber = placesToExport[i][j].placeNumber;
          
          // go through all positions and retrieve + translate 
          // the images from those positions
          const imagesOfPlace = await this.getImagesFromPlace(placesToExport[i][j])

          if (imagesOfPlace == undefined) {
            continue;
          }

          // prepare file data and filenames
          const activityFileName = this.getActivityFileName(activityNumber);
          const placeFileName = this.getPlaceFileName(activityNumber, placeNumber);
          const photoDirectory = activityFileName + '/' + placeFileName + '/' + "Fotos/";
          
          // name each imagefile and add to zip
          for (let k=0; k<imagesOfPlace.length; k++) { 
            const positionFileName = 
              this.getPositionFileName(
                    activityNumber, 
                    placeNumber, 
                    imagesOfPlace[k].positionNumber);
                    
            const imgFileType = imagesOfPlace[k].image.type.split('/')[1];
            const imgFileName = positionFileName + "." + imgFileType;

            zip.file(photoDirectory + imgFileName, imagesOfPlace[k].image);
          }
        }
      }
    },

    

  /* ################################################
    ############# FINDING SAMPLE DATA################
    ################################################# */
    
    async exportFindingSampleData(zip){
      const placesToExport = await this.getPlacesToExport();
      const activitiesCount = placesToExport.length;
      var findDataArray = [];
      
      // go through all activities
      for (let i=0; i<activitiesCount; i++) {
        const placesCount = placesToExport[i].length;
        
        // go through all places within each activity
        for (let j=0; j<placesCount; j++) {
          //go through all positions and retrieve the finds from those positions
          const findsOfPlace = await this.getFindsFromPlace(placesToExport[i][j]);

          // skip if there ar no finds in this place
          if (findsOfPlace == undefined) {
            continue;
          }

          // translate all finds
          const translatedFinds = this.translateFindsArray(findsOfPlace,
                                          placesToExport[i][j].activityNumber, 
                                          placesToExport[i][j].placeNumber);

          if (translatedFinds.length == 0) {
            continue;
          }
          
          if (findDataArray.length == 0) {
            findDataArray = translatedFinds;
          } else {
            findDataArray = findDataArray.concat(translatedFinds)
          }
        }
        this.addFindDataToZip(zip, findDataArray);
      }
    },

    async getFindsFromPlace(place){
      if (place.positions.length == 0) {
        this.addErrorMessage(
            place.activityNumber + " " + place.placeNumber,
            "This place has no positions to export.",
            place._id, "place", "notify");
        return;
      }

      //get all positions in this place
      const positionsOfPlace = await fromOfflineDB
        .getAllObjectsFromArray(place.positions, 'Positions', 'positions')
        .catch((err) => console.error(err));
        
      //filter out all positions that are not images
      const findPositions = positionsOfPlace.filter((position) => position.posType == 'position');
      
      if (findPositions.length == 0) {
        this.addErrorMessage(
          place.activityNumber + " " + place.placeNumber,
          "This place has no finds to export.",
          place._id, "place", "notify");
        return;
      }
      
      return findPositions;
    },

    translateFindsArray(findsArrayEng, activityNumber, placeNumber) {
      var findsArrayGer = [];

      findsArrayEng.forEach(curFindsOfPlace => {
        const translatedFind = this.translateFindHeadersToBODEON(curFindsOfPlace, activityNumber, placeNumber);
        if (translatedFind != undefined) {
          findsArrayGer.push(translatedFind)
        } 
      })

      return findsArrayGer;
    },

    translateFindHeadersToBODEON(findENG, activityNumber, placeNumber) {
      //check if all BODEON required fields are filled
      if (activityNumber.length == 0
        || placeNumber == 0
        || findENG.positionNumber == 0
        || (findENG.hasSubNumber == true && findENG.subNumber == 0)
        || findENG.title.length == 0
        || findENG.dating.length == 0
      ) {
        this.addErrorMessage(activityNumber + " " + placeNumber + " " + findENG.positionNumber,
          "Required field for this find is not filled",
          findENG._id, "position", "warn");
        return;
      }
      
      //translate headers to the german BODEON terms
      var findGer = {
        Aktivitaet: activityNumber,
        StellenNR: placeNumber,
        PosNr: findENG.positionNumber,
        Unternr: findENG.subNumber,
        Rechts: findENG.right,
        Hoch: findENG.up,
        Hoehe: findENG.height,
        Anzahl: findENG.count,
        Gewicht: findENG.weight,
        ObjKuerzel: '',
        Material: findENG.material,
        Ansprache: findENG.title,
        Kommentar: findENG.description,
        Datkode: '',
        Datierung: findENG.dating,
        AnspracheVon: findENG.editor,
        Datum: findENG.date,
      }

      return findGer;
    },

    addFindDataToZip(zip, findsOfPlace) {
      const replacer = (key, value) => value === null ? '' : value;
      const cursor = Object.keys(findsOfPlace[0]);
      const header = JSON.parse(JSON.stringify(cursor));  

      console.log(findsOfPlace)
      console.log("_________________________")
      // prepare file data
      const csv = [header.join(this.separator), ...findsOfPlace.map(row => 
        cursor.map(fieldName => JSON.stringify(row[fieldName], replacer))
          .join(this.separator))
      ].join('\r\n')

      //prepare filename
      const activityNumber = findsOfPlace[0].Aktivitaet;
      const activityFileName = this.getActivityFileName(activityNumber);
      const findsFilename = activityFileName + '/' + activityFileName + "_Fundliste.csv";

      //add to zip
      zip.file(findsFilename, csv);
    },

    /**
     * Opens the confirmation dialog if the export should continue 
     * and or to resolve issues
     */
    async confirmContinueExport(zip) {
      this.confirmDialog = true;

      if (await new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
          })) {
        this.downloadExportedData(zip);
        this.confirmDialog = false;
      } else {
        this.confirmDialog = false;
      }
    },

    agree() {
      this.resolve(true);
      this.dialog = false;
    },
    
    cancel() {
        this.resolve(false);
        this.dialog = false;
    },

    /**
     * Adds a new errorMessage to the errorMessageArray
     * @param {String} title 
     * @param {String} subtitle 
     * @param {String} objectID 
     * @param {'place' | 'position'} objectType 
     * @param {'warn' | 'error'} errorType 
     */
    addErrorMessage(title, subtitle, objectID, objectType, errorType) {
      const errObject = {
        title: title,
        subtitle: subtitle,
        objectID: objectID,
        objectType: objectType,
        errType: errorType,
      }
      this.errorMessageArray.push(errObject);
    },

    /**
     * Reformats an activityNumber (with format `CX 2024/0001`)
     * to an activityFileName in file format `CX_2024_0001`
     * @param {String} activityNumber
     * @returns {String} activityFileName
     */
    getActivityFileName(activityNumber) {
      return activityNumber.replace(/ /g, '_').replace(/\//g, '_');
    },

    /**
     * Parses activityNumber and placeNumber to proper fileName format
     * (all numbers separated with `_` and number 4 digits long with leading `0`)
     * @param {String} activityNumber 
     * @param {String} placeNumber 
     */
    getPlaceFileName(activityNumber, placeNumber) {
      return this.getActivityFileName(activityNumber) + "_" + placeNumber.toString().padStart(4, '0');
    },

    /**
     * Parses activityNumber, placeNumber and positionNumber
     * to proper fileName format (all numbers separated with `_` 
     * and number 4 digits long with leading `0`)
     * @param {String} activityNumber 
     * @param {String} placeNumber 
     * @param {String} positionNumber
     */
    getPositionFileName(activityNumber, placeNumber, positionNumber) {
      return this.getPlaceFileName(activityNumber,placeNumber) + "_" + positionNumber.toString().padStart(4, '0');
    },

    /**
     * Exports coordinates to a .csv file
     * @param {[Object]} data 
     */
    exportCoordsFile(data) {
      for (var i=0; i<data.length; i++) {
        if (data[i].coordinates == '') {
          continue;
        }

        let items = data[i].coordinates;

        const replacer = (key, value) => value === null ? '' : value;
        const cursor = Object.keys(items[0]);
        let header = JSON.parse(JSON.stringify(cursor))
        let filename = '';

        if (data[i].positionNumber != undefined) {
          filename = data[i].activity + '_' + data[i].place + '_' + data[i].positionNumber + '_coordinates';
        } else {
          filename = data[i].activity + '_' + data[i].placeNumber + '_coordinates';
        }

        // build ',' or ';' separated string
        const csv = [header.join(this.separator), ...items.map(row => 
          cursor.map(fieldName => JSON.stringify(row[fieldName], replacer))
            .join(this.separator))
        ].join('\r\n')

        // create ',' or ';' separated blob
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        // save .csv file
        saveAs(blob, filename + ".csv");
      }
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
          elem.noFinding = 'X'
        } else {
          elem.noFinding = ''
        }

        if ( elem.restFinding == true ) {
          elem.restFinding = 'X'
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
              { content: activity.activityNumber, colSpan: 2 },
              { content: '', colSpan: 15 },
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
              { content: 'Koordinaten'},

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
            { header: 'Kommentar', dataKey: 'comment' },
            { header: 'Datierung', dataKey: 'dating' },
            { header: 'KeinBefund', dataKey: 'noFinding' },
            { header: 'RestBefund', dataKey: 'restFinding' },
            { header: 'Koordinaten', dataKey: 'coordinates.length + " " + this.$t("coordinates")' },
            { header: 'Planum', dataKey: 'plane' },
            { header: 'Profil', dataKey: 'profile' },
            { header: 'Sichtbarkeit', dataKey: 'visibility' },
          ],
          body: 
            activityToBePrinted
        });

        const placeToBePrinted = this.allPositionsOfOnePlace
        
        placeToBePrinted.forEach( place => {
          if (place[0].length == 0) {
            return;
          }

          const placeShift = place[0];
          if (placeShift.positions.length == 0
              && this.skipEmpty) {
            return;
          }

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
                  { content: '', colSpan: 9 },
                  { content: 'Stelle:' + placeShift.placeNumber + ' - ' + placeShift.title, colSpan: 2 },
                ],
                [
                  { content: 'PositionsNr' },
                  { content: 'Datum' },
                  { content: 'Ansprache'},
                  { content: 'Bearbeiter' },
                  { content: 'Beschreibung' },
                  { content: 'Koordinaten' },
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
                { header: 'Kommentar', dataKey: 'comment' },
                { header: 'Koordinaten', dataKey: 'coordinates' },
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
          { header: 'Koordinaten', dataKey: 'coordinates' },
          { header: 'Planum', dataKey: 'plane' },
          { header: 'Profil', dataKey: 'profile' },
          { header: 'Sichtbar', dataKey: 'visibility' },
          { header: 'Zeichnung', dataKey: 'drawing' },
          { header: 'Kommentar', dataKey: 'comment' },
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
          { header: 'Stellennr', dataKey: 'place' },
          { header: 'Posnr', dataKey: 'positionNumber' },
          { header: 'Unternr', dataKey: 'subNumber' },
          { header: 'Koordinaten', dataKey: 'coordinates'},
          { header: 'Anzahl', dataKey: 'count' },
          { header: 'Gewicht', dataKey: 'weight' },
          { header: 'Material', dataKey: 'material' },
          { header: 'Ansprache', dataKey: 'title' },
          { header: 'Kommentar', dataKey: 'comment' },
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


    /**
     * Opens the EditPage of a place or position
     * @param id ID of the place or position
     * @param {'place' | 'position' } objectType
     */
    async openObject(id, objectType) {
      if (objectType == 'place') {
        const curPlace = await fromOfflineDB.getObject(id, 'Places', 'places')
          .catch(err => {console.error(err)})

        this.$generalStore.setCurrentObject(curPlace.activityID, "activity");
        this.$generalStore.setCurrentObject(curPlace._id, "place");
        this.$router.push({ name: 'PlaceCreation', params: { placeID: id } })
      } else if (objectType == 'position') {

        const curPos = await fromOfflineDB.getObject(id, 'Positions', 'positions');
        const curPlace = await fromOfflineDB.getObject(curPos.placeID, 'Places', 'places')
          .catch(err => {console.error(err)})

        this.$generalStore.setCurrentObject(curPlace.activityID, "activity");
        this.$generalStore.setCurrentObject(curPos.placeID, "place");
        this.$generalStore.setCurrentObject(curPos._id, "position");

        this.$router.push({ name: 'PositionCreation', params: { positionID: id } })
      } else {  
        console.error('No valid objectType for opening an object was provided.')
      }
    },

    /**
     * Resets the error Message list after closing the Error Dialog
     */
    onExportDialogClosed() {
      this.errorMessageArray = []
    },
    
  }
}
</script>
  
<style scoped>
.v-switch__thumb {
  color: red;
}

.vertical-toggle {
  display: flex;
  flex-direction: column;
}
</style>