<template>
    <div id="navbar">
        <v-row justify="center">
          <v-card class="ma-2" color="#BC987D" @click="changePage('ProjectsOverview')" dark>
            <v-card-title class="justify-center"> Projekt </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('ExcavationsOverview')" dark :disabled="!projectIsSet">
            <v-card-title class="justify-center"> Ausgrabung </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('SectionsOverview')" dark :disabled="!excavationIsSet">
            <v-card-title class="justify-center"> Schnitte </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('FeaturesOverview')" dark :disabled="!excavationIsSet">
            <v-card-title class="justify-center"> Befunde </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('ArtifactsOverview')" dark :disabled="!excavationIsSet">
            <v-card-title class="justify-center"> Funde </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('SamplesOverview')" dark :disabled="!excavationIsSet">
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
      changePage: function(routeName) {
      this.$router.push({ name: routeName, params: { project_id: this.project_id, excavation_id: this.excavation_id } }).catch(error => {
        if (
          error.name !== 'NavigationDuplicated' &&
          !error.message.includes('Avoided redundant navigation to current location')
        ) {
          console.log(error)
        }
      })
      }
    }
  }
</script>
<style scoped>
    #navbar {
        background-color: #B4A27D;
        height: 70px;
        transition: 0.08s ease-in-out;
    }

    @media (max-width: 730px){
        #navbar{
          height: 150px;
          transition: 0.08s ease-in-out;
        }
    }

    @media (max-width: 385px){
      #navbar{
        height: 230px;
        transition: 0.08s ease-in-out;
      }
  }
    
</style>
