<!--
 * Created Date: 29.11.2023 01:45:54
 * Author: Julian Hardtung
 * 
 * Last Modified: 29.03.2024 14:30:50
 * Modified By: Julian Hardtung
 * 
 * Description: Vue component for user login
 -->


<template>
  <div id="wrapper">
    <Navigation active_tab_prop="-1" />

    <v-img cover :height="getHeight()"
      src="assets/background/Background_Landingpage.jpg">
      <v-row class="align-center text-center justify-center pt-16 mt-16">
        <v-col>
          <v-img 
            src="assets/logos/3DDF_Icon.png" 
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
                color="primary"
                density="compact"
                prepend-inner-icon="mdi-account-circle"
                variant="outlined"
                v-model="form.username" 
                :label="this.$t('username')">
              </v-text-field>
          
              <v-text-field
                color="primary"
                prepend-inner-icon="mdi-lock"
                v-model="form.password" 
                variant="outlined"    
                :label="this.$t('password')"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                density="compact"
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
                color="success"
                size="large"
                prepend-icon="mdi-login-variant">        
                {{ this.$t('login') }}
              </v-btn>

              <v-row>
                <v-card-text>
                  <a
                    v-on:click="routeRegistration()"
                    href="/#/registration"
                    class="text-blue text-decoration-none">
                      {{ this.$t('registration') }} 
                      <v-icon icon="mdi-chevron-right"></v-icon>
                  </a>
                </v-card-text>
                <v-card-text>
                  <a
                    class="text-caption text-decoration-none text-blue"
                    href="url">
                    {{ this.$t('forgotPassword') }}
                  </a>
                </v-card-text>
              </v-row>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'
import { useUserStore } from '../Authentication.js';
import { useWindowSize } from 'vue-window-size';

export default {
  name: 'LoginPage',
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
      this.$router.push({ name: 'RegistrationPage' });
    },
    /**
     * Logging in the user with the given username + passsword
     */
    async login() {
      this.userStore.login(this.form)
      .then((res) => {
        this.$root.vtoast.show({ message: this.$t('loginSuccess'), color: 'success' })
        this.$router.push({ name: "ActivitiesOverview" });
      })
      .catch((error) => {
        this.$root.vtoast.show({ message: this.$t(error), color: 'error' })
      });
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
    