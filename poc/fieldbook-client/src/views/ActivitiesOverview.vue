<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list class="overflow-hidden">
        <v-list-item class="mt-5" v-if="current_activity.id !== undefined"
          v-on:click="modifyActivity(current_activity.id)">
          <v-chip>
            Derzeit ausgewählt
          </v-chip>
          <v-list-item-title> {{ current_activity.id }} </v-list-item-title>
          <v-list-item-subtitle> {{ current_activity.description }} </v-list-item-subtitle>
          <v-chip variant="elevated">
            Derzeit ausgewählt
          </v-chip>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-subheader v-if="activities.length === 0"> Bisher wurden keine Aktivitäten angelegt</v-list-subheader>
        <template v-for="(activity, i) in activities" :key="activity">
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
                    <v-btn class="ma-1" icon color="purple" v-on:click="modifyActivity(activity)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-dialog v-model="dialog" persistent width="auto">
                      <template v-slot:activator="{ props }">
                        <v-btn icon color="red" v-bind="props">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <v-card-title class="text-h5">
                          Aktivität löschen?
                        </v-card-title>
                        <v-card-text>Möchten Sie die ausgewählte Aktivität wirklich löschen?</v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn icon color="green-darken-1" variant="text" @click="dialog = false"
                            v-on:click="deleteActivity(activity)">
                            <v-icon>mdi-check-circle</v-icon>
                          </v-btn>
                          <v-btn icon color="red-darken-1" variant="text" @click="dialog = false">
                            <v-icon>mdi-close-circle</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>

                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </div>
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
                        <v-btn class="ma-1" icon color="purple" v-on:click="saveActivity(activity)">
                          <v-icon>mdi-content-save-all</v-icon>
                        </v-btn>
                        <v-btn class="ma-1" icon color="red" v-on:click="clearActivityEditMask(activity)">
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
                    <v-btn class="ma-1" icon color="purple" v-on:click="saveActivity(activity)">
                      <v-icon>mdi-content-save-all</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" icon color="red" v-on:click="clearActivityMask()">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-btn v-on:click="modifyActivity('new')" color="primary" v-if="!showInputMask"> Aktivität hinzufügen </v-btn>
      </v-list>


    </v-form>
  </div>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'

export default {
  name: 'ActivitiesOverview',
  components: {
    Navigation
  },
  methods: {
    //retrieve all activities
    async getActivities() {
      /* Recieve all IDs in store */
      this.activities = await fromOfflineDB.getAllObjects('Activities', 'activities')
    },
    async setActivity(activity_id) {
      if (VueCookies.get('currentActivity') !== activity_id) {
        VueCookies.remove('currentPlace');
        VueCookies.remove('currentPosition');
      }
      VueCookies.set('currentActivity', activity_id)
      this.$router.push({ name: 'PlacesOverview' })
      this.$emit('view', 'Stelle')
    },
    async saveActivity(activity) {
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

      await this.getActivities();
      this.showInputMask = false;
      this.clearActivityMask();
    },
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
    async clearActivityMask() {
      this.showInputMask = false
      this.activity.außenstelle = ""
      this.activity.jahr = ""
      this.activity.nummer = ""
    },
    async clearActivityEditMask(activity) {
      for (let i of this.activities) {
        if (activity.id === i.id) {
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
  