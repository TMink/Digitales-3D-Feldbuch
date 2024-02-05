<!--
 * Created Date: 03.06.2023 10:25:57
 * Author: Julian Hardtung
 * 
 * Last Modified: 05.02.2024 15:34:10
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
      <v-form class="w-75 pa-2">
        <v-card>
          <v-list>
            <v-list-subheader v-if="activities.length === 0">
              {{ $t('not_created_yet', { object: $tc('activity', 2) }) }}
            </v-list-subheader>

            <!--Lists all locally saved activities-->
            <template v-for="(activity, i) in activities" :key="activity">
              <!--Boolean 'activity.edit' decides whether an element is 
            displayed in list form or in edit form-->
              <v-row no-gutters v-if="!activity.edit" class="align-center">

                <v-col cols="10">
                  <v-list-item 
                    class="pa-2 ma-2" v-on:click="setActivity(activity._id)">
                    <v-list-item-title class="ma-4 text-center">
                      {{ activity.activityNumber }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="activity.lastSync > 0">
                      Last sync: {{ new Date(activity.lastSync).toLocaleString() }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-col>

                <v-col cols="2" class="pa-4">

                    <v-menu location="bottom">
                      <template v-slot:activator="{ props }">
                        <v-btn v-if="activity.editor.length>0"
                          color="primary"
                          v-bind="props">
                          Options
                          <v-icon>mdi-arrow-down-bold-box</v-icon>
                        </v-btn>
                        <v-btn v-else
                            color="error"
                            v-bind="props">
                            <v-tooltip 
                              activator="parent"
                              location="bottom">
                              This activity is only local and not yet assigned to an account
                            </v-tooltip>
                            Options
                            <v-icon>mdi-arrow-down-bold-box</v-icon>
                          </v-btn>
                      </template>

                      <v-list>
                        <v-list-item 
                          color="primary"
                          rounded="0"
                          :block="true"
                          v-on:click="activity.edit = !activity.edit">
                          Edit
                          <v-icon>mdi-pencil</v-icon>
                        </v-list-item>
                        <v-list-item 
                          color="error"
                          v-on:click="confirmDeletion(activity)">
                          Delete
                          <v-icon>mdi-delete</v-icon>
                        </v-list-item>
                        <v-list-item 
                          v-if="this.userStore.authenticated && activity.editor.length==0"
                          rounded="0" 
                          :block="true"
                          v-on:click="addEditor(activity, this.userStore.user.username)">
                          Add this your account
                        </v-list-item>
                        <v-list-item v-else
                          rounded="0" 
                          :block="true"
                          class="wrap-text">
                          Editors: 
                          <v-list class="pa-0" v-if="activity.editor">
                            <v-list-item
                            v-for="editor in activity.editor"
                            :key="editor">
                            {{ editor }}
                          </v-list-item>
                          </v-list>
                        </v-list-item>
                        <v-list-item v-if="this.userStore.authenticated"
                          color="error"
                          v-on:click="openAddEditorDialog(activity)">
                          Add other editor
                          <v-icon>mdi-account-plus-outline</v-icon>
                        </v-list-item> 
                      </v-list>
                    </v-menu>
                </v-col>
              </v-row> 

              <!--This is where the edit mask will be triggered-->
              <v-row id="editActivity" no-gutters v-if="activity.edit" class="align-center">

                <v-col cols="10">
                  <v-row no-gutters class="justify-center">

                    <v-col id="activityBranchOffice" cols="4" class="pt-2 px-2">
                      <v-text-field 
                        counter 
                         
                        color="primary" 
                        :label="$t('branchOffice')" 
                        :rules="[rules.required]"
                        v-model="activity.branchOffice">
                      </v-text-field>
                    </v-col>

                    <v-col id="activityYear" min-width="300px" cols="3" class="pt-2 px-2">
                      <v-text-field 
                        counter 
                        :label="$t('year')"  
                        maxlength="4" 
                        color="primary" 
                        v-model="activity.year"
                        :rules="[rules.required]"
                        @keypress="filterNonNumeric(event)">
                      </v-text-field>
                    </v-col>

                    <v-col id="activityNumber" cols="3" class="pt-2 px-2">
                      <v-text-field 
                        counter 
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

                <v-col cols="2" class="pa-4">
                  <v-btn 
                    :block="true"
                    class="ma-1" 
                    color="primary" 
                    v-on:click="saveActivity(activity)">
                    Save
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <v-btn
                    :block="true"
                    class="ma-1"
                    color="error" 
                    v-on:click="closeActivityEdit(activity)">
                    Cancel
                    <v-icon>mdi-close-circle</v-icon>
                  </v-btn>
                </v-col>

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

    <v-dialog v-model="addEditorDialog" :max-width="290" style="z-index: 3;" @keydown.esc="cancelAddEditor()">
          <v-card>
              <v-toolbar dark color="success" dense flat>
                  <v-toolbar-title>Add new Editor to activity</v-toolbar-title>
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

    return {
      userStore
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
    await fromOfflineDB.syncLocalDBs();
    await this.updateActivities();
  },
  methods: {
    /**
     * Get all activities from IndexedDb and Backend
     */
    async updateActivities() {
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities');
    },

    /**
     * @deprecated
     */
    async updateActivitiesFull() {

      var offlineActivities = await fromOfflineDB.getAllObjects('Activities', 'activities');

      // if user isn't logged in, just show the local stuff
      if (!this.userStore.authenticated) {
        console.log("Not logged in, so only show local activities")
        this.activities = offlineActivities;
        return;
      }

      const onlineActivities = await fromBackend.getDataWithParam('activities/user', this.userStore.user._id)
      
      // if there are not offlineActivities, don't check for duplicates
      if (offlineActivities.length == 0) {
        console.log("No local activities, so only show online")
        onlineActivities.forEach(async (onActivity) => {
          await fromOfflineDB.addObject(onActivity, 'Activities', 'activities');
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
        offlineActivities.forEach(async (offActivity) => {
            for (var i=0; i<onlineActivities.length; i++) {

            if (offActivity._id == onlineActivities[i]._id) {
              sameIdFound = true;

              if (onlineActivities[i].lastChanged >= offActivity.lastChanged) {
                var tempActivity = onlineActivities[i];
                onlineActivities.splice(i, 1)
                newActivityList.push(tempActivity);
                //save this onlineActivity to IndexedDB
                await fromOfflineDB.addObject(tempActivity, 'Activities', 'activities');
              } else {
                newActivityList.push(offActivity);
              }
            }
          }

          if (!sameIdFound) {
            newActivityList.push(offActivity);
          } else {
            sameIdFound = false;
          }
        });

      // add remaining online activities to the whole list
      newActivityList.concat(onlineActivities);
      this.activities = newActivityList;
    },
    
    /**
     * Sets the currently selected activity into the cookies
     * @param {String} activityID 
     */
    async setActivity(activityID) {
      if (this.$cookies.get('currentActivity') !== activityID) {
        this.$cookies.remove('currentPlace');
        this.$cookies.remove('currentPosition');
      }

      this.$cookies.set('currentActivity', activityID);
      this.$router.push({ name: 'PlacesOverview' });
    },

    setCookie(data, name) {
      var expiration = new Date();
      var hour = expiration.getHours();
      hour = hour + 6;
      expiration.setHours(hour);
      this.$cookies.set({
        url: "", //the url of the cookie.
        name: name, // a name to identify it.
        value: data, // the value that you want to save
        expirationDate: expiration.getTime()
      }, function (error) {
        console.log(error);
      });
    },

    getCookie(callback) {
      var self = this;

      self.window.webContents.session.cookies.get({}, function (error, cookies) {
        if (error) throw error;
        self.cookies = cookies;

        callback(null, cookies);
      });
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
          lastSync: 0,
          editor: rawActivity.editor,
        }

        // add new activity to current authenticated user
        if (this.userStore.authenticated) {
          newActivity.editor.push(this.userStore.user.username);
          this.userStore.user.activities.push(newActivity._id)
          this.userStore.updateUser();
        }

        // Edit existing data
        if (Object.prototype.hasOwnProperty.call(rawActivity, "_id")) {
          newActivity._id = rawActivity._id;
          await fromOfflineDB.updateObject(newActivity, 'Activities', 'activities');

        } else {
          // Add new data to store 
          var activityID = await fromOfflineDB.addObject(newActivity, 'Activities', 'activities');
          //TODO: rework the onlineSync workflow
          //await fromOfflineDB.addObject({ _id: activityID, object: 'activities' }, 'Changes', 'created');
        }
      }
      await this.updateActivities();
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

      await fromOfflineDB.updateObject(updatedActivity, 'Activities', 'activities');

      // update other user
      if (username != this.userStore.user.username) {
        const response = await fromBackend.getDataWithParam('user/name', username);
        const user = response.user;
  
        user.activities.push(activity._id);
        await fromBackend.putData('user', user);

      } else {
        // update logged in user
        this.userStore.user.activities.push(activity._id);
        this.userStore.updateUser();
      }

      await this.updateActivities();
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
        )
      ) {
        this.deleteActivity(activity);
      }
    },

    /**
     * Removes an activity from IndexedDB and Cookies
     * @param {Object} activity 
     */
    async deleteActivity(activity) {
      this.$cookies.remove('currentPosition');
      this.$cookies.remove('currentPlace');
      this.$cookies.remove('currentActivity');

      var activityIndex = this.activities.indexOf(activity);

      if (activityIndex != -1) {
        this.activities.splice(activityIndex, 1);
      }
      
      await fromOfflineDB.deleteCascade(activity._id, 'activity', 'Activities', 'activities');
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
  