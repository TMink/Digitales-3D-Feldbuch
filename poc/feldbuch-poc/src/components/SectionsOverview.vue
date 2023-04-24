<template>
   <div id="wrapper">
        <Navigation/>
        <v-form>
        <v-subheader v-if="sections.length === 0"> Bisher wurden keine Schnitte angelegt</v-subheader>
          <v-list>
            <template v-for="(section, i) in sections">
              <v-list-item v-on:click="modifysection(section.id)">
                <v-list-item-content>
                  <v-list-item-title> {{ section.title }} </v-list-item-title>
                  <v-list-item-subtitle> {{ section.description }} </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="i !== sections.length - 1"></v-divider>
            </template>
          </v-list>
          <v-btn v-on:click="modifysection('new')" color="primary"> Schnitt hinzufügen </v-btn>
        </v-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import VueCookies from 'vue-cookies'
  import Navigation from './Navigation.vue'
  
  export default {
    name: 'sectionsOverview',
    components: {
        Navigation
    },
    methods: {
      //retrieve all projects
      getsections() {
        var context = this;
  
        axios({
          method: 'get',
          url: '/sections',
          responseType: 'json'
        })
        .then(function (response) {
          for (let item of response.data) {
            context.sections.push(item);
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
      modifysection(item_id) {
        if (item_id !== 'new') {
          VueCookies.set('currentsection', item_id)
        }
        this.$router.push({ name: 'sectionCreation', params: { project_id: item_id } })
      }
    },
    created() {
      this.getsections();
    },
    data() {
      return {
        sections: []
      };
    }
  }
  
  </script>

<style scoped>
#wrapper {
    height: 100%;
}
</style>
  