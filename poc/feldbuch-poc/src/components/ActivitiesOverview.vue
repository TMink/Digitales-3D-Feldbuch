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
    </div>
  </template>
  
  <script>
  import Navigation from './Navigation.vue'
  import axios from 'axios'
  import VueCookies from 'vue-cookies'
  
  export default {
    name: 'ActivitiesOverview',
    components: {
      Navigation
    },
    methods: {
      //retrieve all activities
      getActivities() {
        var context = this;
  
        axios({
          method: 'get',
          url: '/activities',
          responseType: 'json'
        })
        .then(function (response) {
          for (let item of response.data) {
            //if the activity id is saved in cookies => mark is as current activity
            if( VueCookies.get('currentActivity') === item.id){
              context.current_activity = item;
            } else {
              context.activities.push(item);
            }
          }
          //hide the loading circle
          context.loading = false;
        })
        .catch(error => {
          if (!error.response) {
            this.errorStatus = 'Error: Network Error';
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
      },
      modifyActivity(item_id) {
        if (item_id !== 'new') {
          VueCookies.set('currentActivity', item_id)
        }
        this.$router.push({ name: 'ActivityCreation', params: { activity_id: item_id } })
      }
    },
    created() {
      this.getActivities();
    },
    data() {
      return {
        activities: [],
        current_activity:{},
        loading: true
      };
    }
  }
  </script>
  
  <style scoped>
  
    #wrapper {
      height: 100%;
    }
  </style>
  