<template>
  <v-dialog>
    <v-card>
      MODULE CREATION
      <v-row no-gutters>
        <v-col cols="5">
          <v-card-title>
            Single Modules
          </v-card-title>
          <v-card outline>
            <v-row no-gutters>
              <v-col>
                <v-text-field label="Title" v-model="cur_preset.title"></v-text-field>
                <v-checkbox hide-details label="General" v-model="cur_preset.general"></v-checkbox>
                <v-checkbox hide-details label="PositionsList" v-model="cur_preset.positionslist"></v-checkbox>
                <v-checkbox hide-details label="Coordinates" v-model="cur_preset.coordinates"></v-checkbox>
                <v-checkbox hide-details label="Visibility" v-model="cur_preset.visibility"></v-checkbox>
                <v-checkbox hide-details label="FindTypes" v-model="cur_preset.findTypes"></v-checkbox>
                <v-checkbox hide-details label="Plane" v-model="cur_preset.plane"></v-checkbox>
                <v-checkbox hide-details label="Dating" v-model="cur_preset.dating"></v-checkbox>
              </v-col>
            </v-row>
            <v-btn color="primary" v-on:click="saveModulePreset">SAVE Preset</v-btn>
          </v-card>
        </v-col>

        <v-divider vertical></v-divider>

        <v-col cols="5">

          <v-card outlined>
            <v-list>
              <v-list-title v-if="modulePresets.length == 0">
                No presets exist.
              </v-list-title>
              
              <v-list-item
                v-for="item in modulePresets"
                :key="item.title"
                :title="item.title">

              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>

import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';

export default {

  emits: ['updateModulePresets'],

  data: () => ({
    dialog: false,
    cur_preset: {
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
    modulePresets: [],
  }),

  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateModulePresets();
  },

  methods: {
    async updateModulePresets() {
      this.modulePresets = await fromOfflineDB.getAllObjects('ModulePresets', 'modulePresets');
    },

    async saveModulePreset(){
      
      //only save the preset if it doesn't already exist
      if (!this.presetAlreadyExists(false)) {
        var rawPreset = toRaw(this.cur_preset);

        rawPreset.id = String(Date.now());
        
        await fromOfflineDB.addObject(rawPreset, 'ModulePresets', 'modulePresets');
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
  },
};
</script>
