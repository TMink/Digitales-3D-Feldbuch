<!--
 * Created Date: 29.11.2023 13:29:27
 * Author: Oliver Mertens
 * 
 * Last Modified: 07.02.2024 22:40:26
 * Modified By: Oliver Mertens
 * 
 * Description: LandingPage as the first entry point for new users
 -->

<template>
    <div id="wrapper">
        <Navigation active_tab_prop="" />

        <v-parallax   
            src="src/assets/background/Background_Landingpage.jpg"
            height="100vh">

            <div class="d-flex flex-column justify-center align-center text-white">
              <v-card height="40vh"></v-card>
                <img 
                  src="src/assets/logos/3DDF_Icon.png" 
                  alt=""
                  height="100"
                  class="mb-4"/>

                <h1 class="text-h4 font-weight-thin mb-4">
                    {{ toolbar_title }}
                </h1>
                <h3 class="subheading mb-4">
                    Eine ganz wunderbare Software. Komplett kostenfrei
                </h3>

                <v-row wrap text-xs-center class="text-center">
                  <v-col>
                    <v-btn v-on:click="routeLogin()" color="primary" class="ma-2" 
                    prepend-icon="mdi-login">Login</v-btn>
                    <v-btn 
                      v-on:click="routeRegistration()" 
                      color="secondary" class="ma-2"
                      prepend-icon="mdi-account-plus-outline">
                      {{ this.$t('registration') }}
                    </v-btn>

                    <v-card variant="plain" height="10vh"></v-card>
                    <v-icon size="x-large">mdi-arrow-down-circle</v-icon>
                  </v-col>
                </v-row>
            </div>
        </v-parallax>

        <!-- 'What is this?' -->
        <div class="d-flex flex-column justify-center align-center text-center">
          <v-row class="mt-12">
            <v-col cols="3"></v-col>
            <v-col cols="6">
            
            <h1 class="font-weight-thin">{{ $t('lpWhatIsThis') }}</h1>
              <p class="text-h6 mt-4 font-weight-thin">
                {{ $t('lpDescription') }}
              </p>          
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column justify-center align-center mt-6">
          <v-img 
            src="src/assets/background/hero-image.png" 
            alt=""
            width="1500">
          </v-img>  
        </div>

        <!-- 'How do we document?' -->
        <div class="d-flex flex-column justify-center align-center text-center">
          <v-row class="mt-12">
            <v-col cols="3"></v-col>
            <v-col cols="6">
            
            <h1 class="font-weight-thin">{{ $t('lpHowToDocument') }}</h1>
              <p class="text-h6 mt-4 font-weight-thin">
                {{ $t('lpDescriptionStellenkartensystem') }}
              </p>          
            </v-col>
          </v-row>
        </div>

        <div class="d-flex flex-column justify-center align-center mt-6">
          <v-img 
            src="src/assets/background/stellenkartensystem.png" 
            alt=""
            width="1000">
          </v-img>  
        </div>

        <div class="d-flex flex-column justify-center align-center text-center"> 
        <v-table class="mt-6">
          <thead>
            <tr>
              <th class="text-left">
                {{ this.$t('title') }}
              </th>
              <th class="text-left">
                {{ this.$t('description') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="text-left"
              v-for="item in descriptions"
              :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </v-table>
        </div>
             
        <!-- CLIENT DOWNLOAD -->
        <div class="d-flex flex-column justify-center align-center text-center mt-6">
          <v-row class="mt-12">
            <v-col cols="2"></v-col>
            <v-col cols="8">
              <v-card v-if="!isElectron()"  class="pa-4" variant="outlined">
                <v-card-title class="mb-4">
                  <h1 class="font-weight-thin">
                    {{ this.$t('desktopClient') }}
                  </h1>
                </v-card-title>
                <v-card-text>
                  <p class="text-h6 mt-4 font-weight-thin">
                    {{ this.$t('downloadInfoText') }}
                  </p>
                </v-card-text>
                <v-btn href="https://github.com/TMink/Digitales-3D-Feldbuch-Projekt-3-/releases/latest/download/fieldbook-client-win32-x64.7z" 
                  color="secondary" 
                  class="ma-2">{{ this.$t('download') }}</v-btn>
              </v-card>
            </v-col>
          </v-row>
      </div>
      <v-card variant="plain" height="10vh"></v-card>
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
          descriptions: [
            {
              name: this.$t('activity') ,
              description: 'Eine archäologische Maßnahme. Wird identifiziert durch eine Aktivitätsnummer.',
            },
            {
              name: this.$t('activity_id') ,
              description: 'Ein einzigartiger Index, um Aktivitäten eindeutig identifizierbar zu machen. Diese folgt folgender Struktur: Zweistelliges Kürzel für das Außenstellengebiet + Leerzeichen + vierstellige Jahreszahl + / + vierstellige Ziffernfolge',
            },
            {
              name: this.$t('place') ,
              description: 'Neutrale Ansprache für alle Befunde, Verfärbungen oder auch Arbeitsbereiche einer Aktivität. Wird eindeutig identifiziert durch eine Stellennummer.',
            },
            {
              name: this.$t('place_id') ,
              description: 'Fortlaufende Nummerierung aller Stellen einer Aktivität',
            },
            {
              name: this.$t('position') ,
              description: 'Neutrale Ansprache für alle Arbeitsschritte und Erkenntnisse einer Stelle. Wird durch eine Positionsnummer identifiziert.',
            },
            {
              name: this.$t('position_id') ,
              description: 'Fortlaufende Nummerierung aller Positionen einer Stelle. Durch Kombination aus Aktivitäts-, Stellen- und Positionsnummer werden Positionen eindeutig identifizierbar.',
            },
          ]
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
    },
  }
}
</script>
    
<style scoped>
#test {
    text-align: center;
}
</style>
    