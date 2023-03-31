<template>
  <v-form>
    <v-subheader v-if="projects.length === 0"> Bisher wurde kein Projekt angelegt</v-subheader>
    <v-list>
      <template v-for="(project, i) in projects">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title> {{ project.value.name }} </v-list-item-title>
            <v-list-item-subtitle> {{ project.value.description }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="i !== projects.length - 1"></v-divider>
      </template>
    </v-list>
    <v-btn v-on:click="modifyProject('new')" color="primary"> Projekt hinzufügen </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios'

export default {

  name: 'ProjectsOverview',
  methods: {
    getProjects: function () {
      var context = this // to enable accessing the 'projects' variable inside submethods

      axios({
        method: 'get',
        url: 'http://127.0.0.1:3000/projects',
        responseType: 'json'
      })
        .then(function (response) {
          for (let item of response.data.rows) {
            context.projects.push(item)
          }
        })
        .catch(error => {
          if (!error.response) {
            this.errorStatus = 'Error: Network Error';
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
    }
  },
  created() {
    this.getProjects()
  },
  data: function () {
    return {
      projects: []
    }
  }
}

</script>

<style scoped></style>
