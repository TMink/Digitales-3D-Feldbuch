<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Tobias Mink
 * 
 * Last Modified: 18.10.2024 14:09:12
 * Modified By: Julian Hardtung
 * 
 * Description: `coordinates` input module for places/positions
 -->

<template>
  <v-card class="mb-2 pb-4 px-4">
    <v-row no-gutters class="pt-2">
      <h2 class="text-h6 font-weight-medium pt-2">
        {{ $t('coordinates') }}
      </h2>
      
      <v-spacer></v-spacer>

      <!-- HIDE/SHOW MODULE BUTTON -->
      <v-btn variant="flat" icon 
        v-on:click="object.modulePreset.coordinates = !object.modulePreset.coordinates">
        <v-icon v-if="object.modulePreset.coordinates">mdi-eye-outline</v-icon>
        <v-icon v-else>mdi-eye-off-outline</v-icon>
      </v-btn>
    </v-row>

    <v-divider/>
    
    <div v-if="object.modulePreset.coordinates">

      <v-row v-show="!showCoords" class="pt-4 pb-2 align-center">
        <v-file-input 
        class="pt-3"
          v-model="coordinatesFile"
          accept=".txt, .csv"
          label=".txt-Datei mit Koordinaten aus Tachymeter oder ähnlichem auswählen">
        </v-file-input>
        <v-btn
          class="ma-3 mb-4 ml-4" 
          variant="outlined"
          color="secondary"
          v-on:click="saveCoordinates(coordinatesFile)">
          <v-icon class="pr-2">mdi-import</v-icon>
          {{ $t('import') }}
          <v-tooltip 
            v-if="$generalStore.getShowTooltips()" 
            activator="parent" 
            location="bottom"
            :text="$t('savePhrase', { msg: $tc('activity', 1) + ' ' + activity.activityNumber })">
          </v-tooltip>
        </v-btn>
      </v-row>
      <v-row no-gutters v-show="showCoords" class="py-3">
        <v-col> 
          <v-row v-show="showCoords" no-gutters class="align-center">
            <v-card-text v-if="coordinatesList != []"></v-card-text>
            {{  coordinatesList.coords.length }} Koordinaten importiert
            <v-spacer></v-spacer>
            <v-switch
              color="secondary"
              hide-details
              v-model="showFullCoordList"
              :label="$t('showAllCoords')">
            </v-switch>
            <v-spacer></v-spacer>
            <v-btn 
              color="error"
              v-on:click="confirmDeletion()">
              <v-icon class="pr-2">mdi-delete</v-icon>
              {{ $t('delete') }}
              <v-tooltip 
                v-if="$generalStore.getShowTooltips()" 
                activator="parent" 
                location="bottom"
                :text="$t('deletePhrase', { msg: $tc('activity', 1) + ' ' + activity.activityNumber })">
              </v-tooltip>
            </v-btn>
          </v-row>

          <v-data-table-virtual 
            v-if="showFullCoordList"
            fixed-header
            class="mb-n5"
            density="compact" 
            :items="coordinatesList.coords" 
            height="150px" 
            :headers="coordHeaders">
          </v-data-table-virtual>
          
        </v-col>
      </v-row>
      <v-row v-if="!showFullCoordList" no-gutters>
            <!-- RIGHT -->
            <v-col lg="4">
              <v-text-field 
                class="pr-2"
                hide-details 
                color="primary"
                maxlength="8" 
                density="compact" 
                v-model="object.right"
                :label="$t('right')" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>
              <v-text-field 
                v-if="type == 'places'"
                class="pr-2"
                hide-details 
                color="primary"
                maxlength="8" 
                density="compact"
                :label="$t('rightTo')"
                v-model="object.rightTo" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>
            </v-col>

            <v-divider vertical class="mt-1"/>

            <!-- UP -->
            <v-col lg="4">
              <v-text-field 
                class="px-2"
                hide-details 
                color="primary"
                maxlength="8" 
                density="compact"
                :label="$t('up')"
                v-model="object.up" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>

              <v-text-field 
                v-if="type == 'places'"
                class="px-2"
                hide-details 
                color="primary"
                maxlength="8" 
                density="compact"
                :label="$t('upTo')"
                v-model="object.upTo" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>
            </v-col>

            <v-divider vertical class="mt-1"/>

            <!-- DEPTH -->
            <v-col lg="4">
              <v-text-field 
                class="pl-2"
                hide-details 
                color="primary"
                maxlength="8" 
                density="compact"
                :label="$t('depthTop')"
                v-model="object.depthTop" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>

              <v-text-field 
                v-if="type == 'places'"
                class="pl-2"
                hide-details
                color="primary"
                maxlength="8"
                density="compact"
                :label="$t('depthBot')"
                v-model="object.depthBot" 
                @keypress="filterNonNumeric(event)">
              </v-text-field>
            </v-col>
          </v-row>
    </div>

  </v-card>
  <ConfirmDialog ref="confirm" />
