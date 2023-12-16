<!--
 * Created Date: 29.11.2023 13:29:27
 * Author: Oliver Mertens
 * 
 * Last Modified: 16.12.2023 13:58:10
 * Modified By: Julian Hardtung
 * 
 * Description: LandingPage as the first entry point for new users
 -->

<template>
    <div id="wrapper">
        <Navigation active_tab_prop="" />

        <v-parallax
            src="https://cdn.discordapp.com/attachments/537612240409329714/1179100383516299326/Background.png?ex=65788dce&is=656618ce&hm=1293c8ed1ee66a8d3707737d52fa50fc96a5e0ef73b21f9a0a392ee9e8d56f56&"
            height="">
            <div class="d-flex flex-column justify-center align-center text-white">
              <v-card height="40vh"></v-card>
                <v-icon><v-img src="src/assets/logos/3DDF_Icon.png"></v-img></v-icon>

                <h1 class="text-h4 font-weight-thin mb-4">
                    {{ toolbar_title }}
                </h1>
                <h4 class="subheading">
                    richtig fancy das Teil
                </h4>

                <v-row wrap text-xs-center class="text-center">
                  <v-col>
                    <v-btn v-on:click="routeLogin()" color="primary" class="ma-2" 
                    prepend-icon="mdi-login">Login</v-btn>
                    <v-btn v-on:click="routeRegistration()" color="secondary" class="ma-2"
                    
                    prepend-icon="mdi-account-plus-outline">Registration</v-btn>
                    <v-card variant="plain" height="25vh"></v-card>
                    <v-icon size="x-large">mdi-arrow-down-circle</v-icon>
                    <v-card variant="plain" height="10vh"></v-card>
                    <v-card v-if="!isElectron()" variant="outlined" class="pa-4">

                      <v-card-title class="text-h4 font-weight-light mb-4">
                        Desktop Client
                      </v-card-title>
                      <v-card-text>
                        If you are planning on using this fieldbook without an active internet connection, you should download the desktop client.
                      </v-card-text>
                      <v-btn href="https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/releases/latest/download/fieldbook-client-win32-x64.7z" 
                      color="secondary" class="ma-2">Download Client</v-btn>
                    </v-card>
                    <v-card variant="plain" height="20vh"></v-card>
                  </v-col>
                </v-row>
              </div>
        </v-parallax>

    </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'

export default {
  name: 'Landingpage',
  components: {
      Navigation
  },
  data() {
      return {
          toolbar_title: this.$t('fieldbook'),
      };
  },

  methods: {

    routeLogin() {
        this.$router.push({ name: 'Login' });
    },
    routeRegistration() {
        this.$router.push({ name: 'Registration' });
    },

    /**
     * Checks, if the system is running through electron or not
     */
    isElectron() {
      // Renderer process
      if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        console.log("renderer true");
        return true;
      }

      // Main process
      if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        console.log("main process true");
        return true;
      }

      // Detect the user agent when the `nodeIntegration` option is set to true
      if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        console.log("user agent true");
        return true;
      }

      return false;
    }
  }
}
</script>
    
<style scoped>
#test {
    text-align: center;
}
</style>
    