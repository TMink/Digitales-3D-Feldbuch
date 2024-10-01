<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 01.10.2024 17:07:08
 * Modified By: Julian Hardtung
 * 
 * Description: lists all activities + add/edit/delete functionality for them
 -->

<template>
  <div id="wrapper">
    <Navigation ref="navigationRef" active_tab_prop="0" />
    <OnlineImport />

    <!--------------- TOOLBAR --------------->
    <v-row class="pt-2">
      <v-spacer></v-spacer>
      <v-card class="pa-4" :min-width="windowWidth * 0.35" variant="text">
        <v-row no-gutters class="align-center pa-2">
          <!-- ACTIVITIES SEARCH -->
          <v-text-field v-model="searchQuery" append-icon="mdi-magnify" 
            :label="this.$t('search')" single-line
            hide-details color="primary">
          </v-text-field>
        </v-row>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

    <!--------------- MAIN TABLE --------------->
    <v-row>
      <v-spacer></v-spacer>
      <v-card class="pt-2" :min-width="windowWidth * 0.55">
        <v-data-table-virtual v-show="!showAllInfo" 
          :headers="headers" fixed-header
          :items="utils.filteredObjects(activities, searchQuery, 'activity')" 
          :height="utils.getTableHeight(activities, windowHeight)">

          <template v-slot:item="{ item, index }">
            <tr 
              @mouseenter="setHoveredRow(index, true)"
              @mouseleave="setHoveredRow(index, false)">
              <!-- TOOLTIP -->
              <v-tooltip 
                activator="parent"
                location="bottom"
                v-if="generalStore.getShowTooltips()">
                {{ $t('editPhrase', {msg: $t('activity')}) }}
              </v-tooltip>

              <!-- PLACE NUMBER -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-3">
                  {{ item.branchOffice }}
                </v-list-item-title>
              </td>

              <!-- YEAR -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-3">
                  {{ item.year || '-' }}
                </v-list-item-title>
              </td>

              <!-- NUMBER -->
              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-list-item-title class="pl-3" style="min-width:200px">
                  {{ item.number || '-' }}
                </v-list-item-title>
              </td>

              <td v-on:click="handleRowClick(item._id, true)" 
                :style="utils.getRowStyle(index, hoveredRow)">
                <v-space></v-space>
              </td>
              
              <!-- v v v SYNC STATUS v v v -->
                <td>
                <v-btn icon variant="text" v-if="item.lastSync > 0">
                  <v-tooltip activator="parent" location="bottom">
                    {{ this.$t('lastSync') + new Date(item.lastSync).toLocaleString() }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon variant="text" v-else>
                  <v-tooltip activator="parent" location="bottom">
                    {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>

                <!-- v v v ACTIVITY EDITORS/CLOUD SYNC STATUS v v v -->
                <v-btn icon class="ml-2" variant="text"
                  v-if="item.editor.length > 0"
                  v-on:click="openAddEditorDialog(item)">
                  <!-- TOOLTIP -->
                  <v-tooltip 
                    activator="parent"
                    location="bottom"
                    max-width="150px">
                    <v-list class="mx-n3">
                      <v-list-subheader>
                        {{ this.$tc('editor', 2) }}:
                      </v-list-subheader>
                      <v-list-item
                        class="d-flex justify-center"
                        density="compact"
                        v-for="editor in item.editor"
                        :key="editor">
                        {{ editor }}
                      </v-list-item>
                      <v-divider></v-divider>
                      <p class="text-center pt-1">
                        {{ this.$t('addOtherEditor') }}
                      </p>
                    </v-list>
                  </v-tooltip>
                  <v-icon>mdi-account-check</v-icon>
                </v-btn>

                <v-btn icon class="ml-2" variant="text" v-else
                  v-on:click="addEditor(item)">
                  <v-tooltip v-if="userStore.authenticated"
                    activator="parent"
                    location="bottom">
                    {{ $t('clickToAddToYourAccount') }}
                  </v-tooltip>
                  <v-tooltip v-else
                      activator="parent"
                      location="bottom">
                      {{ $t('noAccount') }}
                    </v-tooltip>
                  <v-icon>mdi-account-off-outline</v-icon>
                </v-btn>

                <!-- EDIT -->
                <v-btn 
                  v-on:click="handleRowClick(item._id, false)"
                  style="margin-left: 3px;margin-top: 10px;margin-bottom: 10px;" 
                  color="secondary"
                  variant="outlined">
                  <v-icon class="pr-2">mdi-arrow-right-bold</v-icon>
                  {{ $tc('place', 2) }}
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-card>
      <v-spacer></v-spacer>
    </v-row>

    <!--------------- ADD BUTTON --------------->
    <v-row>
      <v-spacer></v-spacer>
      <AddButton v-on:click="addActivity()" prop_object="activity" />
      <v-spacer></v-spacer>
    </v-row>

    <!--------------- ADD EDITOR DIALOG --------------->
    <v-dialog v-model="addEditorDialog" :max-width="550" style="z-index: 3;" @keydown.esc="cancelAddEditor()">
      <v-card>
        <v-toolbar dark color="success" dense flat>
          <v-toolbar-title>
            {{ $t('addEditorToActivity') }}
          </v-toolbar-title>
        </v-toolbar>
        <v-text-field label="Username" v-model="newEditorName"></v-text-field>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn icon color="success"  @click="confirmAddEditor()"><v-icon>mdi-check-circle</v-icon></v-btn>
          <v-btn icon color="error" @click="cancelAddEditor()"><v-icon>mdi-close-circle</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import AddButton from '../components/AddButton.vue'
import OnlineImport from '../components/OnlineImport.vue'
import { useWindowSize } from 'vue-window-size';
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { fromBackend } from '../ConnectionToBackend.js'
import { toRaw } from 'vue'
import { useUserStore } from '../Authentication.js';
import { generalDataStore } from '../ConnectionToLocalStorage.js';
import { utils } from '../utils.js';

export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation,
    ConfirmDialog,
    AddButton,
    OnlineImport
  },
  
  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();
    const generalStore = generalDataStore();

    return {
      windowWidth: width,
      windowHeight: height,
      userStore,
      generalStore,
      utils
    }
  },
  
  data() {
    return {
      activities: [],
      addEditorDialog: false,
      newEditorName: "",
      editActivity: null,
      resolve: null,
      reject: null,
      rules: {
        required: value => !!value || 'Required.',
      },
      hoveredRow: -1,
      searchQuery: '',
      headers: [
        {
          title: this.$t('branchOffice'),
          align: 'start',
          sortable: true,
          key: 'branchOffice',
        },
        { title: this.$t('year'), align: 'start', key: 'year' },
        { title: this.$t('number'), align: 'start', key: 'number'},
        { title: '', sortable: false, align: 'end', key: 'actions'},
        { title: this.$t('syncStatus'), sortable: false, align: 'start', key: 'status', width: '250px'},
      ],
    };
  },

  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updateActivitiesFull()
      .catch(err => console.error(err));
  },

  mounted() {
    this.$refs.navigationRef.onViewChange(this.$t('overview', { msg: this.$tc('activity', 2) }))
  },
  
  methods: {
    /**
     * Get all activities from IndexedDb and Backend
     * @deprecated (for now)
     */
    async updateActivities() {
      this.activities = await fromOfflineDB
        .getAllObjects('Activities', 'activities')
        .catch(err => console.error(err));
    },

    /**
     * Downloads all online available activities (if the user is logged in) and 
     * combines them with locally saved activities.
     */
    async updateActivitiesFull() {

      var offlineActivities = await fromOfflineDB
        .getAllObjects('Activities', 'activities')
        .catch(err => console.error(err));

      // if user isn't logged in, just show the local stuff
      if (!this.userStore.authenticated) {
        this.activities = offlineActivities;
        this.activities.sort((a, b) => (parseInt(a.number) > parseInt(b.number)) ? 1 : -1);
        return;
      }

      const onlineActivities = await fromBackend
        .getDataWithParam('activities/user', this.userStore.user._id)
        .catch(err => console.error(err));
      
      // if there are no offlineActivities, don't check for duplicates
      if (offlineActivities.length == 0) {
        onlineActivities.forEach(async (onActivity) => {
          await fromOfflineDB
            .addObject(onActivity, 'Activities', 'activities')
            .catch(err => console.error(err));
        });
        this.activities = onlineActivities;
        this.activities.sort((a, b) => (parseInt(a.number) > parseInt(b.number)) ? 1 : -1);

        return;
      }


      // if user is logged in and local + online Activities exist, 
      // check for duplicates and which is newer
      // and combine all activities to the array for display
      var newActivityList = [];
      var sameIdFound = false;

        for (var i=0; i<offlineActivities.length; i++) {

          for (var j=0; j<onlineActivities.length; j++) {

            if (offlineActivities[i]._id == onlineActivities[j]._id
            && offlineActivities[i].lastSync < onlineActivities[j].lastSync) {
              sameIdFound = true;

              if (onlineActivities[j].lastChanged >= offlineActivities[i].lastChanged) {
                var tempActivity = onlineActivities[j];
                onlineActivities.splice(j, 1)
                newActivityList.push(tempActivity);
                //save this onlineActivity to IndexedDB
                await fromOfflineDB
                  .updateIndexedDBObject(tempActivity, 'Activities', 'activities')
                  .catch(err => console.error(err));
              } else {
                newActivityList.push(offlineActivities[i]);
              }
              
              sameIdFound = false;
            }
          }

          if (!sameIdFound) {
            newActivityList.push(offlineActivities[i]);
          } else {
            sameIdFound = false;
          }
        }

      // add remaining online activities to the whole list
      newActivityList.concat(onlineActivities);
      this.activities = newActivityList;
    },
    
    
    /**
     * Opens the placesOverview of the clicked activity
     * @param {String} activityID 
     */
    async openPlacesOverview(activityID) {
      if (this.$generalStore.getCurrentObject('activity') !== activityID) {
        this.$generalStore.setCurrentObject(null, "place");
        this.$generalStore.setCurrentObject(null, "position");
      }

      this.$generalStore.setCurrentObject(activityID, "activity");
      this.$router.push({ name: 'PlacesOverview' });
    },

    /**
     * Opens an activity
     * @param activityID 
     */
    async openActivity(activityID) {
      if (this.$generalStore.getCurrentObject('activity') !== activityID) {
        this.$generalStore.setCurrentObject(null, "place");
        this.$generalStore.setCurrentObject(null, "position");
      }

      this.$generalStore.setCurrentObject(activityID, "activity");
      this.$router.push({ name: 'ActivityCreation', params: {activityID} });
    },

    /**
     * Closes the activity edit mask and removes 
     * an activy if it wasn't saved to IndexedDB
     * @param {ProxyObject} activity 
     */
    closeActivityEdit(activity) {
      // if the activity has not been saved, discard it
      if (activity._id == undefined) {
        var index = this.activities.indexOf(activity);
        if (index != -1) {
          this.activities.splice(index, 1);
        }
      }
      activity.edit = !activity.edit;
    },

    /**
     * Adds a new temporary activity with default data
     */
    async addActivity() {

      const newActivity = {
        activityNumber: '',
        branchOffice: 'Platzhalter',
        year: new Date().getFullYear(),
        number: '0001',
        places: [],
        editor: [],
        lastChanged: Date.now(),
        lastSync: 0,
        edit: true
      }

      if (this.activities.length != 0) {
        const activityNumber = Math.max(...this.activities.map(o => o.number));
        var newActivityNumber = (activityNumber + 1).toString().padStart(4, '0');
        newActivity.number = newActivityNumber;
      }
      newActivity.activityNumber = newActivity.branchOffice
        + "_" + newActivity.year
        + "/" + newActivity.number;

      this.activities.push(newActivity);
      this.saveActivity(newActivity)
    },

    /**
     * Saves/updates an `activity` in the IndexedDB if the 
     * activity mask is filled out correctly
     * @param {ProxyObject} proxyActivity 
     */
    async saveActivity(proxyActivity) {

      const rawActivity = toRaw(proxyActivity);

      //TODO: use form.validate() instead of != null 
      if (rawActivity.branchOffice != null
        && rawActivity.year != null
        && rawActivity.number != null) {

        // new Activity data
        const newActivity = {
          _id: String(Date.now()),
          activityNumber: rawActivity.branchOffice
            + " " + rawActivity.year
            + "/" + rawActivity.number,
          branchOffice: rawActivity.branchOffice,
          year: rawActivity.year,
          number: rawActivity.number,
          places: rawActivity.places,
          lastChanged: Date.now(),
          lastSync: rawActivity.lastSync,
          editor: rawActivity.editor,
          camera: null,

          archiveNumber: '',
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
        }

        // add new activity to current authenticated user 
        // and add editor to the activity, if it isn't already in the list
        if (this.userStore.authenticated 
            && !newActivity.editor.includes(this.userStore.user.username)) {
          newActivity.editor.push(this.userStore.user.username);
          this.userStore.user.activities.push(newActivity._id)
          this.userStore.updateUser();
        }

        // Edit existing data
        if (Object.prototype.hasOwnProperty.call(rawActivity, "_id")) {
          newActivity._id = rawActivity._id;
          await fromOfflineDB
            .updateObject(newActivity, 'Activities', 'activities')
            .catch(err => console.error(err));

        } else {
          // Add new data to store 
          var activityID = await fromOfflineDB
            .addObject(newActivity, 'Activities', 'activities')
            .catch(err => console.error(err));
          //TODO: rework the onlineSync workflow
          //await fromOfflineDB.addObject({ _id: activityID, object: 'activities' }, 'Changes', 'created');
        }
      }
      await this.updateActivities()
        .catch(err => console.error(err));
      this.$root.vtoast.show({ message: this.$t('saveSuccess') });
    },

    /**
     * Opens the dialog for adding a new editor to an activity
     * @param {*} activity 
     */
    openAddEditorDialog(activity) {
      this.addEditorDialog = true;
      this.editActivity = activity;
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    /**
     * Confirms the addition of a new editor to an activity
     */
    confirmAddEditor() {
      this.addEditor(this.editActivity, this.newEditorName);
      this.resolve(true);
      this.addEditorDialog = false;
    },

    /**
     * Cancels the addition of a new editor to an activity
     */
    cancelAddEditor() {
      this.resolve(false)
      this.addEditorDialog = false;
    },
    
    /**
     * Adds a new `username` as an editor to an activity
     * @param {Object} activity 
     */
    async addEditor(activity) {
      // Update the activity
      var updatedActivity = toRaw(activity);

      if (!this.userStore.authenticated) {
        return;
      }

      var username = this.userStore.user.username;
      
      updatedActivity.editor.push(username);

      await fromOfflineDB.postObjectCascade("activities", updatedActivity)
        .catch(err => console.error(err));

      // update other user
      if (username != this.userStore.user.username) {
        const response = await fromBackend
          .getDataWithParam('user/name', username)
          .catch(err => console.error(err));
        const user = response.user;
  
        user.activities.push(activity._id);
        await fromBackend.putData('user', user)
          .catch(err => console.error(err));

      } else {
        // update logged in user
        this.userStore.user.activities.push(activity._id);
        this.userStore.updateUser();
      }

      await this.updateActivities()
        .catch(err => console.error(err));
      this.$root.vtoast.show({ message: this.$t('syncSuccess') });
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
     * Handle a click to a row of the activitiesTable.
     * Either moves to a Place or duplicates it, 
     * depending on if the duplicateSwitch is toggled or not.
     * 
     * @param {String} activityID 
     */
    handleRowClick(activityID, edit) {
      if (edit) {
        this.openActivity(activityID);
      } else {
        this.openPlacesOverview(activityID);
      }
    },
  }
}
</script>
  
<style scoped>
#test {
  text-align: center;
}

.wrap-text {
  -webkit-line-clamp: unset !important;
}
.non-clickable {
  cursor: default; /* Change cursor to indicate non-clickable */
  /* pointer-events: none; */ /* Disable pointer events */
}

td {
  padding: 6px !important;
}

th {
  padding: 6px !important;
}
</style>
  