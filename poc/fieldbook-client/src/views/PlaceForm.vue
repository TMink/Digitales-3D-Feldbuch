<template>
  <v-container fluid>
    <v-row>
      <v-col cols="2">
        <v-card rounded="0">
          <v-tabs v-model="tab" direction="vertical" color="secondary">
            <v-tab value="one" rounded="0"> Allgemein </v-tab>
            <v-tab value="two" rounded="0"> Positionen </v-tab>
            <v-tab value="three" rounded="0"> Modell </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="secondary"> Speichern </v-btn>
            <v-dialog v-model="dialog" persistent width="auto">
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
                  <v-btn color="secondary" variant="outlined" v-on:click="deletePlace()" @click="dialog = false">
                    Ja
                  </v-btn>
                  <v-btn color="primary" variant="outlined" @click="dialog = false">
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
              <v-text-field v-model="place.date" label="Datierung" hint="Format: dd.mm.yyyy"></v-text-field>
            </v-card>
          </v-window-item>

          <v-window-item value="two">
            <v-form>
              <v-list>
                <v-list-subheader v-if="positions.length === 0">
                  Bisher wurde keine Positionen angelegt
                </v-list-subheader>

                <template v-for="(position, i) in positions" :key="position">
                  <v-list-item class="positionItem mt-3" v-on:click="moveToPosition(position.id)">

                    <v-list-item-title class="text-h6">
                      Nr. {{ position.positionNumber }} - {{ position.date }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="text-subtitle-1">
                      {{ position.description }}
                    </v-list-item-subtitle>

                  </v-list-item>
                  <v-divider v-if="i !== positions.length - 1"></v-divider>
                </template>
              </v-list>
              <v-btn v-on:click="addPosition()" class="mr-16 mt-3" color="primary"> Position hinzufügen </v-btn>
            </v-form>
          </v-window-item>


          <v-window-item value="three">
            <v-form>
              <v-list>
                <v-list-subheader v-if="models.length === 0">
                  Bisher wurde keine Modelle angelegt
                </v-list-subheader>

                <template v-for="(model, i) in models" :key="model">
                  <v-list-item class="modelItem mt-3" v-on:click="moveToModel(model.id)">

                    <v-list-item-title class="text-h6">
                      Nr. {{ model.modelNumber }}
                    </v-list-item-title>

                    <v-list-item-subtitle class="text-subtitle-1">
                      {{ model.title }}
                    </v-list-item-subtitle>

                  </v-list-item>
                  <v-divider v-if="i !== models.length - 1"></v-divider>
                </template>
              </v-list>
              <v-btn @click="models_overlay = true" class="mr-16 mt-3" color="primary"> Modell hinzufügen </v-btn>
            </v-form>

            <v-dialog v-model="models_overlay" max-width="800" persistent>
              <v-card>
                <v-card-title>Modell hinzufügen </v-card-title>
                <v-card-text>
                  <v-text-field label="Stellen ID" hint="Geben Sie hier die Stellen ID ein" disabled v-model="place.id">
                  </v-text-field>
                  <v-text-field label="Titel" hint="Geben sie hier einen Titel für das Modell ein"
                    v-model="model.title"></v-text-field>
                  <v-file-input accept=".obj" show-size label="File input" v-model="model.model"></v-file-input>
                  <v-file-input prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp" show-size
                    label="Textur input" v-model="model.texture"></v-file-input>
                </v-card-text>
                <v-card-actions class="justify-center">
                  <v-btn variant="outlined" v-on:click="addModel()"> Speichern </v-btn>
                  <v-btn @click="models_overlay = false"> Abbrechen </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>


            <!-- <v-card>
              <v-text-field 
                label="Stellen ID" 
                hint="Geben Sie hier die Stellen ID ein" 
                v-model="model.placeID"></v-text-field>
              <v-text-field 
                label="Titel" 
                hint="Geben sie hier einen Titel für das Modell ein" 
                v-model="model.title"></v-text-field>
              <v-file-input 
                accept=".obj" 
                show-size 
                label="File input" 
                v-model="model.model"></v-file-input>
              <v-file-input 
                prepend-icon="mdi-camera" 
                accept="image/png, image/jpeg, image/bmp" 
                show-size label="Textur input" 
                v-model="model.texture"></v-file-input>
            </v-card>
            <v-card-actions class="justify-center">
              <v-btn variant="outlined" v-on:click="addModel()" color="secondary"> Modell Speichern </v-btn>
            </v-card-actions> -->
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
import { toRaw } from 'vue';

export default {

  name: 'PlaceCreation',

  data() {

    return {
      tab: null,
      place: {
        id: '',
        activityID: '',
        placeNumber: '',
        ansprache: '',
        date: '',
      },
      model: {
        id: '',
        placeID: '',
        title: '',
        model: '',
        texture: '',
      },
      positions: null,
      models: null,
      models_overlay: false,
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
    await this.updateModels();
  },

  methods: {

    async updatePlace() {

      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data.result;

    },

    async updatePositions() {

      this.positions = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Positions', 'positions');

    },

    async updateModels() {

      this.models = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Models', 'places');

    },

    moveToPosition(positionID) {

      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }
      this.$emit('view', 'Positionsbearbeitung')
      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } });

    },

    async savePlace() {

      //convert from vue proxy to JSON object
      const inputPlace = JSON.parse(JSON.stringify(this.place))

      await fromOfflineDB.deleteObject(this.place.id, 'Places', 'places');
      await fromOfflineDB.addObject(inputPlace, 'Places', 'places');

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
        id: String(Date.now()),
        positionNumber: null,
        placeID: this.place.id,
        texts: [],
        images: [],
        models: {
        }
      };

      if (this.positions.length == 0) {
        newPosition.positionNumber = 1;
      } else {
        this.updatePositions();
        const positionNumber = Math.max(...this.positions.map(o => o.positionNumber))
        const newPositionNumber = positionNumber + 1;
        newPosition.positionNumber = newPositionNumber;
      }

      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await this.updatePositions(newPosition.id);

    },

    async toBase64(rawData) {

      const output = await new Promise((resolve, reject) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          console.log(b64)
          resolve(b64)
        }

        reader.readAsDataURL(f);

      });

      return output;

    },

    async toStringModel(rawData) {

      const output = await new Promise((resolve, reject) => {

        let reader = new FileReader();
        let f = rawData[0];
        reader.onload = e => {
          const b64 = e.target.result
          console.log(b64)
          resolve(b64)
        }

        reader.readAsText(f);

      });

      return output;

    },

    async addModel() {
      const newModel = {
        id: String(Date.now()),
        placeID: this.place.id,
        title: this.model.title,
        model: await this.toStringModel(toRaw(this.model.model)),
        texture: await this.toBase64(toRaw(this.model.texture)),
      };

      if (this.models.length == 0) {
        newModel.modelNumber = 1;
      } else {
        this.updateModels();
        const modelNumber = Math.max(...this.models.map(o => o.modelNumber))
        const newModelNumber = modelNumber + 1;
        newModel.modelNumber = newModelNumber;
      }

      await fromOfflineDB.addObject(newModel, 'Models', 'places');
      await this.updateModels(newModel.id);
    },
    cancelPlace() {

      this.$router.push({ name: "PlacesOverview" });
      this.$emit("view", "Stellen");

    }
  }

};

</script>

<style scoped></style>
