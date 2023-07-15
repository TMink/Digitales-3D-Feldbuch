<template>
  <AddButton @click="addPosition()" />
</template>

<script>
import AddButton from '../components/AddButton.vue';
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';

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
    }
  },
  methods: {
    closeDiag() {
      this.$emit('updatePositions');
      this.$emit('updatePlace');
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
        isSeperate: false,

        texts: [],
        images: [],
        models: [],
        lastChanged: Date.now(),
        lastSync: ''
      };

      if (this.positions_prop.length == 0) {
        newPosition.positionNumber = 1;
        newPosition.subNumber = 1;
      } else {
        var lastPos = 
            await fromOfflineDB.getLastAddedObject('Positions', 'positions');

        newPosition.subNumber = await this.calcSubNumber(newPosition, lastPos);
        newPosition.positionNumber = lastPos.positionNumber + 1;

        //TODO: autoincrement posNumber and implement the divide Checkbox
      }

      await fromOfflineDB.updateObject(curPlace, 'Places', 'places');
      await fromOfflineDB.addObject(newPosition, "Positions", "positions");
      await fromOfflineDB.addObject(
            { id: newPositionID, object: 'positions' }, 'Changes', 'created');
      this.closeDiag();
    },
    /**
     * Calculates the SubNumber of a position
     */
    async calcSubNumber(curPos, prevPos) {
      var subNumber = prevPos.subNumber;

      //TODO: include activity in subNumber calculation
      // --> maybe edit the fromOfflineDB function
      if (/* curPos.activity == prevPos.activity && */
        curPos.placeID == prevPos.placeID &&
        curPos.positionNumber == prevPos.positionNumber &&
        curPos.right == prevPos.right &&
        curPos.up == prevPos.up &&
        curPos.height == prevPos.height &&
        curPos.dating == prevPos.dating &&
        curPos.addressOf == prevPos.addressOf &&
        curPos.date == prevPos.date &&
        !curPos.seperate) {
        return subNumber;
      }

      return subNumber + 1;
    },
  }
}
</script>