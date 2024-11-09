<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.11.2024 17:49:19
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
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion(activity)">
              {{ $t('delete') }}
            </v-btn>

            <ConfirmDialog ref="confirm" />

          </v-tabs>
        </v-card>
      </v-col>

      <v-col cols="8">
          <!-- Tab item 'GENERAL' -->
        <v-card class="pa-4 mb-2">
          <h2 class="text-h6 font-weight-medium pb-1">
            {{  $t('formSheet1') }}
          </h2>
          <v-divider/>

          <v-row class="align-center pt-4">
            <v-col class="justify-end">
              <v-card-title>
                {{  $t('lvrAmt') }}
              </v-card-title>
            
              <!-- LOCATION DESCRIPTION-->
              <v-card variant="outlined" class="pa-1">
                <!--############## RIGHT & RIGHT TO ###############-->
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
                    density="compact"
                    :label="$t('from')"
                    v-model="activity.right">
                  </v-text-field>
                  - 
                  <v-text-field
                    class="pa-2"
                    color="primary"
                    hide-details
                    density="compact"
                    :label="$t('to')"
                    v-model="activity.rightTo">
                  </v-text-field>
                </v-row>

                <!--############## UP & UP TO ###############-->
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
                    density="compact"
                    :label="$t('from')"
                    v-model="activity.up">
                  </v-text-field>
                  -
                  <v-text-field
                    class="px-2"
                    color="primary"
                    hide-details
                    density="compact"
                    :label="$t('to')"
                    v-model="activity.upTo">
                  </v-text-field>
                </v-row>

                <v-divider class="mt-2 pb-2"/>
                
                
                <v-row no-gutters>
                  <!--############## COMMUNITY 1-3 ###############-->
                  <v-col>
                    <v-card-text class="py-2">
                      {{ $t('community') }}
                    </v-card-text>
                
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.community1">
                    </v-text-field>
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.community2">
                    </v-text-field>
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.community3">
                    </v-text-field>
                  </v-col>
                  <!--############## DISTRICT 1-3 ###############-->
                  <v-col>
                    <v-card-text class="py-2">
                      {{ $t('district') }}
                    </v-card-text>
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.district1">
                    </v-text-field>
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.district2">
                    </v-text-field>
                    <v-text-field
                      class="px-2"
                      color="primary"
                      hide-details
                      density="compact"
                      v-model="activity.district3">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-divider class="mt-3 pb-2"/>

                <!--############## AREA DESCR ###############-->
                <v-textarea
                  class="pa-2"
                  color="primary"
                  hide-details
                  rows="2"
                  :label="$t('areaDescr')"
                  v-model="activity.areaDescr">
                </v-textarea>
              </v-card>
            </v-col>


            <!-- ACT_NUMBER + DESIGNATION + ARCHIVE_NUMBER + SHORT TITLE -->
            <v-col>
              <v-text-field
                class="py-2"
                color="primary"
                :label="$tc('actNumber', 1)"
                hide-details
                v-model="activity.activityNumber">
              </v-text-field>
              <v-text-field
                class="py-2"
                color="primary"
                :label="$tc('designation')"
                hide-details
                v-model="activity.designation">
              </v-text-field>
              <v-text-field
                color="primary"
                :label="$tc('archiveNumber', 2)"
                disabled
                variant="underlined"
                persistent-hint
                :hint="$t('filledByLVR')">
              </v-text-field>
              <v-textarea
                class="pt-4"
                color="primary"
                hide-details
                rows="8"
                :label="$tc('title', 3)"
                v-model="activity.shortTitle">
              </v-textarea>
            </v-col>
          </v-row>


          <!--############### ACTIVITY DURATION ###############-->
          <v-row no-gutters class="align-center pt-2">
            <v-card variant="text">
              <v-card-text>
                {{ $t('activityDuration') }}
              </v-card-text>
            </v-card>
            <v-text-field
              class="pl-5 pa-2"
              hide-details
              density="compact"
              color="primary"
              :label="$t('from')"
              v-model="activity.dateFrom">
            </v-text-field>
            -
            <v-text-field
              class="pa-2"
              hide-details
              density="compact"
              color="primary"
              :label="$t('to')"
              v-model="activity.dateTo">
            </v-text-field>
            <v-spacer></v-spacer>
          </v-row>

          <!--############### SITE DIRECTOR + EXCAVATION FIRM ###############-->
          <v-row no-gutters class="align-center">
            <v-card variant="text">
              <v-card-text>
                {{ $t('siteDirector') }}
              </v-card-text>
            </v-card>
            <v-text-field
              class="px-2"
              hide-details
              color="primary"
              v-model="activity.siteDirector">
            </v-text-field>
            <v-card variant="text">
              <v-card-text>
                {{ $t('excavationFirm') }}
              </v-card-text>
            </v-card>
            <v-text-field
              class="pa-2"
              hide-details
              color="primary"
              v-model="activity.excavationFirm">
            </v-text-field>
          </v-row>

        <v-divider class="mt-3 py-3" :thickness="3"/>
        
        <!--############### DONE MEASURES ###############-->
        <v-col>
          <v-row>
            <v-card class="d-flex" variant="text">
              <v-row class="align-center">
                <v-card-text class="vertical-text align-center">
                  {{ $t('doneAction')}}
                </v-card-text>
              </v-row>
            </v-card>

            <v-col>
              <v-row>
                <!-- DONE MEASURES - COLUMN 1-->
                <v-col>
                  <v-checkbox
                    v-model="activity.doneMeasures.excavation"
                    hide-details
                    label="Grabung"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="activity.doneMeasures.noMeasure"
                    hide-details
                    label="Keine (übergeordnete Aktivität)"
                  ></v-checkbox>
                </v-col>
                <!-- DONE MEASURES - COLUMN 2-->
                <v-col>
                  <v-checkbox
                    v-model="activity.doneMeasures.monitoring"
                    hide-details
                    label="Baustellenbeobachtung/ Notbergung"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="activity.doneMeasures.paleoInvestigation"
                    hide-details
                    label="Paläontologische Untersuchung"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="activity.doneMeasures.changeOfLocation"
                    hide-details
                    label="Standortveränderung"
                  ></v-checkbox>
                </v-col>
                <!-- DONE MEASURES - COLUMN 3-->
                <v-col>
                  <v-checkbox
                  v-model="activity.doneMeasures.survey"
                  hide-details
                  label="Vermessung (Hauptziel)"
                  ></v-checkbox>
                  <v-checkbox
                  v-model="activity.doneMeasures.photoDocumentation"
                  hide-details
                  label="Fotodokumentation (Hauptziel)"
                  ></v-checkbox>
                  <v-checkbox
                  v-model="activity.doneMeasures.bdRecording"
                  hide-details
                  label="BD-Aufnahme"
                  ></v-checkbox>
                </v-col>
                <!-- DONE MEASURES - COLUMN 4-->
                <v-col>
                  <v-checkbox
                    v-model="activity.doneMeasures.observation"
                    hide-details
                    label="Beobachtung/ Aufsammlung"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="activity.doneMeasures.technicalReport"
                    hide-details
                    label="Fachliches Gutachten"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="activity.doneMeasures.buildingSurvey"
                    hide-details
                    label="Bauaufnahme"
                  ></v-checkbox>
                </v-col>
              </v-row>
            
              <!--_________________________________________________________________-->
              <v-divider style="border-top: 3px dashed !important;" class="mt-2 pb-3"/>
              <!--_________________________________________________________________-->

              <v-row>
                <v-col>
                  <v-row class="justify-center mb-n6">
                    <v-card variant="text">
                      <v-card-text>
                        {{ $t('prospection')}}
                      </v-card-text>
                    </v-card>
                  </v-row>

                  <v-row>
                    <!-- PROSPECTION - COLUMN 1-->
                    <v-col>
                      <v-checkbox
                        v-model="activity.prospection.roughInspection"
                        hide-details
                        label="Grobbegehung"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.detailedInspection"
                        hide-details
                        label="Feinbegehung"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.individualFindMeasurement"
                        hide-details
                        label="Einzelfundeinmessung"
                      ></v-checkbox>
                    </v-col>

                    <!-- PROSPECTION - COLUMN 2-->
                    <v-col>
                      <v-checkbox
                        v-model="activity.prospection.geoarchaeologicalInvestigation"
                        hide-details
                        label="Geoarchäologische Untersuchung"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.sondages"
                        hide-details
                        label="Sondagen"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.noneProspect"
                        hide-details
                        label="Keine (übergeordnete Aktivität)"
                      ></v-checkbox>
                    </v-col>

                    <!-- PROSPECTION - COLUMN 3-->
                    <v-col>
                      <v-checkbox
                        v-model="activity.prospection.evalElevationData"
                        hide-details
                        label="Auswertung Höhendaten"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.evalAerialImage"
                        hide-details
                        label="Auswertung Luftbild"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.metalDetecting"
                        hide-details
                        label="Metalldetektorsuche"
                      ></v-checkbox>
                    </v-col>

                    <!-- PROSPECTION - COLUMN 4-->
                    <v-col>
                      <v-checkbox
                        v-model="activity.prospection.geophysicsElectrical"
                        hide-details
                        label="Geophysik - Elektrik"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.geophysicsMagnetics"
                        hide-details
                        label="Geophysik - Magnetik"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="activity.prospection.geophysicsOther"
                        hide-details
                        label="Geophysik - Sonstiges"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>

        <!--_________________________________________________________________-->
        <v-divider style="border-top: 3px double !important;"/>
        <!--_________________________________________________________________-->

        <v-row no-gutters class="align-center pa-2 pb-0">
          <!--############### CONDITIONS PROSPEKTION ###############-->
          <v-card variant="text" width="120px">
            <v-card-text class="text-wrap">
              {{ $t('conditionsProspection') }}
            </v-card-text>
          </v-card>     
          <v-slider 
            :max="2" 
            step="1"
            class="px-2" 
            tick-size="3" 
            color="warning"
            show-ticks="always" 
            :ticks="tickLabels" 
            track-color="primary" 
            thumb-color="secondary" 
            v-model="activity.conditionsProspect" 
            style="padding-top:31px; padding-bottom:12px">
          </v-slider>
          
          <!--_________________________________________________________________-->
          <v-divider vertical/>

          <v-card variant="text">
            <v-card-text>
              {{ $t('landUsage') }}
            </v-card-text>
          </v-card>

          <v-col>
            <!--############### LAND USAGE - HISTORICAL ###############-->   
            <v-row no-gutters>
              <v-combobox
                :label="$t('historical')"
                :items="landUsage"
                density="compact"
                hide-details
                class="pr-2"
                v-model="landUsageHistModel">
              </v-combobox>
              <v-col cols="3">
                <v-number-input
                  color="primary"
                  density="compact" 
                  hide-details
                  :max="curYear"
                  controlVariant="stacked"
                  :label="$t('year')"  
                  v-model="activity.landUsageHistYear">
                </v-number-input>
              </v-col>
            </v-row>

            <v-divider class="pl-2 mr-2" vertical/>

            <!--############### LAND USAGE - HISTORICAL ###############--> 
            <v-combobox
              :label="$t('current')"
              :items="landUsage"
              density="compact"
              hide-details
              v-model="landUsageCurModel">
            </v-combobox>
          </v-col>
        </v-row>

        <!--_________________________________________________________________-->
        <v-divider style="border-top: 3px double !important;" class="mt-3 pb-2"/>
        <!--_________________________________________________________________-->

        <!--############### GROUND TYPE ###############-->
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

        <!--############### TOPOGRAPHY ###############-->
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

        <v-divider style="border-top: 3px double !important;" class="mt-3 pb-2"/>


        <v-row class="text-center pa-2">
          <!--############### RESULT TITLE ###############-->
          <v-col cols="6">
            <v-card-text>
              {{ $t('resultOfAction') }}
            </v-card-text>
            <v-combobox
              :label="$t('title')"
              :items="titlesList"
              hide-details
              density="compact"
              :hint="getTitleHint()"
              v-model="activity.resultMeasures.title1">
            </v-combobox>
            <v-combobox
              :label="$t('title')"
              :items="titlesList"
              hide-details
              density="compact"
              :hint="getTitleHint()"
              v-model="activity.resultMeasures.title2">
            </v-combobox>
            <v-combobox
              :label="$t('title')"
              :items="titlesList"
              hide-details
              density="compact"
              :hint="getTitleHint()"
              v-model="activity.resultMeasures.title3">
            </v-combobox>
            <v-combobox
              :label="$t('title')"
              :items="titlesList"
              hide-details
              density="compact"
              :hint="getTitleHint()"
              v-model="activity.resultMeasures.title4">
            </v-combobox>
            <v-combobox
              :label="$t('title')"
              :items="titlesList"
              hide-details
              density="compact"
              :hint="getTitleHint()"
              v-model="activity.resultMeasures.title5">
            </v-combobox>
          </v-col>
          
          <v-divider vertical />

          <!--############### RESULT DATING ###############-->
          <v-col>
            <v-card-text>
              {{ $t('dating') }}
            </v-card-text>
            <v-combobox
              :label="$t('dating')"
              :items="datingsList"
              hide-details
              density="compact"
              :hint="getDatingHint()"
              v-model="activity.resultMeasures.dating1">
            </v-combobox>
            <v-combobox
              :label="$t('dating')"
              :items="datingsList"
              hide-details
              density="compact"
              :hint="getDatingHint()"
              v-model="activity.resultMeasures.dating2">
            </v-combobox>
            <v-combobox
              :label="$t('dating')"
              :items="datingsList"
              hide-details
              density="compact"
              :hint="getDatingHint()"
              v-model="activity.resultMeasures.dating3">
            </v-combobox>
            <v-combobox
              :label="$t('dating')"
              :items="datingsList"
              hide-details
              density="compact"
              :hint="getDatingHint()"
              v-model="activity.resultMeasures.dating4">
            </v-combobox>
            <v-combobox
              :label="$t('dating')"
              :items="datingsList"
              hide-details
              density="compact"
              :hint="getDatingHint()"
              v-model="activity.resultMeasures.dating5">
            </v-combobox>
          </v-col>
        </v-row>
          
        <v-divider style="border-top: 3px double !important;" class="mt-3 pb-2"/>

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
import ConfirmDialog from '../components/ConfirmDialog.vue';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import { toRaw } from 'vue';
import { useWindowSize } from 'vue-window-size';

