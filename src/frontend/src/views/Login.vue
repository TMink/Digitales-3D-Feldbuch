<!--
 * Created Date: 29.11.2023 01:45:54
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.02.2024 20:25:05
 * Modified By: Oliver Mertens
 * 
 * Description: Vue component for user login
 -->


<template>
  <div id="wrapper">
    <Navigation active_tab_prop="" />

    <v-img cover :height="getHeight()"
      src="src/assets/background/Background_Landingpage.jpg">
      <v-row class="align-center text-center justify-center pt-16 mt-16">
        <v-col>
          <img 
            src="src/assets/logos/3DDF_Icon.png" 
            alt=""
            height="100"
            class="mb-4"/>

          <h1 class="text-h4 font-weight-thin mb-14">
            {{ toolbar_title }}
          </h1>

          <div>
            <v-card
              class="mx-auto pa-12 pb-8"
              elevation="8"
              max-width="448"
              rounded="lg">

              <v-text-field
                density="compact"
                prepend-inner-icon="mdi-account-circle"
                variant="outlined"
                v-model="form.username" 
                :label="this.$t('username')">
              </v-text-field>

              <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
                <a></a>
                <a
                  class="text-caption text-decoration-none text-blue"
                  href="url">
                  {{ this.$t('forgotPassword') }}
                </a>
              </div>
          
              <v-text-field
                prepend-inner-icon="mdi-lock"
                v-model="form.password" 
                variant="outlined"    
                :label="this.$t('password')"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
                placeholder="Enter your password"
                @click:append-inner="visible = !visible">
              </v-text-field>

              <v-card
                class="mb-12"
                color="surface-variant"
                variant="tonal">
              </v-card>
          
              <v-btn
                v-on:click="login()"
                block
                class="mb-8"
                color="secondary"
                size="large"
                prepend-icon="mdi-login-variant">        
                {{ this.$t('login') }}
              </v-btn>

              <v-card-text class="text-center">
                <a
                  v-on:click="routeRegistration()"
                  href="/#/registration"
                  class="text-blue text-decoration-none">
                    {{ this.$t('registration') }} 
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </div>
</template>
    
<script>
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import Navigation from '../components/Navigation.vue'
import { useUserStore } from '../Authentication.js';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'Landingpage',
  components: {
    Navigation,
  },
  setup() {
    const userStore = useUserStore();
    const { width, height } = useWindowSize();
    return {
      userStore,
      windowWidth: width,
      windowHeight: height,
    };

  },
  emits: ['view'],
  data() {
    return {
      visible: false,
      activities: [],
      toolbar_title: this.$t('fieldbook'),
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    routeRegistration() {
      this.$router.push({ name: 'Registration' });
    },
    /**
     * Logging in the user with the given username + passsword
     */
    async login() {
      try {
        await this.userStore.login(this.form);
        this.$router.push({ name: "ActivitiesOverview" });
      } catch (error) {
        console.log("Login failed: " + error)
      }
    },
    getHeight() {
      if(this.windowHeight > 600){
        return this.windowHeight - 112;
      } else {
        return this.windowHeight + 112;
      } 
    },
  }
}
</script>
    
<style scoped>
</style>
    