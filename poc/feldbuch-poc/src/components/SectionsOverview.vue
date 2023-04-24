<template>
   <div id="wrapper">
        <Navigation/>
        <v-form>
        <v-subheader v-if="cuts.length === 0"> Bisher wurden keine Schnitte angelegt</v-subheader>
          <v-list>
            <template v-for="(cut, i) in cuts">
              <v-list-item v-on:click="modifyCut(cut.id)">
                <v-list-item-content>
                  <v-list-item-title> {{ cut.title }} </v-list-item-title>
                  <v-list-item-subtitle> {{ cut.description }} </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="i !== cuts.length - 1"></v-divider>
            </template>
          </v-list>
          <v-btn v-on:click="modifyCut('new')" color="primary"> Schnitt hinzufügen </v-btn>
        </v-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import VueCookies from 'vue-cookies'
  import Navigation from './Navigation.vue'
  
  export default {
    name: 'CutsOverview',
    components: {
        Navigation
    },
    methods: {
      //retrieve all projects
      getCuts() {
        var context = this;
  
        axios({
          method: 'get',
          url: '/cuts',
          responseType: 'json'
        })
        .then(function (response) {
          for (let item of response.data) {
            context.cuts.push(item);
          }
        })
        .catch(error => {
          if (!error.response) {
            this.errorStatus = 'Error: Network Error';
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
      },
      modifyCut(item_id) {
        if (item_id !== 'new') {
          VueCookies.set('currentCut', item_id)
        }
        this.$router.push({ name: 'CutCreation', params: { project_id: item_id } })
      }
    },
    created() {
      this.getCuts();
    },
    data() {
      return {
        cuts: []
      };
    }
  }
  
  </script>

<style scoped>
#wrapper {
    height: 100%;
}
</style>
  