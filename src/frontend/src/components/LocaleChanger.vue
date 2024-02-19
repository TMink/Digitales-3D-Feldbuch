<!--
 * Created Date: 07.06.2023 17:36:09
 * Author: Julian Hardtung
 * 
 * Last Modified: 09.02.2024 22:27:00
 * Modified By: Julian Hardtung
 * 
 * Description: language switcher
 -->

<template>
    <div class="LocaleChanger">
        <v-menu>
            <template v-slot:activator="{ props }">
            <v-btn  color="background" v-bind="props" class="current">
              <img :src="imgSrc(langs[current])" :alt="langs[current]">
            </v-btn>
          </template>
            <v-list class="LocaleChangerMenu">
                <v-list-item v-for="(lang, i) in langs" :key="i" @click="changeLang(lang, i)">
                    <img :src="imgSrc(lang)" :alt="lang">
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>

import { generalDataStore } from '../ConnectionToLocalStorage.js';

export default {
    name: 'LocaleChanger',
    data() {
        return {
            langs: ['de', 'en'],
            current: 0,
        }
    },
    setup() {
      const generalStore = generalDataStore();
      return { 
        generalStore,
      };
    },
    methods: {
        imgSrc(langs) {
            return new URL(`../assets/flags/${langs}.png`, import.meta.url).href;
        },
        changeLang(lang, i) {
            this.generalStore.setLocale(lang);
            this.current = i;
            location.reload();
        }
    },
    created() {
        this.current = this.langs.findIndex(e => e == this.generalStore.getLocale())
        if (this.current == -1) this.current = 0
    },
}
</script>

<style>


</style>