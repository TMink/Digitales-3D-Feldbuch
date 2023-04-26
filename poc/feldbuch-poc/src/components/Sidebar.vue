<template>
    <div>
      <v-navigation-drawer app nav right v-model="drawer" color="#e8e4d9">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Digitales Feldbuch
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.link">
          <v-list-item-content>
            <v-list-item-title>
              {{item.title}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link v-on:click="deleteCookies()">
            <v-list-item-content>
              <v-list-item-title>
                Delete Cookies
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
      </v-navigation-drawer>
    </div>
</template>
  
<script>

import VueCookies from 'vue-cookies';


  export default {
    name: 'Navigation',
    props: {
      drawer: Boolean
    },
    data: function () {
      return {
        bottom_sheet: false,
        path: '127.0.0.1:5984',
        items: [
          {link: "/", title:"Startseite"},
          {link: "/3dview", title:"3D-Ansicht"},
          /*{link: "/campaigns", title: "Übergeordnete Projekte"},
          {link: "/excavation", title: "Grabungen" },
          {link: "/excavation/sections", title: "Schnitte"},
          {link: "/excavation/structures", title: "Befunde (SE)"},
          {link: "/excavation/finds", title: "Funde"},
          {link: "/excavation/samples", title: "Proben"}*/
        ]
      }
    },
    methods: {
      savepath (){
        setpath(this.path)
      },
      deleteCookies() {
        VueCookies.remove('currentProject');
        VueCookies.remove('currentContact');
        VueCookies.remove('currentContact');
        VueCookies.remove('currentSection');
        VueCookies.remove('currentFeature');
      }
    }
  }
  
</script>
  
<style>
</style>
  