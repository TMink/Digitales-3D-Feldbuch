<!--
 * Created Date: 06.09.2023 17:19:12
 * Author: Julian Hardtung
 * 
 * Last Modified: 30.10.2024 16:25:05
 * Modified By: Julian Hardtung
 * 
 * Description: input module viewer that shows all modules that are 
 *              in the currently active module preset
 -->

 <template>
  <v-container fluid class="pa-0 ma-0"> 
    <v-form ref="form">
      <v-row v-if="object.posType == 'image' || object.posType == 'drawing'">
        <v-col>
          <ModuleImage
            :objectProp="object"
            :editorItemsSecondProp="editorItemsFirstProp"
            @dataToModuleViewer="sendData($event)"/>
        </v-col>  
      </v-row>

    <v-row no-gutters v-if="object.posType == 'position'">      
      <v-col cols="6">
        <ModuleGeneral
          :objectProp="object"
          :titleItemsSecondProp="titleItemsFirstProp"
          :editorItemsSecondProp="editorItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleDating
          :datingProp="object.dating"
          :showModuleProp="object.modulePreset.dating"
          :datingItemsSecondProp="datingItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleVisibility
          v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
          :visibilityProp="object.visibility"
          :showModuleProp="object.modulePreset.visibility"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleFindTypes
          v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>

      </v-col>

      <v-col cols="6">

        <ModuleCoordinates
          :objectProp="object"
          @dataToModuleViewer="sendData($event)"/>

        <ModulePlane
          v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
          :planeProp="object.plane"
          :showModuleProp="object.modulePreset.plane"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleProfile
          v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'places'"
          :profileProp="object.profile"
          :showModuleProp="object.modulePreset.profile"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleComment
          :commentProp="object.comment"
          :showModuleProp="object.modulePreset.comment"
          @dataToModuleViewer="sendData($event)"/>

        <ModuleObjectDescribers
          v-if="$route.path.substring($route.path.indexOf('/') + 1, $route.path.lastIndexOf('/')) == 'positions'"
          :objectProp="object"
          :materialItemsSecondProp="materialItemsFirstProp"
          @dataToModuleViewer="sendData($event)"/>

      </v-col>        
    </v-row>
    </v-form>
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
import ModuleComment from './modules/ModuleComment.vue';
import ModuleProfile from './modules/ModuleProfile.vue';
import ModuleImage from './modules/ModuleImage.vue';
import ModuleDrawing from './modules/ModuleDrawing.vue';
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
    ModuleProfile,
    ModuleComment,
    ModuleImage,
    ModuleDrawing
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

    this.validate()
  },
  
  methods: {

    async validate () {
      const { valid } = await this.$refs.form.validate()
    },

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