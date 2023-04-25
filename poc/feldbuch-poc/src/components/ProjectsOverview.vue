<template>
  <div id="wrapper">
    <Navigation/>
    <v-form>
      <v-list>
          <v-list-item class="mt-5" v-if="current_project.id !== undefined" v-on:click="modifyProject(current_project.id)">
                  <v-chip>
                    Derzeit ausgewählt
                  </v-chip>      
                  <v-list-item-content>
                      <v-list-item-title> {{ current_project.title }} </v-list-item-title>
                      <v-list-item-subtitle>  {{ current_project.description }} </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-chip variant="elevated">
                    Derzeit ausgewählt
                  </v-chip>
            </v-list-item>
      <v-divider></v-divider>
      <v-subheader v-if="projects.length === 0"> Bisher wurde kein Projekt angelegt</v-subheader>
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
        url: '/projects',
        responseType: 'json'
      })
      .then(function (response) {
        for (let item of response.data) {
          //if the project id is saved in cookies => mark is as current project
          if( VueCookies.get('currentProject') === item.id){
            context.current_project = item;
          } else {
            context.projects.push(item);
          }
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
      projects: [],
      current_project:{},
    };
  }
}
</script>

<style scoped>

  #wrapper {
    height: 100%;
  }
</style>
