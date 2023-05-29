<template>
  <div id="wrapper">
    <Navigation />
    <v-form>
      <v-list>
        <v-list-item class="mt-5" v-if="current_activity.id !== undefined"
          v-on:click="modifyActivity(current_activity.id)">
          <v-chip>
            Derzeit ausgewählt
          </v-chip>
          <v-list-item-content>
            <v-list-item-title> {{ current_activity.id }} </v-list-item-title>
            <v-list-item-subtitle> {{ current_activity.description }} </v-list-item-subtitle>
          </v-list-item-content>
          <v-chip variant="elevated">
            Derzeit ausgewählt
          </v-chip>
        </v-list-item>
        <v-divider></v-divider>
        <v-subheader v-if="activities.length === 0"> Bisher wurden keine Aktivitäten angelegt</v-subheader>

        <template v-for="(activity, i) in activities">
          <v-list-item v-on:click="setActivity(activity.id)">
            <v-list-item-content v-if="!activity.edit">
              <v-row>
                <v-col cols="12" sm="6" md="7">
                  <v-list-item-title class="ma-4"> {{ activity.activityNumber }} </v-list-item-title>
                </v-col>

                <v-col cols="12" sm="6" md="5">
                  <v-btn class="ma-1" icon color="purple" v-on:click="modifyActivity(activity)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn class="ma-1" icon color="red" v-on:click="deleteActivity(activity)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-content v-else>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[rules.required]" v-model="activity.außenstelle" label="Außenstelle"
                      hide-details="auto" placeholder="Xanten" clearable></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[rules.required]" v-model="activity.jahr" label="Jahr" hide-details="auto"
                      placeholder="2023" clearable counter maxlength="4"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.nummer" label="Nummer"
                      hide-details="auto" placeholder="1337" clearable counter maxlength="4">
                    </v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <v-btn class="ma-5" icon color="purple" v-on:click="saveActivity(activity)">
                      <v-icon>mdi-content-save-all</v-icon>
                    </v-btn>
                    <v-btn class="ma-1" icon color="red" v-on:click="clearActivityEditMask(activity)">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i !== activities.length - 1"></v-divider>

        </template>
      </v-list>

      <v-container v-if="showInputMask">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-text-field :rules="[rules.required]" v-model="activity.außenstelle" label="Außenstelle" hide-details="auto"
              placeholder="Xanten" clearable></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field :rules="[rules.required]" v-model="activity.jahr" label="Jahr" hide-details="auto"
              placeholder="2023" clearable counter maxlength="4"></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field :rules="[rules.required, rules.counter]" v-model="activity.nummer" label="Nummer"
              hide-details="auto" placeholder="1337" clearable counter maxlength="4">
            </v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-btn class="ma-5" icon color="purple" v-on:click="saveActivity(activity)">
              <v-icon>mdi-content-save-all</v-icon>
            </v-btn>
            <v-btn class="ma-1" icon color="red" v-on:click="clearActivityMask()">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-btn v-on:click="modifyActivity('new')" color="primary" v-if="!showInputMask"> Aktivität hinzufügen </v-btn>
    </v-form>
  </div>
</template>
  
<script>
import Navigation from './Navigation.vue'
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
      VueCookies.set('currentActivity', activity_id)
      this.$router.push({ name: 'PlacesOverview'})
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
      fromOfflineDB.deleteObject(activity.id, 'Activities', 'activities')
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
  
<style scoped>
#wrapper {
  height: 100%;
}
</style>
  