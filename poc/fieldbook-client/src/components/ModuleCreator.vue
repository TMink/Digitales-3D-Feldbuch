<template>
  <v-dialog style="z-index: 2;" max-width="1000px">
    <v-card class="pa-4">
      
      <v-card-title>MODULE MANAGEMENT - {{ objectTypeProp.toUpperCase() }}</v-card-title>
      <v-row no-gutters>
        <v-col cols="5">
          <v-card-title>
            Single Modules
          </v-card-title>
          <v-card outline>
            <v-row no-gutters>
              <v-col>
                <v-text-field label="Title" v-model="curPreset.title"></v-text-field>
                <v-checkbox hide-details label="General" v-model="curPreset.general"></v-checkbox>
                <v-checkbox hide-details label="PositionsList" v-model="curPreset.positionslist"></v-checkbox>
                <v-checkbox hide-details label="Coordinates" v-model="curPreset.coordinates"></v-checkbox>
                <v-checkbox hide-details label="Visibility" v-model="curPreset.visibility"></v-checkbox>
                <v-checkbox hide-details label="FindTypes" v-model="curPreset.findTypes"></v-checkbox>
                <v-checkbox hide-details label="Plane" v-model="curPreset.plane"></v-checkbox>
                <v-checkbox hide-details label="Dating" v-model="curPreset.dating"></v-checkbox>
              </v-col>
            </v-row>
            <v-btn color="primary" v-on:click="saveModulePreset">SAVE Preset</v-btn>
          </v-card>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-card-subtitle>
            Existing Presets
          </v-card-subtitle>

            <v-data-table-virtual :items="modulePresets" hide-headers>

              <template v-slot:item="{ item, index }">
                <tr @mouseenter="setHoveredRow(index, true)"
                  @mouseleave="setHoveredRow(index, false)">

                  <v-row no-gutters>
                    <td v-on:click="setModulePreset(item.raw)" colspan="3" :style="getRowStyle(index)">
                      <v-list-item-title>
                        {{ item.raw.title || '-' }}
                      </v-list-item-title>
                  </v-row>
                </tr>
              </template>
            </v-data-table-virtual>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutter class="mt-0 pa-n2 align-center text-center">
        <v-col cols="6">
          <v-btn color="primary" v-on:click="saveModulePreset">SAVE Preset</v-btn>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card-subtitle>
            Selected Preset
          </v-card-subtitle>
          <v-card-title>
            {{ selectedPreset.title || '-'}}
          </v-card-title>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>

import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { toRaw } from 'vue';
import VueCookies from 'vue-cookies';

export default {

  components: {
    ConfirmDialog,
  },

  props: {
    objectTypeProp: String
  },
  emits: ['updateModulePresets'],

  data: () => ({
    dialog: false,
    curPreset: {
      title: null,

      general: false,
      coordinates: false,
      visibility: false,
      dating: false,

      //place specific
      plane: false,
      findTypes: false,
      positionslist: false,

      //position specific
      objectDescribers: false,
    },
    selectedPreset: '',
    modulePresets: [],
    hoveredRow: -1,
  }),

  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateModulePresets();
  },

  methods: {
    async updateModulePresets() {
      this.modulePresets = await fromOfflineDB.getAllObjects('ModulePresets', this.objectTypeProp);
    },

    async saveModulePreset() {
      //only save the preset if it doesn't already exist
      if (!this.presetAlreadyExists(false)) {
        var rawPreset = toRaw(this.curPreset);

        rawPreset.id = String(Date.now());
        
        await fromOfflineDB.addObject(rawPreset, 'ModulePresets', this.objectTypeProp);
        await this.updateModulePresets();
        this.$emit('updateModulePresets');
      } else {
        console.log("Preset already exists");
      }
    },

    /**
     * Checks if a preset already exists before saving it
     * @return {Boolean} returns `true` or `false`
     */
    presetAlreadyExists(input) {
      //TODO: functionality (function name can be renamed)
      return input;
    },

    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
     setModulePreset(item) {
      let rawPreset = toRaw(item);
      this.selectedPreset = rawPreset;
      VueCookies.set('currentModulePreset', rawPreset.id)
    },

    editPreset() {
      console.log("EDIT")
    }, 

    /**
     * Deletes a selected ModulePreset from IndexedDB
     * @param {Object} object 
     */
    async deletePreset(object) {
      let rawObject = toRaw(object);

      await fromOfflineDB.deleteObject(rawObject, 'ModulePresets', this.objectTypeProp);
      await this.updateModulePresets();
    },

    /**
     * Opens the confirmation dialog for deletion#
     * @param {Object} place 
     */
     async confirmDeletion(object) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          "Do you really want to delete this preset?"
        )
      ) {
        this.deletePreset(object);
      }
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
        width: '60%',
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

  },
};
</script>
