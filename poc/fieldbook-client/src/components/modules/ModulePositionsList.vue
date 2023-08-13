<template>
  <v-col lg="12">
    <v-form>
      <v-card 
        :min-width="windowWidth * 0.5">
        <v-card-text>
          <h2 class="text-h6 font-weight-medium pb-2">
            {{ $tc('position', 2) }}
          </h2>
        </v-card-text>
        <v-data-table-virtual 
          :items="positions" 
          fixed-header 
          :height="getTableHeight" 
          :headers="headers"
          :sort-by="[{ key: 'positionNumber', order: 'asc' }]" 
          max-height>

          <template v-slot:item="{ item, index }">
            <tr 
              v-on:click="moveToPosition(item.raw.id)" 
              @mouseenter="setHoveredRow(index, true)"
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
              <td 
                class="py-0" 
                :style="getRowStyle(index)">
                <v-list-item-title v-if="item.raw.title.length > 0" 
                    style="min-width:200px" 
                    class="text-wrap">
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

      <!-- <AddPosition :positions_prop="positions" @updatePlace="updatePlace()" @updatePositions="updatePositions()" /> -->

    </v-form>
  </v-col>
</template>
  
<script>
import VueCookies from 'vue-cookies';
import { fromOfflineDB } from '../../ConnectionToOfflineDB';
import AddPosition from '../../components/AddPosition.vue';
import { useWindowSize } from 'vue-window-size';

export default {

  computed: {
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.positions.length > 0 ? this.positions.length : 1;
      const headerHeight = 56;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 350)) {
        return this.windowHeight - 350;
      }

      return totalTableHeight + "px";
    },
  },

  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },

  components: {
    AddPosition,
  },

  emits: ['dataToModelViewer'],

  props: {
    placeProp: Object,
    updateListSecondProp: Boolean,
  },

  data() {
    return {
      placePositions: null,
      place: [],
      positions: [],
      headers: [
        {
          title: this.$t('posNumber'),
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        {
          title: this.$t('subNumber'),
          align: 'start',
          sortable: true,
          key: 'subNumber',
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date' },
      ],
      hoveredRow: -1,
    }
  },

  watch: {
    'updateListSecondProp': {
      handler: async function() {
        await this.updatePositions();
        this.$emit( "dataToModelViewer", [ 'resetBool', false ] );
      }
    },
    'place': {
      handler: 'handlePlaceChange',
      deep: true,
    },
  },

  async created() {
    await fromOfflineDB.syncLocalDBs();
  },

  async updated() {
    await this.updatePositions();
  },

  methods: {

    async updatePlace() {
      const currentPlace = VueCookies.get('currentPlace');
      const data = await fromOfflineDB.getObject(currentPlace, 'Places', 'places');
      this.place = data;
    },

    async updatePositions() {
      this.positions = await fromOfflineDB.getAllObjectsWithID(this.placeProp.id, 'Place', 'Positions', 'positions');
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

    /**
     * Gets called every time some info of the current position changes.
     * Once a change has happend, the flag `hasUnsavedChanges` gets set to `true`
     */
     handlePlaceChange() {
      if (this.hasUnsavedChanges) {
        return;
      }

      if (this.componentHasLoaded) {
        this.hasUnsavedChanges = true;
      }
    },
  },

}

</script>
