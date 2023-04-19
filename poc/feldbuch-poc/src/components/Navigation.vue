<template>
    <div id="navbar">
        <v-row justify="center">
      <v-card outlined class="ma-2" color="#BC987D" v-on:click="toProjects" dark>
        <v-card-title class="justify-center"> Projekt </v-card-title>
      </v-card>

    <v-card class="ma-2" color="#BC987D" v-on:click="toExcavation" dark>
          <v-card-title class="justify-center"> Ausgrabung </v-card-title>
      </v-card>

      <v-card class="ma-2" color="#BC987D" v-on:click="toCuts" dark>
          <v-card-title class="justify-center"> Schnitte </v-card-title>
      </v-card>

      <v-card class="ma-2" color="#BC987D" v-on:click="toFeatures" dark>
          <v-card-title class="justify-center"> Befunde </v-card-title>
      </v-card>

      <v-card class="ma-2" color="#BC987D" v-on:click="toArtifacts" dark>
          <v-card-title class="justify-center"> Funde </v-card-title>
      </v-card>

      <v-card class="ma-2" color="#BC987D" v-on:click="toSamples" dark>
          <v-card-title class="justify-center"> Proben </v-card-title>
      </v-card>
    </v-row>
    </div>
</template>

<script>
 import VueCookies from 'vue-cookies'
  export default {
    data: function (){
      return {
        excavationIsSet: false,
        excavation_id: '',
        projectIsSet: false,
        project_id: '',
        sectionIsSet: false,
        section_id: ''
      }
    },
    created () {
      this.excavation_id = VueCookies.get('currentExcavation')
      if (this.excavation_id !== null) {
        this.excavationIsSet = true
      }
      this.project_id = VueCookies.get('currentProject')
      if (this.project_id !== null){
        this.projectIsSet = true
      }
      this.section_id = VueCookies.get('currentSection')
      if( this.section_id !== null)
        this.sectionIsSet = true
      this.$emit('view','Digitales Feldbuch')
    },
    methods: {
      toProjects: function (){
        /* if (this.projectIsSet){
          this.$router.push({ name: 'ProjectCreation', params: { project_id: this.project_id }})
        } else { */
          this.$router.push({name: 'ProjectsOverview'})
        /* } */
      },
      toCuts: function () {
        this.$router.push({ name: 'CutsOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id } })
      },
      toExcavation: function () {
        this.$router.push({ name: 'ExcavationsOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id } })
      },
      toFeatures: function () {
        this.$router.push({ name: 'FeaturesOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id } })
      },
      toArtifacts: function () {
        this.$router.push({ name: 'ArtifactsOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id } })
      },
      toSamples: function () {
        this.$router.push({ name: 'SamplesOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id } })
      },
      toSection: function (excavation_tab) {
        VueCookies.set('excavationTab', excavation_tab)
        this.$router.push({ name: 'SectionOverview', params: { project_id: this.project_id, excavation_id: this.excavation_id, section_id: this.section_id }})
      }
    }
  }
</script>
<style scoped>
    #navbar {
        background-color: #B4A27D;
    }
    
</style>
