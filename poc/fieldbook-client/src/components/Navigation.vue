<template>
  <v-tabs v-model="active_tab" flat bg-color="accent" fixed-tabs align-tabs="center" slider-color="slider">
    <v-tab id="activity" max-width="250px" class="text-h6" @click="changePage('ActivitiesOverview')">{{$t('activity')}}</v-tab>
    <v-tab id="place" max-width="250px" class="text-h6" @click="changePage('PlacesOverview')" :disabled="!activityIsSet"> {{ $t('place') }}</v-tab>
    <v-tab id="position" max-width="250px" class="text-h6" @click="changePage('PositionsOverview')" :disabled="!placeIsSet"> {{ $t('position') }}</v-tab>
  </v-tabs>
</template>

<script>
 import VueCookies from 'vue-cookies'
 import { useI18n } from 'vue-i18n'
 
  export default {
    setup () {
      const { t } = useI18n() // use as global scope
      return { t }
    },
    data: function (){
      return {
        active_tab: '0',
        placeIsSet: false,
        placeID: '',
        activityIsSet: false,
        activityID: '',
        positionIsSet: false,
        positionID: ''
      }
    },
    created () {
      this.placeID = VueCookies.get('currentPlace')
      if (this.placeID !== null) {
        this.placeIsSet = true
      }
      this.activityID = VueCookies.get('currentActivity')
      if (this.activityID !== null){
        this.activityIsSet = true
      }
      this.positionID = VueCookies.get('currentPosition')
      if( this.positionID !== null)
        this.positionIsSet = true
      this.$emit('view','Digitales Feldbuch')
    },
    methods: {
      changePage: function(routeName) {
      this.$router.push({ name: routeName, params: { activityID: this.activityID, placeID: this.placeID, positionID : this.positionID } }).catch(error => {
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
