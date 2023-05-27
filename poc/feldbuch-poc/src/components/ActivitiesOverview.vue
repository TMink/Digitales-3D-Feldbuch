<template>
    <div id="wrapper">
      <Navigation/>
      <div class="ma-10" v-if="loading === true">
        <v-progress-circular d-flex 
              color="primary" 
              :active="loading"          
              :indeterminate="loading" 
              :size="86"
              :width="8">
          </v-progress-circular>
      </div>    
      <v-form>
        <v-list>
            <v-list-item class="mt-5" v-if="current_activity.id !== undefined" v-on:click="modifyActivity(current_activity.id)">
                    <v-chip>
                      Derzeit ausgewählt
                    </v-chip>      
                    <v-list-item-content>
                        <v-list-item-title> {{ current_activity.title }} </v-list-item-title>
                        <v-list-item-subtitle>  {{ current_activity.description }} </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-chip variant="elevated">
                      Derzeit ausgewählt
                    </v-chip>
              </v-list-item>
        <v-divider></v-divider>
        <v-subheader v-if="activities.length === 0 && loading===false"> Bisher wurde kein Aktivität angelegt</v-subheader>
          <template v-for="(activity, i) in activities">
            <v-list-item v-on:click="modifyActivity(activity.id)">
              <v-list-item-content>
                <v-list-item-title> {{ activity.title }} </v-list-item-title>
                <v-list-item-subtitle> {{ activity.description }} </v-list-item-subtitle>
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
              label="Außenstelle" 
              hide-details="auto" 
              placeholder="Xanten" 
              clearable></v-text-field>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-text-field 
              :rules="[rules.required]" 
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
              v-on:click="saveActivity()">
                <v-icon>mdi-content-save-all</v-icon>
              </v-btn>
              <v-btn class="ma-5" 
              icon 
              color="red" 
              v-on:click="deleteActivity()">
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
      sendMessage () {

      },
      //retrieve all activities
      async getActivities() {
        var context = this;

        /* Recieve all IDs in store */
        const contentIDs = await fromOfflineDB.getIDs('Activities', 'activities');

        if( contentIDs.length > 0) {
          for( let item of contentIDs ) {
            //if the activity id is saved in cookies => mark is as current activity
            if( VueCookies.get('currentActivity') === item){
              context.current_activity = item;
            } else {
              context.activities.push(item);
            }
          }
          //hide the loading circle
          context.loading = false;
        }
      },
      async modifyActivity(item_id) {
        if (item_id !== 'new') {
          VueCookies.set('currentActivity', item_id)
        }

        /* DEBUGGING: Delete all Objects in store */
        await fromOfflineDB.deleteAllObjects('Activities', 'activities');

        /* Create new activity data */
        const newActivity = {
          id: item_id,
          content: "Success!"
        }

        /* Add new data to store */
        await fromOfflineDB.addObject(newActivity, 'Activities', 'activities')
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
        loading: true,
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
  