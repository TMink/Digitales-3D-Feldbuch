<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card rounded="0">
          <v-tabs v-model="tab" direction="vertical" color="secondary" >
            <v-tab value="one" rounded="0"> Allgemein </v-tab>
            <v-tab value="two" rounded="0"> Positionen </v-tab>
            <v-tab value="three" rounded="0"> Modell </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="secondary"> Speichern </v-btn>
            <v-dialog
        v-model="dialog"
        persistent
        width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-btn rounded="0" color="primary" v-bind="props"> Löschen </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
             Stelle Löschen!
          </v-card-title>
          <v-card-text>Wollen Sie die Stelle "{{ place.placeNumber }}" wirklich löschen?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="secondary"
              variant="outlined"
              v-on:click="deletePlace()"
              @click="dialog = false"
            >
              Ja
            </v-btn>
            <v-btn
              color="primary"
              variant="outlined"
              @click="dialog = false"
            >
              Nein
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <v-btn rounded="0" v-on:click="cancelPlace" color="primary"> 
          Abbrechen
        </v-btn>
          </v-tabs>
        </v-card>
          </v-col>

            <v-col>
              <v-window v-model="tab">
          <v-window-item value="one">
            <v-card>
              <v-text-field v-model="place.ansprache" label="Ansprache"
                            hint="Geben Sie hier eine Ansprache ein"></v-text-field>
              <v-text-field v-model="place.date" label="Datierung" 
                        hint="Format: dd.mm.yyyy"></v-text-field>
            </v-card>
          </v-window-item>

          <v-window-item value="two">
            Two
          </v-window-item>
          <v-window-item value="three">
            <v-card>
              <v-text-field 
                label="Stellen ID" 
                hint="Geben Sie hier die Stellen ID ein" 
                v-model="new_model.place_id"></v-text-field>
              <v-text-field 
                label="Titel" 
                hint="Geben sie hier einen Titel für das Modell ein" 
                v-model="new_model.title"></v-text-field>
              <v-file-input 
                accept=".obj" 
                show-size 
                label="File input" 
                v-model="new_model.model"></v-file-input>
              <v-file-input 
                prepend-icon="mdi-camera" 
                accept="image/png, image/jpeg, image/bmp" 
                show-size label="Textur input" 
                v-model="new_model.texture"></v-file-input>
            </v-card>
            <v-card-actions class="justify-center">
              <v-btn variant="outlined" v-on:click="addModel()" color="secondary"> Modell Speichern </v-btn>
              <v-btn variant="outlined" color="primary" @click="models_overlay = false"> Abbrechen </v-btn>
            </v-card-actions>
          </v-window-item>

        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * Methods overview:
 *  updatePlace     - Updates existing presentation of the place
 *  updatePositions - Updates existing presentation of positions
 *  moveToPosition  - Loads the view of the selected position
 *  addPosition     - Adds a new position to the list
 *  savePlace       - Saves the current processing status
 *  deletePlace     - Deletes the currently selected place
 *  cancelPlace     - Cancels all not already saved actions
 */
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {

  name: 'PlaceCreation',

  data() {

    return {
      tab:null,
      place: {
        id: '',
        activityID: '',
        placeNumber: '',
        ansprache: '',
        date: '',
      },
      new_model: {
        id: '',
        place_id: '',
        title: '',
        model: '',
        texture: '', 
      },
      positions: null,
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false,
    }

  },

  async created() {

    await fromOfflineDB.syncLocalDBs();                                         
    await this.updatePlace();
    await this.updatePositions();
  },

  methods: {

    async updatePlace() {

      const currentPlace = VueCookies.get( 'currentPlace' );
      const data = await fromOfflineDB.getObject( currentPlace, 'Places', 'places' );
      this.place = data.result;

    },

    async updatePositions() {
      
      this.positions = await fromOfflineDB.getAllObjectsWithID( this.place.id, 'Place', 'Positions', 'positions' );

    },

    moveToPosition( positionID ) {
      
      if( positionID !== 'new' ) {
        VueCookies.set( 'currentPosition', positionID );
      }
      this.$emit('view', 'Positionsbearbeitung')
      this.$router.push( { name: 'PositionCreation'} );

    },

    async savePlace() {

      await fromOfflineDB.deleteObject( this.place.id, 'Places', 'places' );
      await fromOfflineDB.addObject( this.place, 'Places', 'places' );

    },

    async deletePlace() {

      await fromOfflineDB.deleteCascade(this.place.id, 'position', 'Positions', 'positions');
      VueCookies.remove('currentPosition');

      await fromOfflineDB.deleteObject(this.place.id, 'Places', 'places');
      VueCookies.remove('currentPlace');
      
      this.$router.push({ name: "PlacesOverview" });
      this.$emit('view', 'Stellen');

    },

    async addPosition() {

      const newPosition = {
        id:             String(Date.now()),
        positionNumber: null,
        placeID:        this.place.id,
        texts:          [],
        images:         [],
        models: {
          firstModel: "Perfect shape!"
        }
      };

      if(this.positions.length == 0) {
        newPosition.positionNumber = 1
      } else {
        this.updatePositions();
        const positionNumber = Math.max(...this.positions.map(o => o.positionNumber))
        const newPositionNumber = positionNumber + 1;                           
        newPosition.positionNumber = newPositionNumber;
      }

      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await this.updatePositions(newPosition.id);

    }, 
    async addModel() {
      const newModel = {
        id: String(Date.now()),
        placeID: this.new_model.place_id,
        title: this.new_model.title,
        model: this.new_model.model,
        texture: this.new_model.texture
      };

      await fromOfflineDB.addObject(newModel, 'Models', 'places');
    },
    cancelPlace() {

      this.$router.push({ name: "PlacesOverview" });
      this.$emit("view", "Stellen");

    }
  }

};

</script>

<style scoped></style>