export default {

  name: 'ActivityCreation',
  components: {
    Navigation,
    ConfirmDialog,
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
        places: '',
        lastChanged: '',
        lastSync: '',
        editor: '',
        camera: null,

        
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        community1: '',
        community2: '',
        community3: '',
        district1: '',
        district2: '',
        district3: '',
        areaDescr: '',

        designation: '',
        archiveNumber: '',
        shortTitle: '',

        dateFrom: '',
        dateTo: '',
        siteDirector: '',
        excavationFirm: '',

        doneMeasures: {
          excavation: false,
          noMeasure: false,
          monitoring: false,
          paleoInvestigation: false,
          changeOfLocation: false,
          survey: false,
          photoDocumentation: false,
          bdRecording: false,
          observation: false,
          technicalReport: false,
          buildingSurvey: false,
        },
        prospection: {
          roughInspection: false,
          detailedInspection: false,
          individualFindMeasurement: false,
          geoarchaeologicalInvestigation: false,
          sondages: false,
          noneProspect: false,
          evalElevationData: false,
          evalAerialImage: false,
          metalDetecting: false,
          geophysicsElectrical: false,
          geophysicsMagnetics: false,
          geophysicsOther: false,
        },

        conditionsProspect: '',

        landUsageHist: '',
        landUsageHistYear: 0,
        landUsageCur: '',

        resultMeasures: { 
          title1: '',
          title3: '',
          title4: '',
          title2: '',
          title5: '',
          dating1: '',
          dating2: '',
          dating3: '',
          dating4: '',
          dating5: '',
        },

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

    this.componentHasLoaded = true;
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

<style scoped>
  .vertical-text {
    transform: rotate(180deg);
    writing-mode: vertical-lr;
  }
</style>