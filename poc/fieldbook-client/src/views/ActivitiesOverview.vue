<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list class="overflow-hidden">
        <v-list-subheader v-if="activities.length === 0"> Bisher wurden keine Aktivitäten angelegt</v-list-subheader>

        <!--Lists all locally saved activities-->
        <template v-for="(activity, i) in activities" :key="activity">
          <!--Boolean 'activity.edit' decides whether an element is displayed in list form or in edit form-->
          <div v-if="!activity.edit">
            <v-row>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="8">
                    <v-sheet class="pa-2 ma-2">
                      <v-list-item v-on:click="setActivity(activity.id)">
                        <v-list-item-title class="ma-4"> {{ activity.activityNumber }} </v-list-item-title>
                      </v-list-item>
                    </v-sheet>
                  </v-col>
                  <v-col cols="2" class="pa-4">
                    <v-btn class="ma-1" icon color="edit" v-on:click="modifyActivity(activity)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon color="decline" v-on:click="confirmDeletion(activity)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>

          <!--This is where the edit mask will be triggered-->
          <div v-if="activity.edit">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-row no-gutters>
                    <v-col cols="3">
                      <v-sheet class="pa-2 ma-2">
                        <v-text-field :rules="[rules.required]" v-model="activity.branchOffice" label="Außenstelle"
                          hide-details="auto" placeholder="Xanten" clearable></v-text-field>
                      </v-sheet>
                    </v-col>

                    <v-col cols="3">
                      <v-sheet class="pa-2 ma-2">
                        <v-text-field :rules="[rules.required]" v-model="activity.year" label="Jahr" hide-details="auto"
                          placeholder="2023" clearable counter maxlength="4"></v-text-field>
                      </v-sheet>
                    </v-col>

                    <v-col cols="3">
                      <v-sheet class="pa-2 ma-2">
                        <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.number" label="Nummer"
                          hide-details="auto" placeholder="1337" clearable counter maxlength="4">
                        </v-text-field>
                      </v-sheet>
                    </v-col>

                    <v-col cols="2">
                      <v-sheet class="pa-1 ma-2">
                        <v-btn class="ma-1" icon color="edit" v-on:click="saveActivity(activity)">
                          <v-icon>mdi-content-save-all</v-icon>
                        </v-btn>
                        <v-btn class="ma-1" icon color="decline" v-on:click="clearActivityEditMask(activity)">
                          <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                      </v-sheet>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <v-divider v-if="i !== activities.length - 1"></v-divider>
        </template>
        <ConfirmDialog ref="confirm" />

        <!--This is where the input mask for new activities will be triggered-->
        <v-container v-if="showInputMask">
          <v-row>
            <v-col cols="12">
              <v-row no-gutters>
                <v-col cols="3">
                  <v-sheet class="pa-2 ma-2">
                    <v-text-field :rules="[rules.required]" v-model="activity.branchOffice" label="Außenstelle"
                      hide-details="auto" placeholder="Xanten" clearable></v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="3">
                  <v-sheet class="pa-2 ma-2">
                    <v-text-field :rules="[rules.required]" v-model="activity.year" label="Jahr" hide-details="auto"
                      placeholder="2023" clearable counter maxlength="4"></v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="3">
                  <v-sheet class="pa-2 ma-2">
                    <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.number" label="Nummer"
                      hide-details="auto" placeholder="1337" clearable counter maxlength="4">
                    </v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="2">
                  <v-sheet class="pa-1 ma-2">
                    <v-btn class="ma-1" icon color="edit" v-on:click="saveActivity(activity)">
                      <v-icon>mdi-content-save-all</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" icon color="decline" v-on:click="clearActivityMask()">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-btn v-on:click="modifyActivity('new')" color="add" v-if="!showInputMask">
          <v-icon>mdi-plus-box-multiple</v-icon> </v-btn>
      </v-list>
    </v-form>
  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'

