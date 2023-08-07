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
          <ModuleDating
            :dating="object.dating"
            @dating="object.dating"/>
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
import ModuleGeneral from '../components/modules/ModuleGeneral.vue';
import ModuleCoordinates from '../components/modules/ModuleCoordinates.vue';
import ModuleVisibility from '../components/modules/ModuleVisibility.vue';
import ModuleFindTypes from '../components/modules/ModuleFindTypes.vue';
import ModulePlane from '../components/modules/ModulePlane.vue';
import ModuleDating from '../components/modules/ModuleDating.vue';
import ModulePositionsList from '../components/modules/ModulePositionsList.vue';
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
  },

  watch: {
		'dating': {
			handler: function() { 
				this.$emit("dating");
			}
		}
	},
  
  props: {
    object_id: String,
    object_type: String,
  },
  
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

  watcher: {
    'dating': {
			handler: function() {
				this.$emit("dating");
			}
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