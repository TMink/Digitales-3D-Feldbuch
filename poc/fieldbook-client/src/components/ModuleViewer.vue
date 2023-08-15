 <template>
  <v-container fluid class="pa-0 ma-0"> 
    <v-row>

        <ModuleGeneral v-if='object.modulePreset.general'
          :objectProp="object"
          :titleItemsSecondProp="titleItemsFirstProp"
          :editorItemsSecondProp="editorItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>

        <ModulePositionsList v-if='object.modulePreset.positionslist'
            :placeProp="object"
            :updateListSecondProp="updateListFirstProp"
            @dataToModuleViewer="sendData($event)"/>

        <ModuleCoordinates v-if='object.modulePreset.coordinates'
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>
                  
        <ModuleFindTypes v-if='object.modulePreset.findTypes'
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>
          
        <ModulePlane v-if='object.modulePreset.plane'
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
import ModulePositionsList from '../components/modules/ModulePositionsList.vue';
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
    ModulePositionsList,
    ModuleObjectDescribers,
    ModuleTechnical,
},

  emits: ['dataToPlaceForm'],

  props: {
    updateListFirstProp: Boolean,
    datingItemsFirstProp: Array,
    editorItemsFirstProp: Array,
    materialItemsFirstProp: Array,
    titleItemsFirstProp: Array,
  },

  watch: {
    'updateListFirstProp': {
      handler: async function() {
        //this.updateListSecondProp = this.updateListFirstProp;
        //this.$emit( "dataToModuleViewer", [ 'resetBool', false ] );
      }
    },
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
          id: false,
          objectDescribers: false,
          plane: false,
          positionslist: false,
          title: false,
          visibility: false,
          technical: false,
        }
      },
      pathNames: null,
      id: null,
      updateListSecondProp: false,
    }
  },

  async beforeCreate() {
    await fromOfflineDB.syncLocalDBs();
    const path = this.$route.path;
    this.getPathNamesAndID(path);
    this.object = await fromOfflineDB.getObject(this.id, this.pathNames.db, this.pathNames.os);
  },
  
  methods: {
    async updateObject() {
      this.object = await fromOfflineDB.getObject(this.id, this.pathNames.db, this.pathNames.os);
    },

    getPathNamesAndID(path) {
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