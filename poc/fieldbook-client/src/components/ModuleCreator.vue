<template>
  <v-dialog style="z-index: 2;" max-width="1000px">
    <ConfirmDialog ref="confirm" />
    <v-card class="pa-4">
      
      <v-card-title>MODULE MANAGEMENT - {{ objectTypeProp.toUpperCase() }}</v-card-title>
      <v-row no-gutters>

        <!-- NEW PRESET -->
        <v-col cols="6" v-show="!editPresetForm">
          <v-card-subtitle>
            Add new Preset
          </v-card-subtitle>
          <v-window class="ma-2">
            <v-text-field hide-details label="Title" class="pr-6" v-model="curPreset.title"></v-text-field>
            <v-checkbox 
              hide-details 
              label="General" 
              v-model="curPreset.general">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Coordinates" 
              v-model="curPreset.coordinates">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Visibility" 
              v-model="curPreset.visibility">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Dating" 
              v-model="curPreset.dating">
            </v-checkbox>

            <!-- PLACE SPECIFIC -->
            <v-checkbox 
              hide-details 
              label="Plane" 
              v-if="objectTypeProp == 'places'" 
              v-model="curPreset.plane">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="FindTypes" 
              v-if="objectTypeProp == 'places'" 
              v-model="curPreset.findTypes">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="PositionsList" 
              v-if="objectTypeProp == 'places'" 
              v-model="curPreset.positionslist">
            </v-checkbox>

            <!-- POSITION SPECIFIC -->
            <v-checkbox 
              hide-details 
              label="Object Describers" 
              v-if="objectTypeProp == 'positions'" 
              v-model="curPreset.objectDescribers">
            </v-checkbox>
          </v-window>
        </v-col>


        <!-- EDIT PRESET -->
        <v-col cols="6" v-show="editPresetForm">
          <v-card-subtitle>
            Edit Module
          </v-card-subtitle>
          <v-window class="ma-2">
            <v-text-field hide-details label="Title" class="pr-6" v-model="selectedPreset.title"></v-text-field>
            <v-checkbox 
              hide-details 
              label="General" 
              v-model="selectedPreset.general">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Coordinates" 
              v-model="selectedPreset.coordinates">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Visibility" 
              v-model="selectedPreset.visibility">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="Dating" 
              v-model="selectedPreset.dating">
            </v-checkbox>

            <!-- PLACE SPECIFIC -->
            <v-checkbox 
              hide-details 
              label="Plane" 
              v-if="objectTypeProp == 'places'" 
              v-model="selectedPreset.plane">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="FindTypes" 
              v-if="objectTypeProp == 'places'" 
              v-model="selectedPreset.findTypes">
            </v-checkbox>
            <v-checkbox 
              hide-details 
              label="PositionsList" 
              v-if="objectTypeProp == 'places'" 
              v-model="selectedPreset.positionslist">
            </v-checkbox>

            <!-- POSITION SPECIFIC -->
            <v-checkbox 
              hide-details 
              label="Object Describers" 
              v-if="objectTypeProp == 'positions'" 
              v-model="selectedPreset.objectDescribers">
            </v-checkbox>
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
      <v-row no-gutter class="align-center text-center">
        <v-col cols="6">
          <v-btn color="primary" v-show="!editPresetForm" v-on:click="saveNewPreset">SAVE Preset</v-btn>
          <v-btn color="primary" v-show="editPresetForm" v-on:click="saveEditedPreset">SAVE edited Preset</v-btn>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card-subtitle class="pt-2">
            Selected Preset
          </v-card-subtitle>
          <v-card-title class="pa-0">
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
      title: '',

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
    selectedPreset: {
      title: '',
    },
    modulePresets: [],
    hoveredRow: -1,
    editPresetForm: false,
  }),

  async updated() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateModulePresets();
  },

  methods: {
    /**
     * Get all module presets from IndexedDB
     */
    async updateModulePresets() {
      this.modulePresets = await fromOfflineDB.getAllObjects('ModulePresets', this.objectTypeProp);
    },

    /**
     * Saves a new preset to IndexedDB
     * (if no other similar preset exists)
     */
    async saveNewPreset() {
      var rawPreset = toRaw(this.curPreset);

      //only save the preset if it doesn't already exist
      var presetExists = await this.presetAlreadyExists(rawPreset);

      if (!presetExists) {
        rawPreset.id = String(Date.now());
        
        await fromOfflineDB.addObject(rawPreset, 'ModulePresets', this.objectTypeProp);
        await this.updateModulePresets();
        this.$root.vtoast.show({ message: 'Successfully added the preset'})
        this.$emit('updateModulePresets');
        this.clearPresetInputs();
      } else {
        this.$root.vtoast.show({ message: 'A preset with the same modules already exists', color: 'error' })
      }
    },

    /**
     * Saves an edited preset to IndexedDB
     * (if no other similar preset exists)
     */
    async saveEditedPreset() {
      var rawPreset = toRaw(this.selectedPreset);

      //only save the preset if it doesn't already exist
      var presetExists = await this.presetAlreadyExists(rawPreset);

      if (!presetExists) {
        await fromOfflineDB.updateObject(rawPreset, 'ModulePresets', this.objectTypeProp);
        await this.updateModulePresets();
        this.$root.vtoast.show({ message: 'Successfully saved the preset'})
        this.$emit('updateModulePresets');
      } else {
        this.$root.vtoast.show({ message: 'A preset with the same modules already exists' })
      }
    },

    /**
     * Checks if a preset already exists before saving it
     * @return {Boolean} returns `true` or `false`
     */
    async presetAlreadyExists(newPreset) {
      const excludedFields = ['id', 'title'];
      var allPresets = await fromOfflineDB.getAllObjects('ModulePresets', this.objectTypeProp);

      // exclude certain keys from the checks
      const keys1 = Object.keys(newPreset).filter(key => !excludedFields.includes(key));
      var alreadyExists = false;

      // go through all existing presets
      for (const existingPreset of allPresets) {
        alreadyExists = true;
        // check if an exiting preset is the same as the newPreset
        for (const key of  keys1) {
          if (newPreset[key] !== existingPreset[key]) {
            alreadyExists = false;
            break;
          }
        }
        if (alreadyExists) {
          break;
        }
      }

      return alreadyExists;
    },

    /**
     * Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    setModulePreset(item) {
      let rawPreset = toRaw(item);
      this.selectedPreset = rawPreset;
      if (this.objectTypeProp == 'places') {
        VueCookies.set('placeModulesPreset', rawPreset.id);
      } else if (this.objectTypeProp == 'positions') {
        VueCookies.set('positionModulesPreset', rawPreset.id);
      }
      this.$emit('updateModulePresets');
    },

    /**
     * Opens the preset editing input fields
     */
    editPreset(object) {
      this.editPresetForm = true;
      this.selectedPreset = toRaw(object);
    }, 

    /**
     * Clears the input fields for new presets
     */
    clearPresetInputs() {
      for (let prop in this.curPreset) {
        if (prop == 'title') {
          this.curPreset[prop] = '';
        } else {
          this.curPreset[prop] = false;
        }
      }
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
