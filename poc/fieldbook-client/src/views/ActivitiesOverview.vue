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
                        <v-text-field :rules="[rules.required]" v-model="activity.außenstelle" label="Außenstelle"
                          hide-details="auto" placeholder="Xanten" clearable></v-text-field>
                      </v-sheet>
                    </v-col>

                    <v-col cols="3">
                      <v-sheet class="pa-2 ma-2">
                        <v-text-field :rules="[rules.required]" v-model="activity.jahr" label="Jahr" hide-details="auto"
                          placeholder="2023" clearable counter maxlength="4"></v-text-field>
                      </v-sheet>
                    </v-col>

                    <v-col cols="3">
                      <v-sheet class="pa-2 ma-2">
                        <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.nummer" label="Nummer"
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
                    <v-text-field :rules="[rules.required]" v-model="activity.außenstelle" label="Außenstelle"
                      hide-details="auto" placeholder="Xanten" clearable></v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="3">
                  <v-sheet class="pa-2 ma-2">
                    <v-text-field :rules="[rules.required]" v-model="activity.jahr" label="Jahr" hide-details="auto"
                      placeholder="2023" clearable counter maxlength="4"></v-text-field>
                  </v-sheet>
                </v-col>

                <v-col cols="3">
                  <v-sheet class="pa-2 ma-2">
                    <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.nummer" label="Nummer"
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
  methods: {
    //retrieve all activities
    async getActivities() {
      /* Recieve all IDs in store */
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities')
    },
    //sets the currently selected activity into the cookies
    async setActivity(activityID) {
      if (VueCookies.get('currentActivity') !== activityID) {
        VueCookies.remove('currentPlace');
        VueCookies.remove('currentPosition');
      }
      VueCookies.set('currentActivity', activityID)
      this.$router.push({ name: 'PlacesOverview' })
      this.$emit('view', 'Stelle')
    },
    //saves/updates an activity in the local storage if the activity mask is filled out correctly
    async saveActivity(activity) {
      if (activity.außenstelle != null && activity.jahr != null && activity.nummer != null) {
        for (let i of this.activities) {
          if (activity.id === i.id) {
            this.deleteActivity(activity)
          }
        }

        const newActivity = {
          id: String(Date.now()),
          activityNumber: activity.außenstelle + " " + activity.jahr + "/" + activity.nummer,
          außenstelle: activity.außenstelle,
          jahr: activity.jahr,
          nummer: activity.nummer,
          edit: false
        }

        /* Add new data to store */
        await fromOfflineDB.addObject(newActivity, 'Activities', 'activities')
        this.clearActivityMask();
      }
      await this.getActivities();
      this.showInputMask = false;
    },
    //opens the confirm dialog if needed
    async confirmDeletion(activity) {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete the activity " + activity.activityNumber + "?"
        )
      ) {
        this.deleteActivity(activity);
      }
    },
    //removes an activity from the local storage and the cookies
    async deleteActivity(activity) {
      VueCookies.remove('currentPosition');
      VueCookies.remove('currentPlace');
      VueCookies.remove('currentActivity');
      this.$emit('view', 'Stelle')
      await fromOfflineDB.deleteCascade(activity.id, 'place', 'Places',
        'places');
      await fromOfflineDB.deleteObject(activity.id, 'Activities', 'activities')
      await this.getActivities();
    },
    //decides wether to show the input mask for a new activity or the edit mask for an existing one
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
    //resets the activity masks default values to 'null' and hides it
    async clearActivityMask() {
      this.showInputMask = false
      this.activity.außenstelle = null
      this.activity.jahr = null
      this.activity.nummer = null
    },
    //resets the edit mask for activities to the stored values from the local storage and hides it
    async clearActivityEditMask(activity) {
      for (let i of this.activities) {
        if (activity.id === i.id) {
          console.log(i.außenstelle)
          activity.außenstelle = i.außenstelle
          activity.jahr = i.jahr
          activity.nummer = i.nummer
          activity.edit = false
        }
      }
    }
  },
  async created() {
    await fromOfflineDB.syncLocalDBs();
    await this.getActivities();
  },
  data() {
    return {
      activities: [],
      current_activity: {},
      showInputMask: false,
      dialog: false,
      del_overlay: false,
      activity: {
        außenstelle: null,
        jahr: null,
        nummer: null
      },
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
      }
    };
  }
}
</script>
  
<style scoped></style>
  