<!--
 * Created Date: 01.07.2023 14:01:06
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 13:56:53
 * Modified By: Julian Hardtung
 * 
 * Description: vue component for adding a position
 -->

<template>
  <AddButton @click="addPosition()" prop_object="position" />
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
    await fromOfflineDB.syncLocalDBs().catch(err => console.error(err));
    await this.updateModulePresets().catch(err => console.error(err));
  },
  methods: {

    /**
     * Get all ModulePresets from IndexedDB
     */
     async updateModulePresets() {
      let presetFromCookies = this.$generalStore.getModulesPreset('position');

      if (presetFromCookies != null) {
        this.curModulePreset = await fromOfflineDB
          .getObject(presetFromCookies, 'ModulePresets', 'positions')
          .catch(err => console.error(err));
        }
    },

    /**
     * Adds a new position to the local storage for the current place
     */
    async addPosition() {
      var curPlaceID = this.$generalStore.getCurrentObject('place');
      var curPlace = await fromOfflineDB
        .getObject(curPlaceID, "Places", "places")
        .catch(err => console.error(err));
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
        newPosition.positionNumber = this.positions_prop.length + 1;
      }
      await fromOfflineDB.updateObject(curPlace, 'Places', 'places')
        .catch(err => console.error(err));
      await fromOfflineDB.addObject(newPosition, "Positions", "positions")
        .catch(err => console.error(err));
      this.$emit('updatePositions');
    },
  }
}
</script>