</template>

<script>
  import { parse } from 'csv-parse/browser/esm/sync';
  import { fromOfflineDB } from '../../ConnectionToOfflineDB';
  import { toRaw } from "vue";
  import ConfirmDialog from '../../components/ConfirmDialog.vue';
  
  export default {
      
    components: {
      ConfirmDialog
    },
    props: {
      objectProp: Object,
    },

    emits: ['dataToModuleViewer'],

    data () {
      return {
        height: '',
        heightTo: '',
        north: '',
        northTo: '',
        east: '',
        eastTo: '',
        object: {
          right: '',
          rightTo: '',
          up: '',
          upTo: '',
          depthTop: '',
          depthBot: '',
        },
        type: null,
        coordinatesFile: null,
        coordinatesList: {
          coords: []
        },
        showCoords: false,
        showFullCoordList: false,
        coordHeaders: 
        [
          { title: 'PtNr', align: 'start', key: 'PtNr' },
          { title: 'Ost', align: 'start', key: 'Ost' },
          { title: 'Nord', align: 'start', key: 'Nord' },
          { title: 'Höhe', align: 'start', key: 'Höhe' },
          { title: 'Code', align: 'start', key: 'Code' },
        ],
      }
    },

    watch: {
      objectProp: async function(objectPropData) {
        this.object = objectPropData;
        await this.updateCoordinates();
      },
      "object.right": {
        handler: function() {
          if ( this.object.right != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'right', this.object.right ]);
          }
        }
      },
      "object.rightTo": {
        handler: function() {
          if ( this.object.rightTo != null && this.type == 'places') {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'rightTo', this.object.rightTo ]);
          }
        }
      },
      "object.up": {
        handler: function() {
          if ( this.object.up != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'up', this.object.up ]);
          }
        }
      },
      "object.upTo": {
        handler: function() {          
          if ( this.object.upTo != null && this.type == 'places' ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'upTo', this.object.upTo ]);
          }
        }
      },
      "object.depthBot": {
        handler: function() {
          if ( this.object.depthBot != null && this.type == 'places' ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'depthBot', this.object.depthBot ]);
          }
        }
      },
      "object.depthTop": {
        handler: function() {
          if ( this.object.depthTop != null) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'depthTop', this.object.depthTop ]);
          }
        }
      },
      "object.coordinates": {
        handler: function() {
          if ( this.object.coordinates != null ) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'coordinates', this.object.coordinates ]);
          }
        }
      },
      "object.modulePreset.coordinates": {
        handler: function() {
          if ( this.object.modulePreset.coordinates != null) {
            /* Send data back to ModuleViewer.vue */
            this.$emit("dataToModuleViewer", [ 'modulePreset.coordinates', this.object.modulePreset.coordinates ]);
          }
        }
      }
    },

    async created() {
      this.type = this.getType(this.$route.path);
      this.object = this.objectProp;
      await this.updateCoordinates();

      if (this.type == 'positions'){
        this.object.depthTop = this.objectProp.height;
      }
    },

    methods: {

      async updateCoordinates() {
        var res = await fromOfflineDB
          .getObject(this.object.coordinates, 'Coordinates', 'coordinates')
          .catch(err => console.error(err));
        
        if (res != null) {
          this.coordinatesList = res;
          this.showCoords = true;
        }
      },
      
      getType(path) {
        const lowerName = path.substring(
          path.indexOf("/") + 1, 
          path.lastIndexOf("/")
        );
        return lowerName
      },
      
      /**
       * Parses the coordinates-file according to its decoding (utf-8 or ansi)
       */
      parseFile() {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            const arrayBuffer = e.target.result;
            var decodedText = null;
            var delimiter = null;

            // change parsing setting if utf-8 or ansi encoded
            if (this.isValidUTF8(arrayBuffer)) {
              //UTF-8
              const headers = "PtNr\tOst\tNord\tHöhe\tCode";
              decodedText = [headers, new TextDecoder('utf-8').decode(arrayBuffer)].join('\n');
              delimiter = '\t'
            } else {
              //ANSI or something else
              decodedText = new TextDecoder('windows-1252').decode(arrayBuffer);
              delimiter = ';'
            }

            var parsedText = this.parseCSV(decodedText, delimiter);

            // error checks
            if (parsedText == undefined 
                || parsedText == null) {
              this.$root.vtoast.show({ message: this.$t('saveError') + ' ' + this.$t('wrongFormat'), color: 'error' });
            } else if (parsedText.length == 0) {
              this.$root.vtoast.show({ message: this.$t('saveError') + ' ' + this.$t('emptyFile'), color: 'error' });
            } else {
              resolve(parsedText);
            }
          };

          reader.onerror = function(error) {
            //this.$root.vtoast.show({ message: this.$t('saveError'), color: 'error' });
            reject(error);
          };

          if (this.coordinatesFile) {
            reader.readAsArrayBuffer(this.coordinatesFile);
          }
        });
      },

      /**
       * Parses a csv text with the specified delimiter
       * @param {String} text 
       * @param {String} delimiter 
       */
      parseCSV(text, delimiter) {
        var records = null;
        try {
          records = parse(text, {
            delimiter: delimiter,
            comment: "#",
            columns: true, 
            skip_empty_lines: true,
            //trim: true, 
            //relax_column_count: true, 
          });
        } catch (error) {
          console.error(error);
        }
    
        for (var i=0; i<records.length; i++) {
          if (records[i].Code == '\r') {
            records[i].Code = '';
          }
        }

        return records;
      },

      /**
       * Saves the imported file as coordinates for a place/position
       */
      async saveCoordinates() {
        var coordinates = await this.parseFile().catch(err => console.error(err));

        this.calcCoordRegion(coordinates);

        var coordsInput = {
          _id: String(Date.now()),
          coords: coordinates,
        }

        if (this.type == "places") {
          coordsInput.place = this.object._id;
        } else {
          coordsInput.position = this.object._id;
        }

        //add coords to indexedDB
        await fromOfflineDB.addObject(coordsInput, "Coordinates", "coordinates")
          .catch(err => console.error(err));
        
        //update place/position in indexedDB
        var updatedObject = toRaw(this.object);
        updatedObject.coordinates = coordsInput._id;

        var capitalized = this.type.charAt(0).toUpperCase() + this.type.slice(1)

        await fromOfflineDB.addObject(updatedObject, capitalized, this.type)
          .catch(err => console.error(err));
        
        this.$emit("dataToModuleViewer", [ 'coordinates', coordsInput._id ]);
        this.coordinatesList = coordsInput;
        this.showCoords = true;
        this.$root.vtoast.show({ message: this.$t('saveSuccess')});
      },


      /**
       * Calculates the bounds that include all imported coordinates
       * (so max/min: right, up, depth values)
       * @param coordinates 
       */
      calcCoordRegion(coordinates) {
        var height=9999999999.9;
        var heightTo=0.0;
        var north=9999999999.9;
        var northTo=0.0;
        var east=9999999999.9;
        var eastTo=0.0;

        for(var i=0; i<coordinates.length; i++) {
          var curHeight = parseFloat(coordinates[i].Höhe);
          var curNorth = parseFloat(coordinates[i].Nord);
          var curEast = parseFloat(coordinates[i].Ost);
          
          if (curHeight != '' && height > curHeight ){
            height = curHeight;
          }
          if (curNorth != '' && north > curNorth){
            north = curNorth;
          }
          if (curEast != '' && east > curEast){
            east = curEast;
          } 
        
          if (this.type == 'places') {
            if (curHeight != '' && heightTo < curHeight) {
              heightTo = curHeight;
            }
            if (curNorth != '' && northTo < curNorth) {
              northTo = curNorth;
            }
            if (curEast != '' && eastTo < curEast) {
              eastTo = curEast;
            }
          }
        }

        this.object.right = east;
        this.object.up = north;
        this.object.depthTop = height;
        
        if (this.type == 'places') {
          this.object.rightTo = eastTo;
          this.object.upTo = northTo;
          this.object.depthBot = heightTo;
        }
      },

      /**
       * Deletes coordinates and updates the connected place/position
       */
      async deleteCoordinates() {

        var updatedObject = toRaw(this.object)
        updatedObject.coordinates = '';

        var capitalized = this.type.charAt(0).toUpperCase() + this.type.slice(1);

        await fromOfflineDB.updateObject(updatedObject, capitalized, this.type)

        await fromOfflineDB.deleteObject(this.coordinatesList, 'Coordinates', 'coordinates')
        this.coordinatesList.coords = [];
        this.coordinatesFile = null;
        this.object.right = '';
        this.object.rightTo = '';
        this.object.up = '';
        this.object.upTo = '';
        this.object.depthTop = '';
        this.object.depthBot = '';
        this.showFullCoordList = false;
        this.showCoords = false;
      },

      /**
       * Opens the confirmation dialog for deletion
       * @param {Object}  
       */
      async confirmDeletion() {
        if (
          await this.$refs.confirm.open(
            this.$t('confirm'),
            this.$t('confirmDelCoords'),
          ).catch(err => console.error(err))
        ) {
          this.deleteCoordinates();
        }
      },

      /**
       * Checks if the arrayBuffer is encoded in valid UTF-8 or not
       * @param {*} arrayBuffer 
       */
      isValidUTF8(arrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        let i = 0;
        while (i < uint8Array.length) {
          if (uint8Array[i] <= 0x7F) {
            // 0xxxxxxx - ASCII
            i += 1;
          } else if (uint8Array[i] >= 0xC2 && uint8Array[i] <= 0xDF) {
            // 110xxxxx 10xxxxxx
            if (uint8Array[i + 1] >= 0x80 && uint8Array[i + 1] <= 0xBF) {
              i += 2;
            } else {
              return false;
            }
          } else if (uint8Array[i] >= 0xE0 && uint8Array[i] <= 0xEF) {
            // 1110xxxx 10xxxxxx 10xxxxxx
            if (uint8Array[i + 1] >= 0x80 && uint8Array[i + 1] <= 0xBF && uint8Array[i + 2] >= 0x80 && uint8Array[i + 2] <= 0xBF) {
              i += 3;
            } else {
              return false;
            }
          } else if (uint8Array[i] >= 0xF0 && uint8Array[i] <= 0xF4) {
            // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            if (uint8Array[i + 1] >= 0x80 && uint8Array[i + 1] <= 0xBF && uint8Array[i + 2] >= 0x80 && uint8Array[i + 2] <= 0xBF && uint8Array[i + 3] >= 0x80 && uint8Array[i + 3] <= 0xBF) {
              i += 4;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
        return true;
      },
      
      /**
      * Prevents the input of non numeric values 
      * (allows one single `,` or `.` for float values)
      * @param {*} evt 
      */
      filterNonNumeric(evt) {
        evt = (evt) ? evt : window.event;
        let expect = evt.target.value.toString() + evt.key.toString();

        if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
          evt.preventDefault();
        } else {
          return true;
        }
      },
    }
  }
</script>

<style scoped>

  .v-field__input {
    padding-top: 0px !important;
  }
</style>
