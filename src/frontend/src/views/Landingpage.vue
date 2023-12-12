<!--
 * Created Date: 29.11.2023 13:29:27
 * Author: Oliver Mertens
 * 
 * Last Modified: 12.12.2023 11:58:33
 * Modified By: Oliver Mertens
 * 
 * Description: LandingPage as the first entry point for new users
 -->

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
                    <v-btn v-on:click="routeLogin()" color="primary" class="ma-2" 
                        prepend-icon="mdi-login">Login</v-btn>
                    <v-btn v-on:click="routeRegistration()" color="secondary" class="ma-2"
                        prepend-icon="mdi-account-plus-outline">Registration</v-btn>
                </v-flex>
            </div>
        </v-parallax>

    </div>
</template>
    
<script>
import Navigation from '../components/Navigation.vue'
import { fromOfflineDB } from '../ConnectionToOfflineDB.js'
import { useWindowSize } from 'vue-window-size';

export default {
    name: 'Landingpage',
    components: {
        Navigation
    },
    emits: ['view'],
    data() {
        return {
            activities: [],
            toolbar_title: this.$t('fieldbook'),
        };
    },
    setup() {
        const { width, height } = useWindowSize();
        return {
            windowWidth: width,
            windowHeight: height,
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
        routeRegistration() {
            this.$router.push({ name: 'Registration' });
        },
        getHeight(){
            return this.windowHeight - 115;
        }
    }
}
</script>
    
<style scoped>
#test {
    text-align: center;
}
</style>
    