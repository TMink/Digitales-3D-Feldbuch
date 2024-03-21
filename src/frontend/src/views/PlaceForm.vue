<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 21.03.2024 13:30:11
 * Modified By: Julian Hardtung
 * 
 * Description: input page for places data 
 *              (shows input modules according to module preset)
 -->

<template>
  <Navigation active_tab_prop="1"/>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="2">
        <v-card style="position:fixed; width:15%;">
          <v-tabs v-model="tab" direction="vertical" color="primary">
            <v-tab value="one" rounded="0"> {{ $t('general') }} </v-tab>
            <v-tab class="hideable" value="two" rounded="0"> {{ $t('position') }} </v-tab>
            <v-tab value="three" rounded="0"> {{ $t('imageOverview') }} </v-tab>
            <v-tab class="hideable" value="four" rounded="0"> {{ $tc('technicalDrawing', 2) }} </v-tab>
            <v-tab class="hideable" value="five" rounded="0"> {{ $tc('model', 2) }} </v-tab>
            <v-btn rounded="0" v-on:click="savePlace()" color="primary">
              {{ $t('save') }}
            </v-btn>
            <v-btn rounded="0" color="error" v-on:click="confirmDeletion(place)">
              {{ $t('delete') }}
            </v-btn>

            <ConfirmDialog ref="confirm" />

            <v-btn rounded="0" v-on:click="cancelPlace" color="secondary">
              {{ $t('cancel') }}
            </v-btn>
          </v-tabs>
        </v-card>
      </v-col>

      <v-col cols="10">
        <v-window v-model="tab">
          <!-- Tab item 'GENERAL' -->
          <v-window-item value="one">
            <ModuleViewer ref="moduleViewerRef" :datingItemsFirstProp="datingsList" :editorItemsFirstProp="editorsList"
              :titleItemsFirstProp="titlesList" @dataToPlaceForm="getEmitedData($event)" />
          </v-window-item>

          <!-- Tab item 'positions' -->
          <v-window-item value="two">
            <v-form>
              <v-card class="pa-3" :min-width="windowWidth * 0.5">
                <v-data-table-virtual :items="positions" fixed-header :height="getTableHeight" :headers="headers"
                  :sort-by="[{ key: 'positionNumber', order: 'asc' }]" max-height>

                  <template v-slot:item="{ item, index }">
                    <tr v-on:click="moveToPosition(item.raw._id)" @mouseenter="setHoveredRow(index, true)"
                      @mouseleave="setHoveredRow(index, false)">

                      <!-- POSITION NUMBER -->
                      <td :style="getRowStyle(index)">
                        <v-list-item-title>
                          {{ item.raw.positionNumber }}
                        </v-list-item-title>
                      </td>

                      <!-- SUB NUMBER -->
                      <td :style="getRowStyle(index)">
                        <v-list-item-title>
                          {{ item.raw.subNumber }}
                        </v-list-item-title>
                      </td>

                      <!-- TITLE -->
                      <td class="py-6" :style="getRowStyle(index)">
                        <v-list-item-title v-if="item.raw.title.length > 0" style="min-width:200px" class="text-wrap">
                          {{ item.raw.title }}
                        </v-list-item-title>

                        <v-list-item-title v-if="item.raw.title.length == 0" style="color:dimgrey;">
                          -
                        </v-list-item-title>
                      </td>

                      <!-- DATE -->
                      <td :style="getRowStyle(index)">
                        <v-list-item-title>
                          {{ item.raw.date || '-' }}
                        </v-list-item-title>
                      </td>
                    </tr>
                  </template>
                </v-data-table-virtual>
              </v-card>

              <AddPosition :positions_prop="positions" @updatePositions="updatePositions()" />

            </v-form>
          </v-window-item>

          <!-- Tab item 'pictures' -->
          <v-window-item value="three">
            <ImageOverview :object_id="place._id" />
          </v-window-item>

          <!-- Tab item 'technical drawing' -->
          <v-window-item value="four">
            <v-dialog persistent overlay-color="black" overlay-opacity="1" v-model="backgroundDialog">
              <v-card class="pa-4">
                <v-card-title>Set Background Image</v-card-title>
                <v-file-input @change="setBackgroundImage($event)" prepend-icon="mdi-image"
                  accept="image/png"></v-file-input>
                <v-btn @click.prevent="saveBackground()">Save</v-btn>
                <v-btn @click.prevent="revertBackground()">Cancel</v-btn>
              </v-card>
            </v-dialog>

            <v-toolbar :height="50" color="surface" density="default">
              <v-btn-toggle>
                <v-btn @click="onToolbarClick('pen')" icon="mdi-pencil" rounded="1"></v-btn>
                <v-btn @click="onToolbarClick('eraser')" icon="mdi-eraser" rounded="1"></v-btn>
                <v-btn @click.prevent="onToolbarClick('text')" icon="mdi-format-text" rounded="0"></v-btn>
                <v-btn @click="onToolbarClick('shape')" icon="mdi-shape" rounded="0"></v-btn>
              </v-btn-toggle>
              <v-btn @click="onToolbarClick('colorPicker')" icon="mdi-palette" rounded="0"></v-btn>
              <v-btn @click="onToolbarClick('lineWidth')" icon="mdi-minus" rounded="0"></v-btn>
              <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.undo()" icon="mdi-undo" rounded="0"></v-btn>
              <v-btn @click.prevent="$refs.FieldbookDrawingCanvas.redo()" icon="mdi-redo" rounded="0"></v-btn>
              <v-btn @click.prevent="onToolbarClick('clear')" icon="mdi-trash-can-outline" rounded="0"></v-btn>
              <v-btn @click.prevent="backgroundDialog = true" icon="mdi-image" rounded="0"></v-btn>
              <v-btn @click.prevent="onToolbarClick('refresh')" icon="mdi-reload" rounded="0"></v-btn>
            </v-toolbar>
            <div style="position:relative">
              <v-expand-transition>
                <v-color-picker class="mt-2" style="position:absolute; left:100px; z-index: 1;"
                  v-show="canvasSettings.colorPickerChosen" v-model="canvasSettings.color"></v-color-picker>
              </v-expand-transition>

              <v-card class="mt-2" style="position:absolute; left: 150px; z-index: 1;" :width="600">
                <v-expand-transition>
                  <v-slider v-model="canvasSettings.lineWidth" :min="1" :max="10" :step="1"
                    v-show="canvasSettings.lineWidthChosen" show-ticks="always"
                    :ticks="canvasSettings.lineTicks"></v-slider>
                </v-expand-transition>
              </v-card>

              <v-expand-transition>
                <v-card class="mt-2" row v-show="canvasSettings.textModeChosen"
                  style="position: absolute; left: 90px; z-index: 1;">
                  <v-layout>
                    <v-card :width="200" class="mx-2"><v-select :label="$t('fontFamily')" v-model="canvasSettings.selectedFont"
                        :items="canvasSettings.fonts"></v-select></v-card>
                    <v-card :width="200" class="mx-2"><v-select :label="$t('fontSize')"
                        v-model="canvasSettings.selectedFontSize" :items="canvasSettings.fontSizes"></v-select></v-card>
                  </v-layout>
                </v-card>
              </v-expand-transition>

              <v-expand-transition>
                <v-card class="mt-2" row v-show="canvasSettings.shapeModeChosen"
                  style="position: absolute; left: 140px; z-index: 1;">
                  <v-layout>
                    <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'line'" icon="mdi-minus" rounded="0"></v-btn></v-card>
                    <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'dotted-line'" icon="mdi-dots-horizontal" rounded="0"></v-btn></v-card>
                    <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'circle'" icon="mdi-circle-outline" rounded="0"></v-btn></v-card>
                    <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'rectangle'" icon="mdi-square-outline" rounded="0"></v-btn></v-card>
                    <v-card class="mx-2"><v-btn @click="canvasSettings.mode = 'triangle'" icon="mdi-triangle-outline" rounded="0"></v-btn></v-card>
                    <v-card class="mx-2" :height="50"><v-checkbox :label="$t('fill')" v-model="canvasSettings.filled" icon="mdi-triangle-outline" rounded="0"></v-checkbox></v-card>
                  </v-layout>
                </v-card>
              </v-expand-transition>

              <FieldbookDrawingCanvas ref="FieldbookDrawingCanvas" :canvasWidth="canvasSettings.width"
                :canvasHeight="canvasSettings.height" :lineWidth="canvasSettings.lineWidth"
                :color="canvasSettings.color" :mode="canvasSettings.mode" :fontFamily="canvasSettings.selectedFont" 
                :fontSize="canvasSettings.selectedFontSize" :filled="canvasSettings.filled">
              </FieldbookDrawingCanvas>
            </div>
            <v-row justify="end">
              <v-col class="text-left mt-2">
                <v-btn color="primary" class="mr-2"><v-icon>mdi-content-save-all</v-icon></v-btn>
                <v-btn @click="downloadImage()" color="primary"><v-icon>mdi-download</v-icon></v-btn>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Tab item 'models' -->
          <v-window-item value="five">
            <ModelForm :object_id="place._id" object_type="Places" @addModel="addModel($event)">
            </ModelForm>
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
 *  moveToPosition  - Loads the view of the selected position
 *  cancelPlace     - Cancels all not already saved actions
 */
