<template>
  <v-tabs 
    flat 
    fixed-tabs 
    bg-color="accent" 
    align-tabs="center" 
    slider-color="slider"
    v-model="active_tab">
    
    
    <v-tab 
      id="activity" 
      class="text-h6" 
      max-width="250px" 
      @click="changePage('ActivitiesOverview')">
      {{$t('activity')}}
    </v-tab>
    
    <v-tab 
      id="place" 
      class="text-h6" 
      max-width="250px" 
      @click="changePage('PlacesOverview')" 
      :disabled="!activityIsSet"> 
      {{ $t('place') }}
    </v-tab>
    
    <v-tab 
      id="position" 
      class="text-h6" 
      max-width="250px" 
      @click="changePage('PositionsOverview')" 
      :disabled="!placeIsSet"> 
      {{ $t('position') }}
    </v-tab>
    
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
    props: {
      active_tab_prop: String
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
      this.active_tab = this.active_tab_prop;
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
    },
    methods: {
      changePage: function(routeName) {
      this.$router.push({ name: routeName })
      .catch(error => {
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
