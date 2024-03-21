<!--
 * Created Date: 12.08.2023 11:57:15
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 13:27:42
 * Modified By: Julian Hardtung
 * 
 * Description: component to create, edit, set input module presets 
 *              for places/positions
 -->

<template>
  <v-dialog style="z-index: 2;" max-width="1000px">
    <ConfirmDialog ref="confirm" />
    <v-card class="pa-4">
      
      <v-card-title>{{ $t('moduleManagement') }} - {{ objectTypeProp.toUpperCase() }}</v-card-title>
      <v-row no-gutters>

        <!-- NEW PRESET -->
        <v-col cols="6" v-show="!editPresetForm">
          <v-card-subtitle>
            {{ $t('addNewPreset') }}
          </v-card-subtitle>
          <v-window class="ma-2">
            <v-text-field 
              hide-details 
              color="primary"
              label="Title" 
              class="pr-6"
              clearable
              v-model="newPreset.title"></v-text-field>

            <v-checkbox 
              hide-details 
              :label="$t('technical')" 
              v-if="objectTypeProp == 'places'"
              v-model="newPreset.technical"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('generalInformation')"
              v-model="newPreset.general"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('coordinates')"
              v-model="newPreset.coordinates"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('dating')"
              v-model="newPreset.dating"
              color="secondary">
            </v-checkbox>

            <!-- PLACE SPECIFIC -->
            <v-checkbox 
              hide-details 
              :label="$t('plane')" 
              v-if="objectTypeProp == 'places'" 
              v-model="newPreset.plane"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('findType')"
              v-if="objectTypeProp == 'places'" 
              v-model="newPreset.findTypes"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('visibility')"
              v-if="objectTypeProp == 'places'"
              v-model="newPreset.visibility"
              color="secondary">
            </v-checkbox>

            <!-- POSITION SPECIFIC -->
            <v-checkbox 
              hide-details 
              :label="$t('objectDescribers')" 
              v-if="objectTypeProp == 'positions'" 
              v-model="newPreset.objectDescribers"
              color="secondary">
            </v-checkbox>
          </v-window>
        </v-col>


        <!-- EDIT PRESET -->
        <v-col cols="6" v-show="editPresetForm">
          <v-card-subtitle>
            {{ $t('editModule') }}
          </v-card-subtitle>
          <v-window class="ma-2">
            <v-text-field 
              hide-details 
              label="Title"
              color="primary" 
              append-inner-icon="mdi-close-circle"
              @click:append-inner="editPresetForm = false"
              class="pr-6" 
              v-model="selectedPreset.title"></v-text-field>
            
            <v-checkbox 
              hide-details 
              :label="$t('technical')"
              :disabled="!selectedPreset.canEdit"
              v-if="objectTypeProp == 'places'"
              v-model="selectedPreset.technical"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('generalInformation')"
              :disabled="!selectedPreset.canEdit"
              v-model="selectedPreset.general"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('coordinates')"
              :disabled="!selectedPreset.canEdit"
              v-model="selectedPreset.coordinates"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('dating')" 
              :disabled="!selectedPreset.canEdit"
              v-model="selectedPreset.dating"
              color="secondary">
            </v-checkbox>

            <!-- PLACE SPECIFIC -->
            <v-checkbox 
              hide-details 
              :label="$t('plane')" 
              :disabled="!selectedPreset.canEdit"
              v-if="objectTypeProp == 'places'" 
              v-model="selectedPreset.plane"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('findType')" 
              :disabled="!selectedPreset.canEdit"
              v-if="objectTypeProp == 'places'" 
              v-model="selectedPreset.findTypes"
              color="secondary">
            </v-checkbox>

            <v-checkbox 
              hide-details 
              :label="$t('visibility')"
              :disabled="!selectedPreset.canEdit"
              v-if="objectTypeProp == 'places'"
              v-model="selectedPreset.visibility"
              color="secondary">
            </v-checkbox>

            <!-- POSITION SPECIFIC -->
            <v-checkbox 
              hide-details 
              :label="$t('objectDescribers')" 
              :disabled="!selectedPreset.canEdit"
              v-if="objectTypeProp == 'positions'" 
              v-model="selectedPreset.objectDescribers"
              color="secondary">
            </v-checkbox>
          </v-window>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="6">
          <v-card-subtitle>
            {{ $t('existingPresets') }}
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
                      <v-btn 
                        v-if="item.raw.canEdit"
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
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutter class="align-center text-center">
        <v-col cols="6">
          <v-btn 
            color="primary" 
            v-show="!editPresetForm" 
            v-on:click="saveNewPreset">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
          <v-btn 
            color="primary" 
            v-show="editPresetForm" 
            v-on:click="saveEditedPreset">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="6">
          <v-card-subtitle class="pt-2">
            {{ $t('selectedPreset') }}
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
    newPreset: {
      title: '',

      technical: false,

      general: false,
      coordinates: false,
      dating: false,

      //place specific
      plane: false,
      findTypes: false,
      visibility: false,

      //position specific
      objectDescribers: false,

      //can be edited?
      canEdit: true
    },
    selectedPreset: {
      title: '',
    },
    modulePresets: [],
    hoveredRow: -1,
    editPresetForm: false,
  }),

  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updateModulePresets()
      .catch(err => console.error(err));

    var curPresetID = null;
    if (this.objectTypeProp == 'places') {
      curPresetID = this.$generalStore.getModulesPreset('place');
    } else if (this.objectTypeProp == 'positions') {
      curPresetID = this.$generalStore.getModulesPreset('position');
    }

    if (curPresetID != null) {

      var curPreset = await fromOfflineDB
        .getObject(curPresetID, 'ModulePresets', this.objectTypeProp)
        .catch(err => console.error(err));
      this.selectedPreset = curPreset;
      this.editPresetForm = true;
    }
  },

  methods: {
    /**
     * Get all module presets from IndexedDB
     */
    async updateModulePresets() {
      this.modulePresets = await fromOfflineDB
        .getAllObjects('ModulePresets', this.objectTypeProp)
        .catch(err => console.error(err));
    },

    /**
     * Saves a new preset to IndexedDB
     * (if no other similar preset exists)
     */
    async saveNewPreset() {
      var rawPreset = toRaw(this.newPreset);

      //only save the preset if it doesn't already exist
      var presetExists = await this.presetAlreadyExists(rawPreset)
        .catch(err => console.error(err));

      if (!presetExists) {
        rawPreset._id = String(Date.now());
        
        await fromOfflineDB
          .addObject(rawPreset, 'ModulePresets', this.objectTypeProp)
          .catch(err => console.error(err));
        await this.updateModulePresets()
          .catch(err => console.error(err));
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
      var presetExists = await this.presetAlreadyExists(rawPreset)
        .catch(err => console.error(err));

      if (!presetExists) {
        await fromOfflineDB
          .updateObject(rawPreset, 'ModulePresets', this.objectTypeProp)
          .catch(err => console.error(err));
        await this.updateModulePresets()
          .catch(err => console.error(err));
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
      const excludedFields = ['id', 'title','canEdit'];
      var allPresets = await fromOfflineDB
        .getAllObjects('ModulePresets', this.objectTypeProp)
        .catch(err => console.error(err));

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
        this.$generalStore.setModulesPreset(rawPreset._id, 'place');
      } else if (this.objectTypeProp == 'positions') {
        this.$generalStore.setModulesPreset(rawPreset._id, 'position');
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
      for (let prop in this.newPreset) {
        if (prop == 'title') {
          this.newPreset[prop] = '';
        } else if (prop == 'canEdit') {
          this.newPreset[prop] = true;
        } else {
          this.newPreset[prop] = false;
        }
      }
    },

    /**
     * Deletes a selected ModulePreset from IndexedDB
     * @param {Object} object 
     */
    async deletePreset(object) {
      let rawObject = toRaw(object);

      if (rawObject._id == this.$generalStore.getModulesPreset('place')) {
        var placeDefaultPreset = await fromOfflineDB
          .getObjectByIndex(1, 'ModulePresets', this.objectTypeProp)
          .catch(err => console.error(err));
        this.selectedPreset = placeDefaultPreset;
        this.$generalStore.setModulesPreset(placeDefaultPreset._id, 'place');

      } else if (rawObject._id == this.$generalStore.getModulesPreset('position')) {
        var posDefaultPreset = await fromOfflineDB
          .getObjectByIndex(0, 'ModulePresets', this.objectTypeProp)
          .catch(err => console.error(err));
        this.selectedPreset = posDefaultPreset;
        this.$generalStore.setModulesPreset(posDefaultPreset._id, 'position');
      }

      await fromOfflineDB
        .deleteObject(rawObject, 'ModulePresets', this.objectTypeProp)
        .catch(err => console.error(err));
      await this.updateModulePresets()
        .catch(err => console.error(err));
      this.$emit('updateModulePresets');
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
        ).catch(err => console.error(err))
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
