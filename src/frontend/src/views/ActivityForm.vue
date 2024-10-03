<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 02.10.2024 16:01:59
 * Modified By: Julian Hardtung
 * 
 * Description: input page for activity data 
 *              (shows input modules according to module preset)
 -->

<template>
  <Navigation ref="navigationRef" active_tab_prop="0"/>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="2">
        <v-card style="position:fixed; width:15%;">
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-btn rounded="0" v-on:click="saveActivity()" color="success">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" v-on:click="cancelActivity" color="primary">
              {{ $t('cancel') }}
            </v-btn>
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion(place)">
              {{ $t('delete') }}
            </v-btn>

            <ConfirmDialog ref="confirm" />

          </v-tabs>
        </v-card>
      </v-col>

      <v-col cols="10">
        <v-window v-model="tab">
          <!-- Tab item 'GENERAL' -->
          <v-window-item value="one">
            <v-card class="pa-4 mb-2">
              <h2 class="text-h6 font-weight-medium pb-1">
                {{  $t('generalInformation') }}
              </h2>
              <v-divider/>

              <v-row class="align-center pt-4">
                <!-- ACT_NUMBER + ARCHIVE_NUMBER + SHORT TITLE -->
                <v-col cols="4">
                  <!-- <v-text-field
                      class="py-2"
                      color="primary"
                      :label="$tc('actNumber', 2)"
                      v-model="activity.activityNumber">
                    </v-text-field> -->
                  <v-row no-gutters>
                    <v-text-field
                      class="pr-1"
                      color="primary"
                      :label="$t('branchOffice')"
                      v-model="activity.branchOffice">
                    </v-text-field>
                    <v-text-field
                      class="px-1"
                      color="primary"
                      :label="$t('year')"
                      v-model="activity.year">
                    </v-text-field>
                    <v-text-field
                      class="pl-1"
                      color="primary"
                      :label="$t('number')"
                      v-model="activity.number">
                    </v-text-field>
                  </v-row>
                  <v-text-field
                    color="primary"
                    :label="$tc('archiveNumber', 2)"
                    disabled
                    persistent-hint
                    :hint="$t('filledByLVR')">
                  </v-text-field>
                  <v-textarea
                    class="py-2"
                    color="primary"
                    hide-details
                    :label="$tc('title', 3)"
                    v-model="activity.shortTitle">
                  </v-textarea>
                </v-col>

                <v-spacer></v-spacer>

                <!-- LOCATION DESCRIPTION-->
                <v-col class="justify-end" cols="6">
                  <v-card variant="outlined">
                    <v-row no-gutters class="align-center">
                      <v-col cols="2">
                        <v-card-text>
                          {{ $t('right') }}
                        </v-card-text>
                      </v-col>
                      <v-text-field
                        class="pa-2"
                        color="primary"
                        hide-details
                        :label="$t('from')"
                        v-model="activity.right">
                      </v-text-field>
                      - 
                      <v-text-field
                        class="pa-2"
                        color="primary"
                        hide-details
                        :label="$t('to')"
                        v-model="activity.rightTo">
                      </v-text-field>
                    </v-row>

                    <v-row no-gutters class="align-center">
                      <v-col cols="2">
                        <v-card-text>
                          {{ $t('up') }}
                        </v-card-text>
                      </v-col>
                      <v-text-field
                        class="pa-2"
                        color="primary"
                        hide-details
                        :label="$t('from')"
                        v-model="activity.up">
                      </v-text-field>
                      -
                      <v-text-field
                        class="px-2"
                        color="primary"
                        hide-details
                        :label="$t('to')"
                        v-model="activity.upTo">
                      </v-text-field>
                    </v-row>

                    <v-textarea
                      class="pa-2"
                      color="primary"
                      hide-details
                      :label="$t('areaDescr')"
                      v-model="activity.areaDescr">
                    </v-textarea>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>

            <v-row no-gutters class="align-center">
              <!-- DATES + DIRECTOR -->
              <v-col cols="6">
                <v-card class="mb-2 mr-1">
                  <v-row no-gutters class="align-center">
                    <v-card-text>
                      {{ $t('activityDuration') }}
                    </v-card-text>
                    <v-text-field
                      class="pa-2"
                      hide-details
                      color="primary"
                      :label="$t('from')"
                      v-model="activity.dateFrom">
                    </v-text-field>
                    -
                    <v-text-field
                      class="pa-2"
                      hide-details
                      color="primary"
                      :label="$t('to')"
                      v-model="activity.dateTo">
                    </v-text-field>
                  </v-row>

                  <v-row no-gutters class="align-center">
                    <v-col cols="3">
                      <v-card-text>
                        {{ $t('siteDirector') }}
                      </v-card-text>
                    </v-col>
                    <v-text-field
                      class="px-2"
                      hide-details
                      color="primary"
                      v-model="activity.siteDirector">
                    </v-text-field>
                  </v-row>

                  <v-row no-gutters class="align-center">
                    <v-col cols="3">
                      <v-card-text>
                        {{ $t('excavationFirm') }}
                      </v-card-text>
                    </v-col>
                    
                    <v-text-field
                      class="pa-2"
                      hide-details
                      color="primary"
                      v-model="activity.excavationFirm">
                    </v-text-field>
                  </v-row>
                </v-card>
              </v-col>
              
              <!-- DONE MEASURES -->
              <v-col cols="6">
                <v-card height="200px" class="mb-2 ml-1 pa-2">
                  <v-card-title>
                    {{  $t('doneAction') }}
                  </v-card-title>
                  <v-divider class="py-1"/>
                  <v-combobox
                    :label="$t('doneAction')"
                    :items="doneThings"
                    hide-details
                    v-model="doneThingModel">
                  </v-combobox>
                  <v-card-subtitle v-if="doneThingModel != undefined" class="text-wrap pa-2">
                    {{ doneThingModel.descr }}
                  </v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>

            <!-- LAND USAGE -->
            <v-card class="pa-2 mb-2">
              <v-card-title>
                {{ $t('landUsage') }}
              </v-card-title>
              <v-divider/>

              <!-- HISTORICAL -->
              <v-row no-gutters class="py-2">
                <v-col cols="6" class="pa-2">
                  <v-row no-gutters>
                    <v-col cols="9">
                      <v-combobox
                        :label="$t('historical')"
                        :items="landUsage"
                        hide-details
                        class="pr-2"
                        v-model="landUsageHistModel">
                    </v-combobox>
                  </v-col>
                  <v-col cols="3">
                    <v-number-input
                      color="primary" 
                      hide-details
                      :max="curYear"
                      controlVariant="stacked"
                      :label="$t('year')"  
                      v-model="activity.histLandUsageYear">
                  </v-number-input>
                </v-col>
              </v-row>
                <v-card-subtitle v-if="landUsageHistModel != undefined" class="text-wrap">
                  {{ landUsageHistModel.descr }}
                </v-card-subtitle>
                </v-col>
                <v-divider vertical/>

                <!-- CURRENT -->
                <v-col cols="6" class="pa-2">
                  <v-combobox
                    :label="$t('current')"
                    :items="landUsage"
                    hide-details
                    v-model="landUsageCurModel">
                  </v-combobox>
                  <v-card-subtitle v-if="landUsageCurModel != undefined" class="text-wrap">
                    {{ landUsageCurModel.descr }}
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>

            <v-row no-gutters>

              <!-- CONDITIONS -->
              <v-col cols="6">
                <v-card class="mb-2 mr-1">
                  <v-row no-gutters class="align-center pa-2 pb-0">
                    <v-col cols="3">                      
                      <v-card-text>
                        {{ $t('conditionsProspection') }}
                      </v-card-text>
                    </v-col>
                    
                    <v-slider 
                      :max="2" 
                      step="1"
                      tick-size="3" 
                      :ticks="tickLabels" 
                      show-ticks="always" 
                      class="px-2"
                      style="padding-top:31px; padding-bottom:12px"
                      track-color="primary"
                      thumb-color="secondary" 
                      v-model="activity.conditions" 
                      color="warning">
                    </v-slider>
                  </v-row>

                  <!-- GROUND TYPE -->
                  <v-row no-gutters class="pa-2">
                    <v-col cols="3">
                      <v-card-text>
                        {{ $t('groundType') }}
                      </v-card-text>
                    </v-col>
                    <v-col cols="9">
                      <v-combobox
                        multiple
                        chips
                        persistent-hint
                        :items="groundTypes"
                        :hint="$t('chooseMax', {number: '3'})"
                        v-model="activity.groundType"
                        density="compact"
                        :model-value="activity.groundType" 
                        @update:modelValue="(e) => { (e.length > 3) && e.shift(); activity.groundType = e }">
                      </v-combobox>
                    </v-col>
                  </v-row>

                  <!-- TOPOGRAPHY -->
                  <v-row no-gutters class="pa-2">
                    <v-col cols="3">
                      <v-card-text>
                        {{ $t('topography') }}
                      </v-card-text>
                    </v-col>
                    <v-col cols="9">
                      <v-combobox
                        :items="topography"
                        :hint="$t('chooseMax', {number: '2'})"
                        multiple
                        chips
                        persistent-hint
                        density="compact"
                        v-model="activity.topography"
                        :model-value="activity.topography" 
                        @update:modelValue="(e) => { (e.length > 2) && e.shift(); activity.topography = e }">
                      </v-combobox>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <!-- ARCHIVE MATERIAL + MATERIAL + MISC -->
               <v-col cols="6">
                <v-card class="ml-1">
                  <v-row no-gutters>
                    <v-col cols="4" class="pa-2 pb-1">
                      <v-card-text>
                        {{ $t('archiveMaterial') }}
                      </v-card-text>

                      <v-checkbox
                        density="compact"
                        hide-details
                        v-model="activity.archiveMaterial.photos"
                        :label="$tc('photo', 1)">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        hide-details
                        v-model="activity.archiveMaterial.findDrawings"
                        :label="$t('findDrawing')">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        hide-details
                        v-model="activity.archiveMaterial.excavationDrawings"
                        :label="$t('excavationDrawing')">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        hide-details
                        v-model="activity.archiveMaterial.misc"
                        :label="$t('misc')">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        hide-details
                        v-model="activity.archiveMaterial.no"
                        :label="$tc('no', 2)">
                      </v-checkbox>
                    </v-col>
                    
                    <v-divider vertical/>

                    <v-col cols="3" class="pa-2">
                      <v-card-text>
                        {{ $t('material') }}
                      </v-card-text>

                      <v-checkbox
                        density="compact"
                        v-model="activity.material.find"
                        :label="$tc('find', 2)">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        v-model="activity.material.sample"
                        :label="$tc('sample', 2)">
                      </v-checkbox>
                      <v-checkbox
                        density="compact"
                        v-model="activity.material.no"
                        :label="$tc('no', 1)">
                      </v-checkbox>
                    </v-col>

                    <v-divider vertical/>

                    <v-col cols="4" class="pa-2">
                      <v-card-text>
                        {{ $t('misc') }}
                      </v-card-text>
                      <v-number-input
                        color="primary" 
                        controlVariant="stacked"
                        class="py-2 pl-1"
                        density="compact"
                        persistent-hint
                        :hint="$t('maxPlaceNumber')"
                        :label="$t('placeNumber')"  
                        v-model="activity.maxPlaceNumber">
                      </v-number-input>

                      <v-checkbox
                        density="compact"
                        v-model="activity.findsDocumented"
                        persistent-hint
                        :hint="$t('findsDocumented')"
                        :label="$tc('find', 3)">
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              </v-row>


              <!-- RESULT OF MEASURE DONE -->
              <v-card class="mb-2">
                <v-row class="text-center pa-2">
                  <v-col cols="6">
                    <v-card-text>
                      {{ $t('resultOfAction') }}
                    </v-card-text>
                    <v-combobox
                      :label="$t('title')"
                      :items="titlesList"
                      persistent-hint
                      :hint="getTitleHint()"
                      v-model="titleModel">
                    </v-combobox>
                  </v-col>
                  
                  <v-divider vertical />

                  <!-- DATING -->
                  <v-col>
                    <v-card-text>
                      {{ $t('dating') }}
                    </v-card-text>
                    <v-combobox
                      :label="$t('dating')"
                      :items="datingsList"
                      persistent-hint
                      :hint="getDatingHint()"
                      v-model="datingModel">
                    </v-combobox>
                  </v-col>
                </v-row>
              </v-card>
            
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/**
 * Methods overview:
 *  updatePlace     - Updates existing presentation of the place
 *  savePlace       - Saves the current processing status
 *  confirmDeletion - Opens the confirmation dialog
 *  deletePlace     - Deletes the currently selected place
 *  cancelPlace     - Cancels all not already saved actions
 */
