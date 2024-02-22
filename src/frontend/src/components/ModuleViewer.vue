<!--
 * Created Date: 06.09.2023 17:19:12
 * Author: Julian Hardtung
 * 
 * Last Modified: 22.02.2024 14:00:50
 * Modified By: Julian Hardtung
 * 
 * Description: input module viewer that shows all modules that are 
 *              in the currently active module preset
 -->

 <template>
  <v-container fluid class="pa-0 ma-0"> 
    <v-row>

        <ModuleGeneral v-if='object.modulePreset.general'
          :objectProp="object"
          :titleItemsSecondProp="titleItemsFirstProp"
          :editorItemsSecondProp="editorItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleCoordinates v-if='object.modulePreset.coordinates'
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>
                  
        <ModuleFindTypes v-if='object.modulePreset.findTypes'
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>
          
        <ModulePlane v-if='object.modulePreset.plane'
          :planeProp="object.plane"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleVisibility v-if='object.modulePreset.visibility'
          :visibilityProp="object.visibility"
          @dataToModuleViewer="sendData($event)"/>
          
        <ModuleDating v-if='object.modulePreset.dating'
          :datingProp="object.dating"
          :datingItemsSecondProp="datingItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>
        
        <ModuleObjectDescribers v-if='object.modulePreset.objectDescribers'
          :objectProp="object"
          :materialItemsSecondProp="materialItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>
        
        <ModuleTechnical v-if='object.modulePreset.technical'
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>

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
    datingItemsFirstProp: Array,
    editorItemsFirstProp: Array,
    materialItemsFirstProp: Array,
    titleItemsFirstProp: Array,
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
      object: {
        dating: '',
        technical: '',
        modulePreset: {
          coordinates: false,
          dating: false,
          findTypes: false,
          general: false,
          _id: false,
          objectDescribers: false,
          plane: false,
          title: false,
          visibility: false,
          technical: false,
        }
      },
      pathNames: null,
      _id: null,
    }
  },

  async beforeCreate() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    const path = this.$route.path;
    this.getPathNamesAndID(path);
    this.object = await fromOfflineDB
      .getObject(this._id, this.pathNames.db, this.pathNames.os)
      .catch(err => console.error(err));
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