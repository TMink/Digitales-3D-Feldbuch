<template>
  <v-form ref="form">
    <v-tabs vertical color="secondary">
      <v-tab> Allgemein </v-tab>
      <v-tab> Positionen </v-tab>

      <v-tab-item class="px-4">
        <v-text-field v-model="place.ansprache" label="Ansprache"
          hint="Geben Sie hier eine Ansprache ein"></v-text-field>
        <v-text-field v-model="place.date" label="Datierung" 
                      hint="Format: dd.mm.yyyy"></v-text-field>
      </v-tab-item>

      <v-tab-item class="px-4">
        <div id="wrapper">
          <v-form>
            <v-list>
              <v-divider></v-divider>
              
              <v-subheader v-if="positions.length === 0"> 
                Bisher wurde keine Positionen angelegt
              </v-subheader>
              
              <template v-for="(position, i) in positions">
                <v-list-item class="positionItem mt-3">
                  
                  <v-list-item-content>
                    
                    <v-list-item-title class="text-h6">
                      Nr. {{ position.positionNumber }} - {{ position.date }}
                    </v-list-item-title>
                    
                    <v-list-item-subtitle class="text-subtitle-1">
                      {{ position.description }}
                    </v-list-item-subtitle>

                  </v-list-item-content>
                  
                  <v-btn color="primary" v-on:click="moveToPosition(position.id)">
                    <v-icon color="white">mdi-pencil
                    </v-icon>
                  </v-btn>

                </v-list-item>
                <v-divider v-if="i !== positions.length - 1"></v-divider>
              </template>
            </v-list>
            <v-btn v-on:click="addPosition()" class="mr-16 mt-3" 
                   color="primary"> Position hinzufügen </v-btn>
          </v-form>
        </div>
      </v-tab-item>

      <v-btn v-on:click="savePlace()" color="secondary" class="py-6" tile> 
        Speichern
      </v-btn>

      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on, attrs }">

          <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
            Löschen
          </v-btn>

        </template>
        <v-card>

          <v-card-title class="text-h5">
            Wollen Sie die Stelle "{{ place.placeNumber }}" wirklich löschen?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="secondary" v-on:click="deletePlace()"
                   @click="dialog = false">
              Ja
            </v-btn>

            <v-btn color="primary" @click="dialog = false">
              Nein
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn v-on:click="cancelPlace" color="primary" class="py-6" tile> 
        Abbrechen
      </v-btn>

    </v-tabs>

    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>

  </v-form>
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

  data() {                                                                      /* -------> data() */

    return {
      place: null,
      positions: null,
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false,
    }

  },

  async created() {                                                             /* -------> created() */

    await fromOfflineDB.syncLocalDBs();                                         
    await this.updatePlace();
    await this.updatePositions();

  },

  methods: {                                                                    /* -------> methods */

    async updatePlace() {                                                       /* ------>> updatePlace() */

      const currentPlace = VueCookies.get( 'currentPlace' );                    /* Get id of selected place */
      const data = await fromOfflineDB.getObject                                /* Get all data of selected place */
                         ( currentPlace, 'Places', 'places' );
      this.place = data.result;                                                 /* Update 'place' with existing data */

    },

    async updatePositions() {                                                   /* ------>> updatePositions() */
      
      this.positions = await fromOfflineDB.getPositionsWithPlaceID              /* Update 'positions' with existing data */
                             ( this.place.id, 'Positions', 'positions' );

    },

    moveToPosition( positionID ) {                                              /* ------>> moveToPosition() */
      
      if( positionID !== 'new' ) {
        VueCookies.set( 'currentPosition', positionID );
      };

      this.$router.push( { name: 'PositionCreation'} );

    },

    async savePlace() {

      await fromOfflineDB.deleteObject( this.place.id, 'Places', 'places' );
      await fromOfflineDB.addObject( this.place, 'Places', 'places' );

    },

    async deletePlace() {                                                       /* ------>> deletePlace() */

      await fromOfflineDB.deleteObject(this.place.id, 'Places', 'places');      /* Delete the selected place ... */
      VueCookies.remove('currentPlace');                                        /* ... and remove cookie */
      
      this.$router.push({ name: "PlacesOverview" });                            /* Return to PlacesOverview page */
      this.$emit('view', 'Stellen')

      await fromOfflineDB.deleteCascadePositions                                /* Delete all positions wich were connected with the selected place ... */
            (this.place.id, 'Positions', 'positions');
      VueCookies.remove('currentPosition');                                     /* ... and remove cookies */

    },

    async addPosition() {                                                       /* ------>> addPositions() */

      const newPosition = {
        id:             String(Date.now()),
        positionNumber: 0,
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
        const positionNumber = Math.max(...this.positions.map                   /* Get the highest positionNumber of existing positions */
                                                (o => o.positionNumber))
        const newPositionNumber = positionNumber + 1;                           
        newPosition.positionNumber = newPositionNumber;                         /* Update the current positionNumber */
      }

      await fromOfflineDB.addObject(newPosition, "Positions", "positions");     /* Add a new position to the store */
      await this.updatePositions(newPosition.id);                               /* Update positions list */

    },

    cancelPlace() {                                                                  /* ------>> goBack() */

      this.$router.push({ name: "PlacesOverview" });
      this.$emit("view", "Stellen");

    }

  }

};

</script>

<style scoped></style>
