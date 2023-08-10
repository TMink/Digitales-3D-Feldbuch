<template>
  <v-row class="align-center">
    <v-spacer></v-spacer>
    <AddButton @click="addPosition()" />
    <v-btn 
      @click="moduleCreatorOverlay = !moduleCreatorOverlay"
      color="primary">
      <v-icon>mdi-tune-vertical</v-icon>
      <v-row no-gutters>
        <v-col>
          <v-card-subtitle>
            {{  curModulePreset.title }}
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-btn>
    <v-spacer></v-spacer>
    <ModuleCreator 
      v-model="moduleCreatorOverlay" 
      objectTypeProp="positions"
      @updateModulePresets="updateModulePresets()"/>
  </v-row>
</template>

<script>
import AddButton from '../components/AddButton.vue';
import ModuleCreator from '../components/ModuleCreator.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import VueCookies from 'vue-cookies';
import { toRaw } from 'vue';

export default {
  name: "AddPosition",
  components: {
    AddButton,
    ModuleCreator
  },
  props: {
    positions_prop: Array,
  },
  emits: ['updatePositions', 'updatePlace'],
  data() {
    return {
      curModulePreset: {
        title: '-',
      },
      moduleCreatorOverlay: false,
    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateModulePresets();
  },
  methods: {
    closeDiag() {
      this.$emit('updatePositions');
      this.$emit('updatePlace');
    },

    /**
     * Get all ModulePresets from IndexedDB
     */
     async updateModulePresets() {
      let presetFromCookies = VueCookies.get('posModulesPreset');

      if (presetFromCookies) {
        this.curModulePreset = await fromOfflineDB.getObject(
          presetFromCookies, 'ModulePresets', 'positions');
      }
    },

    /**
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {
      var curPlaceID = VueCookies.get('currentPlace');
      var curPlace = await fromOfflineDB.getObject(curPlaceID, "Places", "places");
      var newPositionID = String(Date.now());

      curPlace.positions.push(newPositionID);
      curPlace.lastChanged = Date.now();

      const newPosition = {
        id: newPositionID,
        placeID: curPlaceID,
        positionNumber: '',
        subNumber: '',
        right: '',
        up: '',
        height: '',
        count: '',
        weight: '',
        material: '',
        title: '',
        description: '',
        dating: '',
        addressOf: '',
        date: new Date().toLocaleDateString("de-DE"),
        hasSubNumber: false,
        isSeparate: false,

        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: ''
      };

      newPosition.modulePreset = toRaw(this.curModulePreset);

      if (this.positions_prop.length == 0) {
        newPosition.positionNumber = 1;
      } else {
        var lastPosNumber = await fromOfflineDB.getLastAddedPosition();

        newPosition.positionNumber = lastPosNumber + 1;
      }
      
      await fromOfflineDB.updateObject(curPlace, 'Places', 'places');
      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await fromOfflineDB.addObject(
            { id: newPositionID, object: 'positions' }, 'Changes', 'created');
      this.closeDiag();
    },
  }
}
</script>