export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation,
    ConfirmDialog
  },
  data() {
    return {
      activities: [],
      current_activity: {},
      showInputMask: false,
      dialog: false,
      del_overlay: false,
      activity: {
        branchOffice: null,
        year: null,
        number: null,
        places: [],
        lastChanged: null,
        lastSync: null
      },
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
      }
    };
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.getActivities();
  },
  methods: {
    /**
     * Get all activities from IndexedDb
     */
    async getActivities() {
      /* Recieve all IDs in store */
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities')
    },
    /**
     * Sets the currently selected activity into the cookies
     * @param {String} activityID 
     */
    async setActivity(activityID) {
      if (VueCookies.get('currentActivity') !== activityID) {
        VueCookies.remove('currentPlace');
        VueCookies.remove('currentPosition');
      }
      VueCookies.set('currentActivity', activityID)
      this.$router.push({ name: 'PlacesOverview' })
      this.$emit('view', 'Stelle')
    },
    /**
     * Saves/updates an `activity` in the IndexedDB if the 
     * activity mask is filled out correctly
     * @param {*} proxyActivity 
     */
    async saveActivity(proxyActivity) {

      const activity = JSON.parse(JSON.stringify(proxyActivity));
      //TODO: use form.validate() instead of != null 
      if (activity.branchOffice != null 
        && activity.year != null 
        && activity.number != null) {

        const newActivity = {
          id: String(Date.now()),
          activityNumber: activity.branchOffice 
                          + " " + activity.year 
                          + "/" + activity.number,
          branchOffice: activity.branchOffice,
          year: activity.year,
          number: activity.number,
          places: [],
          lastChanged: Date.now(),
          lastSync: activity.lastSync
        }
        
        // Edit existing data
        if (Object.prototype.hasOwnProperty.call(activity, "id")) {
          newActivity.id = activity.id;
          await fromOfflineDB.updateObject(newActivity, 'Activities', 'activities');

        } else {
        // Add new data to store 
          var activityID = await fromOfflineDB.addObject(newActivity, 'Activities', 'activities');

          await fromOfflineDB.addObject({id: activityID, object: 'activities'}, 'Changes', 'created');
        }

        this.clearActivityMask();
      }

      await this.getActivities();
      this.showInputMask = false;
    },
    /**
     * Opens the confirmation dialog for deletion
     * @param {*} activity 
     */
    async confirmDeletion(activity) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete the activity " 
          + activity.activityNumber + "?"
        )
      ) {
        this.deleteActivity(activity);
      }
    },
    /**
     * Removes an activity from IndexedDB and Cookies
     * @param {*} activity 
     */
    async deleteActivity(activity) {
      VueCookies.remove('currentPosition');
      VueCookies.remove('currentPlace');
      VueCookies.remove('currentActivity');

      this.$emit('view', 'Stelle')
      await fromOfflineDB.deleteCascade(activity.id, 'place', 'Places',
        'places');
      await fromOfflineDB.deleteObject(activity, 'Activities', 'activities')
      await this.getActivities();
    },
    /**
     * Decides wether to show the input mask for a new `activity` 
     * or the edit mask for an existing one
     * @param {*} activity 
     */
    async modifyActivity(activity) {
      if (activity === 'new') {
        this.showInputMask = true
      }
      else {
        for (let i of this.activities) {
          if (activity.id === i.id) {
            i.edit = true
          }
        }
      }
    },
    /**
     * Resets the activity masks default values to 'null' and hides it
     */
    async clearActivityMask() {
      this.showInputMask = false
      this.activity.branchOffice = null
      this.activity.year = null
      this.activity.number = null
    },
    /**
     * Resets the edit mask for activities to the stored values 
     * from IndexedDb and hides it
     * @param {*} activity 
     */
    async clearActivityEditMask(activity) {
      for (let i of this.activities) {
        if (activity.id === i.id) {
          activity.branchOffice = i.branchOffice
          activity.year = i.year
          activity.number = i.number
          activity.edit = false
        }
      }
    }
  }
}
</script>
  
<style scoped></style>
  