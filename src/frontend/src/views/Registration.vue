<!--
 * Created Date: 29.11.2023 01:45:44
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.02.2024 21:11:39
 * Modified By: Oliver Mertens
 * 
 * Description: Vue component for user registration
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
                color="primary"
                density="compact"
                prepend-inner-icon="mdi-account-circle"
                variant="outlined"
                v-model="form.username" 
                :label="this.$t('username')">
              </v-text-field>

              <v-text-field 
                color="primary"
                prepend-inner-icon="mdi-email"
                v-model="form.mail" 
                density="compact"
                variant="outlined" 
                type="email" 
                :label="this.$t('mail')">
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
                placeholder="Enter your password"
                @click:append-inner="visible = !visible">
              </v-text-field>

              <v-card
                class="mb-12"
                color="surface-variant"
                variant="tonal">
              </v-card>
          
              <v-btn
                v-on:click="registration"
                block
                class="mb-8"
                color="secondary"
                size="large"
                prepend-icon="mdi-account-plus-outline">        
                {{ this.$t('registration') }}
              </v-btn>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-img>
  </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
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
        mail: "",
        password: "",
        activities: []
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
    