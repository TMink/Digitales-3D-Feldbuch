<template>
  <v-form ref="form">
      <Navigation/>
    <v-tabs vertical color="secondary">
      <v-tab> Allgemein </v-tab>
      <v-tab> Positionen </v-tab>

      <v-tab-item class="px-4">
        <v-text-field v-model="place.ansprache" label="Ansprache"
          hint="Geben Sie hier eine Ansprache ein"></v-text-field>
        <v-text-field v-model="place.date" label="Datierung" hint="Format: dd.mm.yyyy"></v-text-field>
      </v-tab-item>

      <v-tab-item class="px-4">
        <v-subheader v-if="positions <= 0"> Bisher wurden keine Positionen angegeben</v-subheader>
        <div id="wrapper">
          <v-form>
            <v-list>
              <v-divider></v-divider>
              <template v-for="(position, i) in positions">
                <v-list-item class="positionItem mt-3">
                  <v-list-item-content>
                    <v-list-item-title class="text-h6"> Nr. {{ position.positionNumber }} - {{ position.date
                    }}</v-list-item-title>
                    <v-list-item-subtitle class="text-subtitle-1">{{ position.description }} </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-btn color="primary"><v-icon color="white"
                      v-on:click="modifyPosition(position.id)">mdi-pencil</v-icon></v-btn>
                </v-list-item>
                <v-divider v-if="i !== positions.length - 1"></v-divider>
              </template>
            </v-list>
            <v-btn v-on:click="modifyPosition('new')" class="mr-16 mt-3" color="primary"> Position hinzufügen </v-btn>
          </v-form>
        </div>
      </v-tab-item>

      <v-btn v-on:click="savePlace()" color="secondary" class="py-6" tile> Speichern </v-btn>
      <v-dialog v-model="dialog" max-width="290">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="secondary" class="py-6" tile v-bind="attrs" v-on="on">
            Delete
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            Do you really want to delete the place:  <br> "{{ place.id }}"?
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="secondary" v-on:click="deletePlace()" @click="dialog = false">
              Yes
            </v-btn>
            <v-btn color="primary" @click="dialog = false">
              No
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn v-on:click="goBack" color="primary" class="py-6" tile> Cancel</v-btn>

    </v-tabs>
    <v-alert v-model="error_dialog" type="error" dense outlined dismissible>
      {{ error_message }}
    </v-alert>
  </v-form>
</template>

<script>
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import Navigation from './Navigation.vue'

export default {
  name: 'PlaceCreation',
  components:{
    Navigation
  },
  data() {

    return {
      place: null,
      positions: null,
      error_dialog: false,
      error_message: '',
      is_new: true,
      is_required: [v => !!v || 'Pflichtfeld'],
      dialog: false
    }

  },
  async created() {

    await fromOfflineDB.syncLocalDBs();
    await this.updateData();

  },
  methods: {
    /* Update existing data */
    async updateData() {

      /* Get id of selected place */
      const currentPlace = VueCookies.get("currentPlace")

      /* Get all data of selected place */
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data.result

      /* Get all positions of selected place */
      this.positions = await fromOfflineDB.getAllObjects('Positions', 'positions');

      this.positions = this.positions.filter(pos => pos.place_id === currentPlace)
    },
    modifyPosition: function(item_id){
      if (item_id !== 'new') {
        VueCookies.set('currentPosition', item_id)
      }
      this.$router.push({ name: 'PositionCreation', params: { position_id: item_id } })
    },
    savePlace: async function() {

      await fromOfflineDB.deleteObject(this.place.id, 'Places', 'places')
      await fromOfflineDB.addObject(this.place, 'Places', 'places')

    },
    /* Delete the selected place */
    deletePlace: async function () {

      await fromOfflineDB.deleteObject(this.place.id, 'Places', 'places')
      this.$router.push({ name: "PlacesOverview" });

    },
    /* Go back to PlacesOverview */
    goBack: function () {

      this.$emit("view", "PlacesOverview");
      this.$router.push({ name: "PlacesOverview" });

    }
  }
};
</script>

<style scoped></style>
