<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 17.02.2024 19:52:59
 * Modified By: Julian Hardtung
 * 
 * Description: lists all activities + add/edit/delete functionality for them
 -->

<template>
  <div id="wrapper">
    <Navigation active_tab_prop="0" />

    <OnlineImport />

    <v-row class="pt-4">
      <v-spacer></v-spacer>
      <v-form class="w-75 pa-4">
        <v-card>
          <v-list class="pa-0">
            <!-- v v v v v EMPTY ACTIVITY LIST v v v v v -->
            <v-list-subheader v-if="activities.length === 0">
              {{ $t('not_created_yet', { object: $tc('activity', 2) }) }}
            </v-list-subheader>

            <template v-for="(activity, i) in activities" :key="activity">
              <v-row no-gutters class="align-center" justify="end">

                <!-- v v v v v ACTIVITY LIST v v v v v -->
                <v-col v-if="!activity.edit" >
                  <v-list-item 
                    class="pa-2 ma-2" v-on:click="setActivity(activity._id)">
                    <v-list-item-title class="ma-4 text-center">
                      {{ activity.activityNumber }}
                    </v-list-item-title>
                  </v-list-item>
                </v-col>

                <!-- v v v v v ACTIVITY EDIT v v v v v -->
                <v-col id="editActivity" v-else class="align-center">
                  <v-row no-gutters class="justify-center">

                    <v-col id="activityBranchOffice" cols="4" class="px-2 py-4">
                      <v-text-field 
                        counter
                        hide-details
                        color="primary" 
                        :label="$t('branchOffice')" 
                        :rules="[rules.required]"
                        v-model="activity.branchOffice">
                      </v-text-field>
                    </v-col>

                    <v-col id="activityYear" min-width="300px" cols="3" class="px-2 py-4">
                      <v-text-field 
                        counter
                        hide-details
                        :label="$t('year')"  
                        maxlength="4" 
                        color="primary" 
                        v-model="activity.year"
                        :rules="[rules.required]"
                        @keypress="filterNonNumeric(event)">
                      </v-text-field>
                    </v-col>

                    <v-col id="activityNumber" cols="3" class="px-2 py-4">
                      <v-text-field 
                        counter 
                        hide-details
                        maxlength="4" 
                        :label="$t('number')" 
                        color="primary" 
                        v-model="activity.number"
                        :rules="[rules.required]"
                        @keypress="filterNonNumeric(event)">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <!-- v v v v v ACTIVITY OPTIONS v v v v v -->
                <v-menu v-if="!activity.edit" location="bottom">
                  <template v-slot:activator="{ props }">
                    <v-btn 
                      v-if="activity.editor.length>0"
                      color="primary"
                      v-bind="props">
                      {{ this.$t('options') }}
                      <v-icon>mdi-arrow-down-bold-box</v-icon>
                    </v-btn>
                  
                    <v-btn v-else
                      color="error"
                      v-bind="props">
                      {{ this.$t('options') }}
                      <v-icon>mdi-arrow-down-bold-box</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <!-- EDIT -->
                    <v-list-item 
                      color="primary"
                      rounded="0"
                      :block="true"
                      v-on:click="activity.edit = !activity.edit">
                      {{ this.$t('edit') }}
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item>
                    <!-- DELETE -->
                    <v-list-item 
                      color="error"
                      v-on:click="confirmDeletion(activity)">
                      {{ this.$t('delete') }}
                      <v-icon>mdi-delete</v-icon>
                    </v-list-item>
                    <!-- ADD TO YOUR ACCOUNT -->
                    <v-list-item 
                      v-if="this.userStore.authenticated && activity.editor.length==0"
                      rounded="0" 
                      :block="true"
                      v-on:click="addEditor(activity, this.userStore.user.username)">
                      {{ this.$t('addToYourAccount') }}
                    </v-list-item>
                    <!-- ADD OTHER EDITOR -->
                    <v-list-item v-if="this.userStore.authenticated"
                      color="error"
                      v-on:click="openAddEditorDialog(activity)">
                      {{ this.$t('addOtherEditor') }}
                      <v-icon>mdi-account-plus-outline</v-icon>
                    </v-list-item> 
                  </v-list>
                </v-menu>

                <!-- v v v v v ACTIVITY EDIT SAVE/CANCEL v v v v v -->
                <div v-else>
                  <!-- SAVE -->
                  <v-btn
                    class="mx-1" 
                    color="primary"
                    v-on:click="saveActivity(activity)">
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <!-- CANCEL -->
                  <v-btn
                    class="ml-1"
                    color="error" 
                    v-on:click="closeActivityEdit(activity)">
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </div>

                <!-- v v v v v ACTIVITY EDITORS/CLOUD SYNC STATUS v v v v v -->
                <v-btn icon class="ml-2" variant="text"
                  v-if="activity.editor.length > 0">
                  <v-tooltip 
                    activator="parent"
                    location="bottom">

                    <v-list 
                      class="mx-n3">
                      <v-list-subheader>
                        {{ this.$tc('editor', 2) }}:
                      </v-list-subheader>
                      <v-list-item
                        class="d-flex justify-center"
                        density="compact"
                        v-for="editor in activity.editor"
                        :key="editor">
                        {{ editor }}
                      </v-list-item>
                    </v-list>
                  </v-tooltip>
                  <v-icon>mdi-account-check</v-icon>
                </v-btn>

                <v-btn icon class="ml-2" variant="text" v-else>
                  <v-tooltip 
                    activator="parent"
                    location="bottom">
                    {{ $t('noAccount') }}
                  </v-tooltip>
                  <v-icon>mdi-account-off-outline</v-icon>
                </v-btn>
                
                <v-btn icon class="mr-2" variant="text"
                  v-if="activity.lastSync > 0">
                  <v-tooltip 
                    activator="parent"
                    location="bottom">
                    {{ this.$t('lastSync') + new Date(activity.lastSync).toLocaleString() }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-check</v-icon>
                </v-btn>
                <v-btn icon class="mr-2" variant="text" v-else>
                  <v-tooltip 
                    activator="parent"
                    location="bottom">
                    {{ $t('onlyLocal') }}
                  </v-tooltip>
                  <v-icon>mdi-cloud-off-outline</v-icon>
                </v-btn>
              </v-row>

              <v-divider v-if="i !== activities.length - 1"></v-divider>
            </template>
            <ConfirmDialog ref="confirm" />

          </v-list>
        </v-card>
      </v-form>
      <v-spacer></v-spacer>
    </v-row>

    <AddButton v-on:click="addActivity()" />

    <!-- ADD EDITOR DIALOG -->
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
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { fromBackend } from '../ConnectionToBackend.js'
import { generalDataStore } from '../ConnectionToLocalStorage'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import AddButton from '../components/AddButton.vue'
import OnlineImport from '../components/OnlineImport.vue'
import { toRaw } from 'vue'
import { useUserStore } from '../Authentication.js';


export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation,
    ConfirmDialog,
    AddButton,
    OnlineImport
  },
  setup() {
    const userStore = useUserStore();
    const generalStore = generalDataStore();

    return {
      userStore,
      generalStore
    }
  },
  emits: ['view'],
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
      }
    };
  },
  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    this.$emit("view", this.$t('overview', { msg: this.$tc('activity', 2) }));
    await fromOfflineDB.syncLocalDBs()
      .catch(err => console.error(err));
    await this.updateActivitiesFull()
      .catch(err => console.error(err));
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
        console.log("Not logged in, so only show local activities")
        this.activities = offlineActivities;
        return;
      }

      const onlineActivities = await fromBackend
        .getDataWithParam('activities/user', this.userStore.user._id)
        .catch(err => console.error(err));
      
      // if there are no offlineActivities, don't check for duplicates
      if (offlineActivities.length == 0) {
        console.log("No local activities, so only show online")
        onlineActivities.forEach(async (onActivity) => {
          await fromOfflineDB
            .addObject(onActivity, 'Activities', 'activities')
            .catch(err => console.error(err));
        });
        this.activities = onlineActivities;

        return;
      }


      // if user is logged in and local + online Activities exist, 
      // check for duplicates and which is newer
      // and combine all activities to the array for display
      var newActivityList = [];
      var sameIdFound = false;

      console.log("online and offline activities have to be combined")
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
     * Sets the currently selected activity into the cookies
     * @param {String} activityID 
     */
    async setActivity(activityID) {
      if (this.generalStore.getCurrentObject('activity') !== activityID) {
        this.generalStore.setCurrentObject(null, "place");
        this.generalStore.setCurrentObject(null, "position");
      }

      this.generalStore.setCurrentObject(activityID, "activity");
      this.$router.push({ name: 'PlacesOverview' });
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
        edit: true,
      }

      if (this.activities.length != 0) {
        const activityNumber = Math.max(...this.activities.map(o => o.number));
        var newActivityNumber = (activityNumber + 1).toString().padStart(4, '0');
        newActivity.number = newActivityNumber;
      }
      newActivity.activityNumber = newActivity.branchOffice
        + " " + newActivity.year
        + "/" + newActivity.number;

      this.activities.push(newActivity);
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
     * @param {*} activity 
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
     * @param {String} username 
     */
    async addEditor(activity, username) {
      // Update the activity
      var updatedActivity = toRaw(activity);
      
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
     * Opens the confirmation dialog for deletion
     * @param {Object} activity 
     */
    async confirmDeletion(activity) {
      if (
        await this.$refs.confirm.open(
          this.$t('confirm'),
          this.$t('confirm_del', {
              object: this.$tc('activity', 1), 
              object_nr: activity.activityNumber }),
        ).catch(err => console.error(err))
      ) {
        this.deleteActivity(activity);
      }
    },

    /**
     * Removes an activity from IndexedDB and Cookies
     * @param {Object} activity 
     */
    async deleteActivity(activity) {
      this.generalStore.setCurrentObject(null, "activity");
      this.generalStore.setCurrentObject(null, "place");
      this.generalStore.setCurrentObject(null, "position");

      var activityIndex = this.activities.indexOf(activity);

      if (activityIndex != -1) {
        this.activities.splice(activityIndex, 1);
      }
      
      await fromOfflineDB
        .deleteCascade(activity._id, 'activity', 'Activities', 'activities')
        .catch(err => console.error(err));
    },

    /**
      * Prevents the input of non numeric values 
      * @param {*} evt 
      */
    filterNonNumeric(evt) {
      evt = (evt) ? evt : window.event;
      let expect = evt.target.value.toString() + evt.key.toString();

      if (!/^[0-9]*$/.test(expect)) {
        evt.preventDefault();
      } else {
        return true;
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
</style>
  