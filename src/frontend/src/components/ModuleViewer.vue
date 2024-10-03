<!--
 * Created Date: 06.09.2023 17:19:12
 * Author: Julian Hardtung
 * 
 * Last Modified: 30.09.2024 18:57:54
 * Modified By: Julian Hardtung
 * 
 * Description: input module viewer that shows all modules that are 
 *              in the currently active module preset
 -->

 <template>
  <v-container fluid class="pa-0 ma-0"> 
    <div v-if="pathObject == 'places' && this.object.placeNumber == 1">
      <ModuleTechnical v-if='this.object.placeNumber == 1'
      :objectProp="object"
      @dataToModuleViewer="sendData($event)"/>
    </div>
      
    <v-row no-gutters v-else >

      <ModuleGeneral
        :objectProp="object"
        :titleItemsSecondProp="titleItemsFirstProp"
        :editorItemsSecondProp="editorItemsFirstProp"
        @dataToModuleViewer="sendData($event)"/>

      <v-col cols="6">
        <ModuleCoordinates
        :objectProp="object"
        @dataToModuleViewer="sendData($event)"/>

      <ModuleVisibility
        v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
        :visibilityProp="object.visibility"
        :showModuleProp="object.modulePreset.visibility"
        @dataToModuleViewer="sendData($event)"/>

      <ModulePlane
        v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
        :planeProp="object.plane"
        :showModuleProp="object.modulePreset.plane"
        @dataToModuleViewer="sendData($event)"/>

      <ModuleObjectDescribers
        v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'positions'"
        :objectProp="object"
        :materialItemsSecondProp="materialItemsFirstProp"
        @dataToModuleViewer="sendData($event)"/>

      </v-col>

      <v-col cols="6">
        <ModuleDating
        :datingProp="object.dating"
        :showModuleProp="object.modulePreset.dating"
        :datingItemsSecondProp="datingItemsFirstProp"
        @dataToModuleViewer="sendData($event)"/>
        
        <ModuleFindTypes
        v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
        :objectProp="object"
        @dataToModuleViewer="sendData($event)"/>

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
import ModuleObjectDescribers from '../components/modules/ModuleObjectDescribers.vue';
import ModuleTechnical from './modules/ModuleTechnical.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB';
import { useWindowSize } from 'vue-window-size';
import { toRaw } from 'vue'
import { useRoute } from 'vue-router';

export default {

  components: {
    ModuleGeneral,
    ModuleCoordinates,
    ModuleVisibility,
    ModuleFindTypes,
    ModulePlane,
    ModuleDating,
    ModuleObjectDescribers,
    ModuleTechnical,
},

  emits: ['dataToPlaceForm'],

  props: {
    objectProp: Object,
    datingItemsFirstProp: Array,
    editorItemsFirstProp: Array,
    materialItemsFirstProp: Array,
    titleItemsFirstProp: Array,
  },
  
  setup(props) {
    const { width, height } = useWindowSize();

    
    var propRaw = toRaw(props);

    var route = useRoute()
    
    var objectPropRaw = propRaw.objectProp;
    const object = route.path.split("/", 2).pop();
    
    return {
      pathObject: object,
      object: objectPropRaw,
      windowWidth: width,
      windowHeight: height,
    };
  },
  
  data() {
    return {
      pathNames: null,
      _id: null,
    }
  },

  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    const path = this.$route.path;
    this.getPathNamesAndID(path);
  },
  
  methods: {

    async updateObject() {
      
      this.object = await fromOfflineDB
        .getObject(this._id, this.pathNames.db, this.pathNames.os)
        .catch(err => console.error(err));
    },

    getPathNamesAndID(path) {
      this._id = path.split("/", 3)[2]
      const lowerName = path.substring(
        path.indexOf("/") + 1, 
        path.lastIndexOf("/"),
      );
      const upperName = lowerName.charAt(0).toUpperCase() + lowerName.slice(1);
      this.pathNames = { db: upperName, os: lowerName };
    },

    sendData(data) {
      /* Send data back to PlaceForm.vue */
      this.$emit("dataToPlaceForm", data);
    },
  }
};

</script>
  
<style scoped></style> 