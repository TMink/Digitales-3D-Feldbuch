<template>
  <v-container fluid> 
    <v-row>
      <v-col>
        
        <!--
        <v-card>
          <ModuleGeneral/>
        </v-card>
      
        
        <v-card>
          <ModuleCoordinates/>
        </v-card>
        
        
        <v-card>
          <ModuleVisibility/>
        </v-card>
        
        <v-card>
          <ModuleFindTypes/>
        </v-card>

        <v-card>
          <ModulePlane/>
        </v-card>
        -->

        <v-card>
          <ModuleDating/>
        </v-card>

        <!--

        <v-card>
          <ModulePositionsList/>
        </v-card>
        -->

      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
/**
 * Methods overview:
 */
 import VueCookies from 'vue-cookies';
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
  
  setup() {
    const { width, height } = useWindowSize();
    return {
      windowWidth: width,
      windowHeight: height,
    };
  },
  
  data() {
    return {
      object: null,
      pathNames: null,
      id: null,
    }
  },

  async created() {
  },
  
  async mounted() {
    await fromOfflineDB.syncLocalDBs();
    this.getPathAndID(this.$route.path);
    await this.updateObject();
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
    }
  }
};

</script>
  
<style scoped></style> 