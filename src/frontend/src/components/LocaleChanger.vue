<!--
 * Created Date: 07.06.2023 17:36:09
 * Author: Julian Hardtung
 * 
 * Last Modified: 25.07.2024 14:30:40
 * Modified By: Julian Hardtung
 * 
 * Description: language switcher
 -->

<template>
    <div class="LocaleChanger">
        <v-menu>
            <template v-slot:activator="{ props }">
            <v-btn  color="background" v-bind="props" class="current">
              <img :src="'assets/flags/'+ langs[current] + '.png'" :alt="langs[current]">
            </v-btn>
          </template>
            <v-list class="LocaleChangerMenu">
                <v-list-item v-for="(lang, i) in langs" :key="i" @click="changeLang(lang, i)">
                    <img :src="'assets/flags/'+ lang + '.png'" :alt="lang">
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { generalDataStore } from '../ConnectionToLocalStorage';

export default {
    name: 'LocaleChanger',
    setup() {
      const generalStore = generalDataStore();

      return {
        generalStore
      }
    },
    data() {
        return {
            langs: ['de', 'en'],
            current: 0,
        }
    },
    methods: {
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