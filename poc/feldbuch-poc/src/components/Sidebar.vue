<template>
    <div>
      <v-navigation-drawer app nav right
      v-model="drawer" color="#e8e4d9" temporary>
                <v-list-item class="close">
                   <App :navdrawer="drawer"/>
                  <button class="button btn-close" @click.stop="drawer = !drawer" >X</button>
               </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Menü
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="item in items" :key="item.title" link :to="item.link"">
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
import VueCookies from 'vue-cookies'
import App from '../App.vue'

  export default {
    name: 'Navigation',
    props: {
      drawer: false
    },
    data: function () {
      return {
        bottom_sheet: false,
        path: '127.0.0.1:5984',
        items: [
          {link: "/", title:"Startseite"},
          {link: "/3dview", title:"3D-Ansicht"},
          /*{link: "/", title:"UTM"},
          {link: "/", title:"Datierung"},
          {link: "/", title:"Kalenderdaten"},
          {link: "/", title:"Kontakt"},*/
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
.close{
  padding-bottom: 0px;
  background-color: #594743;

}

.btn-close{
  margin-right: 190px;
  padding-left: 7px;
  padding-right: 7px;
  background-color: #B4A27D;
  color: white;
  border: 2px solid black;
  font-size: 18px;
  font-weight: bold;
}

.btn-close:hover{
  background-color: white;
  color: black;
}
</style>
