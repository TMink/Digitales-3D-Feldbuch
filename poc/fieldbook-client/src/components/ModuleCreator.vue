<template>
  <v-dialog style="z-index: 2;" max-width="1000px">
    <ConfirmDialog ref="confirm" />
    <v-card class="pa-4">
      
      <v-card-title>MODULE MANAGEMENT - {{ objectTypeProp.toUpperCase() }}</v-card-title>
      <v-row no-gutters>
        <v-col cols="6" v-show="!editPresetForm">
          <v-card-subtitle>
            Add new Preset
          </v-card-subtitle>
          <v-window class="ma-2">

            <v-text-field hide-details label="Title" class="pr-6" v-model="curPreset.title"></v-text-field>
            <v-checkbox hide-details label="General" v-model="curPreset.general"></v-checkbox>
            <v-checkbox hide-details label="PositionsList" v-model="curPreset.positionslist"></v-checkbox>
            <v-checkbox hide-details label="Coordinates" v-model="curPreset.coordinates"></v-checkbox>
            <v-checkbox hide-details label="Visibility" v-model="curPreset.visibility"></v-checkbox>
            <v-checkbox hide-details label="FindTypes" v-model="curPreset.findTypes"></v-checkbox>
            <v-checkbox hide-details label="Plane" v-model="curPreset.plane"></v-checkbox>
            <v-checkbox hide-details label="Dating" v-model="curPreset.dating"></v-checkbox>
          </v-window>
        </v-col>

        <v-col cols="6" v-show="editPresetForm">
          <v-card-subtitle>
            Edit Module
          </v-card-subtitle>
          <v-window class="ma-2">

            <v-text-field hide-details label="Title" class="pr-6" v-model="selectedPreset.title"></v-text-field>
            <v-checkbox hide-details label="General" v-model="selectedPreset.general"></v-checkbox>
            <v-checkbox hide-details label="PositionsList" v-model="selectedPreset.positionslist"></v-checkbox>
            <v-checkbox hide-details label="Coordinates" v-model="selectedPreset.coordinates"></v-checkbox>
            <v-checkbox hide-details label="Visibility" v-model="selectedPreset.visibility"></v-checkbox>
            <v-checkbox hide-details label="FindTypes" v-model="selectedPreset.findTypes"></v-checkbox>
            <v-checkbox hide-details label="Plane" v-model="selectedPreset.plane"></v-checkbox>
            <v-checkbox hide-details label="Dating" v-model="selectedPreset.dating"></v-checkbox>
          </v-window>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-card-subtitle>
            Existing Presets
          </v-card-subtitle>

            <v-data-table-virtual :items="modulePresets" class="pt-2" hide-headers height="400px">

              <template v-slot:item="{ item, index }">
                <tr @mouseenter="setHoveredRow(index, true)"
                  @mouseleave="setHoveredRow(index, false)">

                  <v-row no-gutters class="align-center">
                    <td v-on:click="setModulePreset(item.raw), editPreset(item.raw)" :style="getRowStyle(index)">
                      <v-list-item-title>
                        {{ item.raw.title || '-' }}
                      </v-list-item-title>
                    </td>  
                      <!-- <v-btn 
                        class="mx-2 " 
                        color="primary" 
                        density="compact" 
                        v-on:click="editPreset(item.raw)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn> -->
                      <v-btn 
                        class="mr-2" 
                        color="error" 
                        density="compact"
                        v-on:click="confirmDeletion(item.raw)">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                  </v-row>
                </tr>
              </template>
            </v-data-table-virtual>
            <v-row no-gutters class="pt-2 justify-center">
              <v-btn color="secondary" v-on:click="editPresetForm=false">ADD new preset</v-btn>
            </v-row>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutter class="mt-0 pa-n2 align-center text-center">
        <v-col cols="6">
          <v-btn color="primary" v-show="!editPresetForm" v-on:click="saveModulePreset">SAVE Preset</v-btn>
          <v-btn color="primary" v-show="editPresetForm" v-on:click="saveModulePreset">SAVE edited Preset</v-btn>
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
    editPresetForm: false,
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
      var rawPreset = toRaw(this.curPreset);

      //only save the preset if it doesn't already exist
      var presetExists = await this.presetAlreadyExists(rawPreset);

      if (!presetExists) {
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
    async presetAlreadyExists(newPreset) {
      const excludedFields = ['id', 'title'];
      var allPresets = await fromOfflineDB.getAllObjects('ModulePresets', this.objectTypeProp);

      const keys1 = Object.keys(newPreset).filter(key => !excludedFields.includes(key));
      var alreadyExists = false;

      allPresets.forEach(existingPreset => {
        for (const key of keys1) {
          alreadyExists = true;
          if (newPreset[key] !== existingPreset[key]) {
            alreadyExists = false;
            break;
          }
        }
      });

      return alreadyExists;
    },

    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    setModulePreset(item) {
      let rawPreset = toRaw(item);
      this.selectedPreset = rawPreset;
      VueCookies.set('placeModulesPreset', rawPreset.id);
    },

    editPreset(object) {
      this.editPresetForm = true;
      this.selectedPreset = toRaw(object)
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
        width: '80%',
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
