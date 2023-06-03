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

export default {
    name: 'LocaleChanger',
    data() {
        return {
            langs: ['en', 'de'],
            current: 0,
        }
    },
    methods: {
        imgSrc(langs) {
            return new URL(`../assets/flags/${langs}.png`, import.meta.url).href;
        },
        changeLang(lang, i) {
            this.$i18n.locale = lang;
            this.current = i;
        }
    },
    created() {
        this.current = this.langs.findIndex(e => e == this.$i18n.locale)
        if (this.current == -1) this.current = 0
    },
}
</script>

<style>


</style>