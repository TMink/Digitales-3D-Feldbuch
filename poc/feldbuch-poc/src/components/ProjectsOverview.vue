<template>
  <div id="wrapper">
    <Navigation/>

    <v-form>
      <v-subheader v-if="projects.length === 0"> Bisher wurde kein Projekt angelegt</v-subheader>
      <v-list>
        <template v-for="(project, i) in projects">
          <v-list-item v-on:click="modifyProject(project.id)">
            <v-list-item-content>
              <v-list-item-title> {{ project.title }} </v-list-item-title>
              <v-list-item-subtitle> {{ project.description }} </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="i !== projects.length - 1"></v-divider>
        </template>
      </v-list>
      <v-btn v-on:click="modifyProject('new')" color="primary"> Projekt hinzufügen </v-btn>
    </v-form>
  </div>
  
</template>

<script>
import Navigation from './Navigation.vue'
import axios from 'axios'
import VueCookies from 'vue-cookies'

export default {
  name: 'ProjectsOverview',
  components: {
    Navigation
  },
  methods: {
    //retrieve all projects
    getProjects() {
      var context = this;

      axios({
        method: 'get',
        url: 'http://127.0.0.1:3000/projects',
        responseType: 'json'
      })
      .then(function (response) {
        for (let item of response.data) {
          context.projects.push(item);
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
    modifyProject(item_id) {
      if (item_id !== 'new') {
        VueCookies.set('currentProject', item_id)
      }
      this.$router.push({ name: 'ProjectCreation', params: { project_id: item_id } })
    }
  },
  created() {
    this.getProjects();
  },
  data() {
    return {
      projects: []
    };
  }
}
</script>

<style scoped>

  #wrapper {
    height: 100%;
  }
</style>
