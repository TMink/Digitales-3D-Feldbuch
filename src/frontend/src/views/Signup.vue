<template>
  <div id="wrapper">
    <Navigation active_tab_prop="" />

    <v-img cover style="height:95vh;"
      src="https://cdn.discordapp.com/attachments/537612240409329714/1179100383516299326/Background.png?ex=65788dce&is=656618ce&hm=1293c8ed1ee66a8d3707737d52fa50fc96a5e0ef73b21f9a0a392ee9e8d56f56&">
      <v-row class="align-center text-center justify-center pt-16 mt-16">
        <v-col>

          <v-icon><v-img src="src/assets/logos/3DDF_Icon.png"></v-img></v-icon>
          
          <h1 class="text-h4 font-weight-thin mb-4">
            {{ toolbar_title }}
          </h1>
          <h4 class="subheading">
            SIGNUP
          </h4>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field variant="outlined" label="Username"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field variant="outlined" type="email" label="E-Mail"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field variant="outlined" type="input" label="Password"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          
          <v-btn v-on:click="signup()" color="secondary" class="ma-2"
            prepend-icon="mdi-account-plus-outline">Signup</v-btn>
        </v-col>
      </v-row>
    </v-img>

  </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import AddButton from '../components/AddButton.vue'
import { toRaw } from 'vue'

export default {
  name: 'Landingpage',
  components: {
    Navigation,
    ConfirmDialog,
    AddButton
  },
  emits: ['view'],
  data() {
    return {
      activities: [],
      toolbar_title: this.$t('fieldbook'),
    };
  },
  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
  },
  methods: {
    signup() {

      //Do signup stuff

      //send data to backend
      this.$router.push({ name: 'Login' });
    },
  }
}
</script>
    
<style scoped>
#test {
  text-align: center;
}
</style>
    