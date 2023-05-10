<template>
  <div id="pathbar">
    <v-toolbar-title class="py-1"> <b>Aktuelle Auswahl:</b> {{ currentProject.title }} / {{ currentExcavation.title }} / {{currentSection.title}}</v-toolbar-title>
  </div>
</template>

<script>
import VueCookies from 'vue-cookies'
import axios from 'axios'
export default {
  data: function () {
    return {
      excavationIsSet: false,
      excavation_id: '',
      currentExcavation: '',
      projectIsSet: false,
      project_id: '',
      currentProject: '',
      sectionIsSet: false,
      section_id: '',
      currentSection: ''
    }
  },
  created() {
    this.excavation_id = VueCookies.get('currentExcavation')
    if (this.excavation_id !== null) {
      this.excavationIsSet = true
    }
    this.project_id = VueCookies.get('currentProject')
    if (this.project_id !== null) {
      this.projectIsSet = true
    }
    this.section_id = VueCookies.get('currentSection')
    if (this.section_id !== null)
      this.sectionIsSet = true
    this.$emit('view', 'Digitales Feldbuch')
    this.setObjects();
  },
  methods: {
    setObjects() {
      var context = this;

      if(this.projectIsSet){
        axios({
        method: 'get',
        url: '/projects/' + this.project_id,
        responseType: 'json'
      }).then((response) => {
        this.currentProject = response.data;
        console.log(this.currentProject.data.title)
      }).catch((error) =>{
        if (!error.response) {
          this.errorStatus = 'Error: Network Error';
        } else {
          this.errorStatus = error.response.data.message;
        }
      });
      }

      if(this.excavationIsSet){
        axios({
        method: 'get',
        url: '/excavations/' + this.excavation_id,
        responseType: 'json'
      }).then((response) => {
        this.currentExcavation = response.data;
        console.log(this.currentExcavation.data.title)
      }).catch((error) =>{
        if (!error.response) {
          this.errorStatus = 'Error: Network Error';
        } else {
          this.errorStatus = error.response.data.message;
        }
      });
      }

      if(this.sectionIsSet){
        axios({
        method: 'get',
        url: '/sections/' + this.section_id,
        responseType: 'json'
      }).then((response) => {
        this.currentSection = response.data;
        console.log(this.currentSection.data.title)
      }).catch((error) =>{
        if (!error.response) {
          this.errorStatus = 'Error: Network Error';
        } else {
          this.errorStatus = error.response.data.message;
        }
      });
      }
    }
  }
}

</script>

<style>
#pathbar{
  height: 40px;
  background-color: #876C66;
  color: white;
  text-align: center;
  margin-bottom: 10px;
}
</style>