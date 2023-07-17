<template>
  <v-card variant="outlined" class="ma-3 mb-15">
    <v-card-title>
      {{ $t('data_backup') }}
    </v-card-title>
    <v-divider></v-divider>
    <v-list-item link to="/dataExport">
        <v-list-item-title> 
          {{ $t('data_export') }}
        </v-list-item-title>
      </v-list-item>
    <v-divider></v-divider>
    <v-list-item link v-on:click="backupDialog = true">
      <v-list-item-title> 
        Backup
      </v-list-item-title>
    </v-list-item>
    <v-list-item link v-on:click="importDialog = true">
      <v-list-item-title> 
        Import
      </v-list-item-title>
    </v-list-item>
  </v-card>

  <!-- BACKUP DIALOG -->
  <v-dialog v-model="backupDialog">
      <v-card class="pa-2 ma-2">
        <v-card-title> Backup Data </v-card-title>
        <v-row>
          <v-col cols="6">
            <v-card-subtitle>This will backup:</v-card-subtitle>
            <v-card-text 
              class="ml-8">
              {{ activities.length }} Activities
            </v-card-text>
            <v-card-text 
              class="ml-8">
              {{ places.length }} Places
            </v-card-text>   
            <v-card-text 
              class="ml-8">
              {{ positions.length }} Positions
            </v-card-text>   
          </v-col>
          <v-col cols="6">
            <v-card-text>
              {{ images.length }} Images
            </v-card-text>   
            <v-card-text>
              {{ placeModels.length + positionModels.length }} Models
            </v-card-text>   
            <v-card-text>
              {{ cameras.length }} Cameras
            </v-card-text>   
            <v-card-text>
              {{ createdChanges.length + deletedChanges.length }} Changes
            </v-card-text>   
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
        
        <v-row no-gutters>
          <v-spacer/>
          <v-btn 
            color="primary"
            class="mr-2"
            v-on:click="backupData()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
      
          <v-btn 
            color="error" 
            v-on:click="backupDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
      </v-card>
  </v-dialog>

  <!-- IMPORT DIALOG -->
  <v-dialog v-model="importDialog">
    <v-card class="pa-2 ma-2">
      <v-card-title> Import Data </v-card-title>
    
        <v-file-input
          show-size 
          v-model="importedData" 
          accept=".backup">
        </v-file-input>
    
      <v-row no-gutters>
        <v-spacer/>
        <v-btn 
          color="primary"
          class="mr-2"
          v-on:click="importData(importedData)">
          <v-icon>mdi-content-save-all</v-icon>
        </v-btn>
      
        <v-btn 
          color="error" 
          v-on:click="importDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
    </v-card>
  </v-dialog>
</template>
  
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';
import { saveAs } from 'file-saver';

export default {
  name: 'DataBackup',
  emits: ['view'],
  data() {
    return {
      backupDialog: false,
      importDialog: false,
      importedData: '',
      activities: [],
      places: [],
      positions: [],
      images: [],
      placeModels: [],
      positionModels: [],
      cameras: [],
      createdChanges: [],
      deletedChanges: [],
    };
  },
  async created() {
    this.$emit("view", this.$t('data_backup'));
    await fromOfflineDB.syncLocalDBs();

    this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities');
    this.places = await fromOfflineDB.getAllObjects('Places', 'places');
    this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');
    this.images = await fromOfflineDB.getAllObjects('Images', 'images');
    this.placeModels = await fromOfflineDB.getAllObjects('Models', 'places');
    this.positionModels = await fromOfflineDB.getAllObjects('Models', 'positions');
    this.cameras = await fromOfflineDB.getAllObjects('Cameras', 'cameras');
    this.createdChanges = await fromOfflineDB.getAllObjects('Changes', 'created');
    this.deletedChanges = await fromOfflineDB.getAllObjects('Changes', 'deleted');
  },
  methods: {
    /**
     * Consolidates all data of the IndexedDB to 
     * one `.backup`-file and downloads it.
     */
    async backupData() {
      var filename = "fieldbook_" + new Date().toLocaleDateString('DE-de');
      var rawPlaceModels = toRaw(this.placeModels);
      var rawPositionModels = toRaw(this.positionModels);
      var enc = new TextDecoder("utf-8");
    
      // decode model-files from ArrayBuffer to String
      rawPlaceModels.forEach(model => {
        model.model = enc.decode(model.model);
      });
      rawPositionModels.forEach(model => {
        model.model = enc.decode(model.model);
      });

      // combine all IndexedDB stores to one JSON-object
      var backupData = {
        activities: toRaw(this.activities),
        places: toRaw(this.places),
        positions: toRaw(this.positions),
        images: toRaw(this.images),
        placeModels: toRaw(this.placeModels),
        positionModels: toRaw(this.positionModels),
        cameras: toRaw(this.cameras),
        createdChanges: toRaw(this.createdChanges),
        deletedChanges: toRaw(this.deletedChanges),
      }
      var backupDataString = JSON.stringify(backupData);

      // create blob
      var blob = new Blob([backupDataString], { type: "text/plain;charset=utf-8" });
      // save .txt file
      saveAs(blob, filename + ".backup");
    },

    /**
     * Imports a `.backup` file to create the system 
     * state as it was, when the backup was created.
     * @param {*} file 
     */
    async importData(file) {
      const context = this;
      var rawFile = toRaw(file);
      let reader = new FileReader();

      reader.readAsText(rawFile[0]);
      
      // add all the data back to their corresponding IndexedDB stores
      reader.onload = async function () {
        var jsonRes = JSON.parse(reader.result);

        await context.addData(jsonRes.activities, 'Activities', 'activities');
        await context.addData(jsonRes.places, 'Places', 'places');
        await context.addData(jsonRes.positions, 'Positions', 'positions');
        await context.addData(jsonRes.images, 'Images', 'images');
        await context.addData(jsonRes.placeModels, 'Models', 'places');
        await context.addData(jsonRes.positionModels, 'Models', 'positions');
        await context.addData(jsonRes.cameras, 'Cameras', 'cameras');
        await context.addData(jsonRes.createdChanges, 'Changes', 'created');
        await context.addData(jsonRes.deletedChanges, 'Changes', 'deleted');
      };

      reader.onerror = function () {
        console.log(reader.error);
      };

      // close the import dialog
      this.importDialog = false;
    },

    /**
     * Adds all Objects within the data-array back to 
     * the corresponding IndexedDB store by `dbName` and `storeName`
     * @param {[Object]} data 
     * @param {String} dbName 
     * @param {String} storeName 
     */
    async addData(data, dbName, storeName ){
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          // encode the model file, if the data is for a model
          if (dbName == 'Models') {
            var enc = new TextEncoder();
            data[i].model = enc.encode(data[i].model).buffer;
          }
          await fromOfflineDB.addObject(data[i], dbName, storeName);
        }
      }
    },
  }
}
</script>
  
<style>

</style>