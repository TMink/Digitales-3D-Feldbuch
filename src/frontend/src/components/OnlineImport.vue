<!--
 * Created Date: 11.01.2024 11:48:37
 * Author: Julian Hardtung
 * 
 * Last Modified: 06.02.2024 14:08:50
 * Modified By: Julian Hardtung
 * 
 * Description: Selection to download online available data of activities.
                You can select activities, for which you want to download all data.
 -->

<template>
  <v-row v-if="this.userStore.authenticated" no-gutters class="pt-4 justify-center">

    <v-btn link v-on:click="downloadDialog = true; getOnlineActivities()">
         {{ $t('downloadOnlineData') }}
    </v-btn>
  </v-row>
  <!-- BACKUP DIALOG -->
  <v-dialog :width="windowWidth * 0.6" v-model="downloadDialog">
    <v-card class="pa-2">
      <v-card-title> {{ $t('downloadOnlineData') }} </v-card-title>

      <v-card-text>
        {{ $t('downloadOnlineDataInfo') }}
      </v-card-text>
         
      <v-checkbox hide-details
        v-for="(activity, i) in activities" 
        :key="activity"
        multiple
        v-model="selected"
        :value="activity"
        :label=activity.activityNumber>
      </v-checkbox>

      <v-row no-gutters>
          <v-spacer/>
          <v-btn 
            color="primary"
            class="mr-2"
            v-on:click="downloadCheckedActivities()">
            <v-icon>mdi-content-save-all</v-icon>
          </v-btn>
      
          <v-btn 
            color="error" 
            v-on:click="downloadDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>
    </v-card>
    <v-spacer></v-spacer>
  </v-dialog>
</template>
  
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { toRaw } from 'vue';
import { useWindowSize } from 'vue-window-size';
import { fromBackend } from '../ConnectionToBackend';
import { useUserStore } from '../Authentication.js';

export default {
  name: 'DataBackup',
  setup() {
    const { width, height } = useWindowSize();
    const userStore = useUserStore();
    return {
      windowWidth: width,
      windowHeight: height,
      userStore
    };
  },
  data() {
    return {
      downloadDialog: false,
      importedData: '',
      activities: [],
      isLoading: false,
      isActive: [],
      selected: []
    };
  },
  methods: {
    /**
     * Retrieves all activities of the logged in user from backend 
     */
    async getOnlineActivities() {
      this.activities = await fromBackend.getData("activities/user/" + this.userStore.user._id);
      
      this.activities.forEach(async (activity) => {
        fromOfflineDB.addObject(toRaw(activity), 'Activities', 'activities');
      });

    },

    /**
     * Downloads all dependent data of the previously checked Activities
     */
    async downloadCheckedActivities() {
      for (var i=0; i<this.selected.length; i++) {
        var curActivity = this.selected[i];
        try {
          await this.downloadAllObjectsFromArray(curActivity.places, 'Places');
        } catch (error) {
          console.error(error)
        }
      }
      console.log("DOWNLOADED ALL CHECKED DATA")
    },

    /**
     * Recursively downloads all dependent data of an ID array from the backend 
     * and adds it to the IndexedDB
     * @param {Array} objects 
     * @param {String} type 
     */
    async downloadAllObjectsFromArray(objects, type) {
      return new Promise(async (resolve, reject) => {

        for (var i = 0; i < objects.length; i++) {
          var curObjectID = objects[i];

          // download object
          try {
            var tmpObject = await fromBackend.getData(type.toLowerCase() +"/" + curObjectID);
          } catch (error) {
            console.error(error)
          }
          
          // add object to IndexedDB
          try {
            await fromOfflineDB.addObject(tmpObject, type, type.toLowerCase());
          } catch (error) {
            console.error(error)
          }

          
          // check which object it is and download dependent data
          if (type == 'places') {
            try {
              await downloadAllObjectsFromArray(tmpObject.positions, 'Positions');
            } catch (error) {
              console.error(error)
            }
            try {
              await downloadAllObjectsFromArray(tmpObject.models, 'Models');
            } catch (error) {
              console.error(error)
            }

          } else if (type == 'positions') {
            try {
              await downloadAllObjectsFromArray(tmpObject.images, 'Images');
            } catch (error) {
              console.error(error)
            }

            try {
              await downloadAllObjectsFromArray(tmpObject.models, 'Models');
            } catch (error) {
              console.error(error)
            }
          }
        }
        resolve();
      });
    },
  }
}
</script>
  
<style></style>