<template>
  <v-container fluid> 
    <v-row>
      <v-col>

        <v-window-item v-if="object.modules.general">
          <ModuleGeneral/>
        </v-window-item>

        <v-window-item v-if="object.modules.coordinates">
          <ModuleCoordinates/>
        </v-window-item>
        
        <v-window-item v-if="object.modules.visibility">
          <ModuleVisibility/>
        </v-window-item>
        
        <v-window-item v-if="object.modules.findTypes">
          <ModuleFindTypes/>
        </v-window-item>
        
        <v-window-item v-if="object.modules.plane">
          <ModulePlane/>
        </v-window-item>
        
        <v-window-item v-if="object.modules.dating">
          <ModuleDating/>
        </v-window-item>
        
        <v-window-item v-if="object.modules.positionList">
          <ModulePositionsList/>
        </v-window-item>

      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
/**
 * Methods overview:
 */
import ModuleGeneral from '../components/ModuleGeneral.vue';
import ModuleCoordinates from '../components/ModuleCoordinates.vue';
import ModuleVisibility from '../components/ModuleVisibility.vue';
import ModuleFindTypes from '../components/ModuleFindTypes.vue';
import ModulePlane from '../components/ModulePlane.vue';
import ModuleDating from '../components/ModuleDating.vue';
import ModulePositionsList from '../components/ModulePositionsList.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'PlaceCreation',
  components: {
    ModuleGeneral,
    ModuleCoordinates,
    ModuleVisibility,
    ModuleFindTypes,
    ModulePlane,
    ModuleDating,
    ModulePositionsList,
    
    props: {
      object_id: String,
      object_type: String,
    },
  },

  emits: ['view'],
  
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  
  /**
   * Reactive Vue.js data
   */
  data() {
    return {
      object: null,
    }
  },

  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateObject();
  },
  
  methods: {
    async updateObject() {
      this.object = await fromOfflineDB.getObject(this.object_id,
                        this.object_type, this.object_type.toLowerCase());
    }
  }
};

</script>
  
<style scoped></style> 