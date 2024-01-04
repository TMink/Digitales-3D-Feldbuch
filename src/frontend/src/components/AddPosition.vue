<!--
 * Created Date: 01.07.2023 14:01:06
 * Author: Julian Hardtung
 * 
 * Last Modified: 04.01.2024 15:28:57
 * Modified By: Julian Hardtung
 * 
 * Description: vue component for adding a position
 -->

<template>
  <AddButton @click="addPosition()" />
</template>

<script>
import AddButton from '../components/AddButton.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';

export default {
  name: "AddPosition",
  components: {
    AddButton
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
    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateModulePresets();
  },
  methods: {
    closeDiag() {
      this.$emit('updatePositions');
    },

    /**
     * Get all ModulePresets from IndexedDB
     */
     async updateModulePresets() {
      let presetFromCookies = this.$cookies.get('posModulesPreset');

      if (presetFromCookies.length > 0) {
        this.curModulePreset = await fromOfflineDB.getObject(
          presetFromCookies, 'ModulePresets', 'positions');
        }
    },

    /**
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {
      var curPlaceID = this.$cookies.get('currentPlace');
      var curPlace = await fromOfflineDB.getObject(curPlaceID, "Places", "places");
      var newPositionID = String(Date.now());

      curPlace.positions.push(newPositionID);
      curPlace.lastChanged = Date.now();

      const newPosition = {
        _id: newPositionID,
        placeID: curPlaceID,
        positionNumber: null,
        subNumber: null,
        right: '',
        up: '',
        height: '',
        count: '',
        weight: '',
        material: '',
        title: '',
        description: '',
        dating: '',
        editor: '',
        date: new Date().toLocaleDateString("de-DE"),
        hasSubNumber: false,
        isSeparate: false,

        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: 0
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
            { _id: newPositionID, object: 'positions' }, 'Changes', 'created');
      this.closeDiag();
    },
  }
}
</script>