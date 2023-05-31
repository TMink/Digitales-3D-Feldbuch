<template>
  <v-tabs bg-color="surface" fixed-tabs align-tabs="center">
    <v-tab max-width="250px" @click="changePage('ActivitiesOverview')"> Allgemein </v-tab>
    <v-tab max-width="250px" @click="changePage('PlacesOverview')" :disabled="!activityIsSet"> Stellen</v-tab>
    <v-tab max-width="250px" @click="changePage('PositionCreation')" :disabled="!placeIsSet"> Position</v-tab>
  </v-tabs>
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
      this.$router.push({ name: routeName, params: { activity_id: this.activity_id, place_id: this.place_id, position_id : this.position_id } }).catch(error => {
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
    
</style>
