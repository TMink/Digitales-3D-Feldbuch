<template>
    <div id="wrapper">
      <Navigation/>
      <v-form>
        <v-list>
            <v-list-item class="mt-5" v-if="current_activity.id !== undefined" v-on:click="modifyActivity(current_activity.id)">
                    <v-chip>
                      Derzeit ausgewählt
                    </v-chip>      
                    <v-list-item-content>
                        <v-list-item-title> {{ current_activity.id }} </v-list-item-title>
                        <v-list-item-subtitle>  {{ current_activity.description }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-chip variant="elevated">
                      Derzeit ausgewählt
                    </v-chip>
              </v-list-item>
        <v-divider></v-divider>
        <v-subheader v-if="activities.length === 0"> Bisher wurde keine Aktivitäten angelegt</v-subheader>
          <template v-for="(activity, i) in activities">
            <v-list-item v-on:click="modifyActivity(activity.id)">
              <v-list-item-content>
                <v-row>
                  <v-col cols="12" sm="6" md="7">
                    <v-list-item-title class="ma-4"> {{ activity.id }} </v-list-item-title>
                  </v-col>
                  
                  <v-col cols="12" sm="6" md="5">
                    <v-btn class="ma-1" 
                    icon 
                    color="purple" 
                    v-on:click="modifyActivity(activity)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>

                  <v-btn class="ma-1" 
                  icon 
                  color="red" 
                  v-on:click="deleteActivity(activity)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-col>
            </v-row>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="i !== activities.length - 1"></v-divider>
          </template>
        </v-list>
        <v-btn v-on:click="modifyActivity('new')" color="primary"> Aktivität hinzufügen </v-btn>
      </v-form>
      
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-text-field :rules="[rules.required]"
              v-model="activity.außenstelle"
              label="Außenstelle" 
              hide-details="auto" 
              placeholder="Xanten" 
              clearable></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field 
              :rules="[rules.required]"
              v-model="activity.jahr"
              label="Jahr" 
              hide-details="auto" 
              placeholder="2023" 
              clearable 
              counter 
              maxlength="4"></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="6" md="3">
              <v-text-field 
              :rules="[rules.required, rules.counter]"
              v-model="activity.nummer"
              label="Nummer" 
              hide-details="auto" 
              placeholder="1337" 
              clearable 
              counter 
              maxlength="4">
            </v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-btn class="ma-5" 
              icon 
              color="purple" 
              v-on:click="saveActivity(activity)">
                <v-icon>mdi-content-save-all</v-icon>
              </v-btn>
              <v-btn class="ma-1" 
              icon 
              color="red" 
              v-on:click="deleteActivity(activity)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-col>
            
          </v-row>
        </v-container>
      </v-form>

    </div>
  </template>
  
  <script>
  import Navigation from './Navigation.vue'
  import VueCookies from 'vue-cookies'
  import {fromOfflineDB} from '../ConnectionToOfflineDB.js'
  
  export default {
    name: 'ActivitiesOverview',
    components: {
      Navigation
    },
    methods: {
      //retrieve all activities
      async getActivities() {
        var context = this;

        /* Recieve all IDs in store */
        context.activities = await fromOfflineDB.getAllObjects('Activities', 'activities')
      },
      async saveActivity(activity) {

        const newActivity = {
          id:           activity.außenstelle + " " + activity.jahr + "/"+
                        activity.nummer,
          außenstelle:  activity.außenstelle,
          jahr:         activity.jahr,
          nummer:       activity.nummer
        }

        /* Add new data to store */
        await fromOfflineDB.addObject(newActivity, 'Activities', 'activities')

        await this.getActivities();
      },
      async deleteActivity(activity) {
        console.log(activity)
        fromOfflineDB.deleteObject(activity.id, 'Activities', 'activities')
        await this.getActivities();
      }
    },
    async created() {
      await fromOfflineDB.syncLocalDBs();
      await this.getActivities();
    },
    data() {
      return {
        activities: [],
        current_activity:{},
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
  