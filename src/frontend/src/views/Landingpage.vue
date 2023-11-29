<template>
    <div id="wrapper">
        <Navigation active_tab_prop="" />

        <v-parallax
            src="https://cdn.discordapp.com/attachments/537612240409329714/1179100383516299326/Background.png?ex=65788dce&is=656618ce&hm=1293c8ed1ee66a8d3707737d52fa50fc96a5e0ef73b21f9a0a392ee9e8d56f56&"
            height="">
            <div class="d-flex flex-column fill-height justify-center align-center text-white">

                <v-icon><v-img src="src/assets/logos/3DDF_Icon.png"></v-img></v-icon>

                <h1 class="text-h4 font-weight-thin mb-4">
                    {{ toolbar_title }}
                </h1>
                <h4 class="subheading">
                    richtig fancy das Teil
                </h4>

                <v-flex row wrap text-xs-center>
                    <v-btn v-on:click="routeLogin()" color="primary" class="ma-2" prepend-icon="mdi-login">login</v-btn>
                    <v-btn v-on:click="routeSignup()" color="secondary" class="ma-2" prepend-icon="mdi-account-plus-outline">signup</v-btn>
                </v-flex>
            </div>
        </v-parallax>

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
        this.$emit("view", this.$t('overview', { msg: this.$tc('activity', 2) }));
        await fromOfflineDB.syncLocalDBs();
    },
    methods: {

      routeLogin() {
        this.$router.push({ name: 'Login' });
      },
      routeSignup() {
      this.$router.push({ name: 'Signup' });
      },
    }
}
</script>
    
<style scoped>
#test {
    text-align: center;
}
</style>
    