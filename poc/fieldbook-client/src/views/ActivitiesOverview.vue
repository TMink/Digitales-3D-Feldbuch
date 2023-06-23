<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list class="overflow-hidden">
        <v-list-subheader v-if="activities.length === 0">
          {{ $t('not_created_yet', { object: $tc('activity', 2) }) }}
        </v-list-subheader>

        <!--Lists all locally saved activities-->
        <template v-for="(activity, i) in activities" :key="activity">
          <!--Boolean 'activity.edit' decides whether an element is 
            displayed in list form or in edit form-->
          <v-row no-gutters v-if="!activity.edit" class="px-5">

            <v-col cols="9">
              <v-list-item class="pa-2 ma-2" v-on:click="setActivity(activity.id)">
                <v-list-item-title class="ma-4">
                  {{ activity.activityNumber }}
                </v-list-item-title>
              </v-list-item>
            </v-col>

            <v-col cols="3" class="pa-4">
              <v-btn 
                icon 
                class="ma-1" 
                color="edit" 
                v-on:click="activity.edit = !activity.edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>

              <v-btn 
                icon 
                color="decline" 
                class="ma-1" 
                v-on:click="confirmDeletion(activity)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <!--This is where the edit mask will be triggered-->
          <v-row no-gutters v-if="activity.edit">

            <v-col cols="9">
              <v-row no-gutters class="justify-center">

                <v-col cols="3" class="pt-4 px-2">
                  <v-text-field
                    counter
                    clearable
                    maxlength="20"
                    label="Außenstelle" 
                    :rules="[rules.required]" 
                    v-model="activity.branchOffice">
                  </v-text-field>
                </v-col>

                <v-col cols="2" class="pt-4 px-2">
                  <v-text-field 
                    counter 
                    clearable 
                    label="Jahr" 
                    maxlength="4" 
                    v-model="activity.year" 
                    :rules="[rules.required]">
                  </v-text-field>
                </v-col>

                <v-col cols="2" class="pt-4 px-2">
                  <v-text-field 
                    counter 
                    clearable 
                    maxlength="4" 
                    label="Nummer" 
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
                color="edit" 
                v-on:click="saveActivity(activity)">
                <v-icon>mdi-content-save-all</v-icon>
              </v-btn>
              <v-btn 
                icon 
                class="ma-1" 
                color="decline" 
                v-on:click="closeActivityEdit(activity)">
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-col>

          </v-row>
          <v-divider v-if="i !== activities.length - 1"></v-divider>
        </template>
        <ConfirmDialog ref="confirm" />

        <v-btn v-on:click="addActivity()" color="add">
          <v-icon>mdi-plus-box-multiple</v-icon>
        </v-btn>

      </v-list>
    </v-form>
  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { toRaw } from 'vue'

export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation,
    ConfirmDialog
  },
  data() {
    return {
      activities: [],
      rules: {
        required: value => !!value || 'Required.',
      }
    };
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.updateActivities();
  },
  methods: {
    /**
     * Get all activities from IndexedDb
     */
    async updateActivities() {
      /* Receive all IDs in store */
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
    closeActivityEdit(activity) {
      // if the activity has not been saved, discard it
      if (activity.id == undefined) {
        var index = this.activities.indexOf(activity)
        if (index != -1) {
          this.activities.splice(index, 1);
        }
      }
      activity.edit = !activity.edit
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
        var  newActivityNumber = (activityNumber + 1).toString().padStart(4, '0');
        //newActivityNumber = newActivityNumber.toString().padStart(4, '0'); 
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
     * @param {*} proxyActivity 
     */
    async saveActivity(proxyActivity) {

      const rawActivity = toRaw(proxyActivity);
      //TODO: use form.validate() instead of != null 
      if (rawActivity.branchOffice != null 
        && rawActivity.year != null 
        && rawActivity.number != null) {

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
          lastSync: ''
        }
        
        // Edit existing data
        if (Object.prototype.hasOwnProperty.call(rawActivity, "id")) {
          newActivity.id = rawActivity.id;
          await fromOfflineDB.updateObject(newActivity, 'Activities', 'activities');

        } else {
        // Add new data to store 
          var activityID = await fromOfflineDB.addObject(newActivity, 'Activities', 'activities');

          await fromOfflineDB.addObject({id: activityID, object: 'activities'}, 'Changes', 'created');
        }
      }

      await this.updateActivities();
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

      await fromOfflineDB.deleteCascade(activity.id, 'place', 'Places',
        'places');
      await fromOfflineDB.deleteObject(toRaw(activity), 'Activities', 'activities')
      await this.updateActivities();
    },
  }
}
</script>
  
<style scoped></style>
  