import Navigation from '../components/Navigation.vue';
import ModuleViewer from '../components/ModuleViewer.vue';
import ModelForm from '../components/ModelForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';
import { useWindowSize } from 'vue-window-size';

export default {

  name: 'ActivityCreation',
  components: {
    Navigation,
    ConfirmDialog,
    ModuleViewer,
    ModelForm,
  },
  setup() {
    const { width, height } = useWindowSize();
    var year = new Date().getFullYear();
    return {
      windowWidth: width,
      windowHeight: height,
      curYear: year,
    };
  },

  mounted() {
    this.$refs.navigationRef.onViewChange(this.$tc('detailPage',2, { msg: this.$tc('activity', 1)}))
  },

  /**
   * Reactive Vue.js data
   */
  data() {

    return {
      tab: null,
      backgroundDialog: false,
      a: 0,
      b: 0,
      
      activity: {
        _id: '',
        activityNumber: '',
        branchOffice: '',
        year: '',
        number: '',
        lastChanged: '',
        lastSync: '',
        places: [],
        editor: [],
        camera: '',
        
        archiveNumber: '',
        shortTitle: '',
        title: '',
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        areaDescr: '',
        dateFrom: '',
        dateTo: '',
        siteDirector: '',
        excavationFirm: '',
        doneThing: '',
        landUsageHist: '',
        histLandUsageYear: 0,
        landUsageCur: '',
        conditions: '',
        groundType: [],
        topography: [],
        archiveMaterial: {
          photos: false,
          findDrawings: false,
          excavationDrawings: false,
          misc: false,
          no: false
        },
        material: {
          find: false,
          sample: false,
          no: false
        },
        maxPlaceNumber: 0,
        findsDocumented: '',
      },
    
      headers: [
        {
          title: this.$t('posNumber'),
          align: 'start',
          sortable: true,
          key: 'positionNumber',
        },
        {
          title: this.$t('subNumber'),
          align: 'start',
          sortable: true,
          key: 'subNumber',
        },
        { title: this.$tc('title', 2), align: 'start', key: 'title' },
        { title: this.$t('date'), align: 'start', key: 'date' },
      ],
      searchQuery: '',
      hoveredRow: -1,
      is_required: [v => !!v || 'Pflichtfeld'],
      hasUnsavedChanges: false,
      componentHasLoaded: false,

      datingsList: [],
      editorsList: [],
      titlesList: [],
      doneThings: [],
      landUsage: [],
      
      groundTypes: [],
      groundTypeModel: [],
      
      topography: [],
      topographyModel: [],

      doneThingModel: '',
      landUsageHistModel: '',
      landUsageCurModel: '',
      groundTypeModel: '',
      titleModel: '',
      datingModel: '',
      testMaterial: [],


      tickLabels: {
          2: this.$t('good'),
          1: this.$t('moderate'),
          0: this.$t('bad'),
        },
    }

  },
  /**
   * Check if there are unsaved changes to the activity 
   * before leaving the ActivityForm
   * @param {*} to 
   * @param {*} from 
   * @param {*} next 
   */
  async beforeRouteLeave(to, from, next) {
    var confirmation = false;
    if (this.hasUnsavedChanges) {
      confirmation = await this.confirmRouteChange()
        .catch(err => console.error(err));
      if (confirmation) {
        next();
      }
    } else {
      next();
    }
  },
  /**
   * Initialize data from localDB to the reactive Vue.js data
   */
  async created() {
    this.doneThings = JSON.parse(import.meta.env.VITE_DONE_THINGS);
    this.landUsage = JSON.parse(import.meta.env.VITE_LAND_USAGE);
    this.groundTypes = JSON.parse(import.meta.env.VITE_GROUND_TYPES_SIMPLE);
    this.topography = JSON.parse(import.meta.env.VITE_TOPOGRAPHY);
    this.datingsList = JSON.parse(import.meta.env.VITE_DATINGS_FULL);
    this.titlesList = JSON.parse(import.meta.env.VITE_TITLES_FULL);
    
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updateActivity()
      .catch(err => console.error(err));
  },

  watch: {
    'activity': {
      handler: 'handleActivityChange',
      deep: true,
    },
  },

  methods: {
    /**
     * Update reactive Vue.js activity data
     */
    async updateActivity() {
      const currentActivity = this.$generalStore.getCurrentObject('activity');
      const data = await fromOfflineDB
        .getObject(currentActivity, 'Activities', 'activities')
        .catch(err => console.error(err));
      this.activity = data;

      var foundDoneThings = this.doneThings.filter(function(item) {return item.title === data.doneThing});
      this.doneThingModel = foundDoneThings[0];

      var foundLandUsageHist = this.landUsage.filter(function(item) {return item.title === data.landUsageHist});
      this.landUsageHistModel = foundLandUsageHist[0];

      var foundLandUsageCur = this.landUsage.filter(function(item) {return item.title === data.landUsageCur});
      this.landUsageCurModel = foundLandUsageCur[0];

      var foundTitle = this.titlesList.filter(function(item) {return item.title === data.title});
      this.titleModel = foundTitle[0];

      var foundDating = this.datingsList.filter(function(item) {return item.title === data.dating});
      this.datingModel = foundDating[0];
    },

    /**
     * Save a place to local storage for the current activity
     */
    async saveActivity() {
      //convert from vue proxy to JSON object
      const inputActivity = toRaw(this.activity);
      //inputPlace.date = new Date().toLocaleDateString("de-DE");
      inputActivity.lastChanged = Date.now();

      if (this.doneThingModel != '' && this.doneThingModel != undefined){
        inputActivity.doneThing = this.doneThingModel.title;
      }
       if (this.landUsageHistModel != '' && this.landUsageHistModel != undefined){
        inputActivity.landUsageHist = this.landUsageHistModel.title;
      }
      if (this.landUsageCurModel != '' && this.landUsageCurModel != undefined){
        inputActivity.landUsageCur = this.landUsageCurModel.title;
      }
      if (this.titleModel != '' && this.titleModel != undefined){
        inputActivity.title = this.titleModel.title;
      }
      if (this.datingModel != '' && this.datingModel != undefined){
        inputActivity.dating = this.datingModel.title;
      }

      inputActivity.activityNumber = this.updateActivityNumber(inputActivity.branchOffice, inputActivity.year, inputActivity.number);

      await fromOfflineDB.updateObject(inputActivity, 'Activities', 'activities')
        .catch(err => console.error(err));
      this.hasUnsavedChanges = false;

      this.updateAutoFillList('editors', this.activity.editor, this.editorsList);
      this.updateAutoFillList('titles', this.activity.title, this.titlesList);

      this.$root.vtoast.show({ message: this.$t('saveSuccess') });
      this.$router.push({ name: "ActivitiesOverview" });
    },

        /**
     * Removes a place from the IndexedDB and the Cookies
     */
     async deleteActivity() {

      // Delete the activity and all data that is dependent on it
      await fromOfflineDB
        .deleteCascade(this.activity._id, 'activity', 'Activities', 'activities')
        .catch(err => console.error(err));
      
      this.$generalStore.removeCurrentObject('activity');
      this.$generalStore.removeCurrentObject('place');
      this.$generalStore.removeCurrentObject('position');

      this.hasUnsavedChanges = false;
      this.$router.push({ name: "ActivitiesOverview" });
    },

    /**
     * Cancels the PositionForm and returns to the PositionOverview
     */
     cancelActivity() {
      this.$router.push({ name: "ActivitiesOverview" });
    },

    async updateAutoFillList(storeName, item, itemList) {
      const newEditor = {};

      const editorsFromDB = await fromOfflineDB
        .getAllObjects('AutoFillLists', storeName)
        .catch(err => console.error(err));

      if (editorsFromDB.length > 0) {
        let hasItem = false;

        editorsFromDB.forEach(element => {
          if (element.item == item) {
            hasItem = true;
          }
        })
        if (!hasItem && item != '') {
          newEditor._id = String(Date.now())
          newEditor.item = toRaw(item)
        }
      } else if (item != '') {
        newEditor._id = String(Date.now())
        newEditor.item = toRaw(item)
      }
      if (Object.keys(newEditor).length) {
        await fromOfflineDB.addObject(newEditor, 'AutoFillLists', storeName)
          .catch(err => console.error(err));
      }

      if (itemList.length > 0) {
        let notKnown = true
        itemList.forEach(element => {
          if (element == item) {
            notKnown = false
          }
        })
        if (notKnown) {
          itemList.push(item)
        }
      } else {
        if (item != '') {
          itemList.push(item)
        }
      }
    },

    /**
     * Opens the confirmation dialog for deletion#
     * @param {Object} activity 
     */
    async confirmDeletion(activity) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          this.$t('confirm_del', {
            object: this.$tc('activity', 1),
            object_nr: activity.activityNumber
          })
        ).catch(err => console.error(err))
      ) {
        this.deleteActivity();
      }
    },

    /**
     * Opens the confirmation dialog for leaving the form
     */
    async confirmRouteChange() {
      if (await this.$refs.confirm.open(this.$t('confirm'),
        this.$t('wantToLeave'))) {
        return true;
      } else {
        return false;
      }
    },


    /**
     * Sets the AppBarTitle to the current ActivityNumber + PlaceNumber
     */
    async setAppBarTitle() {
      const acID = this.$generalStore.getCurrentObject('activity');
      var activity = await fromOfflineDB
        .getObject(acID, 'Activities', 'activities')
        .catch(err => console.error(err));

      const plID = this.$generalStore.getCurrentObject('place');
      var place = await fromOfflineDB
        .getObject(plID, 'Places', 'places')
        .catch(err => console.error(err));
    },

    getTitleHint() {
      if (this.titleModel != undefined) {
        return this.titleModel.descr;
      }

      return;
    },

    getDatingHint() {
      if (this.datingModel != undefined) {
        return this.$t('from') + ': ' + this.datingModel.start + ' ' + this.$t('to') + ': ' + this.datingModel.end;
      }

      return;
    },

    
    updateActivityNumber(branchOffice, year, number) {
      return branchOffice + " " + year + "/" + number;
    },

    /**
     * Gets called every time some info of the current position changes.
     * Once a change has happend, the flag `hasUnsavedChanges` gets set to `true`
     */
    handleActivityChange() {
      if (this.hasUnsavedChanges) {
        return;
      }

      if (this.componentHasLoaded) {
        this.hasUnsavedChanges = true;
      }
    },

    /**
     * Prevents the input of non numeric values 
     * (allows one single `,` or `.` for float values)
     * @param {*} evt 
     */
    filterNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[-+]?[0-9]*[,.]?[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },

    onSelect(newValue) {
      if (newValue.length <= 3) {
        this.groundTypeModel = newValue;
      } else {
        // If more than 3 items are selected, revert to the previous value
        this.groundTypeModel = newValue.slice(0, 3);
      }
    }

  }
};

</script>

<style scoped></style>