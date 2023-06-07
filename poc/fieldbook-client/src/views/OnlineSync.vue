<template>
    <Navigation/>
    <v-btn class="ma-5" color="primary" v-on:click="syncSelectedChanges(selectedChanges)">Synchronize selected Changes</v-btn>
    <v-row class="d-flex justify-center h-75">
        <v-card class="sync-card">
            <v-card-title>
                Client
            </v-card-title>
            <v-divider></v-divider>
            <v-list>
                <v-list-item
                    v-for="change in localChanges"
                    :key="change">
                    <v-card class="d-flex align-center justify-end">
                        <v-checkbox 
                            v-model="selectedChanges" 
                            :value="change"
                            hide-details="true"></v-checkbox>
                        <v-card-title class="justify-center">
                            {{ change.localDB.charAt(0).toUpperCase() + change.localDB.slice(1) }}
                        </v-card-title>
                        
                        <div id="chips-container">
                            <v-chip :class="change.request">{{ change.request }}</v-chip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn class="ml-4" v-on:click="syncChange(change)">
                            <v-icon>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </v-card>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </v-card>
        

        <v-card class="sync-card">
                <v-card-title>
                    Server
                </v-card-title>
                <v-divider></v-divider>
                <v-list>

                </v-list>
        </v-card>
    </v-row>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import VueCookies from 'vue-cookies'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import axios from 'axios';

export default {
    name: 'OnlineSync',
    components: {
        Navigation
    },
    data() {
        return {
            localChanges: [{
                request: '',
                localDB: '',
                data_id: ''
            }],
            selectedChanges: [],
            requestTypes: [{
                status: 'get'
            }, {
                status: 'post'
            }, {
                status: 'put'
            },{
                status: 'delete'
            }],
            showInputMask: false,
            dialog: false,
        };
    },
    async created() {
        await fromOfflineDB.syncLocalDBs();
        await this.getLocalStorageChanges();
    },
    methods: {
        //retrieve all activities
        async getLocalStorageChanges() {
            /* Recieve all IDs in store */
            /* TODO: create and use localDB Changes where all changes to the localDB are being saved
            for later synchronization with onlineDB
            this.localChanges = await fromOfflineDB.getAllObjects('Changes', 'changes') */

            //dummy data
            this.localChanges = [
                {
                    request: 'get',
                    localDB: 'activity',
                    data_id: '1685981959571'
                },{
                    request: 'post',
                    localDB: 'activity',
                    data_id: '1685982289742'
                },{
                    request: 'put',
                    localDB: 'activity',
                    data_id: 'TESTID'
                },{
                    request: 'delete',
                    localDB: 'activity',
                    data_id: 'TESTID'
                }
            ]
            console.log(this.localChanges)
        },
        /**
         * Get data of a change from local storage
         * @param {*} change 
         */
        async getChangeData(change) {
            var data = await fromOfflineDB.getObject(change.data_id, 'Activities', 'activities');
            return data;
        },
        /**
         * Synchronize a singular local change with the online DB
         * @param {*} change 
         */
        async syncChange(change) {

            var data = await this.getChangeData(change);
            console.log(data.result)
            axios({
                method: change.request,
                url: '/' + change.localDB + '/' + data.result.id,
                data: data.result
            })
            .then(function (res) {
                //TODO: Delete the uploaded change from the Changes localDB
                console.log(res)
            })
            .catch(function (error) {
                console.log(error);
            });
            
        },
        /**
         * Synchronize all selected changes with the onlineDB
         * @param {*} selChanges 
         */
        async syncSelectedChanges(selChanges) {
            console.log(selChanges)

        }
    },
}
</script>
  
<style scoped>

.sync-card {
    width: 45%;
    margin: 5px;
}

#chips-container .v-chip.get {
  background: #46d13c;
}
#chips-container .v-chip.post {
  background: #2cdfff;
}
#chips-container .v-chip.put {
  background: #ee9830;
}
#chips-container .v-chip.delete {
  background: #f83e70;
}
</style>
  