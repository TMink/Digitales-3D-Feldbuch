<template>
  <v-card>
    <v-form>
      <v-card class="pa-3" :min-width="windowWidth * 0.5">
        <v-data-table-virtual :items="positions" fixed-header :height="getTableHeight" :headers="headers"
          :sort-by="[{ key: 'positionNumber', order: 'asc' }]" max-height>

          <template v-slot:item="{ item, index }">
            <tr v-on:click="moveToPosition(item.raw.id)" @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">

              <!-- POSITION NUMBER -->
              <td :style="getRowStyle(index)">
                <v-list-item-title>
                  {{ item.raw.positionNumber }}
                </v-list-item-title>
              </td>

              <!-- SUB NUMBER -->
              <td :style="getRowStyle(index)">
                <v-list-item-title>
                  {{ item.raw.subNumber }}
                </v-list-item-title>
              </td>

              <!-- TITLE -->
              <td class="py-6" :style="getRowStyle(index)">
                <v-list-item-title v-if="item.raw.title.length > 0" style="min-width:200px" class="text-wrap">
                  {{ item.raw.title }}
                </v-list-item-title>

                <v-list-item-title v-if="item.raw.title.length == 0" style="color:dimgrey;">
                  -
                </v-list-item-title>
              </td>

              <!-- DATE -->
              <td :style="getRowStyle(index)">
                <v-list-item-title>
                  {{ item.raw.date || '-' }}
                </v-list-item-title>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-card>

      <AddPosition :positions_prop="positions" @updatePlace="updatePlace()" @updatePositions="updatePositions()" />

    </v-form>
  </v-card>
</template>
  
<script>
import { fromOfflineDB } from '../../ConnectionToOfflineDB';


export default {

  data() {
    return {
      place: [],
      positions: [],
    }
  },

  watch: {
    'place': {
      handler: 'handlePlaceChange',
      deep: true,
    },
  },

  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updatePlace();
    await this.updatePositions();
  },

  mounted: {
    /**
    * Update reactive Vue.js place data
    */
    async updatePlace() {
      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data;
    },

    /**
    * Update reactive Vue.js positions data
    */
    async updatePositions() {
      this.positions = await fromOfflineDB.getAllObjectsWithID(this.place.id, 'Place', 'Positions', 'positions');
    },

    /**
    * Get the style for the row at the specified index.
    *
    * @param {number} index The index of the row
    * @returns {Object} An object containing row style properties
    */
    getRowStyle(index) {
      return {
        backgroundColor: this.hoveredRow === index ? '#2f3845' : 'transparent',
        cursor: 'pointer',
        padding: '8px 16px'
      };
    },

    /**
    * Update the hoveredRow based on the isHovered flag.
    *
    * @param {number} index - The index of the row being hovered.
    * @param {boolean} isHovered - Indicates if the row is being hovered 
    *                              (true) or not (false).
    */
    setHoveredRow(index, isHovered) {
      if (isHovered) {
        this.hoveredRow = index;
      } else if (this.hoveredRow === index) {
        this.hoveredRow = -1;
      }
    },

    /**
    *  Routes to the PositionForm for the chosen positionID
    * @param {String} positionID 
    */
    moveToPosition(positionID) {
      if (positionID !== 'new') {
        VueCookies.set('currentPosition', positionID);
      }
      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } });
    },
  },

}

</script>
