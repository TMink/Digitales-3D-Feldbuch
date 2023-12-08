<!--
 * Created Date: 07.06.2023 17:36:09
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:50:53
 * Modified By: Julian Hardtung
 * 
 * Description: `DEPRECATED AND BROKEN`synchronizes local data with online data
 -->

<template>
    <Navigation />
    <v-row class="justify-center">
      <v-btn 
        class="ma-5 mt-8 mb-4" 
        color="primary" 
        v-on:click="syncSelectedChanges(selectedChanges)">
        Synchronize all Changes
      </v-btn>
    </v-row>
    <v-row class="d-flex justify-center h-75">
        <v-card class="sync-card">
            <v-card-title>
                Client
            </v-card-title>
            <v-divider></v-divider>
            <v-list>

                <!-- List of updated activities -->
                <v-list-item v-for="change in updatedActivities" :key="change">
                    <v-card class="d-flex align-center justify-end">
                        <v-checkbox 
                            v-model="selectedChanges" 
                            :value="change" 
                            hide-details="true">
                        </v-checkbox>
                        <v-card-title class="justify-center">
                            {{ change.activityNumber }}
                        </v-card-title>
                        <div id="chips-container">
                            <v-chip class="get">Activity</v-chip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn class="ml-4" v-on:click="syncChange(change)">
                            <v-icon>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </v-card>
                    <v-divider></v-divider>
                </v-list-item>

                <!-- List of updated places -->
                <v-list-item v-for="change in updatedPlaces" :key="change">
                    <v-card class="d-flex align-center justify-end">
                        <v-checkbox 
                            v-model="selectedChanges" 
                            :value="change" 
                            hide-details="true">
                        </v-checkbox>
                        <v-card-title class="justify-center">
                            {{ change.placeNumber }}
                        </v-card-title>

                        <div id="chips-container">
                            <v-chip class="get">Place</v-chip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn class="ml-4" v-on:click="syncChange(change)">
                            <v-icon>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </v-card>
                    <v-divider></v-divider>
                </v-list-item>

                <!-- List of updated positions -->
                <v-list-item v-for="change in updatedPositions" :key="change">
                    <v-card class="d-flex align-center justify-end">
                        <v-checkbox 
                            v-model="selectedChanges" 
                            :value="change" 
                            hide-details="true">
                        </v-checkbox>
                        <v-card-title class="justify-center">
                            {{ change.positionNumber }}
                        </v-card-title>

                        <div id="chips-container">
                            <v-chip class="get">Position</v-chip>
                        </div>
                        <v-spacer></v-spacer>
                        <v-btn class="ml-4" v-on:click="syncChange(change)">
                            <v-icon>mdi-cloud-upload</v-icon>
                        </v-btn>
                    </v-card>
                    <v-divider></v-divider>
                </v-list-item>

                <!-- List of updated models -->
                    <v-list-item v-for="change in updatedModels" :key="change">
                        <v-card class="d-flex align-center justify-end">
                            <v-checkbox 
                                v-model="selectedChanges" 
                                :value="change" 
                                hide-details="true">
                            </v-checkbox>
                            <v-card-title class="justify-center">
                                {{ change.title }}
                            </v-card-title>

                            <div id="chips-container">
                                <v-chip class="get">Model</v-chip>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn class="ml-4" v-on:click="syncChange(change)">
                                <v-icon>mdi-cloud-upload</v-icon>
                            </v-btn>
                        </v-card>
                        <v-divider></v-divider>
                    </v-list-item>
                
                <!-- List of updated images -->
                        <v-list-item v-for="change in updatedImages" :key="change">
                            <v-card class="d-flex align-center justify-end">
                                <v-checkbox 
                                    v-model="selectedChanges" 
                                    :value="change" 
                                    hide-details="true">
                                </v-checkbox>
                                <v-card-title class="justify-center">
                                    {{ change.imageNumber }}
                                </v-card-title>

                                <div id="chips-container">
                                    <v-chip class="get">Image</v-chip>
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn class="ml-4" v-on:click="syncChange(change)">
                                    <v-icon>mdi-cloud-upload</v-icon>
                                </v-btn>
                            </v-card>
                            <v-divider></v-divider>
                        </v-list-item>

                <v-divider></v-divider>

                <v-card-title>Deletions</v-card-title>
                <v-list-item v-for="change in deletedObjects" :key="change">
                    <v-card class="d-flex align-center justify-end">
                        <v-checkbox 
                            v-model="selectedChanges" 
                            :value="change" 
                            hide-details="true">
                        </v-checkbox>
                        <v-card-title class="justify-center">
                            {{ change.id }}
                        </v-card-title>

                        <div id="chips-container">
                            <v-chip class="delete">{{ change.object.slice(0, -1) }}</v-chip>
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
                TODO
            </v-list>
        </v-card>
    </v-row>