import { fromOfflineDB } from '../ConnectionToOfflineDB.js';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import AddPosition from '../components/AddPosition.vue';
import ImageOverview from '../components/ImageOverview.vue';
import ModuleViewer from '../components/ModuleViewer.vue';
import ModelForm from '../components/ModelForm.vue';
import { toRaw } from 'vue';
import { useWindowSize } from 'vue-window-size';
import Navigation from '../components/Navigation.vue';
import FieldbookDrawingCanvas from "../components/FieldbookDrawingCanvas.vue";

export default {

  name: 'PlaceCreation',
  components: {
    Navigation,
    ConfirmDialog,
    AddPosition,
    ImageOverview,
    ModuleViewer,
    ModelForm,
    FieldbookDrawingCanvas,
  },
  emits: ['view'],
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
      tab: null,
      backgroundDialog: false,

      canvasSettings: {
        width: 1200,
        height: 800,
        backgroundColor: "#fff",
        colorPickerChosen: false,
        lineWidthChosen: false,
        textModeChosen: false,
        shapeModeChosen: false,
        color: "#000",
        mode: "none",
        filled: false,
        lineWidth: 3,
        lineTicks: {
          1: "1",
          2: "2",
          3: "3",
          4: "4",
          5: "5",
          6: "6",
          7: "7",
          8: "8",
          9: "9",
          10: "10",
        },
        fonts: ["Arial", "Serif", "Verdana", "Tahoma", "Georgia", "Courier New"],
        fontSizes: [16, 20, 24, 28, 32, 40, 44, 52],
        selectedFont: "Arial",
        selectedFontSize: 20,
        writeMode: false,
        backgroundImage: null,
        oldBackgroundImage: null,
      },
      place: {
        _id: '',
        activityID: '',
        placeNumber: '',
        profile: '',
        drawing: '',
        positions: [],
        images: [],
        models: [],
        lines: [],
        lastChanged: '',
        lastSync: 0,

        /* Coordinates */
        right: '',
        rightTo: '',
        up: '',
        upTo: '',
        depthTop: '',
        depthBot: '',

        /* Dating */
        dating: '',

        /* FindTypes */
        noFinding: false,
        restFinding: false,

        /* General */
        description: '',
        editor: '',
        date: '',
        title: '',

        /* Plane */
        plane: '',

        /* PositionsList */
        testBool: false,

        /* Technical */
        technical: '',

        /* Visibility */
        visibility: '',
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
      positions: null,
      titles: [],
      datings: [],
      is_required: [v => !!v || 'Pflichtfeld'],
      tickLabels: {
        3: this.$t('veryGood'),
        2: this.$t('good'),
        1: this.$t('moderate'),
        0: this.$t('bad'),
      },
      hasUnsavedChanges: false,
      componentHasLoaded: false,

      datingsList: [],
      editorsList: [],
      titlesList: [],
    }

  },
  /**
   * Check if there are unsaved changes to the position 
   * before leaving the PositionForm
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
    this.titles = JSON.parse(import.meta.env.VITE_TITLES);
    this.datings = JSON.parse(import.meta.env.VITE_DATINGS);

    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updatePlace()
      .catch(err => console.error(err));
    await this.updatePositions()
      .catch(err => console.error(err));

    const datingFromDB = await fromOfflineDB
      .getAllObjects('AutoFillLists', 'datings')
      .catch(err => console.error(err));
    datingFromDB.forEach(element => {
      this.datingsList.push(element.item)
    });

    const editorsFromDB = await fromOfflineDB
      .getAllObjects('AutoFillLists', 'editors')
      .catch(err => console.error(err));
    editorsFromDB.forEach(element => {
      this.editorsList.push(element.item)
    });

    const titlesFromDB = await fromOfflineDB
      .getAllObjects('AutoFillLists', 'titles')
      .catch(err => console.error(err));
    titlesFromDB.forEach(element => {
      this.titlesList.push(element.item)
    });

    await this.setAppBarTitle()
      .catch(err => console.error(err));
    this.hideNonTechnicalTabs();
    this.componentHasLoaded = true;
    this.hasUnsavedChanges = false;
  },

  computed: {
    getTableHeight() {
      // Calculate the required table height based on the number of items
      const numberOfRows = this.positions.length > 0 ? this.positions.length : 1;
      const headerHeight = 56;
      const rowHeight = 73;
      const totalTableHeight = numberOfRows * rowHeight + headerHeight;

      if (totalTableHeight > (this.windowHeight - 350)) {
        return this.windowHeight - 350;
      }

      return totalTableHeight + "px";
    },
  },

  methods: {

    async getEmitedData(data) {
      switch (data[0]) {
        /* Module: Coordinates */
        case 'right':
          this.place.right = data[1];
          break;
        case 'rightTo':
          this.place.rightTo = data[1];
          break;
        case 'up':
          this.place.up = data[1];
          break;
        case 'upTo':
          this.place.upTo = data[1];
          break;
        case 'depthTop':
          this.place.depthTop = data[1];
          break;
        case 'depthBot':
          this.place.depthBot = data[1];
          break;

        /* Module: Dating */
        case 'dating':
          this.place.dating = data[1];
          break;

        /* Module: FindTypes */
        case 'noFinding':
          this.place.noFinding = data[1];
          break;
        case 'restFinding':
          this.place.restFinding = data[1];
          break;

        /* Module: General */
        case 'description':
          this.place.description = data[1];
          break;
        case 'editor':
          this.place.editor = data[1];
          break;
        case 'date':
          this.place.date = data[1];
          break;
        case 'title':
          this.place.title = data[1];
          break;

        /* Module: Plane */
        case 'plane':
          this.place.plane = data[1];
          break;

        /* Module: PositionList */
        case 'resetBool':
          this.place.testBool = data[1];
          break;

        /* Module: Technical */
        case 'technical':
          this.place.technical = data[1]
          break;

        /* Module: Visibility */
        case 'visibility':
          this.place.visibility = data[1];
          break;

        default:
          console.log('Cant specify emitted data: ' + data[0])
      }
    },

    /**
     * Update reactive Vue.js place data
     */
    async updatePlace() {
      const currentPlace = this.$generalStore.getCurrentObject('place');
      const data = await fromOfflineDB
        .getObject(currentPlace, 'Places', 'places')
        .catch(err => console.error(err));
      this.place = data;
    },

    /**
     * Update reactive Vue.js positions data
     */
    async updatePositions() {
      this.positions = await fromOfflineDB
        .getAllObjectsWithID(this.place._id, 'Place', 'Positions', 'positions')
        .catch(err => console.error(err));
    },

    /**
     * Save a place to local storage for the current activity
     */
    async savePlace() {
      //convert from vue proxy to JSON object
      const inputPlace = toRaw(this.place);
      //inputPlace.date = new Date().toLocaleDateString("de-DE");
      inputPlace.lastChanged = Date.now();

      await fromOfflineDB.updateObject(inputPlace, 'Places', 'places')
        .catch(err => console.error(err));
      this.hasUnsavedChanges = false;

      this.updateAutoFillList('datings', this.place.dating, this.datingsList);
      this.updateAutoFillList('editors', this.place.editor, this.editorsList);
      this.updateAutoFillList('titles', this.place.title, this.titlesList);

      this.$root.vtoast.show({ message: this.$t('saveSuccess') });
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
      if (!!Object.keys(newEditor).length) {
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
     * @param {Object} place 
     */
    async confirmDeletion(place) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          this.$t('confirm_del', {
            object: this.$tc('place', 1),
            object_nr: place.placeNumber
          })
        ).catch(err => console.error(err))
      ) {
        this.deletePlace();
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
     * Removes a place from the IndexedDB and the Cookies
     */
    async deletePlace() {

      // Remove the placeID from connected activity
      const acID = this.$generalStore.getCurrentObject('activity');
      var activity = await fromOfflineDB
        .getObject(acID, 'Activities', 'activities')
        .catch(err => console.error(err));
      var index = activity.places.indexOf(this.place._id.toString());

      activity.places.splice(index, 1)
      await fromOfflineDB.updateObject(activity, 'Activities', 'activities')
        .catch(err => console.error(err));

      // Delete the place and all data that is dependent on it
      await fromOfflineDB
        .deleteCascade(this.place._id, 'place', 'Places', 'places')
        .catch(err => console.error(err));
      this.$generalStore.removeCurrentObject('place');
      this.$generalStore.removeCurrentObject('position');

      this.hasUnsavedChanges = false;
      this.$router.push({ name: "PlacesOverview" });
    },

    /**
     * Adds a new `image_id` to the `images`-array of this place
     * @param {String} image_id 
     */
    addImage(image_id) {
      if (this.place.images == undefined) {
        this.place.images = [image_id];
      } else {
        this.place.images.push(image_id);
      }
    },

    /**
     * Adds a new `model_id` to the `models`-array of this place
     * @param {String} model_id 
     */
    addModel(model_id) {
      if (this.place.models == undefined) {
        this.place.models = [model_id];
      } else {
        this.place.models.push(model_id);
      }
    },

    /**
     *  Routes to the PositionForm for the chosen positionID
     * @param {String} positionID 
     */
    moveToPosition(positionID) {
      if (positionID !== 'new') {
        this.$generalStore.setCurrentObject(positionID, 'position');
      }
      this.$router.push({ name: 'PositionCreation', params: { positionID: positionID } });
    },

    /**
     * Cancels the PositionForm and returns to the PositionOverview
     */
    cancelPlace() {
      this.$router.push({ name: "PlacesOverview" });
    },

    /**
     * Hide the side tabs that are not required for a technical place
     */
    hideNonTechnicalTabs() {
      if (this.place.placeNumber == 1) {
        // Get all elements with the class "hideable"
        const hideableElements = document.querySelectorAll('.hideable');

        // Hide all hideable elements
        hideableElements.forEach(element => {
          element.style.display = 'none';
        });
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

      this.$emit("view", activity.activityNumber + ' ' + place.placeNumber);
    },

    /**
     * Gets called every time some info of the current position changes.
     * Once a change has happend, the flag `hasUnsavedChanges` gets set to `true`
     */
    handlePlaceChange() {
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

    /**
     * Get the style for the row at the specified index.
     *
     * @param {number} index The index of the row
     * @returns {Object} An object containing row style properties
     */
    getRowStyle(index) {
      return {
        backgroundColor: this.hoveredRow === index ? '#2f3845' : 'transparent',
        cursor: 'pointer',
        padding: '8px 16px'
      };
    },

    /**
     * Update the hoveredRow based on the isHovered flag.
     *
     * @param {number} index - The index of the row being hovered.
     * @param {boolean} isHovered - Indicates if the row is being hovered 
     *                              (true) or not (false).
     */
    setHoveredRow(index, isHovered) {
      if (isHovered) {
        this.hoveredRow = index;
      } else if (this.hoveredRow === index) {
        this.hoveredRow = -1;
      }
    },


    /**
     * Changes the status of variables related to the toolbar, if clicked.
     * 
     * @param {string} toolType - Defines the pressed button of the toolbar
     * */
    onToolbarClick(toolType) {
      if (toolType == "pen" || toolType == "eraser") {

        this.canvasSettings.mode = toolType == "eraser" ? "eraser" : "pen";
        this.canvasSettings.lineWidthChosen = false;
        this.canvasSettings.textModeChosen = false;
        this.canvasSettings.colorPickerChosen = false;
        this.canvasSettings.shapeModeChosen = false;
      }
      if (toolType == "colorPicker") {
        this.canvasSettings.lineWidthChosen = false;
        this.canvasSettings.textModeChosen = false;
        this.canvasSettings.shapeModeChosen = false;
        this.canvasSettings.colorPickerChosen = !this.canvasSettings.colorPickerChosen;
      }
      if (toolType == "lineWidth") {
        this.canvasSettings.colorPickerChosen = false;
        this.canvasSettings.textModeChosen = false;
        this.canvasSettings.shapeModeChosen = false;
        this.canvasSettings.lineWidthChosen = !this.canvasSettings.lineWidthChosen;
      }
      if (toolType == "text") {
        this.canvasSettings.mode = "text"
        this.canvasSettings.lineWidthChosen = false;
        this.canvasSettings.colorPickerChosen = false;
        this.canvasSettings.shapeModeChosen = false;
        this.canvasSettings.textModeChosen = !this.canvasSettings.textModeChosen;
      }
      if (toolType == "clear") {
        this.$refs.FieldbookDrawingCanvas.clearCanvas();
      }
      if (toolType == "shape") {
        this.canvasSettings.lineWidthChosen = false;
        this.canvasSettings.textModeChosen = false;
        this.canvasSettings.colorPickerChosen = false;
        this.canvasSettings.shapeModeChosen = !this.canvasSettings.shapeModeChosen;
      }
      if (toolType == "deleteBackground") {

      }
    },


    /**
     * Converts the base64-output of the Vue-Drawing-Canvas to an Imagefile, which can be downloaded.
     * */
    downloadImage() {
      const link = document.createElement('a');
      link.href = this.$refs.FieldbookDrawingCanvas.addWhiteBackgroundToImage().toDataURL();
      link.target = '_blank';
      link.download = `${Date.now()}.png`
      document.body.appendChild(link);
      link.click();
      link.remove();
    },

    async setBackgroundImage(event) {
      let URL = window.URL;
      this.canvasSettings.backgroundImage = URL.createObjectURL(event.target.files[0]);
    },

    async saveBackground() {
      this.backgroundDialog = false;
      await this.setCanvasSize(this.canvasSettings.backgroundImage)
      await this.$refs.FieldbookDrawingCanvas.addBackgroundImage(this.canvasSettings.backgroundImage, this.canvasSettings.width, this.canvasSettings.height);
      this.canvasSettings.oldBackgroundImage = { ...this.canvasSettings.backgroundImage};
      console.log(this.canvasSettings.backgroundImage)
    },

    async setCanvasSize(url) {
      var thisInstance = this;
      var img = new Image();
      img.src = url;
      await img.decode().then(() => {
        if (img.width > 1200) {
          const compression = img.width / 1200;
          img.width /= compression;
          img.height /= compression;
        }
        thisInstance.canvasSettings.width = img.width;
        thisInstance.canvasSettings.height = img.height;
      })
    },

    async revertBackground() {
      if (this.oldBackgroundImage) {
        this.canvasSettings.backgroundImage = {...this.canvasSettings.oldBackgroundImage};
      }
      this.backgroundDialog = false;
      console.log(this.canvasSettings.backgroundImage)
    }

  }
};

</script>

<style scoped></style>