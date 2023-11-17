<template>
  <div id="wrapper">
    <Navigation active_tab_prop="0" />
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

                <v-col cols="9">
                  <v-list-item 
                    class="pa-2 ma-2" v-on:click="setActivity(activity.id)">
                    <v-list-item-title class="ma-4 text-center">
                      {{ activity.activityNumber }}
                    </v-list-item-title>
                  </v-list-item>
                </v-col>

                <v-col cols="3" class="pa-4">
                  <v-btn 
                    icon 
                    class="ma-1" 
                    color="primary" 
                    v-on:click="activity.edit = !activity.edit">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn 
                    icon 
                    color="error" 
                    class="ma-1" 
                    v-on:click="confirmDeletion(activity)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <!--This is where the edit mask will be triggered-->
              <v-row id="editActivity" no-gutters v-if="activity.edit" class="align-center">

                <v-col cols="9">
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
                        :rules="[rules.required]">
                      </v-text-field>
                    </v-col>

                    <v-col id="activityNumber" cols="3" class="pt-2 px-2">
                      <v-text-field 
                        counter 
                        maxlength="4" 
                        :label="$t('number')" 
                        color="primary" 
                        v-model="activity.number"
                        :rules="[rules.required]">
                      </v-text-field>
                    </v-col>
                  </v-row>
                </v-col>

                <v-col cols="3" class="pa-4">
                  <v-btn 
                    icon 
                    class="ma-1" 
                    color="primary" 
                    v-on:click="saveActivity(activity)">
                    <v-icon>mdi-content-save-all</v-icon>
                  </v-btn>
                  <v-btn 
                    icon 
                    class="ma-1" 
                    color="error" 
                    v-on:click="closeActivityEdit(activity)">
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

  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import AddButton from '../components/AddButton.vue'
import { toRaw } from 'vue'

export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation,
    ConfirmDialog,
    AddButton
  },
  emits: ['view'],
  data() {
    return {
      activities: [],
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
     * Get all activities from IndexedDb
     */
    async updateActivities() {
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities');
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

    /* getCookie(name) {
      var value = {
        name: name // the request must have this format to search the cookie.
      };
      ses.cookies.get(value, function (error, cookies) {
        console.console.log(cookies[0].value); // the value saved on the cookie
      });
    }, */

    /**
     * Closes the activity edit mask and removes 
     * an activy if it wasn't saved to IndexedDB
     * @param {ProxyObject} activity 
     */
    closeActivityEdit(activity) {
      // if the activity has not been saved, discard it
      if (activity.id == undefined) {
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
          id: String(Date.now()),
          activityNumber: rawActivity.branchOffice
            + " " + rawActivity.year
            + "/" + rawActivity.number,
          branchOffice: rawActivity.branchOffice,
          year: rawActivity.year,
          number: rawActivity.number,
          places: [],
          lastChanged: Date.now(),
          lastSync: '',
        }

        // Edit existing data
        if (Object.prototype.hasOwnProperty.call(rawActivity, "id")) {
          newActivity.id = rawActivity.id;
          await fromOfflineDB.updateObject(newActivity, 'Activities', 'activities');

        } else {
          // Add new data to store 
          var activityID = await fromOfflineDB.addObject(newActivity, 'Activities', 'activities');
          await fromOfflineDB.addObject({ id: activityID, object: 'activities' }, 'Changes', 'created');
        }
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
      this.activities.splice(activityIndex);
      await fromOfflineDB.deleteCascade(activity.id, 'activity', 'Activities', 'activities');
    },

  }
}
</script>
  
<style scoped>
#test {
  text-align: center;
}
</style>
  