<template>
    <div id="navbar">
        <v-row justify="center">
          <v-card class="ma-2" color="#BC987D" @click="changePage('ActivitiesOverview')" dark>
            <v-card-title class="justify-center"> Aktivitäten </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('PlacesOverview')" dark>
            <v-card-title class="justify-center"> Stellen </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('PositionsOverview')" dark>
            <v-card-title class="justify-center"> Position </v-card-title>
          </v-card>

          <!--
          <v-card class="ma-2" color="#BC987D" @click="changePage('FeaturesOverview')" dark :disabled="!placeIsSet">
            <v-card-title class="justify-center"> Befunde </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('ArtifactsOverview')" dark :disabled="!placeIsSet">
            <v-card-title class="justify-center"> Funde </v-card-title>
          </v-card>

          <v-card class="ma-2" color="#BC987D" @click="changePage('SamplesOverview')" dark :disabled="!placeIsSet">
            <v-card-title class="justify-center"> Proben </v-card-title>
          </v-card>
          -->
        </v-row>
    </div>
</template>

<script>
 import VueCookies from 'vue-cookies'
  export default {
    data: function (){
      return {
        placeIsSet: false,
        place_id: '',
        activityIsSet: false,
        activity_id: '',
        positionIsSet: false,
        position_id: ''
      }
    },
    created () {
      this.place_id = VueCookies.get('currentPlace')
      if (this.place_id !== null) {
        this.placeIsSet = true
      }
      this.activity_id = VueCookies.get('currentActivity')
      if (this.activity_id !== null){
        this.activityIsSet = true
      }
      this.position_id = VueCookies.get('currentPosition')
      if( this.position_id !== null)
        this.positionIsSet = true
      this.$emit('view','Digitales Feldbuch')
    },
    methods: {
      changePage: function(routeName) {
      this.$router.push({ name: routeName, params: { activity_id: this.activity_id, place_id: this.place_id } }).catch(error => {
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
