<!--
 * Created Date: 29.11.2023 01:45:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 08.12.2023 14:32:49
 * Modified By: Julian Hardtung
 * 
 * Description: Vue component for user registration
 -->

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
            Registration
          </h4>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field v-model="form.username" variant="outlined" label="Username"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field v-model="form.mail" variant="outlined" type="email" label="E-Mail"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          <v-row no-gutters>
            <v-spacer></v-spacer>
            <v-text-field v-model="form.password" variant="outlined" type="input" label="Password"></v-text-field>
            <v-spacer></v-spacer>
          </v-row>
          
          <v-btn v-on:click="registration()" color="secondary" class="ma-2"
            prepend-icon="mdi-account-plus-outline">Registration</v-btn>
        </v-col>
      </v-row>
    </v-img>

  </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { useUserStore } from '../Authentication.js';

export default {
  name: 'Landingpage',
  components: {
    Navigation,
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  emits: ['view'],
  data() {
    return {
      activities: [],
      toolbar_title: this.$t('fieldbook'),
      form: {
        username: "",
        mail: "",
        password: "",
      },
    };
  },
  /**
   * Retrieve data from IndexedDB
   */
  async created() {
    await fromOfflineDB.syncLocalDBs();
  },
  methods: {
    async registration() {
      await this.userStore.register(this.form);
      this.$router.push({ name: "Login" });
    },
  }
}
</script>
    
<style scoped>
</style>
    