</template>
  
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { fromBackend } from '../ConnectionToBackend.js'
import { toRaw } from 'vue'

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
            updatedActivities: [],
            updatedPlaces: [],
            updatedPositions: [],
            updatedModels: [],
            updatedImages: [],
            deletedObjects: [],
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
            dialog: false
        };
    },
    async created() {
        await fromOfflineDB.syncLocalDBs();
        await this.getLocalStorageChanges();
    },
    methods: {
        /**
         * Get all Changes to IndexedDB and store them in the Vue ProxyVariables
         */
        async getLocalStorageChanges() {
            
            this.updatedActivities = 
                await fromOfflineDB.getAllUpdatedObjects('Activities', 'activities');
            this.updatedPlaces =
                await fromOfflineDB.getAllUpdatedObjects('Places', 'places');
            this.updatedPositions =
                await fromOfflineDB.getAllUpdatedObjects('Positions', 'positions');
            this.updatedModels =
                await fromOfflineDB.getAllUpdatedObjects('Models', 'places');
            this.updatedModels.concat(
                await fromOfflineDB.getAllUpdatedObjects('Models', 'positions'));
            this.updatedImages =
                await fromOfflineDB.getAllUpdatedObjects('Images', 'images');

            this.deletedObjects =
                await fromOfflineDB.getAllUpdatedObjects('Changes', 'deleted')
        },
        /**
         * Synchronize a singular local change with the online DB
         * @param {*} proxyChange 
         */
        async syncChange(proxyChange) {
            //TODO: OPTIMIZE the whole synchronizatzion process

            // convert from vue proxy to JSON object
            const change = toRaw(proxyChange);

            // get request type of the change (post, put, delete)
            var request = await this.getRequestType(proxyChange);
            
            // get subdomain through which this change is uploaded
            var subdomain = this.getSubdomainFromChange(proxyChange);
            
            // upload changed data to onlineDB
            var res;
            if (subdomain == 'images' || subdomain == 'models') {
                res = await fromBackend.uploadFormData(change, request, subdomain);
            } else {
                res = await fromBackend.uploadData(change, request, subdomain);
            }
            

            if (res.status == 200) {
                // delete the change Entry from indexedDB 
                await this.deleteChangeEntry(change);
            }

            await this.updateLastSyncTime(proxyChange, subdomain);
            
            this.$root.vtoast.show({ message: 'Successfully synchronized with Database!' })
        },
        /**
         * Synchronize all selected changes with the onlineDB
         * @param {*} selChanges 
         */
        async syncSelectedChanges(selChanges) {
            //add together all changes
            var allChanges = this.updatedActivities
                            .concat(this.updatedPlaces)
                            .concat(this.updatedPositions)
                            .concat(this.updatedModels)
                            .concat(this.updatedImages)
                            .concat(this.updatedTexts);

            //upload all changes
            allChanges.forEach(change => {
                this.syncChange(change);
            });

            //show success message
            this.$root.vtoast.show({ message: 'Successfully synchronized with Database!' })
        },
        /**
         * Updates `lastSync`- the time when the change was 
         * last synchronized with the onlineDB.
         * 
         * Also removes the updated object from the proxyList 
         * of all updatedChanges that haven't been uploaded yet
         * 
         * TODO: split both subfunctionalities in separate functions
         * @param {*} proxyChange 
         * @param {String} subdomain 
         */
        async updateLastSyncTime(proxyChange, subdomain) {
            const change = JSON.parse(JSON.stringify(proxyChange));

            // update the `lastSync` times for the uploaded change
            change.lastSync = Date.now();

            //TODO: find a better way of differentiating, which object type the 'change' is
            if (proxyChange.object == undefined) {
                if (subdomain == 'activities') {

                    await fromOfflineDB.updateObject(change, 'Activities', 'activities');
                    let index = this.updatedActivities.indexOf(proxyChange);
                    this.updatedActivities.splice(index, 1);

                } else if (subdomain == 'places') {

                    await fromOfflineDB.updateObject(change, 'Places', 'places');
                    let index = this.updatedPlaces.indexOf(proxyChange);
                    this.updatedPlaces.splice(index, 1);

                } else if (subdomain == 'positions') {

                    await fromOfflineDB.updateObject(change, 'Positions', 'positions');
                    let index = this.updatedPositions.indexOf(proxyChange);
                    this.updatedPositions.splice(index, 1);

                } else if (subdomain == 'models') {
                    if (proxyChange.placeID != undefined) {

                        await fromOfflineDB.updateObject(change, 'Models', 'places');
                        let index = this.updatedModels.indexOf(proxyChange);
                        this.updatedModels.splice(index, 1);

                    } else if (proxyChange.positionsID != undefined) {

                        await fromOfflineDB.updateObject(change, 'Models', 'positions');
                        let index = this.updatedModels.indexOf(proxyChange);
                        this.updatedModels.splice(index, 1);
                    }
                } else if (subdomain == 'images') {

                    await fromOfflineDB.updateObject(change, 'Images', 'images');
                    let index = this.updatedImages.indexOf(proxyChange);
                    this.updatedImages.splice(index, 1);

                } else if (subdomain == 'tests') {

                    await fromOfflineDB.updateObject(change, 'Tests', 'tests');
                    let index = this.updatedTexts.indexOf(proxyChange);
                    this.updatedTexts.splice(index, 1);

                }
            } else {
                let index = this.deletedObjects.indexOf(proxyChange);
                this.deletedObjects.splice(index, 1);
            }
        },
        /**
         * Returns the required subdomain for uploading the `change`
         * @param {*} change 
         */
        getSubdomainFromChange(change) {
            var subdomain = change.object;

            if (change.branchOffice != undefined) {
                subdomain = 'activities'
            } else if (change.placeNumber != undefined) {
                subdomain = 'places'
            } else if (change.positionNumber != undefined) {
                subdomain = 'positions'
            } else if (change.modelNumber != undefined) {
                subdomain = 'models'
            } else if (change.imageNumber != undefined) {
                subdomain = 'images'
            }
            return subdomain;
        },
        /**
         * Deletes an entry in the IndexedDB `'Changes'` 
         * for either `'created'` or `'deleted'` Objects
         * @param {*} change 
         */
        async deleteChangeEntry(change) {
            //check if it is an object that was just created
            // -> then we need to `post` it to backend
            var changeCreated = await fromOfflineDB.getObject(change.id, 'Changes', 'created')
            var changeDeleted = await fromOfflineDB.getObject(change.id, 'Changes', 'deleted')

            if (changeCreated != undefined) {
                fromOfflineDB.deleteObject(change, 'Changes', 'created');
            } else if (changeDeleted != undefined) {
                fromOfflineDB.deleteObject(change, 'Changes', 'deleted');
            }
        },
        /**
         * Get REST request type for uploading the `inputChange`
         * @param {*} inputChange 
         */
        async getRequestType(inputChange) {
            var request = 'put';
            var changeCreated = await fromOfflineDB.getObject(inputChange.id, 'Changes', 'created')
            var changeDeleted = await fromOfflineDB.getObject(inputChange.id, 'Changes', 'deleted')

            if (changeCreated != undefined) {
                request = 'post';
            } else if (changeDeleted != undefined) {
                request = 'delete';
            }

            return request;
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
  background: #4c9b46;
}
#chips-container .v-chip.put {
  background: #ee9830;
}
#chips-container .v-chip.delete {
  background: #f83e70;
}
</style>
  