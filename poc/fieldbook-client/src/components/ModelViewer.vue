<template>
  <v-container fluid> 
    <v-row>
      <v-col>

        <ModuleGeneral v-if='object.modulePreset.general'
          @dataToModelViewer="sendData($event)"/>

        <ModuleCoordinates v-if='object.modulePreset.coordinates'
          @dataToModelViewer="sendData($event)"/>
        
        <ModuleVisibility v-if='object.modulePreset.visibility'
          @dataToModelViewer="sendData($event)"/>
        
        <ModuleFindTypes v-if='object.modulePreset.findTypes'
          @dataToModelViewer="sendData($event)"/>
        
        <ModulePlane v-if='object.modulePreset.plane'
          @dataToModelViewer="sendData($event)"/>

        <ModulePositionsList v-if='object.modulePreset.positionslist'
          :placeProp="object"
          @dataToModelViewer="sendData($event)"/>
   
        <ModuleDating v-if='object.modulePreset.dating'
          :datingProp="object.dating"
          @dataToModelViewer="sendData($event)"/>
          
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

  components: {
    ModuleGeneral,
    ModuleCoordinates,
    ModuleVisibility,
    ModuleFindTypes,
    ModulePlane,
    ModuleDating,
    ModulePositionsList,
  },

  emits: ['dataToPlaceForm'],
  
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  
  data() {
    return {
      object: {
        dating: '',
        modulePreset: {
          coordinates: false,
          dating: false,
          findTypes: false,
          general: false,
          id: false,
          objectDescriber: false,
          plane: false,
          positionslist: false,
          title: false,
          visibility: false,
        }
      },
      pathNames: null,
      id: null,
    }
  },

  async beforeCreate() {
    await fromOfflineDB.syncLocalDBs();
    const path = this.$route.path
    this.getPathAndID(path)
    this.object = await fromOfflineDB.getObject(this.id, this.pathNames.db, this.pathNames.os);
    console.log(this.object.modulePreset)
  },

  async created() {
  },
  
  methods: {
    async updateObject() {
      this.object = await fromOfflineDB.getObject(this.id, this.pathNames.db, this.pathNames.os);
      console.log(this.object)
    },

    getPathAndID(path) {
      this.id = path.split("/", 3)[2]
      const lowerName = path.substring(
        path.indexOf("/") + 1, 
        path.lastIndexOf("/")
      );
      const upperName = lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
      this.pathNames = { db: upperName, os: lowerName }
    },

    sendData(data) {
      /* Send data back to PlaceForm.vue */
      this.$emit("dataToPlaceForm", data)
    }
  }
};

</script>
  
<style scoped></style> 