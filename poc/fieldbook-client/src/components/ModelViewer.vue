<template>
  <v-container fluid> 
    <v-row>
      <v-col>
 <!-- 
        <ModuleGeneral
          @dataToModelViewer="sendData($event)"/>

        <ModuleCoordinates
          @dataToModelViewer="sendData($event)"/>
        
        <ModuleVisibility
          @dataToModelViewer="sendData($event)"/>
        
        <ModuleFindTypes
          @dataToModelViewer="sendData($event)"/>
        
        <ModulePlane
          @dataToModelViewer="sendData($event)"/>

        <ModulePositionsList
          @dataToModelViewer="sendData($event)"/>
        
        <ModuleDating
          :dating="object.dating"
          @dataToModelViewer="sendData($event)"/>
-->

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
      },
      pathNames: null,
      id: null,
    }
  },

  async created() {
    await fromOfflineDB.syncLocalDBs();
    const path = this.$route.path
    this.getPathAndID(path)
    this.object = await fromOfflineDB.getObject(this.id, this.pathNames.db, this.pathNames.os);
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
      this.$emit("dataToPlaceForm", data)
    }
  }
};

</script>
  
<style scoped